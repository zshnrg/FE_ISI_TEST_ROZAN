'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useDisclosure } from "@/hooks/useDisclosure";

import { Input } from "@/components/ui/input";
import { MdAdd, MdSearch } from "react-icons/md";
import { Button } from "@/components/ui/buttton";

import KanbanBoard from "./kanban";
import NewTasktModal from "./new-task-form";

export default function Kanban() {

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

    const newTask = useDisclosure();

    return (
        <div className="flex flex-col p-12 gap-6 min-h-full w-full">
            <div className="flex gap-6 w-full">
                <Input 
                    id="search" 
                    type="text" 
                    placeholder="Search task" 
                    className="w-full"
                    defaultValue={searchParams.get("search")?.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChage(e.target.value)}
                    leadingIcon={<MdSearch/>}
                />
                <Button 
                    onClick={newTask.onOpen}
                    buttonType="primary"
                    className="flex items-center gap-2 shrink-0"
                >
                    <span className="hidden md:block">Add Task</span>
                    <MdAdd/>
                </Button>
            </div>

            <KanbanBoard />

            <NewTasktModal disclosure={newTask} />
        </div>
    );
}