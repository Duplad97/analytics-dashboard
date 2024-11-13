import { groupBy } from "lodash";
import { prisma } from "../config/prisma.config";

export async function getAllStagesService() {
    try {
        const stages = await prisma.funnelStage.findMany();
        return stages;
    } catch (error) {
        throw error;
    }
}

export async function getStageCountByUserService() {
    try {
        const users = await prisma.user.findMany();
        const usersByStageId = groupBy(users, "currentStageId");
        const stageCounts = Object.entries(usersByStageId).map(([stageId, stageUsers]) => ({
            stageId,
            count: stageUsers.length,
            value: (stageUsers.length / users.length) * 100
        }));
        return stageCounts;
    } catch (error) {
        throw error;
    }   
}