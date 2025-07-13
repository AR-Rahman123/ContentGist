import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' }
  ];

  const footerLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">ContentGist</h3>
            <p className="text-slate-400 mb-4">
              Elevating brands through strategic social media management, content creation, and data-driven insights.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <a className="text-slate-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Email: hello@contentgist.com</li>
              <li>Support: support@contentgist.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Content St, Social City, SC 12345</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 mb-4 md:mb-0">
            © 2025 ContentGist. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy">
              <a className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                Terms of Service
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;