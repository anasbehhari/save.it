const mongoose = require("mongoose")

const OperationSchema = new mongoose.Schema({
    Operation_route : {
        type:String,
        default : ""
    },
    Operation_Data_Text : {
        type:String,
        default: ""
    },
    Operation_owner : {
        type:String,
        default: ""
    },
    Operation_password : {
        type : String,
        default : null
    },
    Operation_Date : {
        type:Date,
        default : Date.now
    }

})


const Operation = mongoose.model('Operation',OperationSchema);

module.exports = Operation;