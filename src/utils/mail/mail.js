import nodemailer from "nodemailer";
import env from 'dotenv'

env.config()

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use 'true' for port 465, 'false' for all other ports
  auth: {
    user: process.env.BRAVO_USER, // Your email address
    pass:process.env.BREVO_PASS, // Your email password or App Password
  },
});

// OTP method
const sendOTP = async function (userEmail) {
  try {
    const OTP = (Math.floor(Math.random() * 10000)).toString();

    const info = await transporter.sendMail({
      from: '"Neo Team" <neo701230@gmail.com>', // sender address
      to: `${userEmail}`,
      subject: "Neo OTP Varification", // subject line
      html: `<b>Hey, Injoy Your NEO Journey</b>
            <p>Your vafication code is ${OTP}</p>
      `, 
    });
    return OTP;
  } catch (err) {
    console.log("when sending OTP :\n", err);
  }
}; // it's return an OTP which we can get in controller and save it into user info

export default sendOTP;
