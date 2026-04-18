const express = require("express");
const db = require("../db/query");
const indexRouter = express.Router();
const { showIndexPage } = require("../controller/indexController.js");

indexRouter.get("/", showIndexPage);
module.exports = {
  indexRouter,
};
