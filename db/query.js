const pool = require("./pool");

// Insert Methods
async function insertIntoType({ typeName, colorInHexForm }) {
  await pool.query(`INSERT INTO type (type,color) VALUES ($1, $2) `, [
    typeName,
    colorInHexForm,
  ]);
}
async function insertIntoPokemonType({ pokemonID, typeID }) {
  await pool.query(`INSERT INTO pokemon_types VALUES ($1,$2)`, [
    pokemonID,
    typeID,
  ]);
}
async function insertIntoPokemon(pokemonObject) {
  const {
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
  } = pokemonObject;

  await pool.query(
    `INSERT INTO pokemon 
  (name, pokedex_number, description, height, weight, base_experience, sprite_url, hp, attack, defense, special_attack, special_defense, speed, generation, is_legendary)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
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
    ],
  );
}

// Get Methods
async function getPokemonID(pokemonName) {
  const res = await pool.query("SELECT id FROM pokemon WHERE name = $1", [
    pokemonName,
  ]);
  return res.rows[0]?.id;
}

async function getTypeID(typeName) {
  const res = await pool.query("SELECT id FROM types WHERE name = $1", [
    typeName,
  ]);
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
    "SELECT type from type where id = ANY($1)",
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
  const res = await pool.query("SELECT type FROM type");
  return res.rows.map((row) => row.type);
}

async function getAllPokemonList() {
  const res = await pool.query("SELECT name FROM pokemon");
  return res.rows.map((row) => row.name);
}

async function getNumberOfPokemonOfType(typeName) {
  const typeID = await getTypeID(typeName);

  const res = await pool.query(
    "SELECT COUNT(pokemon_id) FROM pokemon_types WHERE type_id=$1 ",
    [typeID],
  );

  return Number(res.rows[0].count);
}

// UpdatePokemon
async function updatePokemon(pokemonID, updatedDetails) {}

// delete function
async function deletePokemon(pokemonName) {
  const pokemonID = await getPokemonID(pokemonName);
  return await pool.query("DELETE FROM pokemon WHERE id = $1", [pokemonID]);
}

async function deleteType(typeName) {
  const typeID = await getTypeID(typeName);
  return await pool.query("DELETE FROM type WHERE id = $1", [typeID]);
}

module.exports = {
  insertIntoType,
  insertIntoPokemonType,
  insertIntoPokemon,
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
  updatePokemon,
  deletePokemon,
  deleteType,
};
