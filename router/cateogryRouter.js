const express = require("express");
const db = require("../db/query");
const cateogryRouter = express.Router();

const { showCateogryPage, deleteCateogry } = require("../controller/cateogryController.js");

cateogryRouter.get("/", showCateogryPage);
cateogryRouter.get("/delete",deleteCateogry)

module.exports = {
  cateogryRouter,
};
