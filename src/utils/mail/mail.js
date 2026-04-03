import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use 'true' for port 465, 'false' for all other ports
  auth: {
    user: "a6e834001@smtp-brevo.com", // Your email address
    pass: process.env.BREVO_PASS, // Your email password or App Password
  },
});

// OTP method
const sendOTP = async function (userEmail) {
  try {
    const OTP = Math.floor(Math.random() * 10000);
    console.log(OTP);

    const info = await transporter.sendMail({
      from: '"Neo Team" <neoteam@example.com>', // sender address
      to: `${userEmail}`,
      subject: "Neo OTP Varification", // subject line
      text: `Your vafication code is ${OTP}`, // plain text body
      html: "<b>Hey, Injoy Your NEO Journey</b>", // HTML body
    });

    return OTP;
  } catch (err) {
    console.log("when sending OTP :\n", err);
  }
}; // it's return an OTP which we can get in controller and save it into user info

export default sendOTP;
