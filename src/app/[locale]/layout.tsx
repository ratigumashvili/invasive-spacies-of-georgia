import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { firaGo } from "@/lib/fonts"

import { Navbar } from "@/app/[locale]/_components/navbar"
import { Footer } from '@/app/[locale]/_components/footer/footer';

import { LocaleType, supportedLocales } from '@/types/language-types';

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
          <div className='h-full flex flex-col mx-auto'>
            <Navbar locale={locale as "en" | "ka"} />
            <main className='w-full max-w-7xl mx-auto px-4 sm:px-8'>{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
