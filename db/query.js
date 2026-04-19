const pool = require("./pool");

// Insert Methods
async function insertIntoPokemonTable(pokemon) {
  if (await isPokemonPresent(pokemon.name)) {
    console.log("HARSH INSIDE POKEMON ALWAYS PRESNET BLOCK");
    return "Pokemon already present";
  }

  try {
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

    await pool.query(POKEMON_SQL, [
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

    const { rows } = await pool.query(
      "SELECT id FROM pokemon WHERE pokedex_number = $1",
      [pokedex_number],
    );

    const pokemon_id = rows[0].id;
    console.log(`pokemon_id: ${pokemon_id}`);

    for (let eachType of type) {
      await pool.query(
        "INSERT INTO types (type) VALUES ($1) ON CONFLICT (type) DO NOTHING",
        [eachType],
      );
      console.log(`type processed: ${eachType}`);
    }

    for (let eachType of type) {
      const { rows } = await pool.query(
        "SELECT id FROM types WHERE type = $1",
        [eachType],
      );

      const typeId = rows[0].id;

      await pool.query(
        "INSERT INTO pokemon_types(pokemon_id, type_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [pokemon_id, typeId],
      );

      console.log(`linked ${name} with ${eachType}`);
    }

    console.log("All data inserted");
  } catch (err) {
    console.error("Error:", err);
  }
}

// Get Methods
async function getPokemonID(pokemonName) {
  const res = await pool.query("SELECT id FROM pokemon WHERE name = $1", [
    pokemonName,
  ]);
  return res.rows[0]?.id;
}

async function getTypeID(typeName) {
  console.log("INSIDE getTypeID with typeName as " + typeName);
  const res = await pool.query("SELECT id FROM types WHERE type = $1", [
    typeName,
  ]);
  console.log("result is " + res.rows[0]?.id);
  return res.rows[0]?.id;
}

async function getPokemon(pokemonName) {
  const res = await pool.query("SELECT * FROM pokemon WHERE name = $1", [
    pokemonName,
  ]);
  return res.rows[0];
}

async function getTypeOfPokemon(pokemonName) {
  //get pokemonID
  const pokemonID = await getPokemonID(pokemonName);
  // retrive all tthe type ID for the pokemon
  const typeRows = await pool.query(
    "SELECT DISTINCT type_id from pokemon_types where pokemon_id = $1",
    [pokemonID],
  );

  const typeIDs = typeRows.rows.map((row) => row.type_id);

  // get the names foir all the ID of type
  const typeNames = await pool.query(
    "SELECT type FROM types where id = ANY($1)",
    [[typeIDs]],
  );

  return typeNames.rows.map((row) => row.type);
}

async function getAllPokemonOfType(typeName) {
  const typeID = await getTypeID(typeName);
  const pokemonRows = await pool.query(
    "SELECT DISTINCT pokemon_id from pokemon_types where type_id = $1",
    [typeID],
  );

  const pokemonIDs = pokemonRows.rows.map((row) => row.pokemon_id);

  const pokemons = await pool.query(
    "SELECT * from pokemon where id = ANY($1)",
    [pokemonIDs],
  );

  return pokemons.rows;
}

async function getAllPokemonNamesOfType(typeName) {
  const typeID = await getTypeID(typeName);
  const pokemonRows = await pool.query(
    "SELECT DISTINCT pokemon_id from pokemon_types where type_id = $1",
    [typeID],
  );

  const pokemonIDs = pokemonRows.rows.map((row) => row.pokemon_id);

  const pokemonNames = await pool.query(
    "SELECT name from pokemon where id = ANY($1)",
    [pokemonIDs],
  );

  return pokemonNames.rows.map((row) => row.name);
}

async function getImageURLofPokemon(pokemonName) {
  const pokemonID = await getPokemonID(pokemonName);
  const res = await pool.query("SELECT sprite_url FROM pokemon WHERE id= $1", [
    pokemonID,
  ]);
  return res.rows[0].sprite_url;
}

async function getPokemonDetail(pokemonName) {
  const pokemonID = await getPokemonID(pokemonName);
  const res = await pool.query("SELECT * FROM pokemon WHERE id= $1", [
    pokemonID,
  ]);
  return res.rows[0];
}

async function getAllTypeList() {
  const res = await pool.query("SELECT type FROM types");
  return res.rows.map((row) => row.type);
}

async function getAllPokemonList() {
  const res = await pool.query("SELECT * FROM pokemon");
  return res.rows;
}

async function getNumberOfPokemonOfType(typeName) {
  const typeID = await getTypeID(typeName);
  const res = await pool.query(
    "SELECT COUNT(pokemon_id) FROM pokemon_types WHERE type_id=$1 ",
    [typeID],
  );

  return Number(res.rows[0].count);
}

async function getAllTypeAndCount() {
  const allTypes = await getAllTypeList();
  const NoOfPokemonAndType = [];

  for (const type of allTypes) {
    const count = await getNumberOfPokemonOfType(type);

    console.log(`Type: ${type}, Count: ${count}`);

    NoOfPokemonAndType.push({
      type,
      count,
    });
  }
  return NoOfPokemonAndType;
}


// delete function
async function deletePokemon(pokemonName) {
  const pokemonID = await getPokemonID(pokemonName);
  return await pool.query("DELETE FROM pokemon WHERE id = $1", [pokemonID]);
}

async function deleteType(typeName) {
  const typeID = await getTypeID(typeName);
  console.log("typeName" + typeName + "ID is " + typeID);
  const pokemonOfType = await getAllPokemonNamesOfType(typeName);
  for (const pokemon of pokemonOfType) {
    await deletePokemon(pokemon);
  }
  console.log(pokemonOfType);
  return await pool.query("DELETE FROM types WHERE id = $1", [typeID]);
}

// Boolean Method
async function isPokemonPresent(pokemonName) {
  console.log("Checking if pokemon exists:", pokemonName);

  const pokemonID = await getPokemonID(pokemonName);
  console.log("Fetched pokemonID:", pokemonID);

  if (pokemonID === null || pokemonID === undefined) {
    console.log("Pokemon not present");
    return false;
  } else {
    console.log("Pokemon already present");
    return true;
  }
}

module.exports = {
  getPokemonID,
  getTypeID,
  getPokemon,
  getTypeOfPokemon,
  getAllPokemonOfType,
  getImageURLofPokemon,
  getPokemonDetail,
  getAllTypeList,
  getAllPokemonList,
  getNumberOfPokemonOfType,
  deletePokemon,
  deleteType,
  getAllTypeAndCount,
  isPokemonPresent,
  insertIntoPokemonTable,
  getAllPokemonNamesOfType,
};
