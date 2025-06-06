import "@/styles/globals.css"
import { SiteHeader } from "@/components/portfolio/site-header"
import { initializeLocale } from "@/lib/utils";
import { Locale } from "@/i18n-config";
// import { useEffect } from "react";

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
  // This script tag will run on the client side to initialize localization data
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const locale = '${lang}';
                if (typeof window !== 'undefined' && !window.__LOCALE_INITIALIZED__) {
                  window.__LOCALE_INITIALIZED__ = true;
                  const script = document.createElement('script');
                  script.src = '/locales/${lang}.json';
                  script.onload = function() {
                    if (!window.__LOCALE_CACHE__) window.__LOCALE_CACHE__ = {};
                    window.__LOCALE_CACHE__['${lang}'] = window.__LOCALE_DATA__ || {};
                    delete window.__LOCALE_DATA__;
                  };
                  document.head.appendChild(script);
                }
              } catch (e) {
                console.error('Failed to initialize locale:', e);
              }
            })();
          `,
        }}
      />
      {children}
    </>
  );
}
