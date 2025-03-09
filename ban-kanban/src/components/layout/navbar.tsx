"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/themeContext";
import { useToast } from "@/contexts/toastContext";

import Image from "next/image";
import { MdOutlineArrowForwardIos, MdOutlineBedtime, MdOutlineBrightness5, MdOutlineContentCopy, MdOutlineLogout, MdOutlineMenu, MdOutlineNotifications } from "react-icons/md";
import { UserProfileImage } from "../ui/profile";

import { User } from "@/lib/types/auth";
import { destroySession } from "@/lib/actions/session";
import { getSelf } from "@/lib/actions/user";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="fixed inset-x-0 top-0 z-50 h-14 md:h-16 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-between py-2 px-6">
            <Brand />
            <div className="flex gap-4 items-center relative">
                <button className="p-2 rounded-xl bg-neutral-200/50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors">
                    <MdOutlineNotifications className="w-6 h-6 text-neutral-900 dark:text-neutral-50" />
                </button>
                <div ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="p-2 rounded-xl bg-neutral-200/50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                    >
                        <MdOutlineMenu className="w-6 h-6 text-neutral-900 dark:text-neutral-50" />
                    </button>
                    {isOpen && <Dropdown />}
                </div>
            </div>
        </nav>
    );
}

const Dropdown = () => {

    const [user, setUser] = useState<User | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getSelf();
            setUser(data);
        };
        fetchUser();
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const themeDropdownRef = useRef<HTMLDivElement>(null);

    const toggleThemeDropdown = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="absolute top-16 -right-4 max-2-lg bg-neutral-50 dark:bg-neutral-800 rounded-3xl shadow-lg flex flex-col p-6 gap-4">
            {
                user ? (
                    <div className="flex gap-4 items-center">
                        <UserProfileImage full_name={user.user_full_name} size={64} bgColor={user.user_color} />
                        <div>
                            <h3 className="text-md font-semibold text-neutral-900 dark:text-neutral-50">{user.user_full_name}</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.user_email}</p>
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(user.user_code);
                                    toast("User code copied to clipboard", "success");
                                }}
                                className="flex bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-200/70 dark:hover:bg-neutral-600/50 items-center gap-2 p-1 w-fit rounded-lg mt-1"
                            >
                                <MdOutlineContentCopy className="text-neutral-500 dark:text-neutral-400" size={12} />
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">{user.user_code}</span>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center">
                        <div className="h-12 w-12 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
                        <div className="flex flex-col gap-2">
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full w-36 animate-pulse"></div>
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full w-24 animate-pulse"></div>
                        </div>
                    </div>
                )
            }

            <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

            <div className="flex flex-col gap-2">
                <button className="text-md font-medium text-left text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50">Profile</button>
                <div ref={themeDropdownRef} className="relative">
                    <button 
                        onClick={toggleThemeDropdown}
                        className="flex w-full items-center justify-between text-md font-medium text-left text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                    >
                        Theme
                        <MdOutlineArrowForwardIos />
                    </button>
                    {isOpen && <ThemeOptions /> }
                </div>
            </div>

            <hr className="border-t border-2 border-neutral-200 dark:border-neutral-700 mx-4" />

            <button
                className="flex items-center justify-between text-md font-medium text-left text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                onClick={() => destroySession()}
            >
                Logout
                <MdOutlineLogout />
            </button>
        </div>
    );
};

const ThemeOptions = () => {

    const { theme, setTheme } = useTheme();

    return (
        <div className="absolute top-8 left-24 lg:top-0 lg:-left-44 max-2-lg bg-neutral-50 dark:bg-neutral-800 rounded-3xl shadow-lg flex flex-col p-6 gap-2 min-w-36">
            <button
                onClick={() => setTheme("light")}
                className={`flex items-center justify-between ${theme === "light" ? 'text-neutral-900 dark:text-neutral-50' : "text-neutral-500 dark:text-neutral-400"} hover:text-neutral-900 dark:hover:text-neutral-50`}
            >
                Light
                <MdOutlineBrightness5 />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-between ${theme === "dark" ? 'text-neutral-900 dark:text-neutral-50' : "text-neutral-500 dark:text-neutral-400"} hover:text-neutral-900 dark:hover:text-neutral-50`}
            >
                Dark
                <MdOutlineBedtime />
            </button>

        </div>
    );
}

const Brand = () => {
    return (
        <div className="flex items-center gap-4">
            <Image src="/assets/logo.svg" width={36} height={36} alt="logo" />
            <h1 className="text-2xl font-semibold leading-6 text-neutral-900 dark:text-neutral-50 hidden md:block">
                Bankanban
            </h1>
        </div>
    );
};
