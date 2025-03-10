'use server'

import { query } from "@/lib/services/db";
import { getSelf } from "@/lib/actions/user";
import { LogData } from "../types/log";

/**
 * Creates a log entry in the database.
 * @param message - The log message.
 * @param projectId - The ID of the project associated with the log (optional).
 * @param taskId - The ID of the task associated with the log (optional).
 * @returns The created log entry.
 */
export async function createLog(
    message: string,
    projectId?: number,
    taskId?: number
) {
    const { user_id } = await getSelf();
    const { rows } = await query(
        `INSERT INTO project_logs (log_message, log_action_by, project_id, task_id)
         VALUES ($1, $2, $3, $4)
            RETURNING log_id, log_message, log_created_at`,
        [message, user_id, projectId, taskId]
    );

    return rows[0];
}

/**
 * Creates logs for the given messages, project ID, and task ID.
 * @param messages - An array of messages to create logs for.
 * @param projectId - Optional project ID.
 * @param taskId - Optional task ID.
 * @returns A promise that resolves to an array of created logs.
 */
export async function createLogs(
    messages: string[],
    projectId?: number,
    taskId?: number
) {
    const logs = await Promise.all(
        messages.map((message) => createLog(message, projectId, taskId))
    );

    return logs;
}

/**
 * Fetches logs for the given project ID and task ID
 * @param projectId - Optional project ID.
 * @param taskId - Optional task ID.
 * @returns A promise that resolves to an array of logs.
 */

export async function getLogs(projectId: number, limit: number, offset: number, taskId?: number) {
    
    if (!taskId) {
        const { rows } = await query(
            `SELECT project_logs.*, users.user_full_name, projects.project_name, tasks.task_name
            FROM project_logs 
                LEFT JOIN users ON project_logs.log_action_by = users.user_id
                LEFT JOIN projects ON project_logs.project_id = projects.project_id
                LEFT JOIN tasks ON project_logs.task_id = tasks.task_id
            WHERE projects.project_id = $1
            ORDER BY log_created_at DESC
            LIMIT $2 OFFSET $3`,
            [projectId, limit, offset]
        );
        return rows as LogData[]
    }
    
    if (!projectId) {
        const { rows } = await query(
            `SELECT project_logs.*, users.user_full_name, projects.project_name, tasks.task_name
            FROM project_logs 
                LEFT JOIN users ON project_logs.log_action_by = users.user_id
                LEFT JOIN projects ON project_logs.project_id = projects.project_id
                LEFT JOIN tasks ON project_logs.task_id = tasks.task_id
            WHERE projects.project_id = $1 AND tasks.task_id = $2 
            ORDER BY log_created_at DESC
            LIMIT $3 OFFSET $4`,
            [projectId, taskId, limit, offset]
        );
        return rows as LogData[]
    }
}