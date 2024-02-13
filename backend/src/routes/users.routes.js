import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from '../utils/messagesError.js';
import { getUser, getUsers, putUser, deleteUser } from "../controllers/user.controller.js";


const userRouter = Router();

userRouter.get('/', passportError('jwt'), authorization('Admin'), getUsers);
userRouter.get('/:id', passportError('jwt'), authorization('Admin'), getUser)
userRouter.put('/:id', putUser)
userRouter.delete('/:id', passportError('jwt'), authorization('Admin'), deleteUser)

export default userRouter;