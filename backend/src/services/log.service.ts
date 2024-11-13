import { prisma } from "../config/prisma.config";

export async function getLogsService() {
    try {
        const logs = prisma.log.findMany();
        return logs;
    } catch (error) {
        throw error;
    }
}