//imports =>
const express = require("express");
const mongoose = require('mongoose');
const app = express();
require("dotenv").config()
app.use(express.static('./public'));
app.use("/css",express.static(__dirname + "public/css"))
app.use("/fonts",express.static(__dirname + "public/fonts"))
app.use("/icons",express.static(__dirname + "public/icons"))
app.use("/scripts",express.static(__dirname + "public/scripts"))
app.use("/media",express.static(__dirname + "public/media"))
app.use("/uploads",express.static(__dirname + "public/uploads"))
//ejs Setup =>
app.set("views","./views")
app.set("view engine","ejs")
//request JSON 'parse' =>
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
//routes =>
app.use("/",require("./routes/index.js"));
app.use("/api",require("./routes/api/index.js"));

app.get("*",(req,res) => {
    res.redirect("/")
})
//db config  =>
mongoose
    .connect(process.env.DBURI,{ useFindAndModify: true,useUnifiedTopology: true,useNewUrlParser: true })
    .then(() => console.log("MongoDb Connected..."))
    .catch(err => console.log(err))
//Listener =>
app.listen(process.env.PORT,() => {
    console.log(`Server running on ${process.env.PORT}`);
})