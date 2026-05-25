import { User } from "../../model/userModel.js";
import sendOTP from "../mail/mail.js";

export async function checkOtpStatus(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // 1. Check if the OTP object even exists
    if (!user.emailOTP || !user.emailOTP.value) {
      return res
        .status(200)
        .json({ message: "OTP is not sended", result: false });
    }

    const currentTime = Date.now();
    const expiryTime = user.emailOTP.exptime;

    // 2. Check for expiration
    if (currentTime > expiryTime) {
      return res.status(200).json({
        message: "OTP is expired",
        result: false,
        expired_at: expiryTime,
      });
    }

    // 3. If it exists and is NOT expired
    return res.status(200).json({
      message: "OTP is active",
      result: true,
      time_remaining_ms: expiryTime - currentTime,
    });
  } catch (err) {
    console.error("OTP Status Error:", err);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Error while checking status of OTP" });
    }
  }
}

export default async function sendOTPtoUser(req, res) {
  // use varify middleware before this to get the logged in user
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user.varified) {
      const OTP = await sendOTP(user.email);
      user.emailOTP = {
        value: String(OTP),
        exptime: Date.now() + 5 * 60 * 1000,
      };
      await user.save();
      return res
        .status(200)
        .json({ message: "email sended", status: true, OTP , expTime: user.emailOTP.exptime});
    }
    return res.status(400).json({ message: "not varified", status: false });
  } catch (err) {
    console.log("while email varification", err);
    return res.status(400).json({ message: "while email varification", err });
  }
}

// complete it before use it 🛠️
export async function varifyOTP(req, res) {
  try {
    const userId = req.user.id;
    const OTP = req.body.OTP;

    const user = await User.findById(userId);

    // ❗ Check if OTP exists
    if (!user || !user.emailOTP) {
      console.log("No OTP found");
      return res.status(400).json({
        message: "No OTP found",
        status: false,
      });
    }

    const { value, exptime } = user.emailOTP;

    if (Date.now() > exptime) {
      console.log("expired OTP");
      return res
        .status(400)
        .json({ message: "expired otp", status: "expired" });
    }
    if (value == OTP) {
      user.varified = true;
      user.emailOTP = undefined; // remove OTP after use
      await user.save();
      console.log("varified now");
      return res
        .status(200)
        .json({ message: "varification completed", status: "varified" , user });
    }
    console.log("OTP not matching");
    return res.status(400).json({ message: "Otp is not matched" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error found", status: false });
  }
}
