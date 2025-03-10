'use client'

import { Button } from "@/components/ui/buttton";
import { Modal } from "@/components/ui/modal";
import { UserProfileImage } from "@/components/ui/profile";
import { Loading } from "@/components/ui/loading";

import { useToast } from "@/contexts/toastContext";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Member } from "@/lib/types/user";
import { getProject } from "@/lib/actions/project";

type ProjectData = {
    project_name: string;
    project_description: string;
    project_status: boolean;
    project_id: string;
    members: Member[];
}

export default function DetailProjectModal({
    disclosure
}: {
    disclosure: ReturnType<typeof useDisclosure>
}) {

    const { toast } = useToast();

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("project");


    const [loading, setLoading] = useState(true);
    const [projectData, setProjectData] = useState<ProjectData>({
        project_name: "",
        project_description: "",
        project_status: false,
        project_id: "",
        members: []
    });

    useEffect(() => {
        async function fetchProject() {
            setLoading(true);
            if (!projectId) return;

            await getProject(parseInt(projectId))
                .then(project => {
                    if (!project) throw new Error("Project not found");
                    setProjectData({
                        project_name: project.project_name,
                        project_description: project.project_description,
                        project_status: project.project_status,
                        project_id: project.project_id,
                        members: project.members
                    });
                })
                .catch(error => {
                    toast(error.message, "error");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        fetchProject();
    }, [projectId, toast]);

    const onClose = () => {
        const params = new URLSearchParams(searchParams);

        params.delete("task");
        router.replace(`${pathName}?${params.toString()}`);

        disclosure.onClose();
    }

    return (
        <Modal
            onOpenChange={onClose}
            isOpen={disclosure.isOpen}
            title="Project Detail"
            size="xl"
        >
            {
                loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loading />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                                {projectData.project_name}
                            </h4>
                            <span className={`text-xs text-neutral-50 ${projectData.project_status ? "bg-green-500 dark:text-neutral-900" : "bg-neutral-400 dark:bg-neutral-500"} px-2 py-1 rounded-full`}>
                                {projectData.project_status ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {projectData.project_description ? projectData.project_description : "No description"}
                        </p>

                        <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

                        <div className="flex flex-col gap-2 my-4">
                            <h5 className="text-md font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Members</h5>
                            {
                                projectData.members.map(member => (
                                    <div key={member.user_id} className="flex items-center gap-4">
                                        <UserProfileImage full_name={member.user_full_name} size={36} bgColor={member.user_color} />
                                        <div className="flex flex-col leading-5">
                                            <p className="text-md font-semibold text-neutral-900 dark:text-neutral-50">{member.user_full_name}</p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{member.user_role.charAt(0).toUpperCase() + member.user_role.slice(1)}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <Button buttonType="secondary" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                )
            }
        </Modal>
    );
}
