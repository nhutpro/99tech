import { Router } from "express";
import userController from "../controllers/user-controller";
import { adminMiddleware, extractJwtMiddleware, userMiddleware } from "../middlewares/auth-middleware";

const userRouter = Router();
userRouter.get('/:id', extractJwtMiddleware as any, userMiddleware as any, userController.getUserById as any);
userRouter.get('/', extractJwtMiddleware as any, adminMiddleware as any, userController.getUsers as any);
userRouter.post('/', extractJwtMiddleware as any, adminMiddleware as any, userController.createUser as any);
userRouter.put('/:id', extractJwtMiddleware as any, userMiddleware as any, userController.updateUser as any);
userRouter.delete('/:id', extractJwtMiddleware as any, adminMiddleware as any, userController.deleteUser as any);

export default userRouter;
