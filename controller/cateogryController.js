const db = require("../db/query");

async function showCateogryPage(request, response) {
  const type = request.query.type;
  var pokemonData;
  if (!type) {
    pokemonData = await db.getAllTypeAndCount();
  } else {
    pokemonData = await db.getAllPokemonOfType(type);
  }
  if (!pokemonData) {
    res.statusCode(404).send("Not Found");
  }
  response.send(pokemonData);
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
  response.send("DELETED CATEOGRY ");
}

module.exports = {
  showCateogryPage,
  deleteCateogry,
};
