const db = require("../db/query");

async function showIndexPage(request, response) {
  response.render("index");
}

module.exports = {
  showIndexPage,
};
