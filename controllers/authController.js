const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const {firstName, lastName, email, password, role} = req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        user = new User({firstName, lastName, email, password:hashedPassword,role: role === "admin" ? "admin": "user"});
        await user.save();

        res.status(201).json({message: "User registered successfully"});
    }catch(error){
        res.status(500).json({message: "Server error", error: err.message});
    };
};

const signin = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.json({token, user: {id: user._id, firstName: user.firstName, email: user.email }});
    }catch(error){
        return res.status(500).json({message: "Server error", error: err.message});
    }
};

const adminLogin = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user || user.role !== "admin"){
            return res.status(403).json({message: "Access denied"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.json({token, admin: {id: user_id, name: user.firstName, email:user.email}});
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
}

module.exports = {register, signin, adminLogin};