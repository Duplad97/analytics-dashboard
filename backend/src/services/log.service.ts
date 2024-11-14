import { prisma } from "../config/prisma.config";
import { IDynamicObject } from "../interfaces";

export async function getLogsService() {
    try {
        const logs = prisma.log.findMany();
        return logs;
    } catch (error) {
        throw error;
    }
}

export async function getTransitionProbabilityService(fromStageId: string) {
    try {
        // Fetch the current stage's order
        const fromStage = await prisma.funnelStage.findUnique({
            where: { id: parseInt(fromStageId) },
        });

        // Fetch the next stage by order
        const nextStage = await prisma.funnelStage.findFirst({
            where: {
                order: (fromStage?.order || 0) + 1, // Get the next stage based on order
            },
        });

        if (!nextStage) {
            return {
                fromStageId: parseInt(fromStageId),
                toStageId: -1,
                transitionPercentage: 0,
            };
        }

        // Count total users
        const usersCount = await prisma.user.count();

        // Count users who transitioned to the next stage
        const usersTransitioned = await prisma.log.count({
            where: {
                fromStageId: parseInt(fromStageId)
            },
        });

        // Calculate transition percentage
        const transitionPercentage =  parseFloat(((usersTransitioned / usersCount) * 100).toFixed(2));

        return {
            fromStageId: parseInt(fromStageId),
            toStageId: nextStage.id,
            transitionPercentage,
        };
    } catch (error) {
        throw error;
    }
}