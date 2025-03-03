import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing } from '@/i18n/routing';

import { firaGo } from "@/lib/fonts"

import "@/app/styles/globals.css"

export const metadata: Metadata = {
  title: "Invasive Speies of Georgia",
  description: "Open source databade",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {

  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${firaGo.variable}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
