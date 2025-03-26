import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

interface SubscriptionFormProps {
  exhibitorId: string;
  companyName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  exhibitorId,
  companyName,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, getAccessToken } = useAuth();

  // This would normally be handled by loading Stripe.js
  const redirectToStripeCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Creating subscription checkout session for exhibitor:', exhibitorId);
      
      // Get auth token
      const token = await getAccessToken();
      
      const response = await fetch('https://api.bazaar.it/api/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exhibitorId,
          companyName,
          customerEmail: user?.email,
          priceId: 'price_1PcMtIHVo5Jq6dzYOcptaKlk' // Replace with your actual Stripe price ID
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
      
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      console.error('Failed to create checkout session:', err);
      setError('Unable to start subscription process. Please try again.');
      setLoading(false);
    }
  };

  // This simulates a successful return from Stripe checkout
  const simulateCheckoutSuccess = () => {
    // In production, this would be a separate page that Stripe redirects to
    console.log('Payment details successfully captured');
    setLoading(false);
    toast.success('Subscription activated successfully!');
    onSuccess();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Activate Your Exhibitor Account</CardTitle>
        <CardDescription>
          Start managing your exhibitor profile with premium features
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Exhibitor Premium Plan</h3>
            
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold">€20</span>
              <span className="text-gray-600 ml-1">/month</span>
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">First month FREE</span>
            </div>
            
            <p className="text-gray-600 mb-4">
              Access all premium features to showcase your products and connect with potential buyers.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Full exhibitor profile customization</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Featured placement in search results</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Direct customer inquiries</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Product catalog management</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Analytics dashboard</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Your subscription includes a FREE 30-day trial. You won't be charged until the trial period ends, 
              and you can cancel at any time during this period at no cost.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={redirectToStripeCheckout} disabled={loading}>
          {loading ? "Processing..." : "Start Free Trial"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionForm; 