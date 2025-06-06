import "@/styles/globals.css"
import { SiteHeader } from "@/components/portfolio/site-header"

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
                <div className="w-full flex items-center justify-center flex-col">
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                </div>
        </>
    )
}
