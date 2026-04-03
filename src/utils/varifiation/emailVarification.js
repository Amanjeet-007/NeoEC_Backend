// get the user check the varification if not varify send a varification notification or a html to varify 
// get user varification status


// # Mailtrap for testing 
// # replace id with google app password later (NEO)

// route =>     /api/emailvarify (post) user should be logged in 

import { User } from "../../model/userModel.js";
import sendOTP from "../mail/mail.js";

export default async function emailVarification(req,res) {
    // use varify middleware before this to get the logged in user
    try{
        const id = req.user.id;
        const user = await User.findById(id);
        if(!user.varified){
            const OTP = sendOTP(user.email);
            user.emailOTP = OTP;
            user.save()
            res.status(400).json({message:"email is not varified",status:false})
        }
        res.status(200).json({message:"varified",status:true})
    }
    catch(err){
        console.log("while email varification",err)
    }
}