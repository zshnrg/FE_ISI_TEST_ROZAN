import { useState, createContext, useContext, useEffect } from "react";

type ThemeContextType = {
    theme: string;
    setTheme: (theme: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const localTheme = window.localStorage.getItem("theme");
        if (localTheme) {
            setTheme(localTheme as "light" | "dark");
        } else {

            const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (isSystemDark) {
                setTheme("dark");
            }
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

