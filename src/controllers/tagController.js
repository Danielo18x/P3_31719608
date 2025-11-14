import TagRepository from "../repositories/tagRepository.js"

const tagRepo = new TagRepository()

export async function getTag(req, res) {
    try{
        const tags = await tagRepo.findAllTag();
        res.json(tags)
    } catch (error){
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function createTag(req, res){
    try {
        const createdTag= await tagRepo.addTag(req.body);
        res.status(200).json(createdTag)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function updateTag(req, res) {
    try {
        const putTag = await tagRepo.tagUpdate(req.params.id, req.body);
        res.status(200).json(putTag)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}

export async function deleteTag(req, res) {
    try {
        const tagDelete = await tagRepo.removeTag(req.params.id)
        res.status(200).json(tagDelete)
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        })
    }
}