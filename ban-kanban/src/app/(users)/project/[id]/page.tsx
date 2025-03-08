'use client'

import { useParams } from "next/navigation";

export default function Project() {

    const { id } = useParams<{ id: string }>();

    return (
        <div>
            Project {id}
        </div>
    );
}