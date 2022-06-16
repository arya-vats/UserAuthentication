require("./db/conn");
require("dotenv").config();
// const upload = require("express-fileupload");
const csvtojson = require("csvtojson");
const multer = require("multer");
const fs = require("fs");
const UserData = require("./models/RegistrationSchema");
const express = require("express");
const port = process.env.PORT || 3000;
const auth = require("./middleware/auth");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const app = express();
const static_path = path.join(__dirname, "../public");

const csvfilepath = "simple.csv";


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));


app.use(express.static(static_path));
app.set("view engine" , "hbs");


app.get("/", (req,res)=>{
    res.render("index");
})
app.get("/upload",(req,res)=>{
    res.send("uploaded");
})

app.get("/fuserd", async(req,res)=>{
    try{
        // const _id = req.params.id;
      const usrData = await UserData.find();
      
      console.log(usrData);
      res.send(usrData);
    }catch(e){
        res.status(500).send(e);
    }
})


app.get("/fileupload", (req,res)=>{
    res.render("fileupload");
})

app.get("/authuser", auth, (req,res)=>{
    res.render("authuser");
})
app.get("/Register", (req,res)=>{
    res.render("Register");
})

app.get("/Login", (req,res)=>{
    res.render("Login");
})

app.post("/Login", async(req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;

        const usr = await UserData.findOne({username:username});

        const isMatch = await bcrypt.compare(password, usr.password);

       
        const gentoken = await usr.generateAuthToken();
        console.log("gentoken is" + gentoken);
        res.cookie("jwto", gentoken, {
     
            httpOnly:true 
        });
        if(isMatch){
            res.status(201).render("authuser");
        }else{
            res.send("invalid Login details");
        }

    }catch(error){
        res.status(400).send("invalid login details");
    }


    res.render("Login");
})

app.post("/Register", async(req,res)=>{
    try{
        
        const registeredUser = new UserData({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            username:req.body.username,
            password : req.body.password
        })

       

        const registered = await registeredUser.save();
    }catch(error){
        res.status(400).send(error);
    }
    res.render("Login");
})




app.listen(port, ()=>{
    console.log(`Listening to port number ${port}`);
})