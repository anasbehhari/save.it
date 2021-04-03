const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
    Project_route : {
        type:String,
        required:true
    },
    Project_title : {
        type:String,
        default:"Untitled"
    },
    Project_Content : {
        type:String,
        default : "<blockquote><p> Welcome ! we're Ready to <strong><u>Save.it !</u></strong> </p> </blockquote>"
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
})


const Project = mongoose.model('Project',ProjectSchema);

module.exports = Project;