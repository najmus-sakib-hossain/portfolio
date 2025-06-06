import { i18n, type Locale } from "@/i18n-config";
import { LoadTheme } from "@/components/theme/load-theme";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tanvir Hasan Bijoy",
    template: "%s | Bijoy",
  },
  description: "Portfolio of Tanvir Hasan Bijoy.",
  keywords: [
    "friday",
    "manfromexistence",
    "multiverse",
    "aladdin",
    "better",
    "dx",
    "manfromexistence-auth",
    "manfromexistence-ui",
    "manfromexistence-ux",
  ],
  authors: [
    {
      name: "manfromexistence",
      url: "https://manfromexistence.vercel.app",
    },
  ],
  creator: "manfromexistence",
  metadataBase: new URL("https://tanvir-hasan-bijoy.vercel.app"),
  openGraph: {
    title: "Bijoy",
    description: "Tanvir Hasan Bijoy's Portfolio.",
  },
  generator: "Next.js",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const { children } = props;

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head>
        <LoadTheme />
      </head>
      <body className={cn(`antialiased w-full min-h-screen relative`)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

