import { Router } from "express";
import { passportError, authorization } from "../utils/messagesError.js";
import { getFakerProducts } from "../controllers/mocking.controllers.js";

const mockingRouter = Router()

mockingRouter.get('/', passportError('jwt'), authorization('Admin'), getFakerProducts)

export default mockingRouter