import { NextFunction, Request, Response } from "express";
import { getUsersService } from "../services/user.service";

export async function getUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, pageSize } = req.query;
        const users = await getUsersService(parseInt(page as string), parseInt(pageSize as string));
        res.send(users);
    } catch (error) {
        next(error);
    }
}