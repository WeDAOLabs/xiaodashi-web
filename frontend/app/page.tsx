import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Showcase from './components/Showcase';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Community from './components/Community';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
          <Hero />
          <Features />
          <Showcase />
          <Pricing />
          <Testimonials />
          <Community />
        </main>
        <Footer />
      </div>
    </div>
  );
}