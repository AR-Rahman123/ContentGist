import React from 'react';
import { BarChart3, Lightbulb, Calendar, TrendingUp } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Lightbulb,
      title: 'Content Strategy',
      description: 'Data-driven strategies tailored to your brand and audience.'
    },
    {
      icon: BarChart3,
      title: 'Post Creation',
      description: 'Engaging visuals and copy that capture attention and drive action.'
    },
    {
      icon: Calendar,
      title: 'Scheduling & Management',
      description: 'Consistent posting across all platforms with optimal timing.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Reporting',
      description: 'Detailed analytics and insights to measure your success.'
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive social media solutions designed to amplify your brand's voice
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-blue-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;