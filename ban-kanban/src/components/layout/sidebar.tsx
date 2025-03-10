import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRevalidateTag } from "@/contexts/revalidateContext";

import { Project } from "@/lib/types/project";
import { getProjects } from "@/lib/actions/project";

import { MdOutlineDragIndicator } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";
import { getPendingTasks } from "@/lib/actions/task";
import { AssignedTask } from "@/lib/types/task";
import { Button } from "../ui/buttton";
import { useToast } from "@/contexts/toastContext";
import Task from "../ui/task";

const SHOW_PROJECTS = 5;

const highlightMenu = (pathname: string, path: string) => {
    if (pathname === path) {
        return "text-neutral-900 dark:text-neutral-50";
    } else if (pathname.includes(path)) {
        if (path === "/") return "text-neutral-500 dark:text-neutral-400";
        return "text-neutral-900 dark:text-neutral-50";
    }
    return "text-neutral-500 dark:text-neutral-400";
}

export default function SideBar() {

    const router = useRouter();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    
    const projectRevalidate = useRevalidateTag("projects");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            await getProjects("", SHOW_PROJECTS + 1, 0)
                .then((data) => {
                    setProjects(data)
                    setLoading(false);
                })
        }
        fetchData();
    }, [projectRevalidate])

    return (
        <AnimatePresence>
            {
                isOpen && (
                    <motion.div
                        key="sidebar"
                        animate={{ x: 0 }}
                        initial={{ x: "-100%" }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.2, type: "tween" }}
                        style={{ zIndex: 1000 }}
                        className={`h-[calc(100svh-56px)] md:h-[calc(100svh-64px)] min-w-64 bg-neutral-100 dark:bg-[#1e1e1e] text-white flex flex-col gap-4 p-6 fixed md:sticky top-14 md:top-16 lg:top-16}`}
                    >
                        <button 
                            className="absolute top-4 -right-10 bg-neutral-100 dark:bg-[#1e1e1e] w-10 h-12 p-2 rounded-r-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                            onClick={toggleSidebar}
                        >
                            <MdOutlineDragIndicator className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => router.push("/") } 
                            className={`text-md font-medium text-left ${highlightMenu(pathname, "/")} hover:text-neutral-900 dark:hover:text-neutral-50`}
                        >
                            Home
                        </button>

                        <div className="flex flex-col gap-2 shrink-0k">
                            <span className="text-sm font-semibold text-left text-neutral-600 dark:text-neutral-300">Projects</span>
                            {
                                !loading && projects.slice(0, SHOW_PROJECTS).map((project) => (
                                <button 
                                    key={project.project_id}
                                    onClick={() => router.push(`/project/${project.project_id}`)}
                                    className={`"text-md line-clamp-2 font-medium text-left ${highlightMenu(pathname, `/project/${project.project_id}`)} hover:text-neutral-900 dark:hover:text-neutral-50`}
                                >
                                    {project.project_name}
                                </button>
                            ))}
                            {
                                !loading && projects.length > SHOW_PROJECTS && (
                                    <button 
                                        onClick={() => router.push("/")}
                                        className="text-md font-medium text-left text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                                    >
                                        More Projects ...
                                    </button>
                                )
                            }
                            {
                                !loading && projects.length === 0 && (
                                    <span className="text-md font-medium text-left text-neutral-500 dark:text-neutral-400">No Projects</span>
                                )
                            }
                            {
                                loading && Array.from({ length: SHOW_PROJECTS }).map((_, i) => (
                                    <div key={i} className="animate-pulse h-6 bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden">
                                    </div>
                                ))
                            }
                        </div>

                        <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

                        <div className="flex flex-col gap-4 overflow-y-auto max-h-full">
                            <span className="text-sm font-semibold text-left text-neutral-600 dark:text-neutral-300">Pending Tasks</span>
                            <PendingTasks />
                        </div>
                    </motion.div>
                )
            }
            
            {
                !isOpen && (
                    <motion.div
                        key="toggle"
                        animate={{ opacity: 1, x: 0 , transition: { duration: 0.4, type: "tween", delay: 0.5 } }}
                        initial={{ opacity: 0, x: "-100%" }}
                        exit={{ opacity: 1, x: "-100%" }}
                        className={`h-[calc(100svh-56px)] md:h-[calc(100svh-64px)] w-0 sticky top-14 md:top-16 lg:top-16"}`}
                    >
                        <button 
                            className="absolute top-4 -right-10 bg-neutral-100 dark:bg-[#1e1e1e] w-10 h-12 p-2 rounded-r-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                            onClick={toggleSidebar}
                        >
                        <MdOutlineDragIndicator className="w-6 h-6" />
                        </button>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );

}

const NUMBER_OF_TASKS = 10;

const PendingTasks = () => {

    const router = useRouter();
    const taskRevalidate = useRevalidateTag("tasks");
    const { toast } = useToast();

    const [tasks, setTasks] = useState<AssignedTask[]>([]);
    const [loading, setLoading] = useState(true);

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            await getPendingTasks(5, 0)
                .then((data) => {
                    setTasks(data)
                    setLoading(false);
                })
        }
        fetchData();
    }, [taskRevalidate])

    const loadMore = async () => {
        setLoading(true);
        await getPendingTasks(NUMBER_OF_TASKS, offset)
            .then((newData) => {
                setTasks([...tasks, ...newData]);
                setOffset(offset + NUMBER_OF_TASKS);
                setHasMore(newData.length === NUMBER_OF_TASKS);
            })
            .catch((error) => {
                toast(error.message, "error");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="flex flex-col gap-2 min-w-0 max-w-48">
            {
                !loading && tasks.map((task) => (
                    <Task showStatus key={task.task_id} task={task} onClick={() => router.push(`/project/${task.project_id}`)} />
                ))
            }
            {
                !loading && tasks.length === 0 && (
                    <span className="text-md font-medium text-left text-neutral-500 dark:text-neutral-400">No Tasks</span>
                )
            }
            {
                loading && Array.from({ length: NUMBER_OF_TASKS }).map((_, i) => (
                    <div key={i} className="animate-pulse h-12 bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden">
                    </div>
                ))
            }
            {
                hasMore && (
                    <Button
                        type="button"
                        onClick={loadMore}
                        buttonType="secondary"
                        className="w-full bg-white"
                        disabled={loading}
                    >
                        Load More
                    </Button>
                )
            }
        </div>
    );
}