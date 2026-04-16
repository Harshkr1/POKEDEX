const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (req,res)=>{
    res.send("POKEDEX IN CONSTRUCTION !!!");
});

module.exports = {
  indexRouter,
};