import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { firaGo } from "@/lib/fonts"

import { Header } from '@/app/[locale]/_components/header/header';

import { LocaleType, supportedLocales } from '@/types/LanguageTypes';

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

  if (!supportedLocales.includes(locale as LocaleType)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${firaGo.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale as "en" | "ka"} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
