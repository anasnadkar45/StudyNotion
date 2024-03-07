const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');

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

        console.log("OTP Generated", otp);
        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6,
                {
                    lowerCaseAlphabets: false,
                    upperCaseAlphabets: false,
                    specialChars: false
                }
            );

        }

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "otp sent successfully",
            otp,
        })



    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

// signUp
exports.signUp = async (req, res) => {
    try {

        // fetch data from request body
        const {
            firstName,
            lastName,
            email,
            accountType,
            password,
            confirmPassword,
            otp,
            contactNumber
        } = req.body;

        // validate the fetched data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "Enter all the required fields"
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords and confirmPassword do not match"
            })
        }

        // check if the user already exists or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // find most recently created otp for user
        const recentOtp = OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        // validate Otp
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP Not Found"
            })
        } else if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "OTP Invalid"
            })
        }

        // Hash the Password
        const hashedPassword = await bcrypt.hash(password , 10);

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        // create a new user in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        console.log(user);

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message,
        })
    }
}