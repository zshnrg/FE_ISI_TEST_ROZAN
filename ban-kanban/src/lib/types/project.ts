export interface Project {
    project_id: number;
    project_name: string;
    project_description: string;
    project_status: boolean;
    project_created_at: string;
}

export interface UserProject extends Project {
    member_role: string;
}