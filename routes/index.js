const Operation = require("../models/Operation");
const Router = require("express").Router();
Router.get("/", (req, res) => {
  res.render("index");
});
// const New_Operation = new Operation({Operation_route: "anasbehhari"})
// New_Operation.save();
Router.get("/:id", (req, res) => {
  Operation.
  findOne({ Operation_route: req.params.id })
  .then((data) => {
    if(data !=null) {
      res.render("index",{data:data._id})
    }
    else {
      res.render("index",{data:"null"})
      
    }
  })
  .catch(err => console.log(err))
});

module.exports = Router;
