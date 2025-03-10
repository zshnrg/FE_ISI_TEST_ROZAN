'use server'

import { query } from "@/lib/services/db";

import { Member } from "@/lib/types/user";
import { ProjectFormState, ProjectFormSchema } from "@/lib/definitions/project";

import { getSelf } from "./user";
import { createLogs } from "./logger";
import { createMembers, deleteMembers, getMembers } from "./member";

/**
 * Creates a new project.
 * 
 * @param state - The current state of the project form.
 * @param formData - The form data containing the project name and description.
 */

export async function createProject(
    state: ProjectFormState,
    formData: FormData
) {

    // 1. Validate the form data
    const validationResult = ProjectFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        status: true,
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
    
    const memberRows = await createMembers(members, project_id);

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

/**
 * Edits a project with the provided form data.
 * @param state - The current state of the project form.
 * @param formData - The form data to update the project with.
 * @param projectId - The ID of the project to edit.
 * @returns An object with the result of the edit operation.
 */
export async function editProject(
    state: ProjectFormState,
    formData: FormData,
    projectId: number
) {
    
    // 1. Validate the form data
    const validationResult = ProjectFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        status: formData.get("status") === "true",
        members: JSON.parse(formData.get("members") as string)
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        };
    }

    // 2. Update the project
    const { name, description, members, status } = validationResult.data;

    const { rows: projectRow } = await query(
        `UPDATE projects
            SET project_name = $1, project_description = $2, project_status = $3
            WHERE project_id = $4
            RETURNING project_id`,
        [name, description, status, projectId]
    );

    if (projectRow.length === 0) {
        return {
            message: "An error occurred while updating the project.",
            success: false
        };
    }

    // 3. Update members
    const currentMembers = (await getMembers(projectId))

    const membersToRemove = currentMembers.filter((member) => !members.find((newMember) => newMember.user_id === member.user_id));
    const membersToAdd = members.filter((member) => !currentMembers.find((currentMember) => currentMember.user_id === member.user_id));

    if (membersToRemove.length > 0) {
        await deleteMembers(membersToRemove.map((member) => member.user_id), projectId);
    }
    if (membersToAdd.length > 0) {
        await createMembers(membersToAdd, projectId);
    }

    await createLogs(
        [
            `Project ${name} updated`,
            ...membersToAdd.map(
                (member: Member) => `User ${member.user_full_name} added as ${member.user_role}`
            ),
            ...membersToRemove.map(
                (member: Member) => `User ${member.user_full_name} removed`
            )
        ],
        projectId
    )

    return {
        message: "Project updated successfully.",
        success: true
    };
}

/**
 * Retrieves projects based on the search query, limit, and offset.
 * @param search - The search query to filter projects by.
 * @param limit - The maximum number of projects to retrieve. Default is 12.
 * @param offset - The number of projects to skip. Default is 0.
 * @returns An array of projects that match the search query.
 */
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
            ORDER BY project_name
            LIMIT $3 OFFSET $4`,
        [user_id, `%${search}%`, limit, offset]
    );

    return rows;
}

/**
 * Retrieves a project by its ID.
 * @param projectId - The ID of the project to retrieve.
 * @returns The projectand its members.
 */
export async function getProject(projectId: number) {

    // 1. Get current user
    const { user_id } = await getSelf();

    // 2. Get project
    const { rows } = await query(
        `SELECT projects.project_id, project_name, project_description, project_status, project_created_at, users.user_id as user_id, user_full_name, user_email, user_color, member_role as user_role
            FROM projects
            LEFT JOIN project_members ON projects.project_id = project_members.project_id
            LEFT JOIN users ON project_members.user_id = users.user_id
            WHERE projects.project_id = $1`,
        [projectId]
    );

    if (rows.length === 0) {
        return null;
    }

    // 3. IF user is not a member of the project, return null
    if (!rows.find((row) => row.user_id === user_id)) {
        return null;
    }

    const project = {
        project_id: rows[0].project_id,
        project_name: rows[0].project_name,
        project_description: rows[0].project_description,
        project_status: rows[0].project_status,
        project_created_at: rows[0].project_created_at,
        members: rows.map((row) => ({
            user_id: row.user_id,
            user_full_name: row.user_full_name,
            user_email: row.user_email,
            user_color: row.user_color,
            user_role: row.user_role
        })) as Member[]
    };

    return project;
}