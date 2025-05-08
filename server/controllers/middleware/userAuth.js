import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id){
            req.body.userId = decoded.id;
        }else{
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }
        next();

    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized",
        });
    }
}

export default userAuth;