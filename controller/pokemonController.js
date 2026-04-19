const db = require("../db/query");

async function getPokemonDetail(pokemonName) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function filterPokemonDetail(pokemon) {
  const extracted = {
    name: pokemon.name,
    pokedex_number: pokemon.id,
    description: null,
    type: pokemon.types.map((t) => t.type.name),
    height: pokemon.height,
    weight: pokemon.weight,
    base_experience: pokemon.base_experience,
    sprite_url: pokemon.sprites.front_default,
    hp: pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat,
    attack: pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat,
    defense: pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat,
    special_attack: pokemon.stats.find((s) => s.stat.name === "special-attack")
      ?.base_stat,
    special_defense: pokemon.stats.find(
      (s) => s.stat.name === "special-defense",
    )?.base_stat,
    speed: pokemon.stats.find((s) => s.stat.name === "speed")?.base_stat,
    generation: null,
    is_legendary: null,
  };
  return extracted;
}

async function getDescriptionandGenerationandLegendry(filteredPokemonDetail) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${filteredPokemonDetail.name}`,
  );

  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

  const data = await response.json();

  filteredPokemonDetail.description = data.flavor_text_entries.find(
    (entry) => entry.language.name === "en",
  )?.flavor_text;

  filteredPokemonDetail.generation = data.generation.name;
  filteredPokemonDetail.is_legendary = data.is_legendary;
}

async function insertIntoPokemonTable(filteredPokemonDetail) {
  return await db.insertIntoPokemonTable(filteredPokemonDetail);
}

async function showPokemonpage(request, response) {
  const pokemonName = request.query.name;
  var pokemonData;
  if (!pokemonName) {
    pokemonData = await db.getAllPokemonList();
  } else {
    pokemonData = await db.getPokemonDetail(pokemonName);
  }
  if (!pokemonData) {
    response.status(404).send("Not Found");
  }
  !pokemonName
    ? response.render("pokemon", { pokemonData })
    : response.render("pokemon_detail", { pokemonData });
}

async function showPokemonForm(request, response) {
  const alreadyExist = request.query.alreadyExist === "true";
  response.render("AddPokemon", { alreadyExist });
}

async function addPokemon(request, response) {
  try {
    const pokemonName = request.body.pokemonName;
    const pokemonDetail = await getPokemonDetail(pokemonName);
    const alreadyExist = false;
    const filteredPokemonDetail = filterPokemonDetail(pokemonDetail);

    await getDescriptionandGenerationandLegendry(filteredPokemonDetail);

    const result = await insertIntoPokemonTable(filteredPokemonDetail);

    if (result === "Pokemon already present") {
      return response.redirect("/pokemon/addPokemon?alreadyExist=true")
    }
    return response.render("pokemon", { pokemonData: await db.getAllPokemonList() });
  } catch (err) {
    console.error("Error adding pokemon:", err);
    return response.status(500).send("Server Error");
  }
}

async function deletePokemon(request, response) {
  try {
    const pokemonName = request.query.name;
    if (!pokemonName) {
      response.status(304).send("PLEASE SELECT A POKEMON TO DELETE");
    }
    await db.deletePokemon(pokemonName);

    response.render("pokemon", { pokemonData: await db.getAllPokemonList() });
  } catch (err) {
    console.error("Error deleting pokemon:", err);
    return response.status(500).send("Server Error");
  }
}

module.exports = {
  showPokemonpage,
  showPokemonForm,
  addPokemon,
  deletePokemon,
};
