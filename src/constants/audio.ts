export enum AudioTaskStatus {
    CREATED = 'CREATED',
    CANCELLED = 'CANCELLED',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface AudioTask {
    id: number;
    status: AudioTaskStatus;
    createdAt: number;
    updatedAt: number;
    points: number;
}

export interface APIAudioTasks {
    page: number;
    limit: number;
    tasks: AudioTask[];
    points: number;
}
