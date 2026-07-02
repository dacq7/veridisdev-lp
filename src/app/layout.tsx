import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import TouchRipple from "@/components/TouchRipple";
import PlausibleScript from "@/components/PlausibleScript";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";
import { getLocale } from "next-intl/server";

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
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — Software you can trust`,
  },
  description:
    "Desarrollamos software a medida con IA: landing pages, apps web, ecommerce y apps móviles. Proyectos en producción con usuarios reales. Medellín, Colombia.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `${SITE_NAME} — Software you can trust`,
    description:
      "Desarrollamos software a medida con IA: landing pages, apps web, ecommerce y apps móviles. Proyectos en producción con usuarios reales.",
    type: "website",
    locale: "es_CO",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Software you can trust`,
    description:
      "Desarrollamos software a medida con IA: landing pages, apps web, ecommerce y apps móviles.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo/veridis-icon.svg',
    shortcut: '/logo/veridis-icon.svg',
    apple: '/logo/veridis-icon.svg',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/veridis-icon.svg`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'team@veridisdev.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Medellín',
    addressCountry: 'CO',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${dmSans.variable} ${syne.variable}`}>
      <head>
        <PlausibleScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-background text-white antialiased">
        <CustomCursor />
        <TouchRipple />
        {/* Film grain overlay — fixed, covers every section, pointer-events none */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: 0.055,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="page-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#page-grain)" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
}
