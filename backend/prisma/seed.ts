import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { orderBy } from 'lodash';

const prisma = new PrismaClient();

async function main() {
    // Seed FunnelStages
    const funnelStages = [
        { name: 'Signed up on website', order: 1 },
        { name: 'Downloaded app', order: 2 },
        { name: 'Completed onboarding', order: 3 },
        { name: 'Signed up for free trial', order: 4 },
        { name: 'Churned after free trial', order: 5 },
        { name: 'Converted to paid subscription', order: 6 },
        { name: 'Churned after paid subscription', order: 7 },
        { name: 'Renewed paid subscription', order: 8 },
    ];

    const createdStages = await Promise.all(
        funnelStages.map(stage => prisma.funnelStage.create({ data: stage }))
    );

    // Seed Users with random currentStageId
    for (let i = 0; i < 250; i++) {
        await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                currentStageId: faker.helpers.arrayElement(createdStages).id,
            },
        });
    }

    // Seed StageTransitions for each user with random stages
    const users = await prisma.user.findMany();
    const stages = await prisma.funnelStage.findMany();
    const orderedStages = orderBy(stages, "order", "asc");
    for (const user of users) {
        // Determine a random end stage for each user
        const endStageIndex = stages.findIndex(s => s.id === user.currentStageId);

        for (let i = 1; i <= endStageIndex; i++) {
            const fromStage = orderedStages[i - 1];
            const toStage = orderedStages[i];

            await prisma.log.create({
                data: {
                    userId: user.id,
                    fromStageId: fromStage.id,
                    toStageId: toStage.id,
                    createdAt: new Date(Date.now() + i * 1000), // Increment timestamp for realism
                },
            });
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
