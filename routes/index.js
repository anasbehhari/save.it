const Project = require("../models/Project");
const Router = require("express").Router();
var generator = require("generate-password");
Router.get("/clear", (req, res) => {
  Project.deleteMany()
    .then(res.send("clear"))
    .catch((err) => res.send(err));
});
Router.get("/database", (req, res) => {
  Project.find().then((data) => {
    res.json(data);
  });
});















Router.get("/", (req, res) => {
  res.render("index");
});
Router.post("/pid", (req, res) => {
  if (
    req.body.rep != null &&
    req.body.rep != "" &&
    req.body.rep != " " &&
    !req.body.rep.startsWith(" ") &&
    req.body.rep.length > 1
  ) {
    const rep = req.body.rep;
    res.redirect(`/${rep}`);
  } else {
    res.redirect("/");
  }
});
Router.get("/:id", (req, res) => {
  Project.findOne({ Project_route: req.params.id })
    .then((data) => {
      if (data != null) {
        res.render("site", { data: data._id , Notverified:true ,rep:req.params.id});
      } else {
        var password = generator.generate({
          length: 15,
          numbers: true,
          symbols: true,
        });
        const NewProject = new Project({
          Project_route: `${req.params.id}`,
          Project_password: password,
        });
        NewProject.save()
          .then((newone) => {
            console.log(newone);
            res.render("site", { available: true, project: newone ,rep : req.params.id});
          })
          .catch((err) => {
            res.redirect("/");
          });
      }
    })
    .catch((err) => console.log(err));
});

module.exports = Router;
