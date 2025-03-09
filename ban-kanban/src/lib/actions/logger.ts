'use server'

import { query } from "@/lib/services/db";
import { getSelf } from "@/lib/actions/user";

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