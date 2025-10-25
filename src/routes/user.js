import {Router} from "express"
import { getUser, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import valideUser from "../middleware/validateUser.js";
var router = Router();

router.use(valideUser);

router.get('/', getUser);

router.get('/:id', getUserById);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);



export default router;
