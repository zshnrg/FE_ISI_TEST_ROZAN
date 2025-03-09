'use server'

import { Member } from "../types/user";

import { query } from "../services/db";

/**
 * Creates multiple members in the project.
 *
 * @param members - An array of Member objects representing the members to be created.
 * @returns A Promise that resolves to an array of created member rows.
 */
export async function createMembers(
    members: Member[],
    project_id: number
) {
    const memberValues = members.map(
        (member: Member) => `(${project_id}, '${member.user_id}', '${member.user_role}')`
    ).join(", ");

    const { rows: memberRows } = await query(
        `INSERT INTO project_members (project_id, user_id, member_role)
            VALUES ${memberValues}
            RETURNING project_id, user_id, member_role`
    );

    return memberRows;
}

/**
 * Deletes a member from the project.
 *
 * @param project_id - The ID of the project.
 * @param user_id - The ID of the user to be removed.
 * @returns A Promise that resolves to the deleted member row.
 */
export async function deleteMember(
    project_id: number,
    user_id: string
) {
    return await query(
        `DELETE FROM project_members
            WHERE project_id = $1 AND user_id = $2
            RETURNING project_id, user_id, member_role`,
        [project_id, user_id]
    );
}

/**
 * Deletes members from a project.
 *
 * @param user_ids - An array of user IDs to be deleted.
 * @param project_id - The ID of the project from which the members will be deleted.
 * @returns A promise that resolves to the deleted members' information.
 */
export async function deleteMembers(
    user_ids: string[],
    project_id: number
 ) {
    return user_ids.map(async (user_id) => {
        return await deleteMember(project_id, user_id);
    });
}

/**
 * Gets all members of a project.
 *
 * @param project_id - The ID of the project.
 * @returns A Promise that resolves to an array of member rows.
 */
export async function getMembers(project_id: number) {
    const { rows: members } = await query(
        `SELECT users.user_id as user_id, user_full_name, user_email, user_color, member_role as user_role
            FROM project_members
            JOIN users ON project_members.user_id = users.user_id
            WHERE project_id = $1`,
        [project_id]
    );

    return members as Member[];
}