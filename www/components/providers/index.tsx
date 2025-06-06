"use client"

import { Toaster as DefaultToaster, Toaster as NewYorkToaster } from "../ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "../theme/theme-provider";
import { Toaster as NewYorkSonner } from "../ui/sonner"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeSync } from "../theme/theme-sync";
import { SiteHeader } from "@/components/portfolio/site-header"
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider as JotaiProvider } from "jotai"
import * as React from "react"
import { TooltipProvider } from "../ui/tooltip";
import { ContainerWrapper } from "../theme/wrappers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JotaiProvider>
            <NextThemesProvider {...props}>
              <TooltipProvider>
                <SiteHeader />

                {children}
                <ThemeSync />
                <NewYorkToaster />
                <DefaultToaster />
                <NewYorkSonner />
              </TooltipProvider>
            </NextThemesProvider>
          </JotaiProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}

