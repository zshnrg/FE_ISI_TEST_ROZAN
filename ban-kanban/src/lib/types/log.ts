export interface Log {
    log_id: number;
    log_message: string;
    log_created_at: Date;
    log_action_by: number;
    project_id: number;
    task_id: number;
}

export interface LogData extends Log {
    user_full_name: string;
    project_name: string;
    task_name: string;
}