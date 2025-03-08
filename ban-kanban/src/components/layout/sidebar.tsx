import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Project, projectDummy } from "@/lib/types/project";

import { MdOutlineDragIndicator } from "react-icons/md";
import { AnimatePresence, motion } from "motion/react";

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

    const [projects, setProjects] = useState<Project[]>(projectDummy);

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
                        className={`h-[calc(100svh-56px)] md:h-[calc(100svh-64px)] w-64 bg-neutral-100 dark:bg-neutral-800/50 text-white flex flex-col gap-4 p-6 sticky top-14 md:top-16 lg:top-16"}`}
                    >
                        <button 
                            className="absolute top-4 -right-10 bg-neutral-100 dark:bg-neutral-800/50 w-10 h-12 p-2 rounded-r-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                            onClick={toggleSidebar}
                        >
                            <MdOutlineDragIndicator className="w-6 h-6" />
                        </button>

                        <button
                            onClick={() => router.push("/") } 
                            className={`text-md font-medium text-left ${highlightMenu(pathname, "/")} text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50`}
                        >
                            Home
                        </button>

                        <div className="flex flex-col gap-2 overflow-y-auto">
                            <span className="text-sm font-semibold text-left text-neutral-600 dark:text-neutral-300">Projects</span>
                            {projects.slice(0, 5).map((project) => (
                                <button 
                                    key={project.project_id}
                                    onClick={() => router.push(`/project/${project.project_id}`)}
                                    className={`"text-md line-clamp-2 font-medium text-left ${highlightMenu(pathname, `/project/${project.project_id}`)} text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50`}
                                >
                                    {project.project_name}
                                </button>
                            ))}
                            {
                                projects.length > 5 && (
                                    <button 
                                        onClick={() => router.push("/")}
                                        className="text-md font-medium text-left text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                                    >
                                        More Projects ...
                                    </button>
                                )
                            }
                            {
                                projects.length === 0 && (
                                    <span className="text-md font-medium text-left text-neutral-500 dark:text-neutral-400">No Projects</span>
                                )
                            }
                        </div>

                        <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

                        <div className="flex flex-col gap-2 overflow-y-auto">
                            <span className="text-sm font-semibold text-left text-neutral-600 dark:text-neutral-300">Tasks</span>
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
                            className="absolute top-4 -right-10 bg-neutral-100 dark:bg-neutral-800/50 w-10 h-12 p-2 rounded-r-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
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