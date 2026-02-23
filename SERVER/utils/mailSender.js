const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.mailSender = async (email, title, body) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", response);
    return response;

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};