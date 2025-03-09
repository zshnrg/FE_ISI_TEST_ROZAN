'use server'

import { query } from "@/lib/services/db";
import { TaskFormSchema, TaskFormState } from "../definitions/task";
import { createLogs } from "./logger";
import { AssignedTask } from "../types/task";


export async function createTask(
    state: TaskFormState,
    formData: FormData,
    project_id: number
) {
    console.log(formData);

    // 1. Validate the form data
    const validationResult = TaskFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        color: formData.get("color"),
        assignee: JSON.parse(formData.get("assignee") as string)
    });

    console.log(validationResult.error);

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        };
    }

    // 2. Create the project
    const { name, description, start_date, end_date, color, assignee } = validationResult.data;

    const { rows: taskRow } = await query(
        `INSERT INTO tasks (task_name, task_description, task_start_date, task_end_date, task_color, project_id)
         VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING task_id, task_name, task_description, task_start_date, task_end_date, task_color`,
        [name, description, start_date, end_date, color, project_id]
    );

    if (taskRow.length === 0) {
        return {
            message: "An error occurred while creating the task.",
            success: false
        };
    }

    // 3. Insert assignee
    const { task_id } = taskRow[0];

    if (assignee.length === 0) return {
        message: "Task created successfully, but no assignee were added.",
        success: true
    }

    // 4. Create members
    const memberValues = assignee.map((member) => `(${task_id}, '${member.user_id}')`).join(", ");
    const { rows: memberRows } = await query(
        `INSERT INTO task_assignee (task_id, user_id)
            VALUES ${memberValues}
            RETURNING task_id, user_id`
    );

    if (memberRows.length === 0) {
        return {
            message: "Task created successfully, but an error occurred while adding assignee.",
            success: false
        };
    }

    // 5. Create logs
    await createLogs(
        [
            `Task ${name} created`,
            ...assignee.map(
                (member) => `User ${member.user_full_name} assigned to task ${name}`
            )
        ],
        project_id,
        task_id
    )

    return {
        message: "Task created successfully.",
        success: true
    };
}

/**
 * Deletes a task from the project.
 *
 * @param task_id - The ID of the task to be removed.
 * @returns A Promise that resolves to the deleted task row.
 */
export async function deleteTask(
    task_id: number
) {
    return await query(
        `DELETE FROM tasks
            WHERE task_id = $1
            RETURNING task_id, task_name, task_description, task_start_date, task_end_date, task_color`,
        [task_id]
    );
}

/**
 * Gets all tasks of a project joined with the assignee with the user details.
 * 
 * @param project_id - The ID of the project.
 * @returns A group of tasks with the assignee details.
 */
export async function getTasks(project_id: number, search: string = "") {
    const { rows: tasks } = await query(
        `SELECT 
            t.task_id, 
            t.task_name, 
            t.task_description, 
            t.task_start_date, 
            t.task_end_date, 
            t.task_color, 
            t.task_status, 
            t.task_created_at,
            p.project_name,
            p.project_id,
            u.user_id,
            u.user_full_name, 
            u.user_email, 
            u.user_color, 
            m.member_role
        FROM tasks t
            LEFT JOIN task_assignee ta ON t.task_id = ta.task_id
            LEFT JOIN users u ON ta.user_id = u.user_id
            LEFT JOIN project_members m ON u.user_id = m.user_id AND t.project_id = m.project_id
            LEFT JOIN projects p ON t.project_id = p.project_id
        WHERE p.project_id = $1 AND (t.task_name ILIKE '%${search}%' OR t.task_description ILIKE '%${search}%')
        ORDER BY task_updated_at DESC`,
            
        [project_id]
    );

    const taskMap = new Map<number, AssignedTask>();
    tasks.forEach((task) => {
        const { task_id } = task;
        if (!taskMap.has(task_id)) {
            taskMap.set(task_id, {
                task_id: task_id,
                task_name: task.task_name,
                task_description: task.task_description,
                task_start_date: task.task_start_date,
                task_end_date: task.task_end_date,
                task_status: task.task_status,
                task_color: task.task_color,
                task_created_at: task.task_created_at,
                project_id: task.project_id,
                project_name: task.project_name,
                assigned_user: []
            });
        }

        const currentTask = taskMap.get(task_id);
        if (task.user_id) {
            currentTask?.assigned_user.push({
                user_id: task.user_id,
                user_full_name: task.user_full_name,
                user_email: task.user_email,
                user_color: task.user_color,
                user_role: task.user_role
            });
        }
    });

    return Array.from(taskMap.values()) as AssignedTask[];
}

/**
 * Updates the status of a task in the database.
 * @param task_id - The ID of the task to update.
 * @param status - The new status of the task.
 * @returns A promise that resolves to the updated task information.
 */
export async function updateTaskStatus(task_id: number, status: string) {
    const { rows: task } = await query(
        `UPDATE tasks
            SET task_status = $1
            WHERE task_id = $2
            RETURNING task_id, task_name`,
        [status, task_id]
    );

    return task[0] as { task_id: number, task_name: string };
}