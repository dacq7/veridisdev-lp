import { setRequestLocale } from "next-intl/server";
import Navbar from '@/components/Navbar';
import FloatingCTA from '@/components/FloatingCTA';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import QuoteCalculator from '@/components/QuoteCalculator';
import Marquee from '@/components/Marquee';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import HowWeWork from '@/components/HowWeWork';
import WhyVeridis from '@/components/WhyVeridis';
import TechStack from '@/components/TechStack';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

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
        <Testimonials />
        <HowWeWork />
        <WhyVeridis />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
