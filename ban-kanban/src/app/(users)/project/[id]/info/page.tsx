'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/toastContext";

import { Member } from "@/lib/types/user";
import { getProject } from "@/lib/actions/project";

import Log from "./log";
import { UserProfileImage } from "@/components/ui/profile";

type ProjectData = {
    project_name: string;
    project_description: string;
    project_status: boolean;
    project_id: string;
    project_created_at: Date;
    members: Member[];
}

export default function Info() {

    const { id } = useParams<{ id: string }>();

    const { toast } = useToast();

    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            await getProject(parseInt(id))
                .then((data) => {
                    setProject(data);
                })
                .catch((error) => {
                    toast(error.message, "error");
                })
                .finally(() => setLoading(false));
        }
        fetchProject();
    }, [id, toast]);

    return (
        <div className="flex w-full flex-col md:flex-row">
            <div className="flex w-full md:basis-1/3 p-12 bg-neutral-50/50 dark:bg-neutral-800/75">
                {
                    loading && (
                        <div className="flex flex-col h-full gap-4">
                            <div className="flex w-full h-12 bg-neutral-300 dark:bg-neutral-700/20 animate-pulse rounded-lg"></div>
                            <div className="flex h-6 bg-neutral-300 dark:bg-neutral-700/20 animate-pulse rounded-lg"></div>
                            <div className="flex h-6 bg-neutral-300 dark:bg-neutral-700/20 animate-pulse rounded-lg"></div>
                            <div className="flex w-1/4 h-6 bg-neutral-300 dark:bg-neutral-700/20 animate-pulse rounded-lg"></div>
                        </div>
                    )
                }
                {
                    !loading && !project && (
                        <p className="text-lg text-neutral-500 dark:text-neutral-400">No project found</p>
                    )
                }
                {
                    project && (
                        <div className="space-y-6">
                            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">{project.project_name}</h1>
                            <p className="text-lg text-neutral-500 dark:text-neutral-400">{project.project_description}</p>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-neutral-500 dark:text-neutral-400">Status</td>
                                        <td className="text-neutral-900 dark:text-neutral-50">{project.project_status ? "Active" : "Inactive"}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-neutral-500 dark:text-neutral-400">Created at</td>
                                        <td className="text-neutral-900 dark:text-neutral-50">
                                            {new Intl.DateTimeFormat('en-GB', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                timeZone: 'Asia/Bangkok',
                                                hour12: false
                                            }).format(project.project_created_at)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

                            <div className="flex gap-4 items-center">
                                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Members</h2>
                                <span className="text-md text-neutral-500 dark:text-neutral-400">{project.members.length}</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {
                                    project.members.map((member) => (
                                        <div className="flex items-center gap-4" key={member.user_id}>
                                            <UserProfileImage full_name={member.user_full_name} size={36} bgColor={member.user_color} />
                                            <div className="flex flex-col leading-5">
                                                <p className="text-md font-semibold text-neutral-900 dark:text-neutral-50">{member.user_full_name}</p>
                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{member.user_role.charAt(0).toUpperCase() + member.user_role.slice(1)}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>

            <Log />
        </div>
    );
}