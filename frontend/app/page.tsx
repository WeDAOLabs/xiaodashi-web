import Community from './components/Community';
import Features from './components/Features';
import Footer from './components/Footer';
import GrowthWisdomSection from './components/GrowthWisdomSection';
import Header from './components/Header';
import HomepageHero from './components/HomepageHero';
import Testimonials from './components/Testimonials';
import BusinessTransformation from './components/business-transformation/BusinessTransformation';

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <Header />
        <main className="flex-1">
          <HomepageHero />
         
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <GrowthWisdomSection />
            <Features />
            <Testimonials />
            <BusinessTransformation />
            <Community />
          </div>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            {/* Spacer div for consistent spacing before footer */}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}