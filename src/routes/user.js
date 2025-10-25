import {Router} from "express"
import { getUser, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
var router = Router();

router.get('/', getUser);

router.get('/:id', getUserById)

router.post('/', createUser)

router.put('/:id', updateUser)

router.delete('/:id', deleteUser)

export default router;
