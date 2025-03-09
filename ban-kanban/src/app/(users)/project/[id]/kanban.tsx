"use client";

import { useEffect, useMemo, useState } from "react";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";

import Task from "@/components/ui/task";
import { AssignedTask, assignedTaskDummy } from "@/lib/types/task";

import { User } from "@/lib/types/auth";
import { getSelf } from "@/lib/actions/user";

const statuses = ["Not Started", "On Progress", "Done", "Reject"];

const initialTasks = assignedTaskDummy

export default function KanbanBoard() {

    const [tasks, setTasks] = useState<AssignedTask[]>(initialTasks);
    const [user, setUser] = useState<User | null>(null);

    
    useEffect(() => {
        async function fetchUser() {
            await getSelf().then((data) => setUser(data));
        }

        fetchUser();
    }, []);

    const columnTasks: AssignedTask[][] = useMemo(() => {
        return statuses.map((status) => tasks.filter((task) => task.task_status === status));
    }, [tasks]);

    const [activeTask, setActiveTask] = useState<AssignedTask | null>(null);

    const onDragStart = ({ active }: DragStartEvent) => {
        const task: AssignedTask = active.data.current?.task

        if (task && !task.assigned_user.every((u) => u.user_id === user?.user_id)) {
            setActiveTask(task);
        }
    }

    const onDragrEnd = ({ over }: DragEndEvent) => {
        if (over) {
            setActiveTask(null);
        }
    }

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        console.log(active, over);
        
        if (!over || !active) return

        if (over?.data.current?.type === "column") {
            const actTask: AssignedTask = active.data.current?.task;
            const overStatus: string = over.data.current?.status;

            if (actTask.task_status === overStatus) return

            setTasks((tasks) => {
                // 1. Update the task status
                const newTasks =  tasks.map((task) => {
                    if (task.task_id === actTask.task_id) {
                        return {
                            ...task,
                            task_status: overStatus
                        }
                    }

                    return task;
                })

                // 2. Move to last index
                const actIndex = newTasks.findIndex((task) => task.task_id === actTask.task_id);

                const [movedTask] = newTasks.splice(actIndex, 1);
                newTasks.push(movedTask);

                return newTasks;
            })
            return
        }

        const actTask: AssignedTask = active.data.current?.task;
        const overTask: AssignedTask = over?.data.current?.task;
        
        if (actTask.task_id === overTask.task_id) return

        setTasks((tasks) => {
            // 1. Update the task status
            const newTasks = tasks.map((task) => {
                if (task.task_id === actTask.task_id) {
                    return {
                        ...task,
                        task_status: overTask.task_status
                    }
                }

                return task;
            })

            // 2. Move the task before the over task
            const overIndex = newTasks.findIndex((task) => task.task_id === overTask.task_id);
            const actIndex = newTasks.findIndex((task) => task.task_id === actTask.task_id);

            const [movedTask] = newTasks.splice(actIndex, 1);
            newTasks.splice(overIndex, 0, movedTask);

            return newTasks;
        })
    }

    return (
        <div className="flex w-full min-h-[calc(100svh-240px)] overflow-x-auto rounded-2xl">
            <DndContext 
                onDragStart={onDragStart}
                onDragEnd={onDragrEnd}
                onDragOver={onDragOver}
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
    ...props
}: {
    status: string;
    tasks: AssignedTask[];
    user: User | null;
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
        disabled: true
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
                        <TaskCard task={task} key={index} user={user} />
                    ))}
                </SortableContext>
            </div>
        </div>
    )
}

function TaskCard({
    task,
    user,
    ...props
}: {
    task: AssignedTask;
    user: User | null;
    [prop: string]: unknown;
}) {

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
        disabled: task.assigned_user.every((u) => u.user_id === user?.user_id)
    });

    const style = {
        transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
        transition,
    };


    return !isDragging ? (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <Task task={task} {...props} />
        </div>
    ) : (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="border-2 border-indigo-800/20 bg-neutral-50/50 animate-pulse rounded-2xl">
            <Task task={task} {...props} className="opacity-0" />
        </div>
    )
}