import { Target, Eye, Rocket, Globe } from 'lucide-react';

const VisionAim = () => {
  return (
    <section id="vision" className="section-padding bg-navy-deep/30">
      <div className="responsive-container px-4 max-w-[90%] sm:max-w-none">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            Our <span className="gradient-text">Vision & Aim</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Transforming how people travel by train across India with intelligent, 
            user-centric solutions that go beyond traditional booking systems.
          </p>
        </div>

        {/* Vision and Aim Cards */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16 lg:mb-20">
          {/* Vision Card */}
          <div className="glass-card p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl space-y-6 sm:space-y-8 hover:shadow-elegant transition-all duration-500 group">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-primary to-secondary rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">Our Vision</h3>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                To become India's leading intelligent train journey planner, making complex 
                multi-train routes as simple as booking a direct ticket. We envision a future 
                where every traveler can reach their destination efficiently, regardless of 
                direct connectivity.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold mb-1">Pan-India Coverage</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Connecting every corner of India with intelligent route planning</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold mb-1">Innovation Leader</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Setting new standards in travel technology and user experience</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-1 w-0 bg-gradient-primary group-hover:w-full transition-all duration-700 rounded-full"></div>
          </div>

          {/* Aim Card */}
          <div className="glass-card p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl space-y-6 sm:space-y-8 hover:shadow-elegant transition-all duration-500 group">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-accent to-emerald-glow rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">Our Aim</h3>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                To revolutionize train travel by replacing static, limited booking systems 
                with dynamic, AI-powered solutions. Our goal is to eliminate the frustration 
                of "no direct trains available" and unlock seamless connectivity across India's 
                vast railway network.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-accent rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold mb-1">Replace Legacy Systems</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Moving beyond IRCTC's limitations with modern, intelligent solutions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-glow rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold mb-1">Empower Every Traveler</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Making complex journeys accessible to all users, regardless of tech expertise</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-1 w-0 bg-gradient-to-r from-accent to-emerald-glow group-hover:w-full transition-all duration-700 rounded-full"></div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="glass-card p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-6 sm:mb-8 lg:mb-12">Making an Impact</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Cities Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Daily Searches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">85%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">4.8★</div>
              <div className="text-xs sm:text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionAim;