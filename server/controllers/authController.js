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

    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: "Internal server error",
        });
    }

}