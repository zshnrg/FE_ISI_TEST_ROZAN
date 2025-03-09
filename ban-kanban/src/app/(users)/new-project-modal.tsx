'use client'

import { Button } from "@/components/ui/buttton";
import { Input, TextArea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MdOutlineSearch } from "react-icons/md";
import { MemberItem } from "@/components/ui/member";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/contexts/toastContext";
import { useTriggerRevalidate } from "@/contexts/revalidateContext";

import { Member } from "@/lib/types/user";
import { NewProjectFormState } from "@/lib/definitions/project";
import { createProject } from "@/lib/actions/project";
import { getSelf, getUserByCode } from "@/lib/actions/user";

export default function NewProjectModal({ disclosure }: { disclosure: ReturnType<typeof useDisclosure> }) {
    
    // Toast
    const { toast } = useToast();

    // Revalidate tags
    const revalidateTags = useTriggerRevalidate();

    // The form data for the new project
    const [formData, setFormData] = useState<{ name: string, description: string, members: Member[]}>({
        name: "",
        description: "",
        members: []
    });

    // 1. Insert the current user as the lead member
    useEffect(() => {
        const insertSelf = async () => {
            const user = await getSelf();
            setFormData((prev) => ({
                ...prev,
                members: [{
                    ...user,
                    user_role: "lead"
                }]
            }));
        }
        insertSelf();
    }, []);

    // 2. Form data handler
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

    // 3. Form data action
    const [state, action, pending] = useActionState(async (prevState: NewProjectFormState, form: FormData) => {
        form.delete("user_code");
        form.append("members", JSON.stringify(formData.members));
        const response = await createProject(prevState, form);
        if (response.success) {
            disclosure.onClose();
            toast("Project created successfully", "success");
            revalidateTags("projects");
        } else {
            toast(response.message || "An error occurred while creating the project", "error");
        }
        return response;
    }, undefined)
    
    return (
        <Modal
            {...disclosure}
            title="Create a new project"
            size="xl"
        >
            <form action={action} className="flex flex-col gap-4">
                <Input
                    id="name" name="name" type="text"
                    placeholder="Project name *"
                />
                {state?.errors?.name && (
                    <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.name.join(", ")}</p>
                )}
                <TextArea
                    className="min-h-24"
                    id="description" name="description" type="text"
                    placeholder="Project description"
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
                    <div className="flex flex-col gap-3 my-4">
                        {
                            formData.members.map(member => (
                                <MemberItem
                                    key={member.user_id}
                                    member={member}
                                    showRemove={member.user_role !== "lead"}
                                    onRemove={handleRemoveMember}
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-4">
                    <Button buttonType="secondary" type="button" onClick={disclosure.onClose}>
                        Cancel
                    </Button>
                    <Button 
                        disabled={pending}
                        buttonType="primary" className="w-full"
                    >
                        Create
                    </Button>
                </div>

            </form>
        </Modal>
    );
}