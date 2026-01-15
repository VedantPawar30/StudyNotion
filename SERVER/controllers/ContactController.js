const {mailSender} = require("../utils/mailSender");
require("dotenv").config();
exports.submitQuery = async (req, res) => {
    try{
        const {firstname, lastname, email,countrycode, phoneNo, message} = req.body;
        if(!firstname || !email || !countrycode || !phoneNo || !message){
            return res.status(400).json({
                success:false,
                message:"Please fill all required fields",
            });
        }
        //Send mail to admin
        const fullContactNumber = `${countrycode} ${phoneNo}`;
        await mailSender(process.env.ADMIN_EMAIL, "New Contact Us Query",
        `<h1>New Query from ${firstname} ${lastname}</h1>` +
        `<p><strong>Email:</strong> ${email}</p>` +
        `<p><strong>Phone Number:</strong> ${fullContactNumber}</p>` +
        `<p><strong>Message:</strong> ${message}</p>`
        );

        return res.status(200).json({
            success:true,
            message:"Query submitted successfully",
        });

    }
    catch(error){
        console.error("Error in submitQuery:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        });
    }
}

