import { Router } from "express";
import {getProducts ,getProductById, getProductsByCategory, postProduct, putProduct, deleteProduct } from "../controllers/products.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";


const productRouter = Router();


productRouter.get('/', getProducts)
productRouter.get('/management', getProducts)
productRouter.get('/:id', getProductById);
productRouter.get('/category/:idCat', getProductsByCategory);
productRouter.post('/', passportError('jwt'), authorization('Admin'), postProduct);
productRouter.put('/:id', passportError('jwt'), authorization('Admin'), putProduct);
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), deleteProduct);


export default productRouter;