import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { sendConsultationEmail } from '../services/emailService';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  consultationType: 'pricing' | 'consultation';
  postsPerWeek?: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    consultationType: 'consultation',
    postsPerWeek: 3
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send email using EmailJS with enhanced data
      const emailData = {
        ...formData,
        message: formData.consultationType === 'pricing' 
          ? `Pricing Inquiry - ${formData.postsPerWeek} posts per week\n\n${formData.message}`
          : formData.message
      };
      
      await sendConsultationEmail(emailData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '', consultationType: 'consultation', postsPerWeek: 3 });
      setErrors({});
      
      // Auto-close modal after success
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to send consultation request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    onClose();
    setSubmitStatus('idle');
    setFormData({ name: '', email: '', phone: '', message: '', consultationType: 'consultation', postsPerWeek: 3 });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-200">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Let's Work Together</h2>
            <p className="text-lg text-gray-600">Choose how you'd like to get started with ContentGist.</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {/* Consultation Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What are you looking for?
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, consultationType: 'pricing' }))}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.consultationType === 'pricing'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.consultationType === 'pricing' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Custom Pricing</span>
                </div>
                <p className="text-sm text-gray-600">
                  Get a personalized quote based on your posting frequency and needs.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, consultationType: 'consultation' }))}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.consultationType === 'consultation'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.consultationType === 'consultation' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Free Consultation</span>
                </div>
                <p className="text-sm text-gray-600">
                  Discuss your strategy, goals, and how we can help grow your presence.
                </p>
              </button>
            </div>
          </div>

          {/* Weekly Posts Selection (only for pricing) */}
          {formData.consultationType === 'pricing' && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How many posts per week do you need?
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[3, 5, 7, 10, 14, 21].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, postsPerWeek: count }))}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      formData.postsPerWeek === count
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {count} posts
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estimated weekly cost:</span>
                  <span className="text-2xl font-bold text-blue-600">${Math.ceil((formData.postsPerWeek || 3) * 15)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Final pricing may vary based on content complexity and platform requirements.
                </p>
              </div>
            </div>
          )}
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Request Sent!</h3>
              <p className="text-slate-600 mb-4">
                Thank you for your interest! We'll get back to you within 24 hours with your free consultation details.
              </p>
              <p className="text-sm text-slate-500">
                This window will close automatically...
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 mb-6">
                Let's discuss how we can elevate your social media presence. Fill out the form below and we'll be in touch!
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitStatus === 'error' && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">
                      Failed to send your request. Please try again or contact us directly at ibrahim.malik.1492@gmail.com
                    </p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="modal-name" className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="modal-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="modal-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="modal-phone" className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="modal-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+44 7818956993"
                  />
                </div>
                
                <div>
                  <label htmlFor="modal-message" className="block text-sm font-medium text-slate-700 mb-1">
                    Message/Inquiry *
                  </label>
                  <textarea
                    id="modal-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors.message ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Tell us about your social media goals..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Request Consultation
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;