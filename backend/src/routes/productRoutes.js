import express from 'express';
import { getProducts,getProductById, createProduct,deleteProduct ,getTopProducts,updateProduct} from '../controllers/productController.js';

const router = express.Router();
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/top', getTopProducts);
router.post('/', createProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct);

export default router;