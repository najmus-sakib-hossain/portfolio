"use client"

import { Toaster as DefaultToaster, Toaster as NewYorkToaster } from "../ui/toaster"
import { SubCategorySidebarProvider } from "../layout/sidebar/subcategory-sidebar"
import { CategorySidebarProvider } from "../layout/sidebar/category-sidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LeftSidebar } from "../layout/sidebar/left-sidebar"
import { ThemeProvider } from "../theme/theme-provider";
import { Toaster as NewYorkSonner } from "../ui/sonner"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { FontLoader } from "../theme/font-loader";
import { ThemeSync } from "../theme/theme-sync";
import { SiteHeader } from "../layout/site-header"
import { BottomBar } from "../layout/bottom-bar"
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Main } from "./main"
import { Provider as JotaiProvider } from "jotai"
import { Toaster } from "../ui/sonner";
import { Suspense } from "react";
import * as React from "react"
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { ContainerWrapper } from "../theme/wrappers";
// import { MainNavigation, MobileNavigation } from "@/app/themes/navigation";
import {
  CustomizerSidebar,
  CustomizerSidebarToggle,
} from "../theme/customizer/customizer-sidebar";

const SIDEBAR_WIDTH = "21rem";
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
                <SidebarProvider
                  defaultOpen={false}
                  // style={{
                  //   "--sidebar-width": SIDEBAR_WIDTH,
                  // }}
                >

                  <CustomizerSidebar />
                  {/* <LeftSidebar />
                  <CustomizerSidebar variant="inset" />
                  */}
                  <CategorySidebarProvider>
                    <SubCategorySidebarProvider>
                      <div
                        vaul-drawer-wrapper=""
                        className="relative h-screen w-full overflow-hidden"
                      >
                        <SiteHeader />
                        {/* <BottomBar /> */}
                        <Main>
                          {/* <Suspense></Suspense> */}
                          {children}
                          <ThemeSync />
                        </Main>
                        <NewYorkToaster />
                        <DefaultToaster />
                        <NewYorkSonner />
                      </div>
                    </SubCategorySidebarProvider>
                  </CategorySidebarProvider>
                  {/* <SidebarInset className="peer-data-[variant=inset]:peer-data-[state=collapsed]:mt-12 peer-data-[variant=inset]:peer-data-[state=expanded]:mt-12 isolate max-h-svh overflow-hidden peer-data-[variant=inset]:max-h-[calc(100svh-3.5rem)]">
                    <SiteHeader />
                    <ScrollArea className="relative z-10 flex h-full flex-col overflow-hidden">
                      <Suspense>
                        {children}
                        <ThemeSync />
                      </Suspense>
                    </ScrollArea>
                  </SidebarInset> */}
                </SidebarProvider>
              </TooltipProvider>
            </NextThemesProvider>
          </JotaiProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}

