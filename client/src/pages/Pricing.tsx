
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Users, BarChart3 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/plans'],
  });

  const { data: userPlan } = useQuery({
    queryKey: ['/api/user/plan'],
    enabled: isAuthenticated,
  });

  const createCheckoutMutation = useMutation({
    mutationFn: async (planId: number) => {
      return apiRequest('/api/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
    },
    onError: (error) => {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session. Please try again.');
    }
  });

  const handleSelectPlan = (planId: number) => {
    if (!isAuthenticated) {
      // Store selected plan in localStorage and redirect to register
      localStorage.setItem('selectedPlanId', planId.toString());
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

  const getPlanFeatures = (plan: any) => {
    const baseFeatures = [
      `${plan.postsLimit} posts per month`,
      `${plan.name === 'Basic' ? '2' : plan.name === 'Pro' ? '5' : '10'} social media accounts`,
      'Post scheduling',
      'Content calendar',
      'Basic analytics'
    ];

    if (plan.name === 'Pro') {
      baseFeatures.push('Priority support', 'Advanced analytics', 'Bulk scheduling');
    }

    if (plan.name === 'Enterprise') {
      baseFeatures.push('Priority support', 'Advanced analytics', 'Bulk scheduling', 'Custom integrations', 'Dedicated account manager');
    }

    return baseFeatures;
  };

  const isCurrentPlan = (planId: number) => {
    return userPlan && userPlan.id === planId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Social Media Management Plan
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Scale your social media presence with our flexible pricing options
          </p>
          {isAuthenticated && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>Logged in as:</span>
              <Badge variant="outline">{user?.email}</Badge>
            </div>
          )}
        </div>

        {/* Current Plan Display */}
        {isAuthenticated && userPlan && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Current Plan: {userPlan.name}</span>
            </div>
            <p className="text-blue-700 text-sm">
              You're currently on the {userPlan.name} plan with {userPlan.postsLimit} posts per month
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans?.map((plan: any, index: number) => {
            const features = getPlanFeatures(plan);
            const isPopular = index === 1;
            const isCurrent = isCurrentPlan(plan.id);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  isPopular ? 'border-blue-500 border-2 scale-105' : ''
                } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                
                {isCurrent && (
                  <Badge className="absolute -top-3 right-4 bg-green-500">
                    Current Plan
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">
                    {index === 0 && <Users className="w-8 h-8 text-blue-600" />}
                    {index === 1 && <Zap className="w-8 h-8 text-purple-600" />}
                    {index === 2 && <Crown className="w-8 h-8 text-orange-600" />}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  
                  {index === 0 && (
                    <p className="text-sm text-green-600 font-medium mt-2">Perfect for getting started</p>
                  )}
                  {index === 1 && (
                    <p className="text-sm text-purple-600 font-medium mt-2">Best value for growing businesses</p>
                  )}
                  {index === 2 && (
                    <p className="text-sm text-orange-600 font-medium mt-2">Complete solution for enterprises</p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      isPopular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : index === 0 
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={createCheckoutMutation.isPending || isCurrent}
                  >
                    {createCheckoutMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : isAuthenticated ? (
                      `Upgrade to ${plan.name}`
                    ) : (
                      `Start with ${plan.name}`
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      You'll be asked to create an account
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included in All Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Multi-platform posting</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Content scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Performance analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Team collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Mobile app access</span>
              </div>
            </div>
          </div>

          <div className="text-gray-600">
            <p className="mb-2">
              Need a custom plan? <a href="mailto:ibrahim@contentgist.com" className="text-blue-600 hover:text-blue-500 font-medium">Contact us</a> for enterprise solutions.
            </p>
            <p className="text-sm">
              All plans include a 14-day free trial. Cancel anytime. No setup fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
