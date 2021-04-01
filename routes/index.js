const Operation = require("../models/Operation");
const Router = require("express").Router();
Router.get("/", (req, res) => {
  res.render("index");
});
// const New_Operation = new Operation({Operation_route: "anasbehhari"})
// New_Operation.save();
Router.get("/:id", (req, res) => {
  Operation.findOne({ Operation_route: req.params.id })
    .then((data) => {
      if (data != null) {
        res.render("index", { data: data._id });
      } else {
        res.render("index", { data: "null" });
      }
    })
    .catch((err) => console.log(err));
});
Router.post("/rep", (req, res) => {
  if (req.body.rep != null && req.body.rep != "" && req.body.rep !=" " && !req.body.rep.startsWith(" ") && (req.body.rep).length > 1 ) {
    const rep = req.body.rep;
    Operation.findOne({Operation_route:rep})
    .then(response => {
      if(response) {
        res.render("site",{data : response});
      }
      else {
        res.render("site");
      }
    })
    .catch(err => res.send("something went wrong ! "+err))
  }
  else {
    res.redirect("/")
  }
});
Router.get("/site/preview",(req,res)=>{
  res.render("site")
})

module.exports = Router;
