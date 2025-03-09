'use client'

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useToast } from "@/contexts/toastContext";

import { Input } from "@/components/ui/input";
import { MdAdd, MdSearch } from "react-icons/md";
import { Button } from "@/components/ui/buttton";

import KanbanBoard from "./kanban";
import NewTaskModal from "./new-task-modal"
;
import { Member } from "@/lib/types/user";
import { getSelf } from "@/lib/actions/user";
import { getMember } from "@/lib/actions/member";
import { useEffect, useState } from "react";
import EditTaskModal from "./edit-task-modal";
import DetailTaskModal from "./detail-modal";

export default function Kanban() {

    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const { id } = useParams<{ id: string }>();
    
    const handleChage = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        router.replace(`${pathName}?${params.toString()}`);
    }, 500);
    
    const [user, setUser] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUser = async () => {
            await getSelf()
                .then((data) => {
                    return getMember(parseInt(id), data.user_id);
                })
                .then((data) => {
                    setUser(data);
                })
                .catch((error) => {
                    toast(error.message, "error");
                })
                .finally(() => {
                    setLoading(false);
                })
        }
        fetchUser();
    }, [id, toast]);

    const newTask = useDisclosure();
    const editTask = useDisclosure();
    const detailTask = useDisclosure();

    return loading ? (
        <Loading/>
    ) : (
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
                {
                    user?.user_role === "lead" && (
                        <Button 
                            onClick={newTask.onOpen}
                            buttonType="primary"
                            className="flex items-center gap-2 shrink-0"
                        >
                            <span className="hidden md:block">Add Task</span>
                            <MdAdd/>
                        </Button>
                    )
                }
            </div>

            <KanbanBoard onDetail={(detailTask.onOpen)} onEdit={editTask.onOpen} />

            <NewTaskModal disclosure={newTask} />
            <EditTaskModal disclosure={editTask} />
            <DetailTaskModal disclosure={detailTask} />
        </div>
    );
}

const Loading = () => (
    <div className="flex flex-col p-12 gap-6 min-h-full w-full">
        <div className="flex gap-6 w-full">
            <div className="animate-pulse bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl h-12 w-full"></div>
            <div className="animate-pulse bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl h-12 w-24"></div>
        </div>
        <div className="flex h-full animate-pulse bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl"/>
    </div>
)