import { Router } from "express";
import { getLogsController, getTransitionProbabilityController } from "../controllers/log.controller";

const router = Router();

router.get("/", getLogsController)

router.get("/probabilities", getTransitionProbabilityController);

export default router;