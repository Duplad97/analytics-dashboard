import { prisma } from "../config/prisma.config";
import dayjs from "dayjs";
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
        const fromStage = await prisma.funnelStage.findUnique({
            where: { id: parseInt(fromStageId) },
        });

        const nextStage = await prisma.funnelStage.findFirst({
            where: {
                order: (fromStage?.order || 0) + 1
            },
        });

        if (!nextStage) {
            return {
                fromStageId: parseInt(fromStageId),
                toStageId: -1,
                transitionPercentage: 0,
            };
        }

        const usersCount = await prisma.user.count();

        const usersTransitioned = await prisma.log.count({
            where: {
                fromStageId: parseInt(fromStageId)
            },
        });

        const transitionPercentage = parseFloat(((usersTransitioned / usersCount) * 100).toFixed(2));

        return {
            fromStageId: parseInt(fromStageId),
            toStageId: nextStage.id,
            transitionPercentage,
        };
    } catch (error) {
        throw error;
    }
}

export async function getDailyTransitionsService() {
    try {
        const stages = await prisma.funnelStage.findMany();

        const startDate = dayjs().subtract(1, 'month').startOf('month');
        const endDate = dayjs().subtract(1, 'month').endOf('month');

        const datesInRange = [];
        let currentDate = startDate;
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            datesInRange.push(currentDate.format('YYYY-MM-DD')); // Store dates as string for easy comparison
            currentDate = currentDate.add(1, 'day');
        }

        const result = [];

        const logs = await prisma.log.findMany({
            where: {
                createdAt: {
                    gte: startDate.toDate(),
                    lte: endDate.toDate(),
                },
            },
        });

        for (const date of datesInRange) {
            let dateData:IDynamicObject = {
                date: new Date(date),
            };

            stages.forEach(stage => {
                dateData[`stage_${stage.id}`] = 0;
            });

            logs.forEach(log => {
                const logDate = dayjs(log.createdAt).format('YYYY-MM-DD');
                const fromStageId = log.fromStageId;

                if (logDate === date && fromStageId) {
                    dateData[`stage_${fromStageId}`] += 1;
                }
            });

            result.push(dateData);
        }

        return result;
    } catch (error) {
        throw error;
    }
}