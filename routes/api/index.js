
const Router = require("express").Router()
const Project = require("../../models/Project");
const bcrypt = require('bcrypt');
var CryptoJS = require("crypto-js");
const uuid = require("uuid");
function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
function hideemail(target) {
    var email = target
    var hiddenEmail = "";
    for (i = 0; i < email.length; i++) {
        if (i > 2 && i < email.indexOf("@")) {
            hiddenEmail += "*";
        } else {
            hiddenEmail += email[i];
        }
    }
    return hiddenEmail
}
function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
Router.post("/update",(req,res) => {
    const { type,value,route,opid } = req.body;
    switch (type) {
        case "Title":
            var filter = { Project_route: route,Project_key: opid };
            var newvalues = { $set: { Project_title: value } };
            Project.updateOne(filter,newvalues,function (err,response) {
                if (err) {
                    res.send({ updated: false,message: "something went wrong ! " })
                }
                if (response.nModified == 1 && response.ok == 1) {
                    res.send({ updated: true,message: "updated ! " })
                }
                else {
                    res.send({ updated: false,message: "something went wrong ! " })
                }
            });
            break;
        case "email":
            var filter = { Project_route: route,Project_key: opid };
            var newvalues = { $set: { Project_email: value } };
            if (emailIsValid(value)) {
                Project.updateOne(filter,newvalues,function (err,response) {
                    if (err) {
                        res.send({ updated: false,message: "something went wrong ! " })
                    }
                    if (response.nModified == 1 && response.ok == 1) {
                        res.send({ updated: true,message: "updated !" })
                    }
                    else {
                        res.send({ updated: false,message: "something went wrong ! " })
                    }
                });
            }
            else {
                res.send({ updated: false,message: "Email not valid !" })
            }

            break;
        case "Name":
            var filter = { Project_route: route,Project_key: opid };
            var newvalues = { $set: { Project_owner: value } };
            Project.updateOne(filter,newvalues,function (err,response) {
                if (err) {
                    res.send({ updated: false,message: "something went wrong !" })
                }

                if (response.nModified == 1 && response.ok == 1) {
                    res.send({ updated: true,message: "updated !" })
                }
                else {
                    res.send({ updated: false,message: "something went wrong !" })
                }
            });
            break;
        case "Description":
            var filter = { Project_route: route,Project_key: opid };
            var newvalues = { $set: { Project_Description: value } };
            Project.updateOne(filter,newvalues,function (err,response) {
                if (err) {
                    res.send({ updated: false,message: "something went wrong 1 !" })
                }

                if (response.nModified == 1 && response.ok == 1) {
                    res.send({ updated: true,message: "updated !" })
                }
                else {
                    res.send({ updated: false,message: "something went wrong 2 !" + value })
                }
            });
            break;
        case "Password":
            Project.findOne({ Project_route: route,Project_key: opid })
                .then(data => {
                    if (data != null) {
                        bcrypt.compare(value.currentPassword,data.Project_password,function (err,result) {
                            if (result) {
                                bcrypt.hash(value.newPassword,10,function (err,hash) {
                                    data.updateOne({ Project_password: hash },function (err,response) {
                                        if (err) {
                                            res.send({ updated: false,message: "something went wrong !" })
                                        }
                                        if (response.nModified == 1 && response.ok == 1) {
                                            res.send({ updated: true,message: "updated !" })
                                        }
                                        else {
                                            res.send({ updated: false,message: "something went wrong  !" })
                                        }

                                    })

                                })
                            }
                            else {
                                res.send({ updated: false,message: "Password incorrect !" })
                            }
                        });
                    }
                    else {
                        res.send({ updated: false,message: "something went wrong !!" })

                    }
                })
            break;
        case "Delete":
            var filter = { Project_route: route,Project_key: opid };
            Project.deleteOne(filter,function (err,response) {
                if (err) res.send({ updated: false,message: "something went wrong !!" });
                if (response.n == 1 && response.deletedCount == 1) {
                    res.send({ updated: "deleted" })
                }
                else {
                    res.send({ updated: false,message: "something went wrong  !" })
                }
            })
            break;
        case "save":
            var filter = { Project_route: route,Project_key: opid };
            Project.updateOne(filter,{ Project_Content: CryptoJS.AES.encrypt(value,opid).toString() },function (err,response) {
                if (err) {
                    res.send({ updated: false,message: "something went wrong !" })
                }

                if (response.nModified == 1 && response.ok == 1) {
                    res.send({ updated: true,message: "Saved !" })
                }
                else {
                    res.send({ updated: false,message: "something went wrong !" })
                }
            });
            break;
    }
})
Router.post("/content",(req,res) => {
    const { route,opid } = req.body;
    Project.findOne({ Project_route: route,Project_key: opid })
        .then(data => {
            if (data != null) {
                var bytes = CryptoJS.AES.decrypt(data.Project_Content,data.Project_key);
                var originalText = bytes.toString(CryptoJS.enc.Utf8)
                data.Project_Content = originalText;
                res.send({ status: "success",data: data.Project_Content })
            }
            else {
                res.send({ status: "failure",message: "something went wrong !" })
            }
        })
        .catch(err => {
            res.send({ status: "failure",message: "something went wrong !" })
        })
})
Router.post("/frgp",(req,res) => {
    const { route } = req.body;
    Project.findOne({ Project_route: route })
        .then(data => {
            if (data != null && data.Project_email != "") {
                const nodemailer = require("nodemailer");
                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_UNSERNAME,
                        pass: process.env.EMAIL_PASSWORD
                    }
                })
                const link = uuid.v4() + "-@:" + getRandomString(45)+"?route="+route ;
                let mailOptions = {
                    from: process.env.EMAIL_UNSERNAME,
                    to: data.Project_email,
                    subject: "Reset your Route password for  save.it/" + data.Project_route + " account ! ",
                    html: `
                    <div>
                    <h4>Reset your Password </h4>
                       <p>
                        In order to reset your password follow this link : <b> <a target='_blank' href="https://saveitnow.herokuapp.com/rgpsw/${link}">Click here </a></b>
                       </p>

                       <b style="color:red">Notice  : This Link only for one ! use which means as soon as you click this link be deleted ! </b>
                       
                    </div>
                    `
                }
                transporter.sendMail(mailOptions,function (err,data) {
                    if (err) {
                        return res.send({ status: "failure",Message: "something went wrong please refresh the page !" })
                    }
                })
                var filter = { Project_route: route };
                var newvalues = { $set: { Project_recovery: link } };
                Project.updateOne(filter,newvalues,function (err,response) {
                    if (err) {
                        res.send({ status: "failure",Message: "something went wrong   !" })
                    }
                    if (response.nModified == 1 && response.ok == 1) {
                        res.send({ status: "success",Message: "Email sent to " + hideemail(data.Project_email) })
                    }
                    else {
                        res.send({ status: "failure",Message: "something went wrong   !" })
                    }
                });
            }
            else if (data && data.Project_email == "") {
                var filter = { Project_route: data.Project_route };
                var newvalues = { $set: { Project_Timer: new Date() } };
                if(data.Project_Timer !=null) {
                    res.send({ status: "failure",Message: "This route has no Email ! it will be deleted in 1day " })
                }
                else {
                    Project.updateOne(filter,newvalues,function (err,response) {
                    if (err) {
                        res.send({ status: "failure",Message: "something went wrong reload please   !" })
                    }
                    if (response.nModified == 1 && response.ok == 1) {
                        res.send({ status: "failure",Message: "This route has no Email ! it will be deleted in 1day " })
                    }
                    else {
                        res.send({ status: "failure",Message: "something went wrong reload please  !" })
                    }
                });
                }
                
            }
            else {
                res.send({ status: "failure",Message: "something went wrong   !" })
            }
        })
        .catch(err => {
            res.send({ status: "failure",Message: "something went wrong   !" })
        })
})


module.exports = Router;