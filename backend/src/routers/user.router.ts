import { Router } from "express";
import { getUsersByQueryController } from "../controllers/user.controller";

const router = Router();

router.get('/', getUsersByQueryController);

export default router;