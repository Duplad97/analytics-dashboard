import { FunnelStage } from "../interfaces";

export function getStageLabel(stageId: number, stages: FunnelStage[]) {
    const stage = stages.find(stage => stage.id === stageId);
    if (stage) {
        return stage.name;
    }
    return "Unknown";
}