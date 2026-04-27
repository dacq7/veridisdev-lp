import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Projects from '@/components/Projects';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Services */}
        <Services />
        <Projects />
        {/* WhyVeridis */}
        {/* TechStack */}
        {/* Contact */}
        {/* Footer */}
      </main>
    </>
  );
}
