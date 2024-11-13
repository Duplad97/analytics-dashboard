import { NextFunction, Request, Response } from "express";
import { getAllStagesService, getStageCountByUserService } from "../services/stages.service";

export async function getAllStagesController(req: Request, res: Response, next: NextFunction) {
    try {
        const stages = await getAllStagesService();
        res.send(stages);
    } catch (error) {
        next(error);
    }
}

export async function getStageCountByUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const stageCounts = await getStageCountByUserService();
        res.send(stageCounts);
    } catch (error) {
        next(error);
    }
}