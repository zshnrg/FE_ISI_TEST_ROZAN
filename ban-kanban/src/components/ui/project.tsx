import { Project } from "@/lib/types/project";

import { MdOutlineEditNote, MdArrowForwardIos } from "react-icons/md";

export default function ProjectCard({
    project,
    onEdit,
    onClick,
}: {
    project: Project
    onEdit: (project: Project) => void
    onClick: (project: Project) => void
}) {

    return (
        <div className="flex flex-col w-full h-full bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl overflow-hidden">
            <div 
                onClick={() => onClick(project)}
                className="flex flex-col p-4 gap-2 grow cursor-pointer"
            >
                <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 line-clamp-1">{project.project_name}</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{project.project_description}</p>
            </div>
            <div className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800">
                <span className={`text-xs text-neutral-50   ${project.project_status ? "bg-green-500 dark:text-neutral-900" : "bg-neutral-400 dark:bg-neutral-500"} px-2 py-1 rounded-full`}>
                    {project.project_status ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(project)}
                        className="cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                    >
                        <MdOutlineEditNote />
                    </button>
                    <button
                        onClick={() => onClick(project)}
                        className="cursor-pointer text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>
        </div>
    )

}