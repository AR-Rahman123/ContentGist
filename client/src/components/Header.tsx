import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [location] = useLocation();

  const homeNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'why-choose-us', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' }
  ];

  const pageNavItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = homeNavItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(homeNavItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-300">
              ContentGist
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {location === '/' ? (
              <nav className="flex space-x-8">
                {homeNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-colors duration-300 hover:text-blue-400 ${
                      activeSection === item.id ? 'text-blue-400' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            ) : (
              <nav className="flex space-x-8">
                {pageNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className={`text-sm font-medium transition-colors duration-300 hover:text-blue-400 ${
                      location === item.href ? 'text-blue-400' : 'text-slate-300'
                    }`}>
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
            )}
            
            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href={isAdmin ? "/admin" : "/dashboard"}>
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-blue-400">
                      {isAdmin ? 'Admin' : 'Dashboard'}
                    </Button>
                  </Link>
                  <span className="text-sm text-slate-400">Hi, {user?.name}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-blue-400">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/98 backdrop-blur-sm border-b border-slate-800">
          <div className="px-6 py-4 space-y-4">
            {location === '/' && (
              <nav className="space-y-4 border-b border-slate-700 pb-4 mb-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left text-lg font-medium transition-colors duration-300 hover:text-blue-400 ${
                      activeSection === item.id ? 'text-blue-400' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
            
            {/* Mobile Authentication */}
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href={isAdmin ? "/admin" : "/dashboard"}>
                    <Button variant="ghost" className="w-full justify-start text-slate-300">
                      {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                    </Button>
                  </Link>
                  <div className="text-sm text-slate-400 px-3">Hi, {user?.name}</div>
                  <Button variant="outline" onClick={logout} className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start text-slate-300">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;