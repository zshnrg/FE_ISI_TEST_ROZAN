'use client'

import { Button } from "@/components/ui/buttton";
import { Modal } from "@/components/ui/modal";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useEffect, useState } from "react";
import { useToast } from "@/contexts/toastContext";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

import { Member } from "@/lib/types/user";
import { Loading } from "@/components/ui/loading";
import { getTask } from "@/lib/actions/task";
import { UserProfileImage } from "@/components/ui/profile";


type TaskData = {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    color: string;
    assignee: Member[];
}

export default function DetailTaskModal({ disclosure }: { disclosure: ReturnType<typeof useDisclosure> }) {

    const { toast } = useToast();

    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const taskId = searchParams.get("task");


    const [loading, setLoading] = useState(true);
    const [taskData, setTaskData] = useState<TaskData>({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "",
        color: "",
        assignee: []
    });

    useEffect(() => {
        async function fetchTask() {
            setLoading(true);
            if (!taskId) return;

            await getTask(parseInt(id), parseInt(taskId))
                .then((data) => {
                    setTaskData({
                        name: data.task_name,
                        description: data.task_description,
                        start_date: new Date(data.task_start_date).toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16),
                        end_date: new Date(data.task_end_date).toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16),
                        status: data.task_status,
                        color: data.task_color,
                        assignee: data.assigned_user
                    });
                })
                .catch((error) => {
                    toast(error.message, "error");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        fetchTask();
    }, [id, taskId, toast]);

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
            title="Task Detail"
            size="xl"
        >
            {loading ? <Loading /> : (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{taskData.name}</h4>

                        <span className={`text-xs text-neutral-50   ${taskData.status === "Not Started"
                            ? "bg-neutral-400"
                            : taskData.status === "On Progress"
                                ? "bg-yellow-500"
                                : taskData.status === "Done"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            } px-2 py-1 rounded-full`}>
                            {taskData.status}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{taskData.description ? taskData.description : "No description"}</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Start Date</label>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{taskData.start_date}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-neutral-500 dark:text-neutral-400">End Date</label>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{taskData.end_date}</p>
                        </div>

                    </div>

                    <hr className="border-t border-neutral-200 dark:border-neutral-700 my-4" />

                    <div className="flex flex-col gap-2 my-4">
                        <h5 className="text-md font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Members</h5>
                        {
                            taskData.assignee.map(member => (
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
            )}
        </Modal>
    );
}