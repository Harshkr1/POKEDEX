const express = require("express");
const app = express();
const path = require("path");
const { indexRouter } = require("./router/indexRouter.js");

const PORT = process.env.PORT || 3030;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw new error();
  }
  console.log(`listening to port ${PORT}`);
});
