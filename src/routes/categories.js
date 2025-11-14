import {Router} from "express"
import { getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import valideUser from "../middleware/validateUser.js";
var router = Router();

router.use(valideUser);

router.get('/', getCategory);

router.post('/', createCategory);

router.put('/:id', updateCategory);

router.delete('/:id', deleteCategory);

export default router;