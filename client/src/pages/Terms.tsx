import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, AlertTriangle, Scale, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Scale className="h-16 w-16 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-slate-400">
              Last updated: January 2025
            </p>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 space-y-8">
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-blue-400" />
                  1. Acceptance of Terms
                </h2>
                <div className="text-slate-300 space-y-4">
                  <p>By accessing or using ContentGist ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, then you may not access the Service.</p>
                  <p>These Terms apply to all visitors, users, and others who access or use the Service.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                <div className="text-slate-300 space-y-4">
                  <p>ContentGist is a social media management platform that provides:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Content creation and scheduling tools</li>
                    <li>Social media account management</li>
                    <li>Analytics and reporting features</li>
                    <li>Team collaboration capabilities</li>
                    <li>Integration with major social media platforms</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
                <div className="text-slate-300 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Registration</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You must be at least 18 years old to use the Service</li>
                    <li>One person or legal entity may not maintain more than one free account</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white">Account Responsibility</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You are responsible for all activity that occurs under your account</li>
                    <li>You must notify us immediately of any unauthorized use</li>
                    <li>We are not liable for any loss resulting from unauthorized use</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-yellow-400" />
                  4. Acceptable Use Policy
                </h2>
                <div className="text-slate-300 space-y-4">
                  <p>You agree not to use the Service to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violate any laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit harmful, abusive, or offensive content</li>
                    <li>Engage in spam or unsolicited marketing</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the Service</li>
                    <li>Use the Service for illegal or unauthorized purposes</li>
                    <li>Impersonate others or provide false information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Content and Intellectual Property</h2>
                <div className="text-slate-300 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Your Content</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You retain ownership of content you create using the Service</li>
                    <li>You grant us a license to use your content to provide the Service</li>
                    <li>You are responsible for ensuring you have rights to all content you upload</li>
                    <li>You must not upload content that violates third-party rights</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white">Our Content</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The Service and its original content are protected by copyright and other laws</li>
                    <li>Our trademarks and trade dress may not be used without permission</li>
                    <li>You may not copy, modify, or distribute our proprietary content</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Privacy and Data Protection</h2>
                <div className="text-slate-300 space-y-4">
                  <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Payments and Billing</h2>
                <div className="text-slate-300 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Subscription Plans</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Paid plans are billed in advance on a recurring basis</li>
                    <li>You must provide accurate billing information</li>
                    <li>Fees are non-refundable except as required by law</li>
                    <li>We may change our pricing with 30 days notice</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white">Cancellation</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>You may cancel your subscription at any time</li>
                    <li>Cancellation takes effect at the end of the current billing period</li>
                    <li>You will retain access to paid features until the end of the billing period</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability</h2>
                <div className="text-slate-300 space-y-4">
                  <p>We strive to provide reliable service, but we cannot guarantee:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>100% uptime or uninterrupted access</li>
                    <li>That the Service will be error-free</li>
                    <li>Compatibility with all devices or browsers</li>
                    <li>Successful delivery of all scheduled posts</li>
                  </ul>
                  <p>We reserve the right to modify or discontinue the Service at any time.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-green-400" />
                  9. Limitation of Liability
                </h2>
                <div className="text-slate-300 space-y-4">
                  <p>To the maximum extent permitted by law:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>We shall not be liable for any indirect, incidental, or consequential damages</li>
                    <li>Our total liability shall not exceed the amount you paid for the Service</li>
                    <li>We are not responsible for third-party content or services</li>
                    <li>You use the Service at your own risk</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
                <div className="text-slate-300 space-y-4">
                  <p>You agree to indemnify and hold harmless ContentGist from any claims, damages, or expenses arising from:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Your use of the Service</li>
                    <li>Your violation of these Terms</li>
                    <li>Your content or conduct</li>
                    <li>Your violation of third-party rights</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
                <div className="text-slate-300 space-y-4">
                  <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Violation of these Terms</li>
                    <li>Illegal or harmful conduct</li>
                    <li>Non-payment of fees</li>
                    <li>Prolonged inactivity</li>
                  </ul>
                  <p>Upon termination, your right to use the Service will cease immediately.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
                <div className="text-slate-300 space-y-4">
                  <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of California.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
                <div className="text-slate-300 space-y-4">
                  <p>We reserve the right to modify these Terms at any time. We will notify users of material changes by:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Posting the updated Terms on our website</li>
                    <li>Updating the "last updated" date</li>
                    <li>Sending email notifications for significant changes</li>
                  </ul>
                  <p>Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
                <div className="text-slate-300 space-y-4">
                  <p>If you have any questions about these Terms, please contact us:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Email: legal@contentgist.com</li>
                    <li>Address: 123 Legal Street, Terms City, TC 12345</li>
                    <li>Phone: +1 (555) 123-4567</li>
                  </ul>
                </div>
              </section>

            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;