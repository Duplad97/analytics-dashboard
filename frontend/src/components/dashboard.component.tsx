import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { FunnelStage, PieChartData } from '../interfaces';
import api from '../config/api.config';
import { pieArcLabelClasses, PieChart, PieValueType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/internals';

const Dashboard: React.FC = () => {
    const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);

    const valueFormatter = useMemo(() => (value: MakeOptional<PieValueType, "id">) => `${value.value}%`, []);

    useEffect(() => {
        getStageCounts();
    }, []);


    const getStageCounts = async () => {
        try {
            const stagesResponse = await api.get("/stages");
            const funnelData: FunnelStage[] = stagesResponse.data;

            const countResponse = await api.get("/stages/count");
            const data: PieChartData[] = [];
            countResponse.data.forEach((stageCount: { stageId: string, count: number, value: number }) => {
                const stageId = parseInt(stageCount.stageId);
                const funnelStage = funnelData.find(stage => stage.id === stageId);
                data.push({
                    id: stageId,
                    value: stageCount.value,
                    label: funnelStage?.name || ""
                });
            });
            setPieChartData(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <Box my={5}>
                <Typography variant="h4" gutterBottom>
                    Sales Onboarding Funnel
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Track the performance and conversion rates across each funnel stage.
                </Typography>
                <Paper elevation={3} style={{ height: 530, width: '100%', marginTop: '16px', padding: '15px' }}>


                    <PieChart
                        height={500}
                        width={1100}
                        series={[{
                            data: pieChartData,
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 90, additionalRadius: -40, color: 'gray' },
                            arcLabel: (params) => `${params.value}%`,
                            innerRadius: 90,
                            valueFormatter
                        }]}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                              fontWeight: 'bold',
                              fill: "white"
                            },
                        }}
                    />
                </Paper>
            </Box>
        </Container>
    );
};
export default Dashboard;