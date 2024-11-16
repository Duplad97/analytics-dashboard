export interface IDynamicObject {
    [key: string]: any;
}

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

export interface TabData {
    id: number;
    label: string;
    content: JSX.Element;
    closable: boolean;
}