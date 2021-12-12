const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email :{
        type:String,
        required:true
        
    },
    phoneNumber :{
        type: String,
        required: true,
    },
    password :{
        type: String,
        required: true,
    },
    tokens :[{
        token :{
            type:String,
            required:true
        }
    }]
}) ;

// middlewares

// generating tokens
userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        // console.log(token)
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    } catch (error) {
        res.status(400).send(error);
    }
}

//hashing passwords
userSchema.pre("save", async function(next){
    try{
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password,10);
        }
        next();
    }catch(error){
        console.log("Error in password hashing");
    }
});

// now we are defining collection

const Register = new mongoose.model("Register", userSchema);

module.exports = Register;