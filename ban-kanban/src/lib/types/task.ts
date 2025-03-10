import { Member } from "./user";

export interface Task {
    task_id: number;
    task_name: string;
    task_description: string;
    task_start_date: Date;
    task_end_date: Date;
    task_status: string;
    task_color: string;
    task_created_at: Date;
    project_id: number;
};

export interface AssignedTask extends Task {
    assigned_user: Member[]
    project_name: string;
    project_status: boolean;
}