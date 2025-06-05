"use client"

import { useCategorySidebar } from "../layout/sidebar/category-sidebar"
import { useSubCategorySidebar } from "../layout/sidebar/subcategory-sidebar"
import { cn } from "../../lib/utils"

interface MainProps {
  children: React.ReactNode
}

export function Main({ children }: MainProps) {
  const { statecategorysidebar } = useCategorySidebar()
  const { statesubcategorysidebar } = useSubCategorySidebar()

  return (
    <div
      className={cn(
        "bg-background no-scrollbar flex h-screen w-full flex-col overflow-y-auto transition-all duration-200 ease-linear p-2 pt-14 pb-4 md:pb-0",
        statecategorysidebar === "expanded" && "pr-64",
        statesubcategorysidebar === "expanded" && "pr-64"
      )}
    >
      {children}
    </div>
  )
}
