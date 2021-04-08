
const Router = require("express").Router()
const Project = require("../../models/Project");
const bcrypt = require('bcrypt');
function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
                    res.send({ updated: true,message: "Title updated sucessfully !" })
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
                        res.send({ updated: true,message: "Email updated sucessfully !" })
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
                    res.send({ updated: true,message: "userName updated sucessfully !" })
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
                    res.send({ updated: true,message: "Description updated sucessfully !" })
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
                                            res.send({ updated: true,message: "updated sucessfully ! New Password : " + value.newPassword })
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
            Project.updateOne(filter,{ Project_Content: value },function (err,response) {
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
    const {route,opid } = req.body;

    Project.findOne({ Project_route: route,Project_key: opid })
        .then(data => {
            if (data != null) {
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

module.exports = Router;