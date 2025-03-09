'use server'

import { query } from "@/lib/services/db";
import { TaskFormSchema, TaskFormState } from "../definitions/task";
import { createLogs } from "./logger";


export async function createTask(
    state: TaskFormState,
    formData: FormData,
    project_id: number
) {

    // 1. Validate the form data
    const validationResult = TaskFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        color: formData.get("color"),
        assignee: JSON.parse(formData.get("assignee") as string)
    });

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