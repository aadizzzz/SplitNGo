import { Search, Route, Ticket, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: Search,
      title: 'Enter Your Journey',
      description: 'Simply input your departure and destination stations along with your preferred travel dates.',
      color: 'primary'
    },
    {
      step: '02',
      icon: Route,
      title: 'AI Finds Best Routes',
      description: 'Our intelligent system analyzes thousands of combinations to find optimal split journeys.',
      color: 'secondary'
    },
    {
      step: '03',
      icon: Ticket,
      title: 'Book Seamlessly',
      description: 'Select your preferred option and book all tickets in one go with smart seat allocation.',
      color: 'accent'
    }
  ];

  return (
    <section id="how-it-works" className="section-padding">
      <div className="responsive-container px-4 max-w-[90%] sm:max-w-none">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            How <span className="gradient-text">SplitNGo</span> Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Three simple steps to unlock intelligent train journey planning. 
            Our advanced algorithms do the heavy lifting while you focus on your travel.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20 lg:items-center"
            >
              {/* Visual - Always first on mobile */}
              <div className={`relative order-1 lg:order-${index % 2 === 1 ? '2' : '1'}`}>
                <div className="glass-card p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl text-center">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 lg:mb-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-${step.color} to-${step.color}/60 flex items-center justify-center`}>
                    <step.icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-muted-foreground/20">
                    {step.step}
                  </div>
                </div>
                
                {/* Decorative elements - Hidden on mobile */}
                <div className={`hidden sm:block absolute -top-3 sm:-top-6 -right-3 sm:-right-6 w-12 sm:w-20 h-12 sm:h-20 bg-${step.color}/20 rounded-xl sm:rounded-2xl blur-xl`}></div>
                <div className={`hidden sm:block absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 w-16 sm:w-24 h-16 sm:h-24 bg-${step.color}/10 rounded-full blur-2xl`}></div>
              </div>

              {/* Content */}
              <div className={`space-y-6 sm:space-y-8 order-2 lg:order-${index % 2 === 1 ? '1' : '2'} text-center lg:text-left`}>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-${step.color} to-${step.color}/60 bg-clip-text text-transparent`}>
                    {step.step}
                  </div>
                  <div className="hidden sm:block h-1 flex-1 bg-gradient-to-r from-primary/30 to-transparent"></div>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold">{step.title}</h3>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Additional features for this step */}
                <div className="space-y-3 text-left">
                  {index === 0 && (
                    <>
                      <div className="flex items-start space-x-3 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Smart autocomplete for station names</span>
                      </div>
                      <div className="flex items-start space-x-3 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Flexible date selection with calendar view</span>
                      </div>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <div className="flex items-start space-x-3 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Real-time availability checking</span>
                      </div>
                      <div className="flex items-start space-x-3 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Multiple route options with preferences</span>
                      </div>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <div className="flex items-start space-x-3 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Secure payment gateway integration</span>
                      </div>
                      <div className="flex items-start space-x-3 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Instant ticket confirmation and e-tickets</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-12 sm:mt-16 lg:mt-20">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto px-4 sm:px-0">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full"></div>
                {index < steps.length - 1 && (
                  <div className="w-12 sm:w-20 h-1 bg-gradient-to-r from-primary to-secondary ml-2 sm:ml-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;