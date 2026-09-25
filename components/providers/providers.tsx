"use client";

import { useState, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 5 * 60_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {/* Respect the OS reduced-motion setting across every motion component. */}
        <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </MotionConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
