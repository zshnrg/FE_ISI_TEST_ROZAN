'use client'

import { ThemeProvider} from "@/contexts/themeContext";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <ThemeProvider>
      <body className="min-h-svh">
        {children}
      </body>
    </ThemeProvider>
  );
}