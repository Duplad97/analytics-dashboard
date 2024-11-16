import { Container, Box, Typography, Paper, LinearProgress } from "@mui/material";
import { ResponsiveChartContainer, ChartsLegend, LinePlot, MarkPlot, ChartsXAxis, ChartsTooltip, ChartsYAxis, LineSeriesType, PieValueType, BarSeriesType, PieSeriesType, ScatterSeriesType, LineHighlightPlot, ChartsGrid, ChartsAxisHighlight } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/internals";
import { useEffect, useState } from "react";
import api from "../../config/api.config";
import { FunnelStage } from "../../interfaces";
import dayjs from "dayjs";
import { LegendItemParams } from "@mui/x-charts/ChartsLegend/chartsLegend.types";

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

function TransitionChart() {
    const [dataset, setDataset] = useState<any[]>([]);
    const [series, setSeries] = useState<(LineSeriesType | BarSeriesType | ScatterSeriesType | PieSeriesType<MakeOptional<PieValueType, "id">>)[]>([]);
    const [legend, setLegend] = useState<LegendItemParams[]>([]);
    const [seriesShowing, setSeriesShowing] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getDailyTransitions();
    }, [])

    const getDailyTransitions = async () => {
        setLoading(true);
        try {
            const stagesResponse = await api.get("/stages");
            const funnelData: FunnelStage[] = stagesResponse.data;
            const response = await api.get("/log/daily-transitions");
            const transformedData = response.data.map((entry: any) => ({
                ...entry,
                date: new Date(entry.date), // Parse date string into Date object
            }));
            transformedData.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setDataset(transformedData);
            const seriesData: (LineSeriesType | BarSeriesType | ScatterSeriesType | PieSeriesType<MakeOptional<PieValueType, "id">>)[] = [];
            const legendData: LegendItemParams[] = [];
            funnelData.forEach(stage => {
                const customColor = getRandomColor();
                const seriesId = `line_${stage.id}`;

                seriesData.push({
                    type: "line",
                    id: seriesId,
                    label: stage.name,
                    dataKey: `stage_${stage.id}`,
                    area: false,
                    showMark: false,
                    curve: "linear",
                    color: customColor
                });
                legendData.push({
                    id: stage.id,
                    seriesId: seriesId,
                    label: stage.name,
                    color: customColor,
                });
            })
            setSeries(seriesData);
            setLegend(legendData);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const filterSeries = (seriesId: string) => {
        if (seriesShowing === seriesId) {
            setSeriesShowing("");
            return;
        }
        setSeriesShowing(seriesId);
    }

    return (
        <Container>
            <Box my={3}>
                <Typography variant="h4" gutterBottom>
                    Transition Chart
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    The number of transitions from each stage in the last month.
                </Typography>
                <Paper elevation={3} style={{ height: 650, width: '100%', marginTop: '16px', padding: '15px' }}>
                    {!loading ? <>{series.length ? <ResponsiveChartContainer
                        series={seriesShowing.length ? series.filter(s => s.id === seriesShowing) : series}
                        dataset={dataset}
                        xAxis={[
                            {
                                id: 'Days',
                                dataKey: 'date',
                                scaleType: 'time',
                                valueFormatter: (date) => dayjs(new Date(date)).format("ddd DD"),
                            },
                        ]}
                        yAxis={[{ id: 'value-axis', label: 'Counts' }]}
                        margin={{ left: 60, top: 10, right: 20, bottom: 120 }}
                    >
                        <LinePlot />
                        <MarkPlot />
                        <LineHighlightPlot />
                        <ChartsXAxis axisId="Days" />
                        <ChartsYAxis />
                        <ChartsTooltip />
                        <ChartsGrid horizontal />
                        <ChartsAxisHighlight x="line" />
                        <ChartsLegend
                            slotProps={{ legend: { seriesToDisplay: legend } }}
                            direction="row"
                            position={{
                                horizontal: 'middle',
                                vertical: 'bottom',
                            }}
                            onItemClick={(event, context, index) => filterSeries(context.seriesId.toString())}
                        />
                    </ResponsiveChartContainer> : <Typography variant="body1" color="textSecondary" gutterBottom>
                        No data to display
                    </Typography>}</> : <LinearProgress />}
                </Paper>
            </Box>
        </Container>
    )
}
export default TransitionChart;