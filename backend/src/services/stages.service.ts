import { prisma } from "../config/prisma";

export async function getAllStagesService() {
    try {
        const stages = await prisma.funnelStage.findMany();
        return stages;
    } catch (error) {
        throw error;
    }
}