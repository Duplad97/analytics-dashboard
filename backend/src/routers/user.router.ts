import { Router } from "express";
import { createUserController, deleteUsersController, getUsersController, stageChangeController } from "../controllers/user.controller";

const router = Router();

router.get('/', getUsersController);

router.post("/stage-change/:id", stageChangeController);

router.post("/create", createUserController);

router.delete("/", deleteUsersController);

export default router;