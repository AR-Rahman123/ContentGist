import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Plan {
  id: number;
  name: string;
  description: string;
  price: string;
  postsLimit: number;
  features: string[];
  isPopular: boolean;
  stripePriceId: string;
}

interface PricingPlansProps {
  showCurrentPlan?: boolean;
}

export default function PricingPlans({ showCurrentPlan = false }: PricingPlansProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['/api/plans'],
    queryFn: () => apiRequest('/api/plans').then(res => res.json())
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await apiRequest('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      return response.json();
    },
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      if (stripe && data.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId
        });
        if (error) {
          toast({
            title: "Payment Error",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setLoadingPlanId(null);
    }
  });

  const handleUpgrade = async (planId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your plan",
        variant: "destructive",
      });
      return;
    }

    setLoadingPlanId(planId);
    checkoutMutation.mutate(planId);
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return <Zap className="w-5 h-5" />;
      case 'pro':
        return <Star className="w-5 h-5" />;
      case 'premium':
        return <Crown className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const isCurrentPlan = (planId: number) => {
    return user?.planId === planId && user?.subscriptionStatus === 'active';
  };

  const getCurrentPlan = () => {
    if (!user?.planId) return null;
    return plans.find((plan: Plan) => plan.id === user.planId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Plan Display */}
      {showCurrentPlan && user && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {getCurrentPlan() ? getPlanIcon(getCurrentPlan()!.name) : <Zap className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Current Plan: {getCurrentPlan()?.name || 'Free'}
                </h3>
                <p className="text-sm text-gray-600">
                  {getCurrentPlan() 
                    ? `$${getCurrentPlan()!.price}/month • ${getCurrentPlan()!.postsLimit} posts`
                    : 'No active subscription'
                  }
                </p>
              </div>
            </div>
            <Badge 
              variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {user.subscriptionStatus || 'inactive'}
            </Badge>
          </div>
        </div>
      )}

      {/* Pricing Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your social media management needs. 
          Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan: Plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              plan.isPopular 
                ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                : 'hover:shadow-lg transition-shadow'
            } ${
              isCurrentPlan(plan.id) 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  plan.isPopular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getPlanIcon(plan.name)}
                </div>
              </div>
              
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <p className="text-gray-600 text-sm">{plan.description}</p>
              
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500">{plan.postsLimit} posts included</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Features List */}
              <ul className="space-y-3">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Action Button */}
              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrentPlan(plan.id) || loadingPlanId === plan.id}
                className={`w-full ${
                  plan.isPopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                } ${isCurrentPlan(plan.id) ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              >
                {loadingPlanId === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </div>
                ) : isCurrentPlan(plan.id) ? (
                  'Current Plan'
                ) : (
                  'Upgrade Now'
                )}
              </Button>
              
              {isCurrentPlan(plan.id) && (
                <p className="text-center text-sm text-gray-500">
                  You're currently on this plan
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
        <p>
          All plans include secure payment processing, 24/7 support, and a 14-day money-back guarantee. 
          You can cancel or change your plan at any time.
        </p>
      </div>
    </div>
  );
}