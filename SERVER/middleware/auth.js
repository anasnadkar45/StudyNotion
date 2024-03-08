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

}

// idInstructor Middleware


// isAdmin Middleware