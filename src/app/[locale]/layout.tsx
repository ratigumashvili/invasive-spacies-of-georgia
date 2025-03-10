import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { firaGo, bpgNino, arial } from "@/lib/fonts"

import { Navbar } from "@/app/[locale]/_components/navbar"
import { Footer } from '@/app/[locale]/_components/footer';

import { LocaleType, supportedLocales } from '@/types/language-types';

import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/styles'
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
    <html lang={locale}>
      <body className={`${firaGo.variable} ${bpgNino.variable} ${arial.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <div className='h-full flex flex-col mx-auto'>
            <Navbar locale={locale as "en" | "ka"} />
            <main>{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
