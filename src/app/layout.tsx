import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import TouchRipple from "@/components/TouchRipple";

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
