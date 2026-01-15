const User = require("../models/User")
const Profile = require("../models/Profile")
const Course = require("../models/Course")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const otpGenerator = require("otp-generator")
const Otp = require("../models/Otp")
const {mailSender} = require("../utils/mailSender")
const {passwordUpdated} = require("../mail/template/passwordUpdate")
require("dotenv").config()

exports.generateOtp = async (req,res) =>{
    try{
        const {email} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        //Generate  OTP
        var otp = otpGenerator.generate(6, {upperCaseAlphabets:false, specialChars:false, lowerCaseAlphabets:false})

        const result = await Otp.findOne({otp:otp})
        //If not unique then generate again until unique
        while(result){
            otp = otpGenerator.generate(6, {upperCaseAlphabets:false, specialChars:false, lowerCaseAlphabets:false})
        }

        //Create OTP entry in DB
        const newOtp = new Otp({email, otp:otp})
        await newOtp.save()

        res.status(200).json(
            {
                otp,
                message:"OTP sent successfully",
                success:true
            }
        )

    }
    catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"Unable to generate OTP",
                error: err.message

            }
        )
    }
}

exports.signUp = async (req,res) =>{
    try{
        const {firstName, lastName, email, password,confirmPassword, accountType, otp} = req.body

        //Validate input
        if(!firstName || !lastName || !email || !password || !otp || !confirmPassword){
            return res.status(400).json({success:false, message:"All fields are required"})
        }

        //password and confirm password match
        if(password !== confirmPassword){
            return res.status(400).json({success:false,message:"Passwords do not match"})
        }

        //Check if user already exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({success:false,message:"User already exists"})
        }

        //Verify most recent OTP
        const checkOtp = await Otp.findOne({email:email, otp:otp}).sort({createdAt:-1}).limit(1)
        if(!checkOtp){
            return res.status(400).json({success:false,message:"Otp not found"})
        }
        else if(otp !== checkOtp.otp){
            return res.status(400).json({success:false,message:"Invalid OTP"})
        }

        
        //Hash password
        const hashedPassword = await bcrypt.hash(password,10)

        let approved = ""
        approved === "Instructor" ? approved = false : approved = true

        const profileDetails = await Profile.create({
            gender:"",
            dateOfBirth:null,
            about:"",
            contactNumber:null
        })


        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            courses:[],
            image:`https://api.dicebear.com/9.x/initials/svg?seed=${firstName}+${lastName}`,
            courseProgress:[],
        })
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:newUser
        })  
    }
    catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"Unable to register user",
                error: err.message
            }
        )
    }
}


exports.login = async (req,res) =>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        const existingUser = await User.findOne({email}).populate("additionalDetails")
        if(!existingUser){
            return res.status(404).json({success:false,message:"User not found"})
        }
        const matchPassword = await bcrypt.compare(password,existingUser.password)
        if(!matchPassword){
            return res.status(401).json({success:false,message:"Invalid credentials"})
        }

        //Generate JWT token
        const token = jwt.sign({
            id: existingUser._id,
            accountType: existingUser.accountType

        }, process.env.JWT_SECRET, {expiresIn:"3h"}
        )

        existingUser.token = token
        existingUser.password = undefined

        //create a cookie and send token in cookie
        res.cookie("token", token, {
            httpOnly:true,
            expires:new Date(Date.now() + 3*24*60*60*1000)
            
        }).status(200).json({
            success:true,
            token,
            message:"Login successful",
            user:existingUser
        })

        

    }
    catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"Unable to login",
                error: err.message
            }
        )
    }
}

exports.changePassword = async(req,res) =>{
    try{
        //get old password, newpassword, confirmNewPassword from req body
        //validate
        //update password in db
        //send mail - password updated

        const {oldPassword, newPassword} = req.body
        if(!oldPassword || !newPassword){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        

        const user = await User.findById(req.user.id)
        const matchPassword = await bcrypt.compare(oldPassword,user.password)
        if(!matchPassword){
            return res.status(401).json({success:false,message:"Invalid old password"})
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword
        await user.save()

        //send mail
        const emailResult = await mailSender(user.email, "Password Changed Successfully",passwordUpdated(user.email, user.firstName + " " + user.lastName))

        res.status(200).json({
            success:true,
            message:"Password changed successfully",
            emailResult
        })
    }
    catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"Unable to change password",
                error: err.message
            }
        )
    }
}
