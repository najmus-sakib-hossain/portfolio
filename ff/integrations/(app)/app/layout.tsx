import { LoadTheme } from '@/components/theme/load-theme';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '../../www/i18n';

export const metadata: Metadata = {
  title: {
    default: 'Friday',
    template: '%s | Friday',
  },
  description: 'Your AI Friend.',
  keywords: [
    'friday',
    'manfromexistence',
    'multiverse',
    'aladdin',
    'better',
    'dx',
    'manfromexistence-auth',
    'manfromexistence-ui',
    'manfromexistence-ux',
  ],
  authors: [
    {
      name: 'manfromexistence',
      url: 'https://manfromexistence.vercel.app',
    },
  ],
  creator: 'manfromexistence',
  metadataBase: new URL('https://themux.vercel.app'),
  openGraph: {
    title: 'Friday | More than just your AI assistant',
    description: 'Your AI Friend.',
  },
  generator: 'Next.js',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Validate locale
  if (!locales.includes(locale as any)) notFound();

  let messages;
  try {
    messages = (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <LoadTheme />
      </head>
      <body className={cn(`antialiased`)}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}