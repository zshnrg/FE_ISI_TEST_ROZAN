"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Task from "@/components/ui/task";
import { AssignedTask, assignedTaskDummy } from "@/lib/types/task";

const statuses = ["Not Started", "On Progress", "Done", "Reject"];

const initialTasks = assignedTaskDummy

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<AssignedTask[]>(initialTasks);
  
    const handleDragEnd = (
      e: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { x: number } },
      task: AssignedTask
    ) => {
      const threshold = 100;
      const currentIndex = statuses.indexOf(task.task_status);
      let newIndex = currentIndex;
  
      if (info.offset.x > threshold && currentIndex < statuses.length - 1) {
        newIndex = currentIndex + 1;
      } else if (info.offset.x < -threshold && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }
  
      if (newIndex !== currentIndex) {
        setTasks((prevTasks) => {
          const updatedTask = { ...task, task_status: statuses[newIndex] };
          const remainingTasks = prevTasks.filter((t) => t.task_id !== task.task_id);
          return [updatedTask, ...remainingTasks];
        });
      }
    };

    return (
        <div className="flex w-full min-h-[calc(100svh-240px)] overflow-x-auto rounded-2xl">
            <div className="grid grid-cols-4 min-w-200 w-full">
                {statuses.map((status, index) => (
                    <div key={index} className="bg-neutral-100/50 dark:bg-neutral-800/50">
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
                        <div className={`p-1 py-2 space-y-2 ${index === 0 && 'pl-2'} ${index === statuses.length - 1 && 'pr-2'}`}>
                            {tasks
                                .filter((task) => task.task_status === status)
                                .map((task) => (
                                    <motion.div
                                        key={task.task_id}
                                        drag
                                        dragElastic={1}
                                        dragMomentum={false}
                                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                        onDragEnd={(e, info) => handleDragEnd(e, info, task)}
                                        className="cursor-move"
                                    >
                                        <Task task={task} />
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}