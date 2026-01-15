const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {mailSender} = require('../utils/mailSender');
require("dotenv").config();

exports.resetPasswordToken = async (req, res) => {
     try{
        const {email} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({message: "User with this email does not exist"});
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 5*60*1000; // 5 minutes
        await user.save();
        const url = `http://localhost:5173/update-password/${token}`
        const message = `You are receiving this email because you have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process within 5 mins of receiving it:\n\n
        ${url}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        await mailSender(user.email, "Password Reset", message);
        res.status(200).json({success:true,message: "Password reset email sent", token: token});
     }
     catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"Unable to send password reset email",
                error: err.message
            }
        )
     }
}

exports.resetPassword = async (req, res) => {
    try{
        const {token, password, confirmPassword} = req.body;
        const user = await User.findOne({
            resetPasswordToken: token
        });
        if(!user){
            return res.status(400).json({message: "Password reset token is invalid"});
        }
        if(user.resetPasswordExpires < Date.now()){
            return res.status(400).json({message: "Password reset token has expired"});
        }
        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({success:true,message: "Password has been reset successfully"});
    }
    catch(err){
        return res.status(500).json(
            {
                success:false,
                message:"Unable to reset password",
                error: err.message
            }
        )
    }
}
