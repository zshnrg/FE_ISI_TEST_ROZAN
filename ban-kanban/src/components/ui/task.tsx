import { AssignedTask } from "@/lib/types/task";
import { UserProfileImage } from "./profile";

export default function Task({
    task,
    showUser = false,
    showProject = false,
    showStatus = false,
    className,
    ...props
}: {
    task: AssignedTask;
    showUser?: boolean;
    showProject?: boolean;
    showStatus?: boolean;
    className?: string;
    [prop: string]: unknown;
}) {
    return (
        <div className={`flex bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden isolate ${className}`} {...props}>
            <div className="w-2 flex-none"
                style={{ backgroundColor: task.task_color }}
            />
            <div className="p-3 w-full">
                <div className="flex gap-2 items-start justify-stretch w-full">
                    <h4 className="text-md font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-3">{task.task_name}</h4>
                    {
                        showStatus && (
                            <span className={`text-xs font-bold text-neutral-50 ${task.task_status === "Not Started"
                                ? "bg-neutral-400"
                                : task.task_status === "On Progress"
                                    ? "bg-yellow-500"
                                    : task.task_status === "Done"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                } px-2 py-1 rounded-lg ml-auto`}>
                                {task.task_status.split(" ").map((s) => s[0]).join("")}
                            </span>
                        )
                    }
                </div>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{task.task_description}</p>

                {
                    showProject && (
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 line-clamp-2">{task.project_name}</span>
                    )
                }

                {showUser && (
                    <div className="flex gap-2 items-center">
                        <div className="flex -space-x-3.5 mt-2 rotate-180">
                            {task.assigned_user.slice(0,5).map((user) => (
                                <UserProfileImage
                                    key={user.user_id}
                                    full_name={user.user_full_name}
                                    bgColor={user.user_color}
                                    size={24}
                                    className="rotate-180"
                                />
                            ))}
                        </div>
                        {
                            task.assigned_user.length > 5 && (
                                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-2">
                                    +{task.assigned_user.length - 5} more
                                </span>
                            )
                        }
                    </div>
                )}

                <div className="flex gap-2 items-center justify-between mt-2">
                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        {formatDate(task.task_start_date)} - {formatDate(task.task_end_date)}
                    </span>
                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        {Math.floor((new Date(task.task_end_date).getTime() - new Date(task.task_start_date).getTime()) / (1000 * 60 * 60 * 24))}d
                    </span>
                </div>
            </div>
        </div>
    )
}

const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
    });
}