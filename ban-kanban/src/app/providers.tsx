'use client'

import { RevalidateProvider } from "@/contexts/revalidateContext";
import { ThemeProvider } from "@/contexts/themeContext";
import { ToastProvider } from "@/contexts/toastContext";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <ThemeProvider>
      <RevalidateProvider>
        <body className="min-h-svh">
          <ToastProvider>
            {children}
          </ToastProvider>
        </body>
      </RevalidateProvider>
    </ThemeProvider>
  );
}