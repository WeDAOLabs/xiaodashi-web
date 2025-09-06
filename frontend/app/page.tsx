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
        <main className="flex-1">
          <Hero />
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Features />
            <Showcase />
            <Testimonials />
          </div>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <Pricing />
          </div>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <Community />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
