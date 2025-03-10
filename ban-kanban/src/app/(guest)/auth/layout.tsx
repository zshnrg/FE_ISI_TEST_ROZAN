import { Loading } from "@/components/ui/loading";
import Image from "next/image";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    
    return (
        <div className="flex items-center justify-center min-h-svh">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-4xl flex flex-col gap-12 p-16 w-full max-w-lg">
                <Brand />
                <Suspense fallback={<div className="flex w-full h-full items-center justify-center"><Loading /></div>}>
                    {children}
                </Suspense>
            </div>
        </div>
    );
}

const Brand = () => {
    return (
        <div className="flex items-center gap-4">
            <Image src="/assets/logo.svg" width={48} height={48} alt="logo" />
            <h1 className="text-2xl font-semibold leading-6 mb-2 text-neutral-900 dark:text-neutral-50">
                <span className="text-sm">Welcome to</span>
                <br />
                Bankanban
            </h1>
        </div>
    )
}