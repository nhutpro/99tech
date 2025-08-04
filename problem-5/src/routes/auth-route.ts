import { Router } from "express";
import authController from "../controllers/auth-controller";

const authRouter = Router();
authRouter.post('/', authController.authController as any);

export default authRouter;
