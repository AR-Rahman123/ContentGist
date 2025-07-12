import React, { useState } from 'react';
import { Calendar, Clock, Target, BarChart3, Zap, Users, ArrowRight, Play, Pause, Settings, Edit3 } from 'lucide-react';

const SchedulingExplainer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: "Create Your Content",
      description: "Write engaging posts, add images, and craft the perfect message for your audience.",
      icon: Edit3,
      demo: (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">ContentGist</div>
              <div className="text-sm text-gray-500">Draft post</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-700">🚀 Exciting news! Our new feature launch is here...</div>
            </div>
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-xs text-blue-600">IMG</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <div className="text-xs text-green-600">VID</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Schedule Smart",
      description: "Choose the perfect time when your audience is most active, or let our AI optimize for you.",
      icon: Calendar,
      demo: (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="mb-4">
            <div className="font-semibold text-gray-900 mb-2">Schedule Options</div>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border-2 border-blue-500 bg-blue-50 rounded-lg text-sm text-blue-700 font-medium">
                <Clock className="w-4 h-4 mx-auto mb-1" />
                Optimal Time
              </button>
              <button className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600">
                <Calendar className="w-4 h-4 mx-auto mb-1" />
                Custom Time
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Best engagement time:</span>
              <span className="font-semibold text-green-600">2:30 PM EST</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Expected reach:</span>
              <span className="font-semibold text-blue-600">2,400+ users</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Auto-Post & Track",
      description: "Sit back as your content goes live automatically. Monitor performance in real-time.",
      icon: BarChart3,
      demo: (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Live</span>
            </div>
            <div className="text-sm text-gray-500">Posted 2h ago</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">1,247</div>
              <div className="text-xs text-gray-500">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">89</div>
              <div className="text-xs text-gray-500">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">156</div>
              <div className="text-xs text-gray-500">Shares</div>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-900">Engagement Rate: 8.2%</div>
            <div className="text-xs text-gray-600">+32% above average</div>
          </div>
        </div>
      )
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Smart Targeting",
      description: "AI-powered audience analysis to maximize engagement"
    },
    {
      icon: Zap,
      title: "Instant Publishing",
      description: "Lightning-fast posting across all your social platforms"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track performance and optimize your strategy on the go"
    },
    {
      icon: Settings,
      title: "Advanced Automation",
      description: "Set up posting schedules and let our system handle the rest"
    }
  ];

  return (
    <section id="scheduling" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Schedule Like a Pro,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Post Like a Boss</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our Buffer-inspired platform makes social media management effortless. Create, schedule, and track your posts with intelligent automation that grows your audience while you focus on your business.
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="mb-20">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Demo Controls */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause Demo' : 'Play Demo'}
                  </button>
                  <div className="text-sm text-gray-600">
                    Step {activeStep + 1} of {steps.length}
                  </div>
                </div>
                
                {/* Step Navigation */}
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === activeStep ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Step Info */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      {React.createElement(steps[activeStep].icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{steps[activeStep].title}</h3>
                      <div className="text-sm text-blue-600 font-medium">Step {activeStep + 1}</div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {steps[activeStep].description}
                  </p>

                  {/* Step Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                      disabled={activeStep === steps.length - 1}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Demo Visual */}
                <div className="lg:pl-8">
                  <div className="transform transition-all duration-500 hover:scale-105">
                    {steps[activeStep].demo}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Automate Your Social Media?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using our platform to grow their social media presence effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center">
                Start Free Trial
              </a>
              <button 
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Get Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchedulingExplainer;