const Project = require("../models/Project");
const Router = require("express").Router();
var generator = require("generate-password");
const bcrypt = require('bcrypt');
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
Router.get("/",(req,res) => {
  res.render("index");
});
Router.post("/",(req,res) => {
  const { fullname,object,email,message } = req.body;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2,'0');
  var mm = String(today.getMonth() + 1).padStart(2,'0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  if (fullname != "" && object != "" && email != "" && message != "") {
    const nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saveit.noreply@gmail.com",
        pass: process.env.EMAIL_PASSWORD
      }
    })

    let mailOptions = {
      from: "saveit.noreply@gmail.com",
      to: "an.behhari@gmail.com",
      subject: object + "| Save.it Contact form " + today,
      html: `
      <iframe>
      <ul>
        <li>From : ${fullname}</li>
        <li>Object : <b>${object}</b></li>
      </ul>
      <p>
       ${message}
      </p>
      </iframe>
      `
    }
    transporter.sendMail(mailOptions,function (err,data) {
      if (err) {
        return res.send({ status: "failure",Message: "something went wrong please refresh the page !" })
      }
      res.render("index",{ success:true})
    })
  }

})
Router.post("/pid",(req,res) => {
  if (
    req.body.rep != null &&
    req.body.rep != "" &&
    req.body.rep != " " &&
    !req.body.rep.startsWith(" ") &&
    req.body.rep.length > 3
  ) {
    const rep = (req.body.rep).replace(" ","");
    res.redirect(`/${rep}`);
  } else {
    res.redirect("/");
  }
});
Router.get("/rgpsw/:id",(req,res) => {
  if (req.params.id) {
    var filter = { Project_recovery: req.params.id+"?route="+req.query.route };
    var password = generator.generate({
      length: 10,
      numbers: true,
    });
    bcrypt.hash(password,10,function (err,hash) {
      if (err) {
        res.redirect("/")
      }
      var newvalues = { $set: { Project_recovery: "",Project_password: hash } };
      Project.updateOne(filter,newvalues,function (err,response) {
        if (err) {
          res.redirect("/")
        }
        if (response.nModified == 1 && response.ok == 1) {
          const Message = {
            Encrypted: false,
            Data: {
              Project_route: ""
            },
            password,
            route: req.query.route
          }
          res.render("site",Message)
        }
        else {
          res.redirect("/")
        }
      });
    });

  }
})
Router.get("/:id",(req,res) => {
  Project.findOne({ Project_route: req.params.id })
    .then((data) => {
      if (data != null) {
        const Message = {
          Encrypted: false,
          Data: {
            Project_route: req.params.id
          },
          anas: true
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
              res.send({ status: "failure",message: "Error Handling request ! " })
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
                incorrect: true,
                anas: true
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