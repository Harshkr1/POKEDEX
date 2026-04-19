const express = require("express");
const db = require("../db/query");
const pokemonRouter = express.Router();

const { showPokemonpage,showPokemonForm ,addPokemon, deletePokemon} = require("../controller/pokemonController.js");

pokemonRouter.get("/", showPokemonpage);
pokemonRouter.get("/delete", deletePokemon);
pokemonRouter.get("/addPokemon",showPokemonForm);
pokemonRouter.post("/addPokemon",addPokemon);

module.exports = {
  pokemonRouter,
};
