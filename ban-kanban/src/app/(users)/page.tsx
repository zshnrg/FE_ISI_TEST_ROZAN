'use client'

import { Button } from "@/components/ui/buttton";
import { Input } from "@/components/ui/input";
import { MdAdd } from "react-icons/md";

import NewProjectModal from "./new-project-modal";
import EditProjectModal from "./edit-project-modal";

import ProjectList from "./project-list";
import { Project } from "@/lib/types/project";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

    const router = useRouter();

    const [search, setSearch] = useState<string>("");
    const [focusedProject, setFocusedProject] = useState<Project | null>(null);

    const handleChage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const newProjectModal = useDisclosure();
    const editProjectModal = useDisclosure();

    return (
        <div className="flex flex-col p-12 gap-6">
            <div className="flex gap-6">
                <Input 
                    id="search" 
                    type="text" 
                    placeholder="Search project" 
                    className="w-full"
                    value={search}
                    onChange={handleChage}
                />
                <Button 
                    onClick={newProjectModal.onOpen}
                    buttonType="primary"
                    className="flex items-center gap-2 shrink-0"
                >
                    <span className="hidden md:block">New Project</span>
                    <MdAdd/>
                </Button>
            </div>

            <ProjectList 
                searchPQuery={search}
                onProjectClick={(project) => {router.push(`/project/${project.project_id}`)}}
                onProjectEdit={(project) => {
                    setFocusedProject(project);
                    editProjectModal.onOpen();
                }}
            />

            <NewProjectModal disclosure={newProjectModal} />
            <EditProjectModal disclosure={editProjectModal} data={focusedProject} />
        </div>
    );
}


