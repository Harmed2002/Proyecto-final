import { Router } from "express";
import { passportError, authorization } from "../utils/messagesError.js";
import { productController } from "../controllers/products.controller.js";
import upload from "../config/multer.js";


const productRouter = Router();


productRouter.get('/', productController.getProducts)
productRouter.get('/products-management', passportError('jwt'), authorization('Admin'), productController.getProducts)
productRouter.get('/:id', productController.getProductById);
productRouter.get('/category/:idCat', productController.getProductsByCategory);
productRouter.post('/', passportError('jwt'), authorization('Admin'), productController.postProduct);
productRouter.post('/upload', upload.single('thumbnail'), productController.uploadImage);
productRouter.put('/:id', passportError('jwt'), authorization('Admin'), productController.putProduct);
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), productController.deleteProduct);

export default productRouter;