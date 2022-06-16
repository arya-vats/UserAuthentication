const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/userdata").then(()=>{
    console.log(`Connection Successful with the database`);
}).catch((e)=>{
    console.log(`error`);
})