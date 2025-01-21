const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")

//auth
exports.auth = async(req, res, next) => {

    try{
        //extract token--> 3 ways are there(One from body, one from cookie, one from bearer token)
        //most avoided way-> from body and most safe way-> from bearer token
        const token = req.cookies.token
                        || req.body.token
                         || req.header("Authorization").replace("Bearer ", "")

        //if token missing, then return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode
        }
        catch(err){
            //verification issue
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        next()
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
    }
}

//isStudent
exports.isStudent = async(req, res, next) => {
    //after decoding the token in auth middleware using jwt.verify we have inserted it in req.user
    //So everything of that token are stired inside req.user
    //We are getting things by (req.user.something) like this

    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students only",
            })
        }
        next()
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}

//isInstructor
exports.isInstructor = async(req, res, next) => {

    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructors only",
            })
        }
        next()
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}

//isAdmin
exports.isAdmin = async(req, res, next) => {

    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admins only",
            })
        }
        next()
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}