import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechFlow Solutions',
      content: 'Their strategic approach transformed our social media presence. We saw a 400% increase in qualified leads within 6 months.',
      rating: 5,
      company: 'TechFlow Solutions'
    },
    {
      name: 'Marcus Chen',
      role: 'Marketing Director, GreenLeaf Co.',
      content: 'Outstanding creativity and execution. Our engagement rates have never been higher, and the ROI speaks for itself.',
      rating: 5,
      company: 'GreenLeaf Co.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, Bloom Wellness',
      content: 'ContentGist helped us build a community of 50K+ engaged followers. Their content strategy is simply brilliant.',
      rating: 5,
      company: 'Bloom Wellness'
    },
    {
      name: 'David Thompson',
      role: 'CMO, Urban Eats',
      content: 'From 2K to 25K followers in 8 months. Their visual content and posting schedule drove incredible growth for our restaurant chain.',
      rating: 5,
      company: 'Urban Eats'
    },
    {
      name: 'Lisa Park',
      role: 'Brand Manager, StyleCraft',
      content: 'Professional, creative, and results-driven. They understand our brand voice perfectly and consistently deliver high-quality content.',
      rating: 5,
      company: 'StyleCraft'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Client Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Don't just take our word for it – hear from businesses we've helped grow
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Main testimonial display */}
          <div 
            className="bg-white p-8 md:p-12 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100 min-h-[300px] flex flex-col justify-center"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="flex items-center justify-between mb-6">
              <Quote className="w-8 h-8 text-blue-500" />
              <div className="flex">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <p className="text-slate-700 text-lg md:text-xl leading-relaxed mb-8 italic">
              "{testimonials[currentIndex].content}"
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">
                    {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonials[currentIndex].name}</h4>
                  <p className="text-slate-600">{testimonials[currentIndex].role}</p>
                  <p className="text-blue-600 text-sm font-medium">{testimonials[currentIndex].company}</p>
                </div>
              </div>
              
              {/* Navigation arrows */}
              <div className="flex space-x-2">
                <button
                  onClick={goToPrevious}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  onClick={goToNext}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <p className="text-sm text-slate-500">
              {isAutoPlaying ? 'Auto-rotating every 4 seconds' : 'Hover to pause auto-rotation'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;