import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { exhibitorId } = useParams<{ exhibitorId: string }>();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would verify the session with Stripe
    // For now, we'll just simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto py-16 px-4">
        <Card className="p-8 text-center">
          <CardContent className="pt-6 px-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <p className="text-lg text-gray-700">Verifying your subscription...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Activated!</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Your 30-day free trial has started. You now have full access to all exhibitor premium features.
                </p>
                
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg mb-8 text-left w-full">
                  <h3 className="font-medium text-green-800 mb-2">What happens next?</h3>
                  <ul className="list-disc list-inside text-green-700 space-y-1">
                    <li>Your card won't be charged until your 30-day trial ends</li>
                    <li>You can cancel anytime during the trial with no charge</li>
                    <li>After the trial, you'll be charged €20/month</li>
                    <li>You can manage your subscription from your profile settings</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    className="flex-1"
                    onClick={() => navigate(`/exhibitor/${exhibitorId}`)}
                  >
                    View Your Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSuccess; 