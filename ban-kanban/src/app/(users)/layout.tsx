'use client'

import Navbar from "@/components/layout/navbar";
import SideBar from "@/components/layout/sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />
            <div className="flex w-full h-full mt-14 lg:mt-16">
                <SideBar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}

