'use client'

import Navbar from "@/components/layout/navbar";
import SideBar from "@/components/layout/sidebar";

import { Loading } from "@/components/ui/loading";
import { Suspense } from "react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <div className="flex flex-col min-h-full max-w-screen">
            <Navbar />
            <div className="flex w-screen h-full mt-14 md:mt-16">
                <SideBar />
                <main className="flex w-full min-w-0">
                    <Suspense fallback={<div className="flex w-full h-full items-center justify-center"><Loading /></div>}>
                        {children}
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

