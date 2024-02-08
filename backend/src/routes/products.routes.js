import { Router } from "express";
import { passportError, authorization } from "../utils/messagesError.js";
import { productController } from "../controllers/products.controller.js";
import upload from "../config/multer.js"


const productRouter = Router();


productRouter.get('/', productController.getProducts)
productRouter.get('/management', productController.getProducts)
productRouter.get('/:id', productController.getProductById);
productRouter.get('/category/:idCat', productController.getProductsByCategory);
productRouter.post('/', passportError('jwt'), authorization('Admin'), productController.postProduct);
productRouter.put('/:id', passportError('jwt'), authorization('Admin'), productController.putProduct);
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), productController.deleteProduct);
productRouter.post('/upload/:id', upload.array('product'), productController.uploadImage);

export default productRouter;