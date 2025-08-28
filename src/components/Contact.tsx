import { useState } from 'react';
import { Send, Mail, Phone, MapPin, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import emailjs from 'emailjs-com';
emailjs.init('4Boa5PkqzEPwV1uOY');

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.send(
      'service_rnpqrss',
      'template_qyhp66a',
      {
        from_name: formData.name,
        from_email: formData.email, // this is the sender's email, used as a variable in the template
        subject: formData.subject,
        message: formData.message,
      }
    )
    .then(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, (error) => {
      console.log(error);
      toast({
        title: "Error!",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'aadizz@icloud.com',
      subtitle: 'We respond within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 89607 73070',
      subtitle: 'Available 9 AM - 6 PM IST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Department of Computer Application',
      subtitle: 'CSJM University, Kanpur, India'
    }
  ];

  const faqItems = [
    {
      question: "How does the split journey algorithm work?",
      answer: "We apply BFS/A* graph search on train route maps to find alternate ways to reach your destination via seat splits or layovers, optimizing for time and convenience."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use encrypted gateways and don't store your payment credentials. All transactions are processed through secure, industry-standard payment processors."
    },
    {
      question: "Can I cancel split journey tickets?",
      answer: "Yes, each leg of your journey can be canceled individually, based on IRCTC policy. You'll receive refunds according to the cancellation terms for each segment."
    },
    {
      question: "Do you support international routes?",
      answer: "Not yet — but it's on our roadmap. We're currently focused on Indian railways but plan to expand to international routes in the future."
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <section id="contact" className="section-padding bg-navy-deep/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 sm:w-40 h-20 sm:h-40 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-30 sm:w-60 h-30 sm:h-60 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="responsive-container px-4 max-w-[90%] sm:max-w-none relative">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Have questions about SplitNGo? Want to provide feedback or suggestions? 
            We'd love to hear from you. Let's build the future of train travel together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center lg:text-left">Let's Connect</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center lg:text-left">
                Whether you're a traveler with feedback, a partner interested in collaboration, 
                or just curious about our technology, we're here to help.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold mb-1">{info.title}</h4>
                    <p className="text-sm sm:text-base text-foreground font-medium">{info.content}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{info.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions - Interactive FAQ */}
            <div className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl">
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center justify-center lg:justify-start">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
                Quick Questions?
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-white/10 last:border-b-0 pb-2 sm:pb-3 last:pb-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left flex items-start justify-between p-2 -m-2 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                    >
                      <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors pr-2 leading-relaxed">
                        {item.question}
                      </span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="mt-2 pl-2 animate-fade-in">
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="glass-card p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full bg-background/50 border-white/20 focus:border-primary text-sm sm:text-base py-3 px-4"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full bg-background/50 border-white/20 focus:border-primary text-sm sm:text-base py-3 px-4"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What would you like to discuss?"
                    required
                    className="w-full bg-background/50 border-white/20 focus:border-primary text-sm sm:text-base py-3 px-4"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows={4}
                    className="w-full bg-background/50 border-white/20 focus:border-primary resize-none text-sm sm:text-base py-3 px-4 min-h-[120px] sm:min-h-[150px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-hero w-full group py-3 px-6 rounded-2xl text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
