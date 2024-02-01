const express = require("express");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
require("dotenv").config();
const route = require("./routes/route");
const xlsx = require('xlsx');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer().any());

const server = mongoose.connect(process.env.MONGODB_URI);

app.use("/",route);

app.listen(process.env.PORT||3000,function(){
    console.log("app is listening on port "+(process.env.PORT||3000));
    })

