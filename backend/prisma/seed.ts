import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // Seed FunnelStages
    const funnelStages = [
        { name: 'Signed up on website', order: 1 },
        { name: 'Downloaded app', order: 2 },
        { name: 'Completed onboarding', order: 3 },
        { name: 'Signed up for free trial', order: 4 },
        { name: 'Converted to paid subscription', order: 5 },
        { name: 'Churned after free trial', order: 6 },
        { name: 'Churned after paid subscription', order: 7 },
        { name: 'Renewed paid subscription', order: 8 },
    ];

    const createdStages = await Promise.all(
        funnelStages.map(stage => prisma.funnelStage.create({ data: stage }))
    );

    // Seed Users with random currentStageId
    for (let i = 0; i < 100; i++) {
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
    for (const user of users) {
        // Determine a random end stage for each user
        const endStageIndex = Math.floor(Math.random() * stages.length);

        // Step 3: Create ordered transition logs up to the end stage for each user
        for (let i = 1; i <= endStageIndex; i++) {
            const fromStage = stages[i - 1];
            const toStage = stages[i];

            await prisma.log.create({
                data: {
                    userId: user.id,
                    activity: { fromStageId: fromStage.id, toStageId: toStage.id },
                    createdAt: new Date(Date.now() + i * 1000), // Increment timestamp for realism
                },
            });

            // Update user's current stage to the next stage in the sequence
            await prisma.user.update({
                where: { id: user.id },
                data: { currentStageId: toStage.id },
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
