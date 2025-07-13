import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-slate-400">
              Last updated: January 2025
            </p>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 space-y-8">
              
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Eye className="h-6 w-6 mr-2 text-blue-400" />
                  1. Information We Collect
                </h2>
                <div className="text-slate-300 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Email address and name when you create an account</li>
                    <li>Payment information when you upgrade to a paid plan</li>
                    <li>Profile information you choose to provide</li>
                    <li>Communication preferences and settings</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Social media content you create and schedule</li>
                    <li>Analytics and performance data</li>
                    <li>Platform usage patterns and preferences</li>
                    <li>Social media account connections (with your permission)</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Operating system and screen resolution</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-purple-400" />
                  2. How We Use Your Information
                </h2>
                <div className="text-slate-300 space-y-4">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide and maintain our social media management services</li>
                    <li>Process transactions and send billing information</li>
                    <li>Send you technical notices, updates, and support messages</li>
                    <li>Respond to your comments, questions, and customer service requests</li>
                    <li>Analyze usage patterns to improve our platform</li>
                    <li>Personalize your experience and provide relevant content</li>
                    <li>Protect against fraudulent or illegal activity</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Lock className="h-6 w-6 mr-2 text-green-400" />
                  3. Information Sharing and Disclosure
                </h2>
                <div className="text-slate-300 space-y-4">
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Service Providers:</strong> Trusted third parties who assist us in operating our platform (payment processors, hosting providers, analytics services)</li>
                    <li><strong>Social Media Platforms:</strong> When you connect your social media accounts, we share content according to your instructions</li>
                    <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                    <li><strong>Business Transfers:</strong> In connection with any merger, sale of assets, or acquisition</li>
                    <li><strong>Your Consent:</strong> When you explicitly consent to sharing</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                <div className="text-slate-300 space-y-4">
                  <p>We implement robust security measures to protect your information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encryption in transit and at rest</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Secure data centers with physical security controls</li>
                    <li>Employee access controls and training</li>
                    <li>Regular backup and disaster recovery procedures</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights and Choices</h2>
                <div className="text-slate-300 space-y-4">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                    <li><strong>Objection:</strong> Object to certain uses of your information</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent for optional data processing</li>
                  </ul>
                  <p className="mt-4">To exercise these rights, please contact us at privacy@contentgist.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
                <div className="text-slate-300 space-y-4">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze site traffic and usage patterns</li>
                    <li>Provide personalized content and features</li>
                    <li>Prevent fraud and enhance security</li>
                  </ul>
                  <p>You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. International Data Transfers</h2>
                <div className="text-slate-300 space-y-4">
                  <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Adequacy decisions by relevant authorities</li>
                    <li>Standard contractual clauses</li>
                    <li>Binding corporate rules</li>
                    <li>Certification schemes</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
                <div className="text-slate-300 space-y-4">
                  <p>We retain your information for as long as necessary to provide our services and comply with legal obligations:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Account information: While your account is active and for a reasonable period afterward</li>
                    <li>Content data: As long as needed to provide services</li>
                    <li>Analytics data: Aggregated and anonymized for business purposes</li>
                    <li>Legal requirements: As required by applicable law</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                <div className="text-slate-300 space-y-4">
                  <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                <div className="text-slate-300 space-y-4">
                  <p>We may update this privacy policy from time to time. We will notify you of any material changes by:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Posting the new policy on this page</li>
                    <li>Updating the "last updated" date</li>
                    <li>Sending you an email notification for significant changes</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                <div className="text-slate-300 space-y-4">
                  <p>If you have any questions about this privacy policy, please contact us:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Email: privacy@contentgist.com</li>
                    <li>Address: 123 Privacy Street, Data City, DC 12345</li>
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

export default PrivacyPolicy;