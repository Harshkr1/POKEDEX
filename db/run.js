const db = require("./query");

async function main() {
  try {
    // 1. Insert Type
    await db.insertIntoType({
      typeName: "electric",
      colorInHexForm: "#F8D030",
    });
    console.log("Type inserted");

    // 2. Insert Pokemon
    await db.insertIntoPokemon({
      name: "pikachu",
      pokedex_number: 25,
      description: "Electric mouse Pokémon",
      height: 4,
      weight: 60,
      base_experience: 112,
      sprite_url: "pikachu.png",
      hp: 35,
      attack: 55,
      defense: 40,
      special_attack: 50,
      special_defense: 50,
      speed: 90,
      generation: 1,
      is_legendary: false,
    });
    console.log("Pokemon inserted");

    const pokemonID = 0;
    const typeID = 0;

    await db.insertIntoPokemonType({
      pokemonID,
      typeID,
    });
    console.log("Pokemon-Type relation inserted");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    process.exit();
  }
}

main();
