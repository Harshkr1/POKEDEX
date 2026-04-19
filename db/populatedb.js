const { Client } = require("pg");

async function fetchPokemonURL() {
  try {
    console.log("Fetching Pokémon URLs...");
    const pokemonUrl = [];
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=35");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    data.results.forEach(({ url }) => pokemonUrl.push(url));

    console.log(`Fetched ${pokemonUrl.length} Pokémon URLs`);
    return pokemonUrl;
  } catch (error) {
    console.error("Error fetching URLs:", error);
  }
}

async function fetchPokemonDetail(pokemonURL) {
  try {
    console.log("Fetching Pokémon details...");
    const promises = pokemonURL.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    });

    const allPokemonDetails = await Promise.all(promises);
    console.log(`Fetched ${allPokemonDetails.length} Pokémon details`);
    return allPokemonDetails;
  } catch (error) {
    console.error("Error fetching details:", error);
    return [];
  }
}

// Pading Pokedex Number to 4 for fetching better quality images
function paddingToFourDigits(pokedexNumber) {
  return pokedexNumber.toString().padStart(4, '0');
}

function filterPokemonDetail(pokemonDetail) {
  const pokemonTableDetail = [];

  pokemonDetail.forEach((pokemon) => {
    const extracted = {
      name: pokemon.name,
      pokedex_number: paddingToFourDigits(pokemon.id),
      description: null,
      type: pokemon.types.map((t) => t.type.name),
      height: pokemon.height,
      weight: pokemon.weight,
      base_experience: pokemon.base_experience,
      sprite_url: `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${paddingToFourDigits(pokemon.id)}.png`,
      hp: pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat,
      attack: pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat,
      defense: pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat,
      special_attack: pokemon.stats.find(
        (s) => s.stat.name === "special-attack"
      )?.base_stat,
      special_defense: pokemon.stats.find(
        (s) => s.stat.name === "special-defense"
      )?.base_stat,
      speed: pokemon.stats.find((s) => s.stat.name === "speed")?.base_stat,
      generation: null,
      is_legendary: null,
    };

    pokemonTableDetail.push(extracted);
  });

  console.log(`Filtered ${pokemonTableDetail.length} Pokémon`);
  return pokemonTableDetail;
}

async function getDescriptionandGenerationandLegendry(filteredData) {
  console.log("Fetching additional Pokémon data...");

  for (const pokemon of filteredData) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
    );

    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    pokemon.description = data.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    )?.flavor_text;

    pokemon.generation = data.generation.name;
    pokemon.is_legendary = data.is_legendary;
  }

  console.log("Additional data added");
}

async function insertIntoPokemonTable(filteredPokemonDetail) {
  const client = new Client({
    connectionString:
      "postgresql://harshkr70:Hello12345@@localhost:5432/pokedex",
  });

  await client.connect();
  console.log("Connected to DB");

  await client.query(`
    CREATE TABLE IF NOT EXISTS pokemon (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(100) NOT NULL,
      pokedex_number INTEGER UNIQUE NOT NULL,
      description TEXT,
      height INTEGER,
      weight INTEGER,
      base_experience INTEGER,
      sprite_url TEXT,
      hp INTEGER,
      attack INTEGER,
      defense INTEGER,
      special_attack INTEGER,
      special_defense INTEGER,
      speed INTEGER,
      generation TEXT,
      is_legendary BOOLEAN DEFAULT FALSE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS types (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      type VARCHAR(20) UNIQUE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS pokemon_types (
      pokemon_id INT REFERENCES pokemon(id) ON DELETE CASCADE,
      type_id INT REFERENCES types(id) ON DELETE CASCADE,
      PRIMARY KEY (pokemon_id, type_id)
    );
  `);

  console.log("Tables ensured");

  try {
    for (const pokemon of filteredPokemonDetail) {
      const {
        name,
        pokedex_number,
        description,
        type,
        height,
        weight,
        base_experience,
        sprite_url,
        hp,
        attack,
        defense,
        special_attack,
        special_defense,
        speed,
        generation,
        is_legendary,
      } = pokemon;

      console.log(`Processing ${name} (${pokedex_number})`);

      const POKEMON_SQL = `
        INSERT INTO pokemon 
        (name, pokedex_number, description, height, weight, base_experience, sprite_url, hp, attack, defense, special_attack, special_defense, speed, generation, is_legendary)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (pokedex_number) DO NOTHING;
      `;

      await client.query(POKEMON_SQL, [
        name,
        pokedex_number,
        description,
        height,
        weight,
        base_experience,
        sprite_url,
        hp,
        attack,
        defense,
        special_attack,
        special_defense,
        speed,
        generation,
        is_legendary,
      ]);

      const { rows } = await client.query(
        "SELECT id FROM pokemon WHERE pokedex_number = $1",
        [pokedex_number]
      );

      const pokemon_id = rows[0].id;
      console.log(`pokemon_id: ${pokemon_id}`);

      for (let eachType of type) {
        await client.query(
          "INSERT INTO types (type) VALUES ($1) ON CONFLICT (type) DO NOTHING",
          [eachType]
        );
        console.log(`type processed: ${eachType}`);
      }

      for (let eachType of type) {
        const { rows } = await client.query(
          "SELECT id FROM types WHERE type = $1",
          [eachType]
        );

        const typeId = rows[0].id;

        await client.query(
          "INSERT INTO pokemon_types(pokemon_id, type_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [pokemon_id, typeId]
        );

        console.log(`linked ${name} with ${eachType}`);
      }
    }

    console.log("All data inserted");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
    console.log("DB connection closed");
  }
}

async function main() {
  const url = await fetchPokemonURL();
  const detail = await fetchPokemonDetail(url);
  const filteredPokemonDetail = filterPokemonDetail(detail);
  await getDescriptionandGenerationandLegendry(filteredPokemonDetail);
  await insertIntoPokemonTable(filteredPokemonDetail);
}

main();