import { groupBy, orderBy } from "lodash";
import { prisma } from "../config/prisma.config";

export async function getAllStagesService() {
    try {
        const stages = await prisma.funnelStage.findMany();
        const orderedStages = orderBy(stages, "order", "asc")
        return orderedStages;
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
            value: parseFloat(((stageUsers.length / users.length) * 100).toFixed(2))
        }));
        return { stageCounts: stageCounts, allUserCount: users.length };
    } catch (error) {
        throw error;
    }   
}