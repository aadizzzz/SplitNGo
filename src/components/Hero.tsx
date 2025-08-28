import { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-railway.jpg';
import SearchForm, { SearchData } from './SearchForm';
import LoadingTransition from './LoadingTransition';

const Hero = () => {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    setShowSearchForm(true);
  };

  const handleSearchSubmit = (searchData: SearchData) => {
    setShowLoading(true);
  };

  return (
    <section id="hero" className="section-padding pt-20 sm:pt-32 min-h-screen bg-gradient-hero">
      <div className="responsive-container px-4 max-w-[90%] sm:max-w-none">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Find the{' '}
                <span className="gradient-text">Smartest</span>{' '}
                Train Route
              </h1>
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-muted-foreground font-light">
                Even When No Direct Trains Exist
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                SplitNGo finds the best split, layover, or multi-train journey tailored to your needs. 
                Our intelligent system analyzes thousands of route combinations to get you there efficiently.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                onClick={handleSearchClick}
                className="btn-hero group w-full sm:w-auto"
              >
                {showSearchForm ? 'Plan Your Journey' : 'Search Trains'}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => scrollToSection('#how-it-works')}
                variant="outline"
                className="btn-secondary group w-full sm:w-auto"
              >
                <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                See How It Works
              </Button>
            </div>

            {/* Search Form */}
            <SearchForm 
              isVisible={showSearchForm} 
              onSubmit={handleSearchSubmit}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">50K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Routes Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">95%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">24/7</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Real-time Updates</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-elegant">
              <img 
                src={heroImage} 
                alt="Smart Railway Network Visualization"
                className="w-full h-48 sm:h-64 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20"></div>
            </div>
            
            {/* Floating Elements - Hidden on mobile */}
            <div className="hidden sm:block absolute -top-6 -right-6 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-primary rounded-2xl opacity-80 blur-xl animate-pulse"></div>
            <div className="hidden sm:block absolute -bottom-6 -left-6 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-r from-secondary to-accent rounded-full opacity-60 blur-2xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Loading Transition */}
      <LoadingTransition 
        isVisible={showLoading} 
        onComplete={() => setShowLoading(false)}
      />
    </section>
  );
};

export default Hero;