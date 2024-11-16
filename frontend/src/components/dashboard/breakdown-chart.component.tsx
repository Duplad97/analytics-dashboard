import { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Box, Paper, styled, LinearProgress, IconButton, useMediaQuery } from '@mui/material';
import { FunnelStage, TabData } from '../../interfaces';
import api from '../../config/api.config';
import { ChartsLegend, ChartsTooltip, pieArcLabelClasses, PiePlot, PieSeriesType, PieValueType, ResponsiveChartContainer } from '@mui/x-charts';
import { MakeOptional, useDrawingArea } from '@mui/x-charts/internals';
import ProbabilityGauge from './probability-gauge.component';
import { getStageLabel } from '../../_helper/stage-label.helper';
import { Refresh } from '@mui/icons-material';

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
    const [userCount, setUserCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const isMobile = useMediaQuery('(max-width:1100px)');

    const valueFormatter = useMemo(() => (value: MakeOptional<PieValueType, "id">) => `${value.value}%`, []);

    useEffect(() => {
        getStageCounts();
    }, []);


    const getStageCounts = async () => {
        setLoading(true);
        try {
            const stagesResponse = await api.get("/stages");
            const funnelData: FunnelStage[] = stagesResponse.data;
            setFunnelStages(funnelData);

            const countResponse = await api.get("/stages/count");
            setUserCount(countResponse.data.allUserCount)
            const data: MakeOptional<PieValueType, "id">[] = [];
            countResponse.data.stageCounts.forEach((stageCount: { stageId: string, count: number, value: number }) => {
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
        setLoading(false);
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
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Breakdown Chart
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            The current breakdown of the user base (which stage each percentage of the user base is in).
                        </Typography>
                    </Box>
                    <IconButton onClick={getStageCounts}>
                        <Refresh />
                    </IconButton>
                </Box>
                <Paper elevation={3} style={{ height:'85vh', width: '100%', marginTop: '16px', padding: '15px' }}>
                    {!loading ?
                        <>
                            {series.length ?
                                <>
                                    <Typography variant="body1" color="textSecondary" gutterBottom>
                                        Click on a legend item to see the transition probability to the next stage.
                                    </Typography>
                                    <ResponsiveChartContainer
                                        series={series}
                                        sx={{
                                            [`& .${pieArcLabelClasses.root}`]: {
                                                fontWeight: 'bold',
                                                fill: "white"
                                            },
                                        }}
                                        margin={isMobile ? {top: 370} : {}}
                                    >
                                        <PiePlot />
                                        <ChartsTooltip trigger='item' />
                                        <PieCenterLabel>{`Total users: ${userCount}`}</PieCenterLabel>
                                        <ChartsLegend
                                            itemGap={25}
                                            direction={isMobile ? "row" : "column"}
                                            position={{
                                                horizontal: 'left',
                                                vertical: isMobile ? 'top' : 'middle',
                                            }}
                                            onItemClick={(event, context, index) => getTransitionProbabilities(context.itemId as string)}
                                        />
                                    </ResponsiveChartContainer>
                                </>
                                : <Typography variant="body1" color="textSecondary" gutterBottom>
                                    No data to display
                                </Typography>}
                        </>
                        : <LinearProgress />}
                </Paper>
            </Box>
        </Container>
    );
};
export default BreakDownChart;