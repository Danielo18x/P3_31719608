export default function valideUser(req, res, next) {
    const token = req.cookies.tokencito;
    
    try {
        if (!token) {
            return res
                .status(401)
                .json({status: "error", message: "Access not authorized"})
        }
        return next();
    } catch (error){
        return res
            .status(401)
            .json({status: "error", message: "Access not authorized"})
    }
}
