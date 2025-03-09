"use client";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor } from "@dnd-kit/core";
import { useToast } from "@/contexts/toastContext";
import { useRevalidateTag, useTriggerRevalidate } from "@/contexts/revalidateContext";

import Task from "@/components/ui/task";

import { getSelf } from "@/lib/actions/user";
import { AssignedTask } from "@/lib/types/task";
import { getMember } from "@/lib/actions/member";
import { Member } from "@/lib/types/user";
import { getTasks, updateTaskStatus } from "@/lib/actions/task";

const statuses = ["Not Started", "On Progress", "Done", "Reject"];

export default function KanbanBoard({
    onDetail,
    onEdit
}: {
    onDetail: () => void;
    onEdit: () => void;
}) {

    const searchParams = useSearchParams();
    const search = searchParams.get("search") || "";
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();

    const [tasks, setTasks] = useState<AssignedTask[]>([]);
    const [user, setUser] = useState<Member | null>(null);

    const tasksRevalidate = useRevalidateTag("tasks");
    const revalidateTags = useTriggerRevalidate();

    // 0. Get the user

    useEffect(() => {
        async function fetchUser() {
            await getSelf()
                .then(async (user) => {
                    return await getMember(parseInt(id), user.user_id);
                })
                .then((member) => {
                    if (!member) throw new Error("You are not a member of this project");
                    setUser(member);
                })
                .catch((error) => {
                    toast(error.message, "error");
                    router.push("/");
                });
        }
        fetchUser();
    }, [id, router, toast]);

    // 1. Get the tasks

    useEffect(() => {
        async function fetchTasks() {
            await getTasks(parseInt(id), search)
                .then((tasks) => {
                    setTasks(tasks);
                })
                .catch((error) => {
                    toast(error.message, "error");
                })
        }
        fetchTasks();
    }, [id, toast, tasksRevalidate, search]);

    // 2. Group the tasks by status
    const columnTasks: AssignedTask[][] = useMemo(() => {
        return statuses.map((status) => tasks.filter((task) => task.task_status === status));
    }, [tasks]);

    // 3. Task Dragging
    const [activeTask, setActiveTask] = useState<AssignedTask | null>(null)

    const onDragStart = ({ active }: DragStartEvent) => {
        const task: AssignedTask = active.data.current?.task

        if ((task && !task.assigned_user.every((u) => u.user_id !== user?.user_id)) || user?.user_role === "lead") {
            setActiveTask(task);
        }
    }

    const onDragEnd = async ({ over }: DragEndEvent) => {
        if (!over) return
        if (!activeTask) return

        const isColumn = over?.data.current?.type === "column"
        const overStatus: string = isColumn ? over.data.current?.status : over?.data.current?.task.task_status;

        await updateTaskStatus(activeTask.task_id, overStatus)
            .then(() => {
                revalidateTags("tasks");
            })
            .catch((error) => {
                toast(error.message, "error");
            })
    }

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if (!over || !active) return

        const isColumn = over?.data.current?.type === "column"

        const actTask: AssignedTask = active.data.current?.task;
        const overStatus: string = isColumn ? over.data.current?.status : over?.data.current?.task.task_status;

        if (actTask.task_status === overStatus) return
        
        setTasks((tasks) => {
            // 1. Update the task status
            const newTasks = tasks.map((task) => {
                if (task.task_id === actTask.task_id) {
                    return {
                        ...task,
                        task_status: overStatus
                    }
                }

                return task;
            })

            // 2. Move to first
            const taskIndex = newTasks.findIndex((task) => task.task_id === actTask.task_id);
            const task = newTasks.splice(taskIndex, 1)[0];
            newTasks.unshift(task);

            return newTasks;
        })

    }

    const sensors = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 12,
        },
    })

    return (
        <div className="flex w-full min-h-[calc(100svh-240px)] overflow-x-auto rounded-2xl">
            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                sensors={[sensors]}
            >
                <div className="grid grid-cols-4 min-w-200 w-full">
                    <SortableContext items={statuses}>
                        {
                            columnTasks.map((tasks, index) => (
                                <ColumnContainer
                                    key={index}
                                    status={statuses[index]}
                                    tasks={tasks}
                                    user={user}
                                    onDetail={onDetail}
                                    onEdit={onEdit}
                                />
                            ))
                        }
                    </SortableContext>
                </div>
                <DragOverlay>
                    {
                        activeTask && (
                            <Task task={activeTask} />
                        )
                    }
                </DragOverlay>
            </DndContext>
        </div>
    )
}

function ColumnContainer({
    status,
    tasks,
    user,
    onDetail,
    onEdit,
    ...props
}: {
    status: string;
    tasks: AssignedTask[];
    user: Member | null;
    onDetail: () => void;
    onEdit: () => void;
    [prop: string]: unknown;
}) {

    const {
        setNodeRef
    } = useSortable({
        id: status,
        data: {
            type: "column",
            status
        },
        disabled: tasks.every((task) => task.assigned_user.every((u) => u.user_id !== user?.user_id)) && user?.user_role === "member"
    });

    const taskIds = useMemo(() => tasks.map((task) => task.task_id), [tasks]);

    return (
        <div ref={setNodeRef} className="bg-neutral-100/50 dark:bg-neutral-800/50" {...props}>
            <div className="flex items-center gap-4 px-4 py-3 bg-indigo-900 text-neutral-50 dark:bg-indigo-800 dark:hover:bg-indigo-700">
                <div
                    className={`w-3 h-3 rounded-full ${status === "Not Started"
                        ? "bg-neutral-400"
                        : status === "On Progress"
                            ? "bg-yellow-400"
                            : status === "Done"
                                ? "bg-green-400"
                                : "bg-red-400"
                        }`}
                ></div>
                <h1 className="text-md font-semibold">{status}</h1>
            </div>
            <div className="p-1 py-2 space-y-2">
                <SortableContext items={taskIds}>
                    {tasks.map((task, index) => (
                        <TaskCard
                            task={task} key={index} user={user}
                            onDetail={onDetail} onEdit={onEdit}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    )
}

function TaskCard({
    task,
    user,
    onDetail,
    onEdit,
    ...props
}: {
    task: AssignedTask;
    user: Member | null;
    onDetail: () => void;
    onEdit: () => void;
    [prop: string]: unknown;
}) {

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const handleClick = () => {
        const params = new URLSearchParams(searchParams);
        params.set("task", task.task_id.toString());

        if (searchParams.get("search")) {
            router.replace(`${pathName}?${params.toString()}&search=${searchParams.get("search")}`);
        } else {
            router.replace(`${pathName}?${params.toString()}`);
        }

        if (user?.user_role === "lead") {
            onEdit();
        } else {
            onDetail();
        }
    }

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.task_id,
        data: {
            type: "task",
            task,
        },
        disabled: task.assigned_user.every((u) => u.user_id === user?.user_id) && user?.user_role === "member"
    });

    const style = {
        transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
        transition,
    };


    return !isDragging ? (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={handleClick} >
            <Task task={task} {...props} />
        </div>
    ) : (
        <div ref={setNodeRef} style={style} onClick={handleClick}
            {...attributes} {...listeners} className="border-2 border-indigo-800/20 bg-neutral-50/50 animate-pulse rounded-2xl">
            <Task task={task} {...props} className="opacity-0" />
        </div>
    )
}