import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import WhyVeridis from '@/components/WhyVeridis';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Services */}
        <Services />
        <Projects />
        <WhyVeridis />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
