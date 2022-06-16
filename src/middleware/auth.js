const jwt = require("jsonwebtoken");
const StudentData = require("../models/RegistrationSchema");


const auth = async (req,res,next)=>{
    try{

        const tkn = req.cookies.jwto;
        const verifyUser = jwt.verify(tkn, process.env.SECRET_KEY);
        console.log(verifyUser);
        

        const user = await StudentData.findOne({_id:verifyUser._id});
        // console.log(user);

        req.tkn = tkn;
        req.user = user;
        next();
    }catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;