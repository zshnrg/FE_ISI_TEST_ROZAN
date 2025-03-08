'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

import { MdOutlineContentCopy, MdOutlineInfo } from "react-icons/md";
import { Button } from "@/components/ui/buttton";

import { User } from "@/lib/types/auth";
import { getSelf } from "@/lib/actions/user";

export default function SuccessCode() {

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const data = await getSelf();
            setUser(data);
        }
        fetchUser();
    }, []);

    return user?.user_code ? (
        <div className="flex flex-col gap-6">
            <p className="text-gray-500">Welcome to Bankanban {user?.user_full_name}!. The code below is your PersonalID. Share this code with your Lead and join the team.</p>
            <div className="flex flex-col gap-4">
                <div
                    className="py-4 px-6 bg-neutral-100 dark:bg-neutral-700/20 hover:bg-neutral-200 dark:hover:bg-neutral-700/20  rounded-full flex items-center justify-between gap-4 w-full transition-colors"
                    onClick={() => navigator.clipboard.writeText(user?.user_code)}
                >
                    <span className="text-md font-bold text-neutral-600 dark:text-neutral-200">{user.user_code}</span>
                    <MdOutlineContentCopy className="text-neutral-600 dark:text-neutral-200" />
                </div>
                <p className="flex items-start ml-4 gap-2">
                    <MdOutlineInfo className="text-neutral-500 dark:text-neutral-400 mt-[2px]" />
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">You can find this code later in your profile</span>
                </p>
            </div>

            <Button
                buttonType="primary"
                className="w-full"
                onClick={() => router.push("/")}
            >
                Continue
            </Button>
        </div>
    ) : (
        <Loading />
    )
}

const Loading = () => (
    <div className="flex flex-col gap-6">
        <div className="animate-pulse flex flex-col gap-4">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-600/20 rounded-full w-full animate-pulse"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-600/20 rounded-full w-full animate-pulse"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-600/20 rounded-full w-full animate-pulse"></div>
        </div>
        <div className="h-14 bg-neutral-200 dark:bg-neutral-600/20 rounded-full w-full animate-pulse"></div>
        <div className="h-14 bg-indigo-500/20 rounded-full w-full animate-pulse"></div>
    </div>
)