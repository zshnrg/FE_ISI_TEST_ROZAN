'use client'

import { ThemeProvider } from "@/contexts/themeContext";
import { ToastProvider } from "@/contexts/toastContext";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <ThemeProvider>
      <body className="min-h-svh">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </ThemeProvider>
  );
}