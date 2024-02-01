const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
fileName:{type:String,required:true}
},
{timestamps:true}
)

module.exports = mongoose.model("fileData",fileSchema);