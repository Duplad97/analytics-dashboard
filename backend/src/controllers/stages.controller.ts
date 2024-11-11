import { NextFunction, Request, Response } from "express";
import { getAllStagesService } from "../services/stages.service";

export async function getAllStagesController(req: Request, res: Response, next: NextFunction) {
    try {
        const stages = await getAllStagesService();
        res.send(stages);
    } catch (error) {
        next(error);
    }
}