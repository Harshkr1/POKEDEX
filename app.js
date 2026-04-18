const express = require("express");
const app = express();
const path = require("path");
const { indexRouter } = require("./router/indexRouter.js");
const { cateogryRouter } = require("./router/cateogryRouter.js");
const { pokemonRouter } = require("./router/pokemonRouter.js");

const PORT = process.env.PORT || 3030;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/cateogry", cateogryRouter);
app.use("/pokemon", pokemonRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw new error();
  }
  console.log(`listening to port ${PORT}`);
});
