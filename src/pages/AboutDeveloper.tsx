import React from 'react';
import { motion } from 'framer-motion';
import { Code, Coffee, Brain, Rocket, Github, Linkedin, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AboutDeveloper = () => {
  const skills = [
    { name: 'Python', level: 90 },
    { name: 'Java', level: 85 },
    { name: 'React.js', level: 95 },
    { name: 'Node.js', level: 88 },
    { name: 'MongoDB', level: 80 },
    { name: 'MySQL', level: 82 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Code className="w-16 h-16 text-primary-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
              Meet the Developer
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground px-4 sm:px-0">
              Passionate about solving real-world problems through code
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card p-6 sm:p-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Hi, I'm Aditya Dhiman</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                      <p>
                        This project is built by a passionate MCA student who used AI as a bridge between ideas and implementation. 
                        With just foundational coding knowledge, I learned to tweak, modify, and control code to bring life to real-world ideas. 
                        SplitNGo is the result of creativity backed by curiosity—and a willingness to collaborate with intelligent tools like AI.
                      </p>
                      <p>
                        AI tools have been invaluable—not as a replacement for learning, but as an accelerator. They've helped me understand 
                        complex patterns, debug efficiently, and focus on problem-solving rather than syntax struggles. My approach combines 
                        human creativity with AI assistance to build meaningful solutions.
                      </p>
                      <p>
                        SplitNGo is the result of that approach—a smart, dynamic system that goes beyond ticket booking to suggest optimized, 
                        real-world train routes, even in tricky cases. The idea emerged from my observation of limitations in traditional railway 
                        booking systems and my desire to build something that could analyze real-time routes and help users make faster, smarter travel decisions.
                      </p>
                      <p>
                        I hope this project inspires others who feel limited by traditional learning paths to explore how curiosity and technology 
                        can make anything possible. Technology isn't just a tool for me—it's a bridge to transform everyday challenges into 
                        user-friendly digital solutions, one line of code at a time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Technical Skills</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-background/30 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Project Inspiration */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Coffee className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Project Inspiration</h3>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  SplitNGo represents my vision of intelligent transportation technology. Traditional booking systems often 
                  leave travelers stranded when direct routes aren't available, but I believe technology can bridge those gaps.
                </p>
                <p>
                  This project showcases advanced route-finding algorithms, real-time data processing, and intuitive user 
                  experience design—all working together to make travel planning smarter and more accessible.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card p-6 sm:p-8 text-center">
              <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-lg mx-auto">
                <Button variant="outline" size="lg" className="hover-scale flex-1 sm:flex-none">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" size="lg" className="hover-scale flex-1 sm:flex-none">
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="lg" className="hover-scale flex-1 sm:flex-none">
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutDeveloper;