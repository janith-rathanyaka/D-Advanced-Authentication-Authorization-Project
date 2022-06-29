const User = require('../model/User');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "MyKey";

const signup = async (req,res,next) => {
    const {name , email ,password} = req.body;
    
    let checkUser; 

    try {
        checkUser = await User.findOne({email: email})
    } catch (error) {
        console.log(error)
    }

    if(checkUser) {
        return res.status(400).json({message: "user already exists"})
    }
    
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        email,
        password : hashedPassword
    })

    try {
        await user.save();
    } catch (err) {
        console.log(err)
    }

    return res.status(201).json({message:user})
}

const login = async (req,res,next) => {
    const {email ,password} = req.body;
    
    let checkUser; 

    try {
        checkUser = await User.findOne({email: email})
    } catch (error) {
        console.log(error)
    }

    if(!checkUser) {
        return res.status(400).json({message: "user not Found"})
    }

    const isPasswordCorrect = bcrypt.compareSync(password, checkUser.password);
    
    if(!isPasswordCorrect) {
        return res.status(400).json({message: "Invalid Email/ Password"}); 
    }

    return res.status(200).json({message: "Successfully Logged In"});
}

exports.signup = signup;
exports.login = login;