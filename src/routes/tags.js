import {Router} from "express"
import { getTag, createTag, updateTag, deleteTag } from "../controllers/tagController.js";
import valideUser from "../middleware/validateUser.js";
var router = Router();

router.use(valideUser);

router.get('/', getTag);

router.post('/', createTag);

router.put('/:id', updateTag);

router.delete('/:id', deleteTag);

export default router;