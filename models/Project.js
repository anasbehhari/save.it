const mongoose = require("mongoose")
var uuid = require('uuid');
const ProjectSchema = new mongoose.Schema({
    Project_route : {
        type:String,
        required:true
    },
    Project_title : {
        type:String,
        default:"Untitled"
    },
    Project_email: {
        type: String,
        default: ""
    },
    Project_Content : {
        type:String,
        default:""
    },
    Project_owner : {
        type:String,
        default: ""
    },
    Project_Description : {
        type: String,
        default:"This is project description !"
    },
    Project_password : {
        type : String,
        default: ""
    },
    Project_Date : {
        type:Date,
        default : Date.now
    }
    ,
    Project_key : {
       type:String,
        default: uuid.v4()
    },
    Project_recovery : {
        type: String,
        default : ""
    }
})


const Project = mongoose.model('Project',ProjectSchema);

module.exports = Project;