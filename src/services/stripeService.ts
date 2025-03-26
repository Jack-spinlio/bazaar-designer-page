/**
 * Service for handling Stripe subscriptions
 */
export class StripeService {
  private static API_URL = 'https://api.bazaar.it';

  /**
   * Create a Stripe checkout session for subscription with free trial
   */
  static async createSubscriptionCheckout(
    exhibitorId: string, 
    companyName: string,
    customerEmail: string,
    token: string
  ): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.API_URL}/create-subscription-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exhibitorId,
          companyName,
          customerEmail,
          // Include other subscription details
          priceId: 'price_exhibitor_monthly', // This would be your actual Stripe price ID
          trialPeriodDays: 30
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Stripe checkout creation error:', error);
      throw error;
    }
  }

  /**
   * Get subscription status for an exhibitor
   */
  static async getSubscriptionStatus(exhibitorId: string, token: string): Promise<{
    status: 'active' | 'trialing' | 'canceled' | 'none';
    trialEnd?: string;
    currentPeriodEnd?: string;
  }> {
    try {
      const response = await fetch(`${this.API_URL}/subscription-status/${exhibitorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription status error:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string, token: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.API_URL}/cancel-subscription/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      throw error;
    }
  }

  /**
   * Update payment method
   */
  static async createUpdatePaymentSession(
    customerId: string, 
    returnUrl: string,
    token: string
  ): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.API_URL}/create-payment-update-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment update session');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment update session error:', error);
      throw error;
    }
  }
} 