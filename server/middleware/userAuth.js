import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    console.log("Cookies received:", req.cookies);
    console.log("Token exists in cookies:", !!req.cookies.token);
    
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized - No token provided",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id){
            // Initialize req.body if it doesn't exist
            if (!req.body) {
                req.body = {};
            }
            req.body.userId = decoded.id;
        }else{
            return res.status(401).json({
                status: false,
                message: "Unauthorized - Invalid token",
            });
        }
        next();

    } catch (error) {
        console.log("Token verification error:", error.message);
        return res.status(401).json({
            status: false,
            message: "Unauthorized",
        });
    }
}

export default userAuth;