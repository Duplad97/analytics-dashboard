import { NextFunction, Request, Response } from "express";
import { getLogsService } from "../services/log.service";

export async function getLogsController(req: Request, res: Response, next: NextFunction) {
    try {
        const logs = await getLogsService();
        res.send(logs);
    } catch (error) {
        next(error);
    }
}