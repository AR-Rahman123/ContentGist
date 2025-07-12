import React, { useState } from 'react';
import { ExternalLink, X, TrendingUp, Users, Eye, Heart } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  result: string;
  gradient: string;
  description: string;
  metrics: {
    followers: string;
    engagement: string;
    reach: string;
    conversions: string;
  };
  services: string[];
  duration: string;
  industry: string;
}

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const projects: Project[] = [
    {
      id: 1,
      title: 'Tech Startup Growth',
      category: 'B2B SaaS',
      result: '400% follower increase',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Transformed a B2B SaaS startup from 500 to 2,500 followers with strategic LinkedIn and Twitter content focusing on thought leadership and industry insights.',
      metrics: {
        followers: '2,500',
        engagement: '8.5%',
        reach: '150K',
        conversions: '45'
      },
      services: ['Content Strategy', 'LinkedIn Management', 'Twitter Growth', 'Lead Generation'],
      duration: '6 months',
      industry: 'Technology'
    },
    {
      id: 2,
      title: 'E-commerce Brand',
      category: 'Retail',
      result: '250% engagement boost',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Elevated an online fashion retailer\'s Instagram presence with visually stunning product photography and user-generated content campaigns.',
      metrics: {
        followers: '15K',
        engagement: '12.3%',
        reach: '500K',
        conversions: '180'
      },
      services: ['Instagram Management', 'Visual Content Creation', 'Influencer Partnerships', 'UGC Campaigns'],
      duration: '8 months',
      industry: 'Fashion & Retail'
    },
    {
      id: 3,
      title: 'Restaurant Chain',
      category: 'Food & Beverage',
      result: '300% reach expansion',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Boosted a local restaurant chain\'s social presence with mouth-watering food photography and community engagement strategies.',
      metrics: {
        followers: '8.5K',
        engagement: '15.7%',
        reach: '200K',
        conversions: '95'
      },
      services: ['Food Photography', 'Community Management', 'Local SEO', 'Event Promotion'],
      duration: '4 months',
      industry: 'Food & Beverage'
    },
    {
      id: 4,
      title: 'Fitness Platform',
      category: 'Health & Wellness',
      result: '500% conversion rate',
      gradient: 'from-green-500 to-green-600',
      description: 'Developed a comprehensive social media strategy for a fitness app, focusing on motivational content and success stories.',
      metrics: {
        followers: '25K',
        engagement: '18.2%',
        reach: '800K',
        conversions: '320'
      },
      services: ['Multi-platform Strategy', 'Video Content', 'Community Building', 'App Promotion'],
      duration: '10 months',
      industry: 'Health & Fitness'
    },
    {
      id: 5,
      title: 'Real Estate Agency',
      category: 'Property',
      result: '200% lead generation',
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Enhanced a real estate agency\'s digital presence with property showcases and market insights, driving qualified leads.',
      metrics: {
        followers: '5.2K',
        engagement: '9.8%',
        reach: '120K',
        conversions: '65'
      },
      services: ['Property Photography', 'Market Analysis Content', 'Lead Generation', 'Client Testimonials'],
      duration: '7 months',
      industry: 'Real Estate'
    },
    {
      id: 6,
      title: 'Fashion Brand',
      category: 'Lifestyle',
      result: '350% brand awareness',
      gradient: 'from-pink-500 to-pink-600',
      description: 'Built a luxury fashion brand\'s Instagram presence with high-end photography and strategic influencer collaborations.',
      metrics: {
        followers: '35K',
        engagement: '14.5%',
        reach: '1.2M',
        conversions: '250'
      },
      services: ['Brand Photography', 'Influencer Marketing', 'Luxury Positioning', 'Fashion Shows Coverage'],
      duration: '12 months',
      industry: 'Luxury Fashion'
    }
  ];

  const categories = ['All', 'B2B SaaS', 'Retail', 'Food & Beverage', 'Health & Wellness', 'Property', 'Lifestyle'];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Work
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Success stories from brands we've helped grow their social media presence
            </p>
          </div>
          
          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => openModal(project)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                      {project.category}
                    </span>
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${project.gradient} mr-3`}></div>
                    <span className="text-slate-300 font-medium">
                      {project.result}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className={`bg-gradient-to-r ${selectedProject.gradient} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium opacity-90 uppercase tracking-wide">
                  {selectedProject.category}
                </span>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-3xl font-bold mb-2">{selectedProject.title}</h2>
              <p className="text-lg opacity-90">{selectedProject.result}</p>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Project Details */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Project Overview</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {selectedProject.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Industry</h4>
                      <p className="text-slate-600">{selectedProject.industry}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Duration</h4>
                      <p className="text-slate-600">{selectedProject.duration}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Services Provided</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.services.map((service, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Metrics */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Key Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-slate-600">Followers</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{selectedProject.metrics.followers}</p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Heart className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-slate-600">Engagement</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{selectedProject.metrics.engagement}</p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Eye className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-slate-600">Reach</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{selectedProject.metrics.reach}</p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-slate-600">Conversions</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{selectedProject.metrics.conversions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Portfolio;