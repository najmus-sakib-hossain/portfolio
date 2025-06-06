import "@/styles/globals.css"
import { SiteHeader } from "@/components/portfolio/site-header"
import { initializeLocale } from "@/lib/utils";
import { Locale } from "@/i18n-config";

// Initialize locale data on the client side
if (typeof window !== 'undefined') {
  initializeLocale();
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
                <div className="relative w-full flex items-center justify-center flex-col">
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                </div>
        </>
    )
}

export function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <>
      {/* Set window.__LOCALE_CACHE__ here if needed */}
      {children}
    </>
  );
}
