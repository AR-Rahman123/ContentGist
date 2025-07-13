import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, Target, Award, Heart, Globe, Zap, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ContentGist</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We're passionate about helping businesses and creators amplify their social media presence through strategic content creation, seamless scheduling, and data-driven insights.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Target className="h-8 w-8 text-blue-400" />
                  <CardTitle className="text-2xl text-white">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  To democratize social media success by providing powerful, intuitive tools that enable businesses of all sizes to create compelling content, engage authentically with their audience, and measure their impact effectively.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Globe className="h-8 w-8 text-purple-400" />
                  <CardTitle className="text-2xl text-white">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  To become the world's most trusted platform for social media management, where creativity meets technology to build meaningful connections between brands and their communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-slate-400">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Authenticity</h3>
              <p className="text-slate-400">We believe in genuine connections and authentic storytelling that resonates with real people.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
              <p className="text-slate-400">We continuously evolve our platform to stay ahead of social media trends and user needs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Trust</h3>
              <p className="text-slate-400">Your data and content are safe with us. We prioritize security and transparency in everything.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Excellence</h3>
              <p className="text-slate-400">We strive for excellence in every feature, every interaction, and every customer experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-400">The passionate people behind ContentGist</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-700 border-slate-600 text-center">
              <CardHeader>
                <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-white">Sarah Johnson</CardTitle>
                <CardDescription className="text-slate-400">CEO & Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Former digital marketing director with 10+ years of experience helping brands build their online presence.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600 text-center">
              <CardHeader>
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-white">Mike Chen</CardTitle>
                <CardDescription className="text-slate-400">CTO</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Full-stack engineer and former startup founder passionate about building scalable, user-friendly platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600 text-center">
              <CardHeader>
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-white">Emma Rodriguez</CardTitle>
                <CardDescription className="text-slate-400">Head of Design</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  UX/UI designer with a keen eye for detail and a passion for creating intuitive, beautiful user experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-slate-400">Numbers that speak to our success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-slate-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">1M+</div>
              <div className="text-slate-400">Posts Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-slate-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Join Us?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your journey with ContentGist today and transform your social media presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;