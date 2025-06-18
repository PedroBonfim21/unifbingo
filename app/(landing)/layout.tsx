import { Footer } from "./_components/footer";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-purple-900 text-white">
      <main className="flex-1 flex items-center justify-center bg-purple-900">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;