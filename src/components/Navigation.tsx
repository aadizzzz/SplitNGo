import { useState, useEffect } from 'react';
import { Menu, X, Train, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Train className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">SplitNGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-colors duration-300 font-medium ${
                  isActive(item.href)
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <Link to="/profile">
                    <Button variant="outline" className="flex items-center space-x-2 btn-animate">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="outline" className="btn-animate">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button className="btn-hero btn-animate">
                        Plan Your Journey
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 touch-target btn-animate"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                  }}
                  className={`transition-colors duration-300 font-medium text-left py-2 px-1 rounded-lg touch-target ${
                    isActive(item.href)
                      ? 'text-primary font-semibold bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Buttons */}
              {!loading && (
                <div className="space-y-3 mt-6 pt-4 border-t border-white/10">
                  {user ? (
                    <Link to="/profile" onClick={() => {
                      setIsMenuOpen(false);
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                    }}>
                      <Button variant="outline" className="w-full flex items-center justify-center space-x-2 btn-animate touch-target">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth" onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                      }}>
                        <Button variant="outline" className="w-full btn-animate touch-target">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth" onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                      }}>
                        <Button className="btn-hero w-full btn-animate touch-target">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;