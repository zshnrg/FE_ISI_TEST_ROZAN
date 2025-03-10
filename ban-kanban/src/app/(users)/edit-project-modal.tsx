'use client'

import { Button } from "@/components/ui/buttton";
import { Input, TextArea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MdClose, MdOutlineSearch } from "react-icons/md";
import { UserProfileImage } from "@/components/ui/profile";
import { Loading } from "@/components/ui/loading";
import { motion } from "motion/react"

import { useToast } from "@/contexts/toastContext";
import { useTriggerRevalidate } from "@/contexts/revalidateContext";
import { useDisclosure } from "@/hooks/useDisclosure";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { getUserByCode } from "@/lib/actions/user";
import { Member } from "@/lib/types/user";
import { ProjectFormState } from "@/lib/definitions/project";
import { editProject, getProject } from "@/lib/actions/project";

export default function EditProjectModal({
    disclosure,
}: {
    disclosure: ReturnType<typeof useDisclosure>,
}) {

    const [loading, setLoading] = useState(true);

    // Toast
    const { toast } = useToast();

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("project");

    // Revalidate tags
    const revalidateTags = useTriggerRevalidate();

    // The form data for the new project
    const [formData, setFormData] = useState<{ name: string, description: string, status: boolean, members: Member[] }>({
        name: "",
        description: "",
        status: true,
        members: []
    });

    useEffect(() => {
        async function fetchProject() {
            setLoading(true);
            if (!projectId) return;

            await getProject(parseInt(projectId))
                .then(project => {
                    if (!project) throw new Error("Project not found");
                    setFormData({
                        name: project.project_name,
                        description: project.project_description,
                        status: project.project_status,
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
    
    // 1. Form data handler
    const [memberError, setMemberError] = useState<string | null>(null);

    const handleChage = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        if (e.target.name === "user_code" && e.target.value.length === 8) {
            const user = await getUserByCode(e.target.value);
            e.target.value = "";

            if (!user) {
                setMemberError("User not found");
                setTimeout(() => {
                    setMemberError(null);
                }, 2000);
                return;
            } else if (formData.members.find(member => member.user_id === user.user_id)) {
                setMemberError("User already added");
                setTimeout(() => {
                    setMemberError(null);
                }, 2000);
                return;
            }

            setFormData({
                ...formData,
                members: [...formData.members, {
                    ...user,
                    user_role: "member"
                }]
            });
            return;
        }

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleRemoveMember = (user_id: string) => {
        setFormData({
            ...formData,
            members: formData.members.filter(member => member.user_id !== user_id)
        });
    }

    // 2. Form data action
    const [state, action, pending] = useActionState(async (prevState: ProjectFormState, form: FormData) => {
        
        if (!projectId) return;
        
        form.delete("user_code");
        form.append("members", JSON.stringify(formData.members));
        form.append("status", formData.status.toString());

        const response = await editProject(prevState, form, parseInt(projectId));

        if (response.success) {
            onClose();
            toast("Project created successfully", "success");
            revalidateTags("projects");
        } else {
            if (response.errors) return response;
            toast(response.message || "An error occurred while creating the project", "error");
        }
        return response;
    }, undefined)


    return (
        <Modal
            {...disclosure}
            title="Edit Project"
            size="xl"
        >
            {
                loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loading />
                    </div>
                ) : (

                    <form action={action} className="flex flex-col gap-4">
                        <div className="flex gap-4 items-center">
                            <Input
                                id="name" name="name" type="text"
                                placeholder="Project name *"
                                defaultValue={formData.name}
                                className="w-full"
                            />
                            <ToogleStatus status={formData.status} setStatus={(status: boolean) => setFormData({ ...formData, status })} />
                        </div>
                        {state?.errors?.name && (
                            <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.name.join(", ")}</p>
                        )}
                        <TextArea
                            className="min-h-24"
                            id="description" name="description" type="text"
                            placeholder="Project description"
                            defaultValue={formData.description}
                        />

                        <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

                        <div className="flex flex-col gap-4">
                            <Input
                                id="search_user_code" name="user_code" type="text"
                                placeholder="Search user by code"
                                leadingIcon={<MdOutlineSearch />}
                                onChange={handleChage}
                            />
                            {
                                memberError && (
                                    <p className="ml-4 mt-2 text-red-500 text-sm">{memberError}</p>
                                )
                            }
                            <div className="flex flex-col gap-2 my-4">
                                {
                                    formData.members.map(member => (
                                        <div key={member.user_id} className="flex items-center justify-between mx-8">
                                            <div className="flex items-center gap-4">
                                                <UserProfileImage full_name={member.user_full_name} size={36} bgColor={member.user_color} />
                                                <div className="flex flex-col leading-5">
                                                    <p className="text-md font-semibold text-neutral-900 dark:text-neutral-50">{member.user_full_name}</p>
                                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{member.user_role.charAt(0).toUpperCase() + member.user_role.slice(1)}</p>
                                                </div>
                                            </div>
                                            {
                                                member.user_role === "member" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMember(member.user_id)}
                                                        className="text-red-500"
                                                    >
                                                        <MdClose />
                                                    </button>
                                                )
                                            }

                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="flex flex-col-reverse md:flex-row gap-4">
                            <Button buttonType="secondary" type="button" onClick={onClose}>
                                Discard
                            </Button>
                            <Button disabled={pending} buttonType="primary" className="w-full">
                                Save
                            </Button>
                        </div>

                    </form>
                )
            }
        </Modal>
    );
}

const ToogleStatus = ({ status, setStatus } : { status: boolean, setStatus: (status: boolean) => void }) => {
    // Toogle switch active or inactive, (green or red)
    const handleToogle = () => {
        setStatus(!status);
    }

    return (
        <div className={`w-20 h-12 p-2 rounded-full flex shrink-0 items-center cursor-pointer ${status ? "bg-green-500" : "bg-red-500"}`} onClick={handleToogle}>
            <motion.div
                initial={{x: 0}}
                animate={{x: status ? "100%" : 0}}
                layout
                className={`w-8 h-8 rounded-full bg-white`}
            />
        </div>
    );
}