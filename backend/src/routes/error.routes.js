import { Router } from "express";
import {debug, info, warning, error, fatal} from '../controllers/errors.controller.js';

const errorRouter = Router();



errorRouter.get('/debug', debug);
errorRouter.get('/info', info);
errorRouter.get('/warning', warning);
errorRouter.get('/error', error);
errorRouter.get('/fatal', fatal);



export default errorRouter;


