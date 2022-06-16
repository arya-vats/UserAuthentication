const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const UserStructure = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
  
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]


    })


    UserStructure.methods.generateAuthToken = async function(){
        try{
            console.log(this._id);
            const gentoken = jwt.sign({_id:this._id.toString()} , process.env.SECRET_KEY); 
            this.tokens = this.tokens.concat({token:gentoken});
            await this.save();
            return gentoken;
        }catch(error){
            res.send("error part");
            console.log(error);
        }
    }


    UserStructure.pre("save", async function(next){
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password,10);
        }
        next();
})

const UserData = new mongoose.model("UserData", UserStructure);

module.exports = UserData;