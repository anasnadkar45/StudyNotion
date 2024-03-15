const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// authentication Middleware
exports.auth = async (req, res, next) => {
    try{
        // get the token
        const token = req.cookies.token ||
                        req.body.token ||
                        req.header("Authorization").replace("Bearer ","");

        // if token is missing return the response
        if(!token){
            return res.status(401).json({
                success: false,
                message:"Token is missing"
            })
        }

        // verify the token
        try{
            const decode =  jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(err){
            return res.status(401).json({
                success: false,
                message:"Token is invalid"
            })
        }

        next();
    }catch(err){
        return res.status(401).json({
            success: false,
            message:"something went wrong while validating the token"
        })
    }
}

// isStudent Middleware
exports.isStudent = async(req, res, next) => {
    try{
        if(req.user.accountType !== 'Student'){
            return res.status(401).json({
                success: false,
                message:"This is protected route for student only"
            })
        }
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified , please try again"
        })
    }
}

// isInstructor Middleware
exports.isInstructor = async(req, res, next) => {
    try{
        if(req.user.accountType !== 'Instructor'){
            return res.status(401).json({
                success: false,
                message:"This is protected route for Instructor only"
            })
        }
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified , please try again"
        })
    }
}

// isAdmin Middleware
exports.isAdmin = async(req, res, next) => {
    try{
        if(req.user.accountType !== 'Admin'){
            return res.status(401).json({
                success: false,
                message:"This is protected route for Admin only"
            })
        }
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message:"User role cannot be verified , please try again"
        })
    }
}