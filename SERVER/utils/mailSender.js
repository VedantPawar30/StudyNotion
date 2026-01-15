const nodemailer = require("nodemailer")
require("dotenv").config()

exports.mailSender = async (email, title, body) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to:email,
            subject:title,
            html:body
        }
        // Send email
        let info = await transporter.sendMail(mailOptions)
        console.log("Email sent: " + info.response)
        return info
    }
    catch (error) {
        console.error("Error sending email: ", error)
        throw error
    }
}

