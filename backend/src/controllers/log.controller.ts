import { NextFunction, Request, Response } from "express";
import { getLogsService, getTransitionProbabilityService } from "../services/log.service";

export async function getLogsController(req: Request, res: Response, next: NextFunction) {
    try {
        const logs = await getLogsService();
        res.send(logs);
    } catch (error) {
        next(error);
    }
}

export async function getTransitionProbabilityController(req: Request, res: Response, next: NextFunction) {
    try {
        const { fromStageId } = req.query;
        const transitionPercentages = await getTransitionProbabilityService(fromStageId as string);
        res.send(transitionPercentages);
    } catch (error) {
        next(error);
    }
}