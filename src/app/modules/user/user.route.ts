import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema, updateZodSchema } from "./user.validation";
import { IUserRole } from "./user.interface";
import { authCheck } from "../../middleware/authCheck";


const router = Router();

router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser);

router.get('/all-users', authCheck(IUserRole.ADMIN), UserControllers.getAllUsers);

router.get('/:id', authCheck(IUserRole.ADMIN), UserControllers.getSingleUser);

router.patch('/:id', validateRequest(updateZodSchema), authCheck(...Object.values(IUserRole)), UserControllers.updateUser);

router.patch('/block/:id', authCheck(IUserRole.ADMIN), UserControllers.blockUser);

router.patch('/unblock/:id', authCheck(IUserRole.ADMIN), UserControllers.unblockUser);

router.patch('/:id', validateRequest(updateZodSchema), authCheck(...Object.values(IUserRole)), UserControllers.updateUser);

router.get('/me', authCheck(...Object.values(IUserRole)), UserControllers.getMe);

export const UserRoutes = router;