import CategoryRepository from "../repositories/categoryRepository.js"

const categRepo = new CategoryRepository()

export async function getCategory(req, res) {
    try{
        const categories = await categRepo.findAllCategory();
        res.json(categories)
    } catch (error){
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function createCategory(req, res){
    try {
        const createdCategory= await categRepo.addCategory(req.body);
        res.status(200).json(createdCategory)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function updateCategory(req, res) {
    try {
        const putCategory = await categRepo.categoryUpdate(req.params.id, req.body);
        res.status(200).json(putCategory)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function deleteCategory(req, res) {
    try {
        const categoryDelete = await categRepo.removeCategory(req.params.id)
        res.status(200).json(categoryDelete)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}