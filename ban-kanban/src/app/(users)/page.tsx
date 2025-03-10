'use client'

import { Button } from "@/components/ui/buttton";
import { Input } from "@/components/ui/input";
import { MdAdd, MdSearch } from "react-icons/md";

import NewProjectModal from "./new-project-modal";
import EditProjectModal from "./edit-project-modal";
import ProjectList from "./project-list";

import { useDisclosure } from "@/hooks/useDisclosure";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import DetailProjectModal from "./detail-project-modal";

export default function Home() {

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

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
    const detailProjectModal = useDisclosure();

    return (
        <div className="flex flex-col p-12 gap-6 min-h-full w-full">
            <div className="flex gap-6">
                <Input 
                    id="search" 
                    type="text" 
                    placeholder="Search project" 
                    className="w-full"
                    defaultValue={searchParams.get("search")?.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChage(e.target.value)}
                    leadingIcon={<MdSearch/>}
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
                onEdit={editProjectModal.onOpen}
                onDetail={detailProjectModal.onOpen}
            />

            <NewProjectModal disclosure={newProjectModal} />
            <EditProjectModal disclosure={editProjectModal} />
            <DetailProjectModal disclosure={detailProjectModal} />
        </div>
    );
}


