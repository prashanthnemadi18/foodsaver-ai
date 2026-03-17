import { motion } from 'framer-motion';
import { Leaf, TrendingUp, Users, Award, Shield, Rocket, BarChart3, Home, ChefHat, Sparkles, Smartphone, Bot, Bell, Lock } from 'lucide-react';
import { AIBrainIcon, FoodPreservationIcon, AnalyticsIcon, SustainabilityIcon, SmartStorageIcon, RecipeSuggestionIcon, CommunityImpactIcon } from '../components/AIIcons';
import { AnimatedButton, AIBadge, GlassSection, AnimatedCard } from '../components/AnimatedComponents';

const HomePage = ({ onNavigate }: { onNavigate: (view: 'home' | 'register' | 'dashboard' | 'login') => void }) => {
  const features = [
    {
      icon: <AIBrainIcon className="w-12 h-12" />,
      title: "AI Predictions",
      description: "Advanced machine learning algorithms predict food longevity with 99% accuracy.",
      color: "from-emerald-400 to-cyan-500",
      tag: "Deep Learning"
    },
    {
      icon: <AnalyticsIcon className="w-12 h-12" />,
      title: "Smart Analytics",
      description: "Real-time insights into your consumption habits and waste reduction metrics.",
      color: "from-purple-500 to-pink-500",
      tag: "Real-time"
    },
    {
      icon: <RecipeSuggestionIcon className="w-12 h-12" />,
      title: "AI Chef",
      description: "Generative AI creates gourmet recipes based on your soon-to-expire inventory.",
      color: "from-amber-400 to-orange-600",
      tag: "Generative AI"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fafafa]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/30 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-200/20 rounded-full blur-[100px] animate-float-delayed"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="min-h-screen flex items-center justify-center px-4 pt-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div variants={itemVariants} className="mb-6">
              <AIBadge>Powered by Advanced Neural Networks</AIBadge>
            </motion.div>

            <motion.div 
              className="mb-10"
              variants={itemVariants}
            >
              <motion.h1 
                className="text-8xl md:text-9xl font-black mb-8 tracking-tighter"
                variants={itemVariants}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600">
                  FoodSaver
                </span>
                <span className="text-gray-900 ml-4 relative">
                  AI
                  <motion.span 
                    className="absolute -top-4 -right-8"
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-8 h-8 text-amber-400" />
                  </motion.span>
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-3xl md:text-4xl text-gray-500 font-light max-w-4xl mx-auto leading-tight"
                variants={itemVariants}
              >
                The future of <span className="text-gray-900 font-medium">sustainable living</span> is here. 
                Manage your kitchen with the intelligence of tomorrow.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
              variants={itemVariants}
            >
              <AnimatedButton 
                onClick={() => onNavigate('register')}
                variant="primary"
                className="text-xl px-10 py-5 rounded-2xl shadow-emerald-200 shadow-2xl"
              >
                Initialize AI Assistant 🚀
              </AnimatedButton>
              <AnimatedButton 
                onClick={() => onNavigate('login')}
                variant="outline"
                className="text-xl px-10 py-5 rounded-2xl backdrop-blur-md"
              >
                Member Portal 🔐
              </AnimatedButton>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
              variants={itemVariants}
              className="relative max-w-5xl mx-auto"
            >
              <GlassSection className="p-2">
                <div className="bg-gray-900/5 rounded-[2rem] p-4 border border-white/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "AI Accuracy", value: "99.4%" },
                      { label: "Waste Reduced", value: "1.2k Tons" },
                      { label: "Active Nodes", value: "50k+" },
                      { label: "Neural Uptime", value: "99.9%" }
                    ].map((stat, i) => (
                      <div key={i} className="p-6 text-left">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassSection>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <section className="py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <AnimatedCard key={index} delay={index * 0.1}>
                  <div className="mb-8 relative">
                    <div className={`absolute -inset-4 bg-gradient-to-br ${feature.color} opacity-20 blur-2xl rounded-full`} />
                    <div className="relative">{feature.icon}</div>
                  </div>
                  <AIBadge>{feature.tag}</AIBadge>
                  <h3 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{feature.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">{feature.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <motion.section 
          className="py-20 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-gray-800 mb-6">
                How It <span className="text-gradient">Works</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple steps to transform your food management
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 hidden lg:block"></div>
              
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "Add Your Items",
                    description: "Scan or manually add your food items with purchase dates",
                    icon: <Smartphone className="w-10 h-10 text-white" />
                  },
                  {
                    step: "02",
                    title: "AI Analysis",
                    description: "Our system predicts expiry dates and provides storage recommendations",
                    icon: <Bot className="w-10 h-10 text-white" />
                  },
                  {
                    step: "03",
                    title: "Smart Alerts",
                    description: "Get notified when items are about to expire with recipe suggestions",
                    icon: <Bell className="w-10 h-10 text-white" />
                  },
                  {
                    step: "04",
                    title: "Track Impact",
                    description: "Monitor your waste reduction and sustainability contributions",
                    icon: <BarChart3 className="w-10 h-10 text-white" />
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-1">
                      <div className="glass-effect rounded-2xl p-8 shadow-modern">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                            {item.step}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-lg">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="hidden lg:block">
                      <motion.div 
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.icon}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section 
          className="py-20 px-4 bg-gradient-to-r from-emerald-50 to-cyan-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-gray-800 mb-6">
                Ready to <span className="text-gradient">Save Food</span>?
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Join thousands of users who are already reducing food waste and saving money
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <AnimatedButton 
                  onClick={() => onNavigate('register')}
                  variant="primary"
                  className="text-xl px-10 py-5"
                >
                  Get Started Free <Leaf className="w-6 h-6 ml-2" />
                </AnimatedButton>
                <AnimatedButton 
                  onClick={() => onNavigate('dashboard')}
                  variant="ghost"
                  className="text-xl px-10 py-5"
                >
                  View Demo →
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;