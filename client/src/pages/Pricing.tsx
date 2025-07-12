import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/plans'],
  });

  const createCheckoutMutation = useMutation({
    mutationFn: async (planId: number) => {
      return apiRequest('/api/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout (would require Stripe JS in real implementation)
      window.open(`https://checkout.stripe.com/pay/${data.sessionId}`, '_blank');
    },
  });

  const handleSelectPlan = (planId: number) => {
    if (!isAuthenticated) {
      setLocation('/register');
      return;
    }
    createCheckoutMutation.mutate(planId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Scale your social media presence with our flexible pricing options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans?.map((plan: any, index: number) => (
            <Card 
              key={plan.id} 
              className={`relative ${index === 1 ? 'border-blue-500 border-2 scale-105' : ''}`}
            >
              {index === 1 && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{plan.postsLimit} posts per month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Post scheduling</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Analytics dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Email support</span>
                  </div>
                  {index === 2 && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Priority support</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  variant={index === 1 ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={createCheckoutMutation.isPending}
                >
                  {isAuthenticated ? 'Select Plan' : 'Sign Up & Select'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Need a custom plan? <a href="mailto:ibrahim@contentgist.com" className="text-blue-600 hover:text-blue-500">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}