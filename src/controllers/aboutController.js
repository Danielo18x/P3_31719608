export async function getAbout(req, res) {
    try{
        res.status(200).json({
            status: "success",
            data: {
                nombreCompleto: "Danilo Antonio Marin Lombano",
                cedula: "31719608",
                seccion: "2"
            }
        })
    } catch (error){
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}