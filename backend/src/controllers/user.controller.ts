import { NextFunction, Request, Response } from "express";
import { getUsersByQueryService } from "../services/user.service";
import { ParsedUrlQuery } from "node:querystring";

export async function getUsersByQueryController(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.query as ParsedUrlQuery;
        const users = await getUsersByQueryService(query);
        res.send(users);
    } catch (error) {
        next(error);
    }
}