import { 
  Zap, 
  Clock, 
  Target, 
  Settings,
  Route,
  Users,
  Shield,
  Smartphone
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Route,
      title: 'Dynamic Route Planning',
      description: 'AI-powered algorithms find optimal multi-train journeys when direct routes aren\'t available.',
      color: 'text-primary'
    },
    {
      icon: Clock,
      title: 'Layover Optimization',
      description: 'Smart scheduling that minimizes waiting times while ensuring comfortable connections.',
      color: 'text-secondary'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Live train status, platform changes, and delay notifications to keep you informed.',
      color: 'text-accent'
    },
    {
      icon: Target,
      title: 'Preference Matching',
      description: 'Customize your journey based on budget, comfort, time preferences, and travel class.',
      color: 'text-emerald-glow'
    },
    {
      icon: Users,
      title: 'Smart Seat Allocation',
      description: 'Intelligent booking system that optimizes seat selection across multiple trains.',
      color: 'text-sky-glow'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Bank-grade security with encrypted transactions and protected personal data.',
      color: 'text-teal-glow'
    },
    {
      icon: Settings,
      title: 'Advanced Filters',
      description: 'Filter by departure times, train types, stations, and journey duration preferences.',
      color: 'text-primary'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Seamless experience across all devices with offline ticket access and notifications.',
      color: 'text-secondary'
    }
  ];

  return (
    <section id="about" className="section-padding bg-navy-deep/50">
      <div className="responsive-container px-4 max-w-[90%] sm:max-w-none">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            Why Choose <span className="gradient-text">SplitNGo</span>?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Revolutionary train journey planning that goes beyond traditional booking systems. 
            Experience the future of intelligent travel planning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 sm:mb-6">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl ${feature.color.replace('text-', 'bg-')}/20 flex items-center justify-center mb-3 sm:mb-4 mx-auto sm:mx-0`}>
                  <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center sm:text-left">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center sm:text-left">
                  {feature.description}
                </p>
              </div>
              
              {/* Hover effect line - Hidden on mobile */}
              <div className="hidden sm:block h-1 w-0 bg-gradient-primary group-hover:w-full transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Trusted by thousands of travelers across India</span>
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;