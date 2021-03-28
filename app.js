//imports =>
const express = require("express");
const mongoose = require('mongoose');
const app = express();
require("dotenv").config()
//Static folders =>

app.use(express.static('./public'));
app.use("/css",express.static(__dirname + "public/css"))
//ejs Setup =>

app.set("views","./views")
app.set("view engine","ejs")
//request JSON 'parse' =>

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
//routes =>

app.use("/api",require("./routes/api/api.js"));
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