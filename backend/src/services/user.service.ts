import { prisma } from "../config/prisma.config";
import { Prisma, User } from "@prisma/client";

export async function getUsersService(page: number, pageSize: number, filter: string) {
    try {
        const whereClause: Prisma.UserWhereInput = filter
            ? {
                OR: [
                    { name: { contains: filter, mode: 'insensitive' } },
                    { email: { contains: filter, mode: 'insensitive' } },
                ],
            }
            : {};

        const skip = (page - 1) * pageSize;
        const users = await prisma.user.findMany({
            skip: skip,
            take: pageSize,
            where: whereClause,
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

export async function stageChangeService(userId: number, stageId: number) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { currentStageId: stageId },
        });
        return user;
    } catch (error) {
        throw error;
    }
}

export async function createUserService(userData: { name: string, email: string, currentStageId: number }) {
    try {
        const newUser = await prisma.user.create({ data: userData });
        return newUser;
    } catch (error) {
        throw error;
    }
}

export async function deleteUsersService(userIds: number[]) {
    try {
        const deleted = await prisma.user.deleteMany({
            where: { id: { in: userIds } }
        });
        return deleted;
    } catch (error) {
        throw error;
    }
}