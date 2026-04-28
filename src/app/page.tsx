import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Marquee from '@/components/Marquee';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import HowWeWork from '@/components/HowWeWork';
import WhyVeridis from '@/components/WhyVeridis';
import TechStack from '@/components/TechStack';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        {/* Services */}
        <Services />
        <Projects />
        <Testimonials />
        <HowWeWork />
        <WhyVeridis />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
