const mongoose = require("mongoose")
const {mailSender} = require("../utils/mailSender")
const {otpTemplate} = require("../mail/template/emailVerificationTemplate")
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt :{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})

//Pre save hook to send OTP via email
otpSchema.pre("save", async function(next){
   try{
     const mailResponse = await mailSender(
        this.email,
        "OTP for Verification",
        otpTemplate(this.otp)
     )
     console.log("Mail sent successfully", mailResponse)
        next()
   }
    catch(err){
        console.log("Error in sending mail", err)
        next(err)
    }
})

module.exports = mongoose.model("Otp", otpSchema)