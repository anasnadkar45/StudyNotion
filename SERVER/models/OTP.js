const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email: {
        type:String,
        required: true,
    },
    otp:{
        type:String,
        required: true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = { OTP };

// module.exports = mongoose.model('Profile',profileSchema);

async function sendVerificationEmail(email, otp){
    try{
        const response = await mailSender(email,"Verification Email from StudyNotion", otp);
        console.log("email send successfully", response);

    }catch(err){
        console.log("error occured sending email: ", err);
    }
};

OTPSchema.pre("save" , async function (next){
    await sendVerificationEmail(this.email, this.otp);
})