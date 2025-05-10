import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// Register user
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
        // Send welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to our service",
            text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nYour Company`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
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

// Login user
export const login = async (req, res) => {

    if(!req.body) {
        return res.json({
            status: false,
            message: "Please fill all the fields",
        });
    }
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

        // Log cookie options for debugging
        console.log("Setting token cookie with options:", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
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

// Logout user
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

// Send OTP for email verification
export const sendVerifyOtp = async (req, res) => {
    try {
        console.log("Full request body in sendVerifyOtp:", req.body);
        const {userId} = req.body;
        console.log("User ID received from middleware:", userId);
        
        const user = await userModel.findById(userId);

        if(user.isAccountVerified) {
            return res.json({
                status: false,
                message: "Account already verified",
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        console.log("OTP generated:", otp);

        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiry
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP for account verification is ${otp}. It is valid for 24 hours.`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });

        console.log("OTP sent successfully");
        return res.json({
            status: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        res.json({
            status: false,
            message: error.message,
        });
    }
}

// Verify OTP
export const verifyEmail = async (req, res) => {
    console.log("Full request body in verifyEmail:", req.body);
    // Get userId from the middleware or from the request body
    const { userId, otp } = req.body;

    if (!otp) {
        return res.json({
            status: false,
            message: "Please provide OTP",
        });
    }

    if (!userId) {
        return res.json({
            status: false,
            message: "User ID is required",
        });
    }

    try {
        const user = await userModel.findById(userId);
        console.log("User found:", !!user);

        if (!user) {
            return res.json({
                status: false,
                message: "User not found",
            });
        }

        // Log OTP values for debugging
        console.log("OTP received:", otp);
        console.log("OTP in database:", user.verifyOtp);
        console.log("OTP expiry:", user.verifyOtpExpiryAt, "Current time:", Date.now());

        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({
                status: false,
                message: "Invalid OTP",
            });
        }

        if(user.verifyOtpExpiryAt < Date.now()) {
            return res.json({
                status: false,
                message: "OTP expired",
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiryAt = 0;

        await user.save();
        console.log("Account verified successfully");
        return res.json({
            status: true,
            message: "Account verified successfully",
        });

    } catch (error) {
        console.log("Error in verifyEmail:", error.message);
        return res.json({
            status: false,
            message: error.message,
        });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            status: true,
            message: "User is authenticated",
        });
    } catch (error) {
        return res.json({
            status: false,
            message: error.message,
        });
    }
}

// Send reset OTP
export const sendResetOtp = async (req, res) => {

    const {email} = req.body;

    if(!email) {
        return res.json({
            status: false,
            message: "Please provide email",
        });
    }

    try {
        const user = await userModel.findOne({email});

        if(!user) {
            return res.json({
                status: false,
                message: "User not found",
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Reset Password OTP",
            text: `Your OTP for reset password is ${otp}. It is valid for 24 hours.`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });

        console.log("OTP sent successfully");
        return res.json({
            status: true,
            message: "OTP sent successfully",
        });
        
    } catch (error) {
        return res.json({
            status: false,
            message: error.message,
        });
    }
}

// Reset password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword) {
        return res.json({
            status: false,
            message: "Please provide all the fields",
        });
    }
    
    try {
        const user = await userModel.findOne({email});

        if(!user) {
            return res.json({
                status: false,
                message: "User not found",
            });
        }

        if(user.resetOtp !== otp || user.resetOtp === "") {
            return res.json({
                status: false,
                message: "Invalid OTP",
            });
        }

        if(user.resetOtpExpiryAt < Date.now()) {
            return res.json({
                status: false,
                message: "OTP expired",
            });
        }

        const hasedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hasedPassword;
        user.resetOtp = '';
        user.resetOtpExpiryAt = 0;
        await user.save();

        console.log("Password reset successfully");
        return res.json({
            status: true,
            message: "Password reset successfully",
        });
            
    } catch (error) {
        return res.json({
            status: false,
            message: error.message,
        });
    }
}
