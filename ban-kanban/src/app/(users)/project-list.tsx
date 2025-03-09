'use client'

import ProjectCard from "@/components/ui/project";
import { Project } from "@/lib/types/project";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProjects } from "@/lib/actions/project";
import { Button } from "@/components/ui/buttton";
import { useRevalidateTag } from "@/contexts/revalidateContext";

const NUM_PROJECTS = 12;

export default function ProjectList({
    onProjectClick,
    onProjectEdit
}: {
    onProjectClick: (project: Project) => void
    onProjectEdit: (project: Project) => void
}) {

    const projectRevalidate = useRevalidateTag("projects");
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [data, setData] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setOffset(0);
            setData([]);
            setLoading(true);

            await getProjects(
                searchParams.get("search")?.toString() || "",
                NUM_PROJECTS,
                0
            )
                .then((data) => {
                    console.log(data);
                    setData(data);
                    setShowLoadMore(data.length === NUM_PROJECTS);
                    setOffset(NUM_PROJECTS);
                    setLoading(false);
                })
        }
        fetchData();
    }, [searchParams, projectRevalidate])

    const loadMore = async () => {
        
        setLoading(true);
        await getProjects(
            searchParams.get("search")?.toString() || "",
            NUM_PROJECTS,
            offset
        )
            .then((newData) => {
                setData([...data, ...newData]);
                setShowLoadMore(newData.length === NUM_PROJECTS);
                setOffset(offset + NUM_PROJECTS);
                setLoading(false);
            })
    }


    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {
                    (!loading || data.length > 0) && data.map(project => (
                        <ProjectCard key={project.project_id} project={project} onClick={onProjectClick} onEdit={onProjectEdit} />
                    ))
                }
                {
                    !loading && data.length === 0 && (
                        <div className="col-span-4 flex flex-col items-center justify-center h-24">
                            <p className="text-neutral-500 dark:text-neutral-400">No projects found</p>
                        </div>
                    )
                }
                {
                    loading && Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse h-24 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl overflow-hidden">
                        </div>
                    ))
                }
            </div>
            {
                showLoadMore && (
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
    )
}