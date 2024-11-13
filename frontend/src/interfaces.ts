export interface User {
    id: number;
    name: string;
    email: string;
    currentStageId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface FunnelStage {
    id: number;
    name: string;
    order: number;
}

export interface Log {
    id: number;
    userId: number;
    activity: Object;
    createdAt: Date;
}

export interface PieChartData {
    id: number;
    value: number;
    label: string;
}