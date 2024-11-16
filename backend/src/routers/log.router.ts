import { Router } from "express";
import { getDailyTransitionsController, getLogsController, getTransitionProbabilityController } from "../controllers/log.controller";

const router = Router();

router.get("/", getLogsController)

router.get("/probabilities", getTransitionProbabilityController);

router.get("/daily-transitions", getDailyTransitionsController);

export default router;