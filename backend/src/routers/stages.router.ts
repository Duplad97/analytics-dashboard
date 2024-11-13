import { Router } from "express";
import { getAllStagesController, getStageCountByUserController } from "../controllers/stages.controller";

const router = Router();

router.get('/', getAllStagesController);

router.get("/count", getStageCountByUserController);

export default router;