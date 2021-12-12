const jwt = require("jsonwebtoken");

const Register = require("../models/models");

const auth = async(req, res, next)=>{
    try{
        const token = req.cookies.jwtLogin;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyUser);
        const user = await Register.findOne({_id:verifyUser._id});
        console.log(user);
        next();

    }catch(error){
        res.status(400).send(error);
    }
}

module.exports = auth;