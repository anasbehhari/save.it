const Router = require("express").Router();
Router.get("/", (req, res) => {
  res.send("ee");
});

module.exports = Router;
