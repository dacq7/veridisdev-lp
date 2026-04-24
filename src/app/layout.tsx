import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veridis Dev — Software you can trust",
  description:
    "Desarrollamos software a medida con IA: landing pages, apps web, ecommerce y apps móviles. Proyectos en producción con usuarios reales. Medellín, Colombia.",
  metadataBase: new URL("https://veridisdev.com"),
  openGraph: {
    title: "Veridis Dev — Software you can trust",
    description:
      "Desarrollamos software a medida con IA: landing pages, apps web, ecommerce y apps móviles. Proyectos en producción con usuarios reales.",
    type: "website",
    locale: "es_CO",
    siteName: "Veridis Dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veridis Dev — Software you can trust",
    description:
      "Desarrollamos software a medida con IA: landing pages, apps web, ecommerce y apps móviles.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${syne.variable}`}
    >
      <body className="bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
