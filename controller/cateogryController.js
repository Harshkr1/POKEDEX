const db = require("../db/query");

async function showCateogryPage(request, response) {
  const type = request.query.type;
  var pokemonData;
  if (!type) {
    pokemonData = await db.getAllTypeAndCount();
  } else {
    pokemonData = await db.getAllPokemonOfType(type);
    console.log(pokemonData);
  }
  if (!pokemonData) {
    response.statusCode(404).send("Not Found");
  }
  !type
    ? response.render("Cateogry", { pokemonData })
    : response.render("Cateogry_list", { pokemonData: pokemonData, cateogry: type });
}

async function deleteCateogry(request, response) {
  const type = request.query.type;
  console.log("TYPE is " + type);
  if (!type) {
    response.status(404).send("Provide a cateogry first");
  }
  const typeID = await db.getTypeID(type);
  console.log(typeID + "IS THE TYPEID INSIDE DELETE CATEOGRY");
  if (typeID === null || typeID === undefined) {
    response.status(404).send("Type does not exist");
  }
  await db.deleteType(type);
  const pokemonData = await db.getAllTypeAndCount();

  response.render("Cateogry", { pokemonData })
}

module.exports = {
  showCateogryPage,
  deleteCateogry,
};
