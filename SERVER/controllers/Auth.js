const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator')

// sendOTP
exports.sendOTP = async (req, res) => {

    try {// fetch email from request body
        const { email } = req.body;

        // check if user already exists or not
        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).josn({
                success: false,
                message: 'User already registered'
            })
        }

        // generate Otp
        var otp = otpGenerator.generate(6,
            {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            }
        );
        console.log("OTP Generated",otp);



    } catch (err) {

    }
}