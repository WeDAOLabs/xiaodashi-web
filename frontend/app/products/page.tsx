
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Tools from '@/app/components/Tools';

export default function ProductsPage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
          <Tools />
        </main>
        <Footer />
      </div>
    </div>
  );
}
