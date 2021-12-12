require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const Register = require("./models/models");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth")

const port = process.env.PORT || 3000;
const staticpath = path.join(__dirname, "../public")
const viewspath = path.join(__dirname, "../templates/views");
const partialspath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

app.use(express.static(staticpath));
app.set("view engine", "hbs");

app.set("views", viewspath);
hbs.registerPartials(partialspath)


app.get("/", (req, res)=> {
    // res.send("hello from other side");
    res.render("index");
})

app.get("/login", (req, res)=>{
    res.render("index");
})

app.get("/secret", auth,  (req, res)=>{
    console.log(`this is cookie token : ${req.cookies.jwtLogin}`);
    res.render("secret");
})
app.post("/register", async(req, res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        // console.log(`password is ${password} and cpassword is ${cpassword}`)
        if(password === cpassword){
            const addUser = new Register({
                name: req.body.name,
                email: req.body.email,
                phoneNumber : req.body.phoneNumber,
                password : req.body.password
            });
            // hashing password
            // concept of middleware in models.js

            // generating tokens
            const token = await addUser.generateAuthToken();
            
            // console.log(token);
            res.cookie("jwt", token,{
                expires : new Date(Date.now()+30000),
                httpOnly : true
            });
            const registererd = await addUser.save();
            res.status(201).render("index");
        }else{
            res.send("passwords are not matching");
        }
    } catch (error) {
        res.status(400).send(error)
    }
});

app.post("/login", async(req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const verifyMail = await Register.findOne({email:email});

        const matchPassword = await bcrypt.compare(password, verifyMail.password);

        const token = await verifyMail.generateAuthToken();
        // console.log(token);
        res.cookie("jwtLogin", token,{
            expires : new Date(Date.now()+ 600000),
            httpOnly : true
        });

        // console.log(`This is login Cookie with token :${req.cookies.jwtLogin}`)

        if(matchPassword){
            res.status(201).send("You have logged in")
        }else{
            res.status(400).send("Invalid email or wrong password!");
        }
    } catch (error) {
        res.status(400).send("Invalid login details");
    }

})

app.listen(port, ()=>{
    console.log(`server is running at ${port}`);    
});