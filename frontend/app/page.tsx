import Header from './components/Header';
import HomepageHero from './components/HomepageHero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Community from './components/Community';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <Header />
        <main className="flex-1">
          <HomepageHero />
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Features />
            <Testimonials />
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
