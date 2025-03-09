'use server'

import { query } from "@/lib/services/db";
import { NewProjectFormState, ProjectFormSchema } from "@/lib/definitions/project";
import { Member } from "@/lib/types/user";
import { createLogs } from "./logger";
import { getSelf } from "./user";

/**
 * Creates a new project.
 * 
 * @param state - The current state of the project form.
 * @param formData - The form data containing the project name and description.
 */

export async function createProject(
    state: NewProjectFormState,
    formData: FormData
) {

    // 1. Validate the form data
    const validationResult = ProjectFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        members: JSON.parse(formData.get("members") as string)
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        };
    }

    // 2. Create the project
    const { name, description, members } = validationResult.data;

    const { rows: projectRow } = await query(
        `INSERT INTO projects (project_name, project_description)
         VALUES ($1, $2)
            RETURNING project_id, project_name, project_description`,
        [name, description]
    );

    if (projectRow.length === 0) {
        return {
            message: "An error occurred while creating the project.",
            success: false
        };
    }

    // 3. Insert member
    const { project_id } = projectRow[0];

    if (members.length === 0) return {
        message: "Project created successfully, but no members were added.",
        success: true
    }

    const memberValues = members.map(
        (member: Member) => `(${project_id}, '${member.user_id}', '${member.user_role}')`
    ).join(", ");

    const { rows: memberRows } = await query(
        `INSERT INTO project_members (project_id, user_id, member_role)
            VALUES ${memberValues}
            RETURNING project_id, user_id, member_role`
    );

    if (memberRows.length === 0) {
        return {
            message: "Project created successfully, but an error occurred while adding members.",
            success: false
        };
    }

    // 4. Create logs
    await createLogs(
        [
            `Project ${name} created`,
            ...members.map(
                (member: Member) => `User ${member.user_full_name} added as ${member.user_role}`
            )
        ],
        project_id
    )

    return {
        message: "Project created successfully.",
        success: true
    };
}

export async function editProject(
    state: NewProjectFormState,
    formData: FormData,
    projectId: string
) {
    return
}

export async function getProjects(
    search: string,
    limit: number = 12,
    offset: number = 0
) {

    // 1. Get current user
    const { user_id } = await getSelf();

    // 2. Get projects
    const { rows } = await query(
        `SELECT project_members.project_id, project_name, project_description, project_status, member_role
            FROM projects
            LEFT JOIN project_members ON projects.project_id = project_members.project_id
            WHERE project_members.user_id = $1
                AND LOWER(project_name) LIKE LOWER($2)
            LIMIT $3 OFFSET $4`,
        [user_id, `%${search}%`, limit, offset]
    );

    return rows;
}