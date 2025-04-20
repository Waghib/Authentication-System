import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            status: false,
            message: "Please fill all the fields",
        });
    }
    try {
        const existingUser = await userModel.findOne({ email})

        if (existingUser) {
            console.log("User already exists");
            return res.json({
                status: false,
                message: "User already exists",
            })
        }

        const hasedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email,
            password: hasedPassword,
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        console.log("User registered successfully");
        return res.json({
            status: true,
            message: "Registration successful",
        });

    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: "Internal server error",
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            status: false,
            message: "Please fill all the fields",
        });
    }
    try {
        const user = await userModel.findOne({email});

        if (!user){
            return res.json({status: false, message: 'Invalid email'})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({status: false, message: 'Invalid password'})
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        console.log("User logged in successfully");
        return res.json({
            status: true,
            message: "Login successful",
        });

    } catch (error) {
        return res.json({
            status: false,
            message: error.message,
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        console.log("User logged out successfully");
        return res.json({
            status: true,
            message: "Logout successful",
        });
    } catch (error) {
        return res.json({
            status: false,
            message: error.message,
        });
    }
}
    