import React from 'react';
import { Target, Users, Zap, Award } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Target,
      title: 'Data-Driven Approach',
      description: 'Every decision backed by analytics and performance metrics'
    },
    {
      icon: Users,
      title: 'Creative Excellence',
      description: 'Award-winning content that stands out in crowded feeds'
    },
    {
      icon: Zap,
      title: 'Seamless Execution',
      description: 'Streamlined processes that deliver consistent results'
    },
    {
      icon: Award,
      title: 'ROI Focused',
      description: 'Measurable growth that impacts your bottom line'
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We combine strategic thinking with creative execution to deliver social media success that drives real business growth
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;