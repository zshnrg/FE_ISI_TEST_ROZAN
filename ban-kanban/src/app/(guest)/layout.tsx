'use client'

import { useTheme } from "@/contexts/themeContext";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { theme, setTheme } = useTheme();

    return (
        <div>
            {/* Anbolute button theme switcher */}
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="absolute bottom-4 right-4 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-full">
                {
                    theme === 'light' ? '🌙' : '☀️'
                }
            </button>
            {children}
        </div>
    );
}