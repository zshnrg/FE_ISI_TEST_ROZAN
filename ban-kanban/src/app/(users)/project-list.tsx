'use client'

import ProjectCard from "@/components/ui/project";
import { Project, projectDummy } from "@/lib/types/project";
import { useState } from "react";

export default function ProjectList({ 
    searchPQuery, 
    onProjectClick,
    onProjectEdit 
} : { 
    searchPQuery: string,
    onProjectClick: (project: Project) => void
    onProjectEdit: (project: Project) => void 
} ) {

    const [data, setData] = useState<Project[]>(projectDummy);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {
                data.map(project => (
                    <ProjectCard key={project.project_id} project={project} onClick={onProjectClick} onEdit={onProjectEdit} />
                ))
            }
        </div>
    )
}