"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()
  return (
    <div className="mr-4 hidden md:flex">
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Home
        </Link>
        <Link
          href="/contents"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/contents")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Contents
        </Link>
        <Link
          href="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/about")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          About
        </Link>
      </nav>
    </div>
  )
}
