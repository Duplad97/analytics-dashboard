import { ParsedUrlQuery } from "querystring";
import { prisma } from "../config/prisma.config";

export async function getUsersService(page: number, pageSize: number) {
    try {
        const skip = (page - 1) * pageSize;
        const users = await prisma.user.findMany({
            skip: skip,
            take: pageSize
        });

        const totalUsers = await prisma.user.count();

        return {
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / pageSize),
        };
    } catch (error) {
        throw error;
    }
}