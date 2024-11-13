import { ParsedUrlQuery } from "querystring";
import { prisma } from "../config/prisma.config";

export async function getUsersByQueryService(query: ParsedUrlQuery) {
    try {
        const users = await prisma.user.findMany({
            where: {
                ...(query as { [key: string]: any }),
            },
        });
        return users;
    } catch (error) {
        throw error;
    }
}