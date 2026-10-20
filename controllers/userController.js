import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res) {
    if(req.body.user == "admin"){
        if(req.user != null){
            res.status(403).json({
                message : "You are not authorized to create admin accounts"
            })
            return
        }
    }else{
        res.status(403).json({
            message : "You are not authorized to create admin accounts.Please login first"
        })
        return
    }

    //create pwd hash
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        img: req.body.img
    });

    user.save()
        .then(() => {
            res.json({
                message: "User data saved successfully"
            })
        })
        .catch(() => {
            res.json({
                message: "failed to save user data"
            })
        })
}

export function loginUser(req,res){
    const email =req.body.email
    const password = req.body.password

    User.findOne ({email : email}).then (
        (user)=>{
            if(user == null){
                res.status(404).json({
                    message: "User not found"
                })
            }else{
                const isPasswordCorrect = bcrypt.compareSync(password,user.password)

                if(isPasswordCorrect){

                    //Generate token for the user
                    const token = jwt.sign(
                        { 
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        img: user.img 
                    },
                    "mi@BA56",
                )
                    res.json({
                        message: "login successful",
                        token: token
                    }
                    )
                } else{
                    res.status(401).json({
                        message : "Invalid password"
                    })
                }
            }
        })



}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role != "admin"){
        return false;
    }
    return true;
}

 
