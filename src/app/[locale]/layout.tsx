import type { ReactNode } from "react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/route";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>; // Atualizado para Promise
}

export const metadata = {
  title: "DEᐱ | Portfolio",
  icons: {
    icon: '/favicon.ico',
  },
  favicon: '/favicon.ico',
  description: "An impressive portfolio showcasing full stack development skills",
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "pt")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
