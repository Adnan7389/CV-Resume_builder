import React from 'react';
import { FileText, GraduationCap, Star, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import animationData from '../assets/education-animation.json';

const HomePage = ({ onGetStarted }) => {
  // Animation variants for scroll reveal
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 font-sans">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-green-700" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Smart CV & Resume Generator
              </h1>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              For Ethiopian Students
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Build Your <span className="text-green-700">Professional</span> Resume or CV Instantly
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Empower your career journey with a tailored resume or CV designed for Ethiopian university students and graduates using AI.
            </p>
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-green-700 hover:bg-green-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </div>
          <div className="hidden lg:block">
            <Lottie animationData={animationData} loop={true} className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10 tracking-tight">
          Why Choose Us?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: FileText,
              title: 'AI-Powered Content',
              description: 'Our AI crafts professional, structured content that highlights your academic and professional strengths.',
            },
            {
              icon: Star,
              title: 'Professional Templates',
              description: 'Select from modern templates tailored for the Ethiopian job market to impress employers.',
            },
            {
              icon: Users,
              title: 'Student-Focused',
              description: 'Designed for Ethiopian students, emphasizing academic achievements and career potential.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-6 text-center transition-all duration-300"
            >
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-green-700" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10 tracking-tight">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'Enter Information',
                description: 'Fill in your academic and personal details.',
                icon: FileText,
                color: 'bg-green-700',
              },
              {
                step: 2,
                title: 'Choose Format',
                description: 'Select CV or Resume and pick a template.',
                icon: Star,
                color: 'bg-yellow-600',
              },
              {
                step: 3,
                title: 'AI Generation',
                description: 'Our AI creates professional content.',
                icon: GraduationCap,
                color: 'bg-red-600',
              },
              {
                step: 4,
                title: 'Download PDF',
                description: 'Export your polished document.',
                icon: CheckCircle,
                color: 'bg-blue-600',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl shadow-md p-6 text-center transition-all duration-300"
              >
                <div
                  className={`${step.color} text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold`}
                >
                  {step.step}
                </div>
                <div className="mb-4">
                  <step.icon className="h-8 w-8 text-gray-700 mx-auto" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonial Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10 tracking-tight">
          What Students Say
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              name: 'Abebe Kebede',
              role: 'Recent Graduate, Addis Ababa University',
              quote:
                'This platform helped me create a professional resume that landed me my first job. The AI made it so easy to highlight my skills!',
            },
            {
              name: 'Abdi Keno',
              role: 'Computer Science Student, Haramaya University',
              quote:
                'The templates are perfect for Ethiopian employers, and the process was so simple. I got my CV done in minutes!',
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-sm sm:text-base text-gray-600 italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-green-700">{testimonial.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-gray-900 text-white py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            © 2025 Smart CV & Resume Generator. Empowering Ethiopian students to achieve their career goals.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;