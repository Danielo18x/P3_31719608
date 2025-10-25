export async function getPing(req, res) {
    try{
        res.status(200).send("")
    } catch (error){
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}