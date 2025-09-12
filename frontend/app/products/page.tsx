
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Tools from '@/app/components/Tools';

export default function ProductsPage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tools />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
