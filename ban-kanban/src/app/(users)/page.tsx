'use client'

import { Button } from "@/components/ui/buttton";
import { Input } from "@/components/ui/input";
import { MdAdd } from "react-icons/md";

import NewProjectModal from "./new-project-modal";
import EditProjectModal from "./edit-project-modal";

import ProjectList from "./project-list";
import { UserProject } from "@/lib/types/project";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Home() {

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [focusedProject, setFocusedProject] = useState<UserProject |  null>(null);

    const handleChage = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        router.replace(`${pathName}?${params.toString()}`);
    }, 500);

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
                    defaultValue={searchParams.get("search")?.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChage(e.target.value)}
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
                onProjectClick={(project) => {router.push(`/project/${project.project_id}`)}}
                onProjectEdit={(project) => {
                    setFocusedProject(project);
                    editProjectModal.onOpen();
                }}
            />

            <NewProjectModal disclosure={newProjectModal} />
            <EditProjectModal disclosure={editProjectModal} data={focusedProject} setData={setFocusedProject}/>
        </div>
    );
}


