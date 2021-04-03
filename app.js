//imports =>
const express = require("express");
const mongoose = require('mongoose');
const app = express();
require("dotenv").config()
var CryptoJS = require("crypto-js");
//Static folders =>
 
// Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
//  console.log(ciphertext);
// Decrypt
// var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
// var originalText = bytes.toString(CryptoJS.enc.Utf8);
 
// console.log(originalText); // 'my message'
app.use(express.static('./public'));
app.use("/css",express.static(__dirname + "public/css"))
app.use("/fonts",express.static(__dirname + "public/fonts"))
app.use("/icons",express.static(__dirname + "public/icons"))
app.use("/scripts",express.static(__dirname + "public/scripts"))
app.use("/media",express.static(__dirname + "public/media"))



//ejs Setup =>

app.set("views","./views")
app.set("view engine","ejs")
//request JSON 'parse' =>

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
//routes =>

app.use("/",require("./routes/index.js"));

//db config  =>

mongoose
    .connect(process.env.DBURI,{ useUnifiedTopology: true,useNewUrlParser: true,useFindAndModify: true})
    .then(() => console.log("MongoDb Connected..."))
    .catch(err => console.log(err))

//Listener =>

app.listen(process.env.PORT,() => {
    console.log(`Server running on ${process.env.PORT}`);
})