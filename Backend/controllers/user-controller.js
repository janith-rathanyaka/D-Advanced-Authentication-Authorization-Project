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

    const token = jwt.sign({id:checkUser._id}, JWT_SECRET_KEY, {
         expiresIn:"1hr"
    });
    
    res.cookie(String(checkUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 30), //30 seconds
        httpOnly: true,
        sameSite: 'lax'
    } )

    return res.status(200).json({message: "Successfully Logged In",
        user: checkUser,token 
    });
}

const verifyToken = (req,res,next) => {
     const cookies = req.headers.cookie;
     console.log(cookies)
     const token = cookies.split("=")[1];
    if(!token) {
        res.status(404).json({message: "No token found!"})
    }

    jwt.verify(String(token), JWT_SECRET_KEY , (err, user) => {
        if(err) {
            return res.status(400).json({message:"Invalid Token"})
        }
        console.log(user.id)
        req.id = user.id;
    });
   next();
}

const getUser = async (req,res,next) => {
   const userId = req.id;
   let user;
   try {
       user = await User.findById(userId, "-password");
   } catch (error) {
       return new Error(error)
   }

   if(!user) {
       return res.status(404).json({message: "User Not Found"});
   }

   return res.status(200).json({user});
}

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser