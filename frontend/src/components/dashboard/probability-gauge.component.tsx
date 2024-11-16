import { Box, Paper, Typography } from "@mui/material";
import { Gauge } from "@mui/x-charts";
import { FunnelStage } from "../../interfaces";
import { getStageLabel } from "../../_helper/stage-label.helper";

interface IProps {
    data: { fromStageId: number, toStageId: number, transitionPercentage: number },
    stages: FunnelStage[]
}

function ProbabilityGauge(props: IProps) {

    return (
        <Box m={2}>
            <Paper elevation={3} style={{ height: '35vh', width: '100%', marginTop: '16px', padding: '15px' }}>
                <Typography variant="h4" gutterBottom>
                    Transition Probability
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    The probability of users transitioning from stage <b>{getStageLabel(props.data.fromStageId, props.stages)}</b> to stage <b>{getStageLabel(props.data.toStageId, props.stages)}</b> is:
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }} mt={3} width="100%"><Gauge
                    width={120}
                    height={120}
                    value={props.data.transitionPercentage}
                    text={
                        ({ value, valueMax }) => `${value}%`
                    }
                />
                </Box>
            </Paper>
        </Box>
    )
}
export default ProbabilityGauge;