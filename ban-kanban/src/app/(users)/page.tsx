'use client'

import { Button } from "@/components/ui/buttton";
import { Input } from "@/components/ui/input";
import { MdAdd } from "react-icons/md";

import NewProjectModal from "./new-project-modal";

import { useDisclosure } from "@/hooks/useDisclosure";

export default function Home() {

    const newProjectModal = useDisclosure();

    return (
        <div className="flex flex-col p-12 gap-6">
            <div className="flex gap-6">
                <Input 
                    id="search" 
                    type="text" 
                    placeholder="Search project" 
                    className="w-full"
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

            <NewProjectModal disclosure={newProjectModal} />
        </div>
    );
}


