'use client'

import { useState } from "react"

import { MdOutlineContentCopy } from "react-icons/md";

export default function SuccessCode () {

    const [ code, setCode ] = useState("123123");

    return (
        <div className="flex flex-col gap-6">
            <p className="text-gray-500">Welcome to Bankanban Rozan Ghosani!. The code below is your PersonalID. Share this code with your Lead and join the team.</p>
            <div className="flex items-center gap-4">
                <div className="py-4 px-6 bg-neutral-100 dark:bg-neutral-700/20 rounded-full flex items-center justify-between gap-4 w-full">
                    <span className="text-md font-bold text-neutral-600 dark:text-neutral-200">{code}</span>
                    <MdOutlineContentCopy className="text-neutral-600 dark:text-neutral-200" />
                </div>
            </div>
        </div>
    );
}