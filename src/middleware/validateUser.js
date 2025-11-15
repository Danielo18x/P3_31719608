import jwt from "jsonwebtoken";

export default function valideUser(req, res, next) {
    const token = req.cookies.tokencito;
    
    try {
        if (!token) {
            return res
                .status(401)
                .json({status: "error", message: "Access not authorized"})
        }
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (user.rol !== "admin"){
            return res
                .status(401)
                .json({ status: "fail", message: "Access not authorized" });
        }
        return next();
    } catch (error){
        return res
            .status(401)
            .json({status: "error", message: "Access not authorized"})
    }
}
