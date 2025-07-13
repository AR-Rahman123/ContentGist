import React, { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmail = () => {
  const [match, params] = useRoute('/verify-email');
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      return;
    }

    verifyEmail(token);
  }, []);

  const verifyEmail = async (token: string) => {
    try {
      const response = await apiRequest('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.token && response.user) {
        // Store the auth token
        localStorage.setItem('authToken', response.token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          setLocation('/dashboard');
        }, 3000);
      } else {
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      if (error.message?.includes('expired')) {
        setStatus('expired');
        setMessage('Your verification link has expired. Please request a new one.');
      } else {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. Please try again.');
      }
    }
  };

  const resendVerification = async () => {
    const email = prompt('Please enter your email address to resend verification:');
    if (!email) return;

    setIsResending(true);
    try {
      const response = await apiRequest('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      alert(response.message || 'Verification email sent! Please check your inbox.');
    } catch (error: any) {
      alert(error.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <Mail className="h-12 w-12 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email address...'}
            {status === 'success' && 'Your email has been verified!'}
            {status === 'error' && 'Verification failed'}
            {status === 'expired' && 'Verification link expired'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert className={`${status === 'success' ? 'border-green-200 bg-green-50' : 
                           status === 'error' || status === 'expired' ? 'border-red-200 bg-red-50' : 
                           'border-blue-200 bg-blue-50'}`}>
            <AlertDescription className={getStatusColor()}>
              {message}
            </AlertDescription>
          </Alert>

          {status === 'success' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Redirecting to your dashboard in 3 seconds...
              </p>
              <Button 
                onClick={() => setLocation('/dashboard')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Go to Dashboard Now
              </Button>
            </div>
          )}

          {(status === 'error' || status === 'expired') && (
            <div className="space-y-3">
              <Button
                onClick={resendVerification}
                disabled={isResending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setLocation('/login')}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setLocation('/login')}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;