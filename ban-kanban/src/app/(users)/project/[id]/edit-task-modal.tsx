'use client'

import { Button } from "@/components/ui/buttton";
import { Input, TextArea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MdClose } from "react-icons/md";
import { MemberItem } from "@/components/ui/member";

import { useTriggerRevalidate } from "@/contexts/revalidateContext";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useToast } from "@/contexts/toastContext";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

import { Member } from "@/lib/types/user";
import { Loading } from "@/components/ui/loading";
import { getMembers } from "@/lib/actions/member";
import { editTask, getTask } from "@/lib/actions/task";
import { TaskFormState } from "@/lib/definitions/task";

type TaskFormData = {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    color: string;
    assignee: Member[];
}


export default function EditTaskModal({ disclosure }: { disclosure: ReturnType<typeof useDisclosure> }) {

    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const taskId = searchParams.get("task");

    // Toast
    const { toast } = useToast();

    // 1. Fetch members
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);

    const revalidateTags = useTriggerRevalidate();

    
    // The form data for the new project
    const [formData, setFormData] = useState<TaskFormData>({
        name: "",
        description: "",
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        status: "Not Started",
        color: "#B22222",
        assignee: []
    });
    
    useEffect(() => {
        async function fetchTask() {
            setLoading(true);
            if (!taskId) return;

            await getTask(parseInt(id), parseInt(taskId))
                .then((data) => {
                    setFormData({
                        name: data.task_name,
                        description: data.task_description,
                        start_date: new Date(data.task_start_date).toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16),
                        end_date: new Date(data.task_end_date).toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16),
                        status: data.task_status,
                        color: data.task_color,
                        assignee: data.assigned_user
                    });
                    return data
                })
                .then((data) => {
                    return getMembers(parseInt(id))
                        .then((members) => {
                            setMembers(members.filter((member) => !data.assigned_user.some((user) => user.user_id === member.user_id)));
                        })
                })
                .catch((error) => {
                    toast(error.message, "error");
                })
                .finally(() => {
                    setLoading(false);
                })
        }

        fetchTask();
    }, [id, toast, taskId]);


    // 2. Form data handler
    const handleFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const [searchMember, setSearchMember] = useState<string>("");
    const filtermembers = useMemo(() => {
        if (!searchMember) return [];
        return members.filter((member) => member.user_full_name.toLowerCase().includes(searchMember.toLowerCase()));
    }, [searchMember, members]);

    const handlePickMember = async (user_id: string) => {
        const user = members.find((member) => member.user_id === user_id);
        if (!user) return

        setFormData({
            ...formData,
            assignee: [...formData.assignee, user]
        });

        // Remove the user from the list
        setMembers((prev) => prev.filter((member) => member.user_id !== user_id));
        setSearchMember("");
    }

    const handleRemoveMember = (user_id: string) => {
        const user = formData.assignee.find((member) => member.user_id === user_id);
        if (!user) return

        setFormData({
            ...formData,
            assignee: formData.assignee.filter((member) => member.user_id !== user_id)
        });

        // Add the user back to the list
        setMembers((prev) => [...prev, user]);
    }

    // 3. Fomt data action
    const [state, action, pending] = useActionState(async (prevState: TaskFormState, form: FormData) => {
        
        if (!taskId) return;

        form.append("assignee", JSON.stringify(formData.assignee));

        const response = await editTask(parseInt(taskId), prevState, form, parseInt(id));
        if (response.success) {
            toast("Task created successfully", "success");
            revalidateTags("tasks");
            onClose();
        } else {
            toast(response.message || "An error occurred while creating the task", "error");
        }
        return response;
    }, undefined)

    // 4. On form submit
    const onClose = () => {
        const params = new URLSearchParams(searchParams);

        params.delete("task");
        router.replace(`${pathName}?${params.toString()}`);
        
        disclosure.onClose();
    }

    return (
        <Modal
            isOpen={disclosure.isOpen}
            onOpenChange={onClose}
            title="Create a new project"
            size="xl"
        >   {
                loading ? (<Loading />) : (

                    <form action={action} className="flex flex-col gap-4">

                        {/* Name */}
                        <div className="flex items-center gap-4">
                            <Input
                                id="name" name="name" type="text"
                                className="w-full"
                                placeholder="Project name *"
                                defaultValue={formData.name}
                            />
                            <div className="relative flex items-center">
                                <input 
                                    value={formData.color}
                                    type="color" id="color" name="color" onChange={handleFormData}
                                    className="w-14 h-14  shrink-0 rounded-full border focus:outline-0" style={{ backgroundColor: formData.color }}
                                />
                            </div>

                        </div>

                        {
                            state?.errors?.name && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.name}</p>
                        }
                        {
                            state?.errors?.color && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.color}</p>
                        }

                        {/* Description */}
                        <TextArea
                            defaultValue={formData.description}
                            className="min-h-24"
                            id="description" name="description" type="text"
                            placeholder="Project description"
                        />

                        {
                            state?.errors?.description && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.description}</p>
                        }

                        <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

                        {/* members */}
                        <div className="relative py-4 px-6 bg-neutral-100 dark:bg-neutral-700/20 rounded-4xl has-focus:ring-2 has-focus:ring-indigo-900 has-focus:ring-opacity-50 flex flex-wrap items-center gap-4">
                            {
                                formData.assignee.length > 0 && (
                                    formData.assignee.map((user) => (
                                        <div className="flex items-center w-fit gap-2 p-2 bg-neutral-50 rounded-lg text-sm text-neutral-800 dark:text-neutral-200" key={user.user_id}>
                                            {user.user_full_name}
                                            <MdClose onClick={() => handleRemoveMember(user.user_id)} className="cursor-pointer" />
                                        </div>
                                    ))
                                )
                            }
                            <input
                                className="focus:outline-none flex grow-1 text-md text-neutral-800 dark:text-neutral-200"
                                type="text"
                                placeholder="Search member to assign"
                                value={searchMember}
                                onChange={(e) => setSearchMember(e.target.value)}
                            />
                            <div hidden={filtermembers.length === 0} className="absolute top-16 inset-x-0 w-full space-y-4 py-4 bg-neutral-100 shadow-xl dark:bg-neutral-800 rounded-xl max-h-48 overflow-y-auto">
                                {
                                    filtermembers.map((member) => (
                                        <MemberItem
                                            key={member.user_id}
                                            member={member}
                                            onClick={() => handlePickMember(member.user_id)}
                                        />
                                    ))
                                }
                            </div>
                        </div>

                        {
                            state?.errors?.assignee && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.assignee}</p>
                        }

                        {/* Start and End Date */}
                        <div className="flex gap-4 items-center">
                            <Input
                                id="start_date" name="start_date" type="datetime-local"
                                defaultValue={formData.start_date}                                
                                placeholder="Start Date" className="w-full text-sm"
                            />
                            <div className="w-4 h-1 bg-neutral-300 dark:bg-neutral-500 rounded-full shrink-0"></div>
                            <Input
                                id="end_date" name="end_date" type="datetime-local"
                                defaultValue={formData.end_date}
                                placeholder="End Date" className="w-full text-sm"
                            />
                        </div>

                        {
                            state?.errors?.start_date && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.start_date}</p>
                        }
                        {
                            state?.errors?.end_date && <p className="ml-4 mt-2 text-red-500 text-sm">{state.errors.end_date}</p>
                        }

                        <div className="flex flex-col-reverse md:flex-row gap-4 mt-12">
                            <Button buttonType="secondary" type="button" onClick={disclosure.onClose}>
                                Cancel
                            </Button>
                            <Button
                                disabled={pending}
                                buttonType="primary" className="w-full"
                            >
                                Update
                            </Button>
                        </div>

                    </form>
                )
            }
        </Modal>
    );
}