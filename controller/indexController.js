const db = require("../db/query");

async function showIndexPage(request, response) {
  const messages = await db.getAllTypeAndCount();
  if (!messages) {
    res.statusCode(404).send("Not Found");
  }
  response.send(messages);
}

module.exports = {
  showIndexPage,
};
