import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  ExternalLink,
  AlertTriangle,
  Users,
  Key,
  Globe,
  Smartphone,
  Settings,
  FileText,
  BarChart3,
  Camera,
  Eye,
  Edit,
  Share,
  Video
} from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  actionRequired?: boolean;
  platform?: string;
}

const OAuthTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('facebook');

  const platforms = {
    facebook: {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      permissions: ['pages_manage_posts', 'pages_read_engagement'],
      description: 'Connect your Facebook Page to post content and read engagement metrics'
    },
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-600',
      authUrl: 'https://api.instagram.com/oauth/authorize',
      permissions: ['user_profile', 'user_media'],
      description: 'Connect your Instagram Business account for posting and analytics'
    },
    twitter: {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      permissions: ['tweet.read', 'tweet.write', 'users.read'],
      description: 'Connect your Twitter account to post tweets and read analytics'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700',
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      permissions: ['w_member_social'],
      description: 'Connect your LinkedIn profile for professional content posting'
    },
    youtube: {
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      authUrl: 'https://accounts.google.com/o/oauth2/auth',
      permissions: ['youtube.upload'],
      description: 'Connect your YouTube channel for video uploads and management'
    }
  };

  const steps: TutorialStep[] = [
    {
      id: 0,
      title: 'Welcome to Secure Social Media Connection',
      description: 'Learn how to safely connect your social media accounts without sharing passwords',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">OAuth 2.0 Authentication</h3>
            <p className="text-gray-600 mb-6">
              This tutorial will guide you through connecting your social media accounts using OAuth 2.0,
              the industry standard for secure authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800">Secure</h4>
              <p className="text-sm text-green-700">No passwords shared</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800">Controlled</h4>
              <p className="text-sm text-blue-700">You control permissions</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-800">Revokable</h4>
              <p className="text-sm text-purple-700">Disconnect anytime</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">What You'll Learn</h4>
                <ul className="text-sm text-amber-800 mt-2 space-y-1">
                  <li>• How OAuth keeps your accounts secure</li>
                  <li>• Step-by-step connection process</li>
                  <li>• What permissions we request and why</li>
                  <li>• How to manage and revoke access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: 'Choose Your Platform',
      description: 'Select which social media platform you want to connect first',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Select a Platform to Connect</h3>
            <p className="text-gray-600">Choose the social media platform you want to learn about connecting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(platforms).map(([key, platform]) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatform === key;
              
              return (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPlatform(key)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        {isSelected && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {selectedPlatform && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                {platforms[selectedPlatform as keyof typeof platforms].name} Connection Details
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  <span>Permissions: {platforms[selectedPlatform as keyof typeof platforms].permissions.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>OAuth URL: {platforms[selectedPlatform as keyof typeof platforms].authUrl}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
      actionRequired: true
    },
    {
      id: 2,
      title: 'Understanding OAuth Flow',
      description: 'Learn how the secure authentication process works',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">How OAuth 2.0 Works</h3>
            <p className="text-gray-600">Understanding the secure authentication flow</p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Click Connect',
                description: 'You click the "Connect" button for your chosen platform',
                icon: Smartphone,
                color: 'bg-blue-500'
              },
              {
                step: 2,
                title: 'Redirect to Platform',
                description: 'You\'re redirected to the official platform login page (not our site)',
                icon: ExternalLink,
                color: 'bg-green-500'
              },
              {
                step: 3,
                title: 'Login & Authorize',
                description: 'You login with your credentials on the platform\'s secure site',
                icon: Lock,
                color: 'bg-purple-500'
              },
              {
                step: 4,
                title: 'Grant Permissions',
                description: 'You review and approve the specific permissions we\'re requesting',
                icon: CheckCircle,
                color: 'bg-orange-500'
              },
              {
                step: 5,
                title: 'Return with Code',
                description: 'The platform sends you back to our app with a secure authorization code',
                icon: Key,
                color: 'bg-indigo-500'
              },
              {
                step: 6,
                title: 'Exchange for Token',
                description: 'We exchange the code for an access token (encrypted and stored securely)',
                icon: Shield,
                color: 'bg-emerald-500'
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color} flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Key Security Benefits</h4>
                <ul className="text-sm text-green-800 mt-2 space-y-1">
                  <li>• Your password never leaves the platform's official website</li>
                  <li>• We only get limited permissions you specifically approve</li>
                  <li>• You can revoke access anytime from your platform settings</li>
                  <li>• All tokens are encrypted and stored securely</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Platform-Specific Permissions',
      description: 'Learn what permissions we request and why',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {platforms[selectedPlatform as keyof typeof platforms].name} Permissions
            </h3>
            <p className="text-gray-600">Understanding what access we request and why we need it</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${platforms[selectedPlatform as keyof typeof platforms].color}`}>
                {React.createElement(platforms[selectedPlatform as keyof typeof platforms].icon, { className: "w-5 h-5 text-white" })}
              </div>
              <h4 className="font-semibold text-blue-900">{platforms[selectedPlatform as keyof typeof platforms].name} Connection</h4>
            </div>
            <p className="text-sm text-blue-800">{platforms[selectedPlatform as keyof typeof platforms].description}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Requested Permissions:</h4>
            {platforms[selectedPlatform as keyof typeof platforms].permissions.map((permission, index) => {
              const permissionDetails = {
                'pages_manage_posts': {
                  name: 'Manage Page Posts',
                  description: 'Allows us to create and publish posts on your Facebook Page',
                  icon: FileText
                },
                'pages_read_engagement': {
                  name: 'Read Page Engagement',
                  description: 'Allows us to view likes, comments, and shares on your posts for analytics',
                  icon: BarChart3
                },
                'user_profile': {
                  name: 'Access Profile',
                  description: 'Allows us to get basic profile information for account verification',
                  icon: Users
                },
                'user_media': {
                  name: 'Access Media',
                  description: 'Allows us to view and post media content to your Instagram account',
                  icon: Camera
                },
                'tweet.read': {
                  name: 'Read Tweets',
                  description: 'Allows us to view your tweets for analytics and engagement tracking',
                  icon: Eye
                },
                'tweet.write': {
                  name: 'Write Tweets',
                  description: 'Allows us to create and publish tweets on your behalf',
                  icon: Edit
                },
                'users.read': {
                  name: 'Read User Info',
                  description: 'Allows us to access basic user information for account verification',
                  icon: Users
                },
                'w_member_social': {
                  name: 'Post to LinkedIn',
                  description: 'Allows us to create and publish posts on your LinkedIn profile',
                  icon: Share
                },
                'youtube.upload': {
                  name: 'Upload Videos',
                  description: 'Allows us to upload and manage videos on your YouTube channel',
                  icon: Video
                }
              };

              const details = permissionDetails[permission as keyof typeof permissionDetails];
              if (!details) return null;

              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-gray-900">{details.name}</h5>
                    <p className="text-sm text-gray-600">{details.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">Important Notes</h4>
                <ul className="text-sm text-amber-800 mt-2 space-y-1">
                  <li>• We only request the minimum permissions needed for our service</li>
                  <li>• You can review and modify permissions in your platform settings</li>
                  <li>• Revoking permissions will disable automated posting for that platform</li>
                  <li>• We never request permission to access private messages or personal data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Try the Connection',
      description: 'Walk through the actual connection process',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Ready to Connect!</h3>
            <p className="text-gray-600">Let's walk through the actual connection process for {platforms[selectedPlatform as keyof typeof platforms].name}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${platforms[selectedPlatform as keyof typeof platforms].color}`}>
                {React.createElement(platforms[selectedPlatform as keyof typeof platforms].icon, { className: "w-8 h-8 text-white" })}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Connect Your {platforms[selectedPlatform as keyof typeof platforms].name} Account
              </h4>
              <p className="text-gray-600 mb-6">
                Click the button below to start the secure OAuth connection process
              </p>
              
              <Button 
                size="lg"
                className={`${platforms[selectedPlatform as keyof typeof platforms].color} hover:opacity-90 text-white px-8 py-3 text-lg`}
                onClick={() => {
                  // This would trigger the actual OAuth flow in production
                  alert(`In a real environment, this would redirect you to ${platforms[selectedPlatform as keyof typeof platforms].authUrl} to securely authenticate with ${platforms[selectedPlatform as keyof typeof platforms].name}.`);
                }}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Connect {platforms[selectedPlatform as keyof typeof platforms].name}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">What Happens Next:</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>You'll be redirected to {platforms[selectedPlatform as keyof typeof platforms].name}'s official login page</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>Login with your {platforms[selectedPlatform as keyof typeof platforms].name} credentials (we never see them)</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>Review and approve the permissions we're requesting</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>You'll be redirected back to our platform with a secure connection</span>
              </div>
            </div>
          </div>
        </div>
      ),
      actionRequired: true
    },
    {
      id: 5,
      title: 'Managing Your Connections',
      description: 'Learn how to manage and revoke access to your connected accounts',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Managing Your Connected Accounts</h3>
            <p className="text-gray-600">You're always in control of your social media connections</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  From Our Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Manage connections directly in your dashboard:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>View all connected accounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Disconnect individual platforms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>See connection status and last activity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Reconnect if tokens expire</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  From Social Platforms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Manage permissions in your platform settings:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Revoke app access completely</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Modify specific permissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>View app activity logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Report any suspicious activity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Your Rights & Control</h4>
                <ul className="text-sm text-green-800 mt-2 space-y-1">
                  <li>• You can disconnect any platform at any time</li>
                  <li>• We'll notify you if we need to request additional permissions</li>
                  <li>• You can view exactly what data we access and when</li>
                  <li>• All tokens are automatically refreshed to maintain security</li>
                  <li>• We follow industry best practices for data encryption and storage</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-2">Platform-Specific Settings:</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(platforms).map(([key, platform]) => {
                const Icon = platform.icon;
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-2 h-auto py-3"
                    onClick={() => {
                      const settingsUrls = {
                        facebook: 'https://www.facebook.com/settings?tab=applications',
                        instagram: 'https://www.instagram.com/accounts/manage_access/',
                        twitter: 'https://twitter.com/settings/applications',
                        linkedin: 'https://www.linkedin.com/psettings/permitted-services',
                        youtube: 'https://myaccount.google.com/permissions'
                      };
                      window.open(settingsUrls[key as keyof typeof settingsUrls], '_blank');
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Tutorial Complete!',
      description: 'You now understand how to securely connect your social media accounts',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Congratulations!</h3>
            <p className="text-lg text-gray-600 mb-6">
              You've completed the OAuth connection tutorial and now understand how to securely 
              connect your social media accounts.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">What You've Learned:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">How OAuth 2.0 keeps you secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">The step-by-step connection process</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">What permissions we request and why</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">How to manage your connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Your rights and control options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Platform-specific security settings</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.close()}
            >
              Start Connecting Accounts
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setCurrentStep(0)}
            >
              Restart Tutorial
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact our support team or visit our documentation.</p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">OAuth Connection Tutorial</h2>
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Step */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {steps[currentStep].content}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              } ${completedSteps.includes(index) ? 'bg-green-600' : ''}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default OAuthTutorial;