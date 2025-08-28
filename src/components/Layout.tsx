import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background smooth-scroll">
      <Navigation />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Layout;