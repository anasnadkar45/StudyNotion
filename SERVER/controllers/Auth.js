const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();


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

// Login user
exports.login = async (req, res) => {
    try{
        // fetch data from the body
        const {email , password} = req.body;

        // validate email and password
        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            })
        }

        // check if user exists or not 
        const user = await User.findOne({email}).populate("additionalDetals");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User does not exist , please sign in first"
            });
        }

        // Generate jwt token after matching the password
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id : user._id,
                role: user.accountType,
            }
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn: "2h"
            })
            user.token = token;
            user.password = undefined;

            // cookies generate 
            const option = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token",token,option).status(200).json({
                success: true,
                token,
                user,
                message: "login successful"
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: "password is incorrect"
            })
        }

    }catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message:"login failed , please try again"
        });
    }
};

exports.changePassword = async (req , res) =>{
    // get data from request body
    // get old password new password confirm password
    const {password , newPassword , confirmPassword} = req.body;
    
    // validate password
    // update new password confirm password in database
    // send mail password updated
    // return response
}