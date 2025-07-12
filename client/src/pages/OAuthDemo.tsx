import React from 'react';
import { useLocation } from 'wouter';
import OAuthDemo from '@/components/OAuth-Demo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const OAuthDemoPage: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">OAuth Security Demo</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <OAuthDemo />
      </div>
    </div>
  );
};

export default OAuthDemoPage;