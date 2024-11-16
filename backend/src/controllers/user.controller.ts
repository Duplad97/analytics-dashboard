import { NextFunction, Request, Response } from "express";
import { createUserService, deleteUsersService, getUsersService, stageChangeService } from "../services/user.service";

export async function getUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, pageSize, filter } = req.query;
        const users = await getUsersService(parseInt(page as string), parseInt(pageSize as string), filter as string || "");
        res.send(users);
    } catch (error) {
        next(error);
    }
}

export async function stageChangeController(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { stageId } = req.body;
        const user = await stageChangeService(parseInt(id), stageId);
        res.send(user);
    } catch (error) {
        next(error);
    }
}

export async function createUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const userData = req.body;
        const newUser = await createUserService(userData);
        res.send(newUser);
    } catch (error) {
        next(error);
    }
}

export async function deleteUsersController(req: Request, res: Response, next: NextFunction) {
    try {
        const { userIds } = req.body;
        const deleted = await deleteUsersService(userIds); 
        res.send(deleted);       
    } catch (error) {
        next(error);
    }
}