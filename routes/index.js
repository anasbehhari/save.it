const Project = require("../models/Project");
const Router = require("express").Router();
var generator = require("generate-password");
const bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js");
Router.get("/clear",(req,res) => {
  Project.deleteMany()
    .then(res.send("clear"))
    .catch((err) => res.send(err));
});
Router.get("/database",(req,res) => {
  Project.find().then((data) => {
    res.json(data);
  });
});

//CryptoJS.AES.encrypt("<blockquote><p> Welcome ! we're Ready to <strong><u>Save.it !</u></strong> </p> </blockquote>",Serial).toString()
//var bytes = CryptoJS.AES.decrypt(newone.Project_Content,newone.Project_key);
//var originalText = bytes.toString(CryptoJS.enc.Utf8);

Router.get("/",(req,res) => {
  res.render("index");
});
Router.post("/pid",(req,res) => {
  if (
    req.body.rep != null &&
    req.body.rep != "" &&
    req.body.rep != " " &&
    !req.body.rep.startsWith(" ") &&
    req.body.rep.length > 3
  ) {
    const rep = req.body.rep;
    res.redirect(`/${rep}`);
  } else {
    res.redirect("/");
  }
});
Router.get("/:id",(req,res) => {
  Project.findOne({ Project_route: req.params.id })
    .then((data) => {
      if (data != null) {
        const Message = {
          Encrypted: false,
          Data: {
            Project_route: req.params.id
          }
        }
        res.render("site",Message);
      }
      else if (req.params.id != null &&
        req.params.id != "" &&
        req.params.id != " " &&
        !req.params.id.startsWith(" ") &&
        req.params.id.length > 3) {
        var password = generator.generate({
          length: 10,
          numbers: true,
        });
        bcrypt.hash(password,10,function (err,hash) {
          var NewProject = new Project({
            Project_route: `${req.params.id}`,
            Project_password: hash,
          });
          NewProject.save()
            .then((newone) => {
              const Message = {
                Encrypted: true,
                newOne: true,
                Data: newone,
                password
              }
              res.render("site",Message);
            })
            .catch((err) => {
              res.redirect("/");
            });
        });

      }
      else {
        res.redirect("/");
      }
    })
    .catch((err) => console.log(err));
});
Router.post("/:id",(req,res) => {
  const { repo,password } = req.body;
  if (repo && password && password != "" && repo != "" && !repo.startsWith(" ") && repo.length > 1) {
    Project.findOne({ Project_route: repo })
      .then(data => {
        if (data != null) {
          bcrypt.compare(password,data.Project_password,function (err,result) {
            if (err) {
              res.send({ status: "failure",message: "Error Handling request (wa walo a m3alem ) ! " })
            }
            if (result) {
              const Message = {
                Encrypted: true,
                Data: data
              }
              res.render("site",Message);
            }
            else {
              const Message = {
                Encrypted: false,
                Data: {
                  Project_route: req.params.id
                },
                incorrect: true
              }
              res.render("site",Message);
            }
          })
        }
        else {
          res.redirect("/")
        }
      })
  }
  else {
    res.redirect("/")
  }
})

module.exports = Router;
