const express = require("express");
const db = require("../db/query");
const pokemonRouter = express.Router();

const { showPokemonpage,showPokemonForm ,addPokemon} = require("../controller/pokemonController.js");

pokemonRouter.get("/", showPokemonpage);
pokemonRouter.get("/addPokemon",showPokemonForm);
pokemonRouter.post("/addPokemon",addPokemon);

module.exports = {
  pokemonRouter,
};
