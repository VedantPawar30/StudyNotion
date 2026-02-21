const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.authMiddleware = (req,res,next) =>{
    try{
        const token = req.header("Authorization")?.replace("Bearer ","") || req.cookies.token
        if(!token){
            return res.status(401).json({message:"Unauthorized: No token provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"Middleware Issue: Internal Server Error"
            }
        )
    }
}

exports.isStudent = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(403).json({message:"Forbidden: Access is denied (Student only)"})
        }
        next()
    }
    catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"Internal Server Error"
            }
        )
    }
}

exports.isInstructor = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(403).json({message:"Forbidden: Access is denied (Instructor only)"})
        }
        next()
    }
    catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"This One is Instructor Middleware Internal Server Error"
            }
        )
    }
}

exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(403).json({message:"Forbidden: Access is denied (Admin only)"})
        }
        next()

    }
    catch(err){
        return res.status(500).json(
            {
                success:false,                
                message:"Internal Server Error"
            }
        )
    }
}
