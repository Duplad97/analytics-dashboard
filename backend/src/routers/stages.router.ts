import { Router } from "express";
import { getAllStagesController } from "../controllers/stages.controller";

const router = Router();

router.get('/', getAllStagesController);

export default router;