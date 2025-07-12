import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const OAuthDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          How Social Media Authentication Works
        </h1>
        <p className="text-lg text-gray-600">
          Your clients connect their accounts securely without sharing passwords
        </p>
      </div>

      {/* OAuth Flow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              Client Clicks Connect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Your client clicks "Connect Facebook" in their dashboard. They're redirected to Facebook's official login page.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              Secure Authorization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Client logs in on Facebook's site (not yours) and grants permission for posting. Facebook sends a secure code back.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              Token Exchange
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Your system exchanges the code for an access token, which is encrypted and stored for automated posting.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Benefits */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Shield className="w-5 h-5" />
            Security Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm">Clients never share passwords with you</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm">All authentication happens on official social media sites</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm">Clients can revoke access anytime from their social media settings</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm">Access tokens are encrypted in your database</span>
          </div>
        </CardContent>
      </Card>

      {/* What You Get */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              What You Receive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="outline" className="text-xs">Access Token (Encrypted)</Badge>
            <Badge variant="outline" className="text-xs">Posting Permissions</Badge>
            <Badge variant="outline" className="text-xs">Account Information</Badge>
            <Badge variant="outline" className="text-xs">Analytics Access</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              What Clients Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="outline" className="text-xs">Revoke Access Anytime</Badge>
            <Badge variant="outline" className="text-xs">View App Permissions</Badge>
            <Badge variant="outline" className="text-xs">Monitor Posted Content</Badge>
            <Badge variant="outline" className="text-xs">Manage Account Settings</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Setup Requirements */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            Setup Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 mb-3">
            To enable social media connections, you'll need to create developer apps with each platform:
          </p>
          <div className="space-y-2 text-sm">
            <div>• <strong>Facebook:</strong> Create a Facebook App for Business at developers.facebook.com</div>
            <div>• <strong>Instagram:</strong> Use Facebook's Instagram Basic Display API</div>
            <div>• <strong>Twitter:</strong> Apply for Twitter API access at developer.twitter.com</div>
            <div>• <strong>LinkedIn:</strong> Create a LinkedIn app at developer.linkedin.com</div>
            <div>• <strong>YouTube:</strong> Set up Google API credentials at console.cloud.google.com</div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-700">
            <strong>Demo Mode:</strong> The current system includes demo social media connections. 
            To enable real connections, you'll need to provide the actual API credentials for each platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthDemo;