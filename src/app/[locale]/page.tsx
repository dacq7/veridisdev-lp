import { setRequestLocale } from "next-intl/server";
import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/site-config';
import Navbar from '@/components/Navbar';
import FloatingCTA from '@/components/FloatingCTA';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import QuoteCalculator from '@/components/QuoteCalculator';
import Marquee from '@/components/Marquee';
import Projects from '@/components/Projects';
import TrackRecord from '@/components/TrackRecord';
import HowWeWork from '@/components/HowWeWork';
import WhyVeridis from '@/components/WhyVeridis';
import TechStack from '@/components/TechStack';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BlogPreview from '@/components/BlogPreview';
import AgentProcess from '@/components/AgentProcess';

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const canonicalUrl = `${SITE_URL}/${locale}`;
  const ogParams = new URLSearchParams({
    title: 'Veridis Dev',
    subtitle: isEs ? 'Software a medida con IA' : 'Custom software with AI',
  });
  const ogImageUrl = `${SITE_URL}/api/og?${ogParams.toString()}`;

  return {
    title: { absolute: `${SITE_NAME} — Software you can trust` },
    description: isEs
      ? 'Desarrollamos software a medida con IA: landing pages, apps web, ecommerce y apps móviles. Proyectos en producción con usuarios reales. Medellín, Colombia.'
      : 'We build custom software with AI: landing pages, web apps, ecommerce and mobile apps. Projects in production with real users. Medellín, Colombia.',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: `${SITE_NAME} — Software you can trust`,
      description: isEs
        ? 'Desarrollamos software a medida con IA. Proyectos en producción con usuarios reales.'
        : 'We build custom software with AI. Projects in production with real users.',
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: isEs ? 'es_CO' : 'en_US',
      alternateLocale: isEs ? 'en_US' : 'es_CO',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — Software you can trust`,
      description: isEs
        ? 'Desarrollamos software a medida con IA.'
        : 'We build custom software with AI.',
      images: [ogImageUrl],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        {/* Services */}
        <Services />
        <QuoteCalculator />
        <Projects />
        <BlogPreview locale={locale as 'es' | 'en'} />
        <TrackRecord />
        <HowWeWork />
        <WhyVeridis />
        <TechStack />
        <About />
        <AgentProcess locale={locale as 'es' | 'en'} />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
