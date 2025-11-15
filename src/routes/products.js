import {Router} from "express"
import { getProduct, publicProduct, getProductById, createProduct , updateProduct, deleteProduct} from "../controllers/productsController.js";
import valideUser from "../middleware/validateUser.js";
var router = Router();

router.get('/products', getProduct);
router.get('/p/:id-:slug', publicProduct);

router.use(valideUser);

router.post('/products', createProduct);

router.get('/products/:id', getProductById);

router.put('/products/:id', updateProduct);

//router.get('/', getCategory);

router.delete('products/:id', deleteProduct);

export default router;