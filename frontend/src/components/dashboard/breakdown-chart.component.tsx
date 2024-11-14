import { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Paper, styled } from '@mui/material';
import { FunnelStage, TabData } from '../../interfaces';
import api from '../../config/api.config';
import { ChartsLegend, Gauge, pieArcLabelClasses, PieChart, PiePlot, PieSeriesType, PieValueType, ResponsiveChartContainer } from '@mui/x-charts';
import { MakeOptional, useDrawingArea } from '@mui/x-charts/internals';
import ProbabilityGauge from './probability-gauge.component';
import { getStageLabel } from '../../_helper/stage-label.helper';

const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
        </StyledText>
    );
}

interface IProps {
    addTab: Function
}

function BreakDownChart(props: IProps) {
    const [funnelStages, setFunnelStages] = useState<FunnelStage[]>([]);
    const [series, setSeries] = useState<PieSeriesType<MakeOptional<PieValueType, "id">>[]>([]);

    const valueFormatter = useMemo(() => (value: MakeOptional<PieValueType, "id">) => `${value.value}%`, []);

    useEffect(() => {
        getStageCounts();
    }, []);


    const getStageCounts = async () => {
        try {
            const stagesResponse = await api.get("/stages");
            const funnelData: FunnelStage[] = stagesResponse.data;
            setFunnelStages(funnelData);

            const countResponse = await api.get("/stages/count");

            const data: MakeOptional<PieValueType, "id">[] = [];
            countResponse.data.forEach((stageCount: { stageId: string, count: number, value: number }) => {
                const parsedStageId = parseInt(stageCount.stageId);
                const funnelStage = funnelData.find(stage => stage.id === parsedStageId);
                data.push({
                    id: stageCount.stageId,
                    value: stageCount.value,
                    label: funnelStage?.name || "",
                });
            });

            const seriesData: PieSeriesType<MakeOptional<PieValueType, "id">>[] = [
                {
                    type: "pie",
                    id: "pie-series-1",
                    data: data,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 90, additionalRadius: -40, color: 'gray' },
                    arcLabel: (params) => `${params.value}%`,
                    innerRadius: 100,
                    valueFormatter
                },
            ]
            setSeries(seriesData);
        } catch (error) {
            console.log(error);
        }
    }

    const getTransitionProbabilities = async (itemId: string) => {
        try {
            const response = await api.get("/log/probabilities", {
                params: {
                    fromStageId: itemId,
                }
            });
            const tabData: TabData = {
                id: Math.random(),
                label: getStageLabel(response.data.fromStageId, funnelStages) + " Probability",
                content: <ProbabilityGauge data={response.data} stages={funnelStages} />,
                closable: true
            }
            props.addTab(tabData);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <Box my={3}>
                <Typography variant="h4" gutterBottom>
                    Breakdown Chart
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    The current breakdown of the user base (which stage each percentage of the user base is in).
                </Typography>
                <Paper elevation={3} style={{ height: 600, width: '100%', marginTop: '16px', padding: '15px' }}>
                    {series.length && <ResponsiveChartContainer
                        series={series}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fontWeight: 'bold',
                                fill: "white"
                            },
                        }}
                    >
                        <PiePlot />
                        <PieCenterLabel>Total users: 250</PieCenterLabel>
                        <ChartsLegend
                            direction="column"
                            position={{
                                horizontal: 'left',
                                vertical: 'middle',
                            }}
                            onItemClick={(event, context, index) => getTransitionProbabilities(context.itemId as string)}
                        />
                    </ResponsiveChartContainer>}
                </Paper>
            </Box>
        </Container>
    );
};
export default BreakDownChart;