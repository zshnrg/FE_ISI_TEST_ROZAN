'use client'

import { Button } from "@/components/ui/buttton";
import { Input, TextArea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MdClose, MdOutlineSearch } from "react-icons/md";
import { UserProfileImage } from "@/components/ui/profile";
import { Loading } from "@/components/ui/loading";

import { useToast } from "@/contexts/toastContext";
import { useTriggerRevalidate } from "@/contexts/revalidateContext";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useActionState, useEffect, useState } from "react";

import { getMembers } from "@/lib/actions/member";
import { getUserByCode } from "@/lib/actions/user";
import { Member } from "@/lib/types/user";
import { Project, UserProject } from "@/lib/types/project";
import { ProjectFormState } from "@/lib/definitions/project";
import { editProject } from "@/lib/actions/project";

export default function EditProjectModal({ 
    disclosure, 
    data,
    setData
}: { 
    disclosure: ReturnType<typeof useDisclosure>, 
    data: UserProject | null,
    setData: (data: UserProject | null) => void
}) {

    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMembers() {
            if (!data) return;
            setLoading(true);

            await getMembers(data.project_id)
                .then(members => {
                    setMembers(members);
                    setLoading(false);
                });
        }
        fetchMembers();
    }, [data]);

    const handleClose = () => {
        setData(null);
        disclosure.onClose();
    }

    return (
        <Modal
            {...disclosure}
            title={data?.member_role === "member" ? "View Project" : "Edit Project"}
            size="xl"
        >
            {
                !loading && data ? (
                    data.member_role === "member" ? (
                        <Detail project={data} members={members} onClose={handleClose} />
                    ) : (
                        <EditForm project={data} members={members} onClose={handleClose} />
                    )
                ) : null
            }
            {
                loading && (
                    <div className="flex justify-center items-center h-48">
                        <Loading />
                    </div>
                )
            }
        </Modal>
    );
}

function Detail ({ 
    project, 
    members, 
    onClose
}: { 
    project: Project, 
    members: Member[], 
    onClose: () => void
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{project.project_name}</h4>
                
                <span className={`text-xs text-neutral-50   ${project.project_status ? "bg-green-500 dark:text-neutral-900" : "bg-neutral-400 dark:bg-neutral-500"} px-2 py-1 rounded-full`}>
                    {project.project_status ? "Active" : "Inactive"}
                </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{project.project_description ? project.project_description : "No description"}</p>

            <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

            <div className="flex flex-col gap-2 my-4">
                <h5 className="text-md font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Members</h5>
                {
                    members.map(member => (
                        <div key={member.user_id} className="flex items-center gap-4">
                            <UserProfileImage full_name={member.user_full_name} size={36} bgColor={member.user_color} />
                            <p className="text-md font-semibold text-neutral-900 dark:text-neutral-50">{member.user_full_name}</p>
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

const EditForm = ({ 
    project, 
    members, 
    onClose
}: { 
    project: Project, 
    members: Member[], 
    onClose: () => void
}) => {

    // Toast
    const { toast } = useToast();

    // Revalidate tags
    const revalidateTags = useTriggerRevalidate();

    // The form data for the new project
    const [formData, setFormData] = useState<{ name: string, description: string, members: Member[] }>({
        name: project.project_name,
        description: project.project_description,
        members: [ ...members ]
    });

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
        form.delete("user_code");
        form.append("members", JSON.stringify(formData.members));

        const response = await editProject(prevState, form, project.project_id);

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

        <form action={action} className="flex flex-col gap-4">
            <Input
                id="name" name="name" type="text"
                placeholder="Project name *"
                defaultValue={formData.name}
            />
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
                                    <div className="flex flex-col leading-3">
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
                <Button buttonType="primary" className="w-full">
                    Save
                </Button>
            </div>

        </form>
    )
}

