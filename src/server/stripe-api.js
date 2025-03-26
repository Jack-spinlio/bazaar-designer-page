/**
 * This is a server-side implementation of Stripe subscription API endpoints.
 */

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

/**
 * Create a Stripe Checkout Session for subscription with trial period
 */
router.post('/create-subscription-checkout', async (req, res) => {
  try {
    const { exhibitorId, companyName, customerEmail, priceId } = req.body;
    
    if (!exhibitorId || !customerEmail) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'exhibitorId and customerEmail are required' 
      });
    }
    
    // Create or retrieve customer
    let customer;
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1
    });
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: companyName,
        metadata: {
          exhibitorId: exhibitorId,
          companyName: companyName
        }
      });
    }
    
    // Create checkout session with trial period
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Your actual price ID from Stripe Dashboard
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 30,
        metadata: {
          exhibitorId: exhibitorId,
          companyName: companyName
        }
      },
      success_url: `${process.env.FRONTEND_URL}/exhibitor/${exhibitorId}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/exhibitor/${exhibitorId}`,
      client_reference_id: exhibitorId,
      customer_email: customerEmail
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get subscription status for an exhibitor
 */
router.get('/subscription-status/:exhibitorId', async (req, res) => {
  try {
    const { exhibitorId } = req.params;
    
    if (!exhibitorId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'exhibitorId is required' 
      });
    }
    
    // Look up customer by exhibitorId (in metadata)
    const customers = await stripe.customers.list({
      limit: 1,
      metadata: {
        exhibitorId: exhibitorId
      }
    });
    
    if (customers.data.length === 0) {
      return res.json({ status: 'none' });
    }
    
    const customer = customers.data[0];
    
    // Get subscriptions for customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 1
    });
    
    if (subscriptions.data.length === 0) {
      return res.json({ status: 'none' });
    }
    
    const subscription = subscriptions.data[0];
    
    // Return subscription status details
    res.json({
      status: subscription.status,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cancel a subscription
 */
router.post('/cancel-subscription/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    if (!subscriptionId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'subscriptionId is required' 
      });
    }
    
    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    res.json({ success: true, subscription });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a customer portal session for managing payment methods
 */
router.post('/create-payment-update-session', async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;
    
    if (!customerId || !returnUrl) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'customerId and returnUrl are required' 
      });
    }
    
    // Create a portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Customer portal session error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle Stripe webhook events for subscription lifecycle
 * 
 * IMPORTANT: This endpoint must be configured in Express to provide raw body access
 * Add the following in your main server.js file before routes:
 * 
 * // For Stripe webhook handling
 * app.use('/api/webhook', express.raw({ type: 'application/json' }));
 * 
 * // For regular JSON parsing (must come AFTER the raw handler)
 * app.use(express.json());
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('No Stripe signature found in webhook request');
    return res.status(400).send('Webhook Error: No Stripe signature found');
  }
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).send('Webhook Error: Webhook secret not configured');
  }
  
  let event;
  
  // Verify webhook signature
  try {
    // req.body should be the raw body due to express.raw middleware
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle specific event types
  try {
    console.log(`Processing webhook event: ${event.type}`);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const exhibitorId = session.client_reference_id || 
                           session.metadata?.exhibitorId || 
                           session.subscription_data?.metadata?.exhibitorId;
        
        if (!exhibitorId) {
          console.warn('No exhibitorId found in checkout session data');
          break;
        }
        
        console.log(`Checkout completed for exhibitor: ${exhibitorId}`);
        console.log('Session data:', session);
        
        // Update subscription status in database
        try {
          const { error } = await supabase
            .from('business_profiles')
            .update({
              subscription_status: 'trialing',
              subscription_id: session.subscription,
              customer_id: session.customer,
              subscription_updated_at: new Date().toISOString()
            })
            .eq('id', exhibitorId);
          
          if (error) {
            console.error('Failed to update business profile with subscription info:', error);
          } else {
            console.log(`Updated subscription status for exhibitor: ${exhibitorId}`);
          }
        } catch (dbError) {
          console.error('Database error when updating subscription status:', dbError);
        }
        
        break;
      }
        
      case 'invoice.paid': {
        const invoice = event.data.object;
        const subscription = invoice.subscription;
        
        if (!subscription) {
          console.warn('No subscription ID found in invoice data');
          break;
        }
        
        console.log(`Invoice paid for subscription: ${subscription}`);
        
        // Get subscription details to find exhibitorId
        try {
          const subscriptionData = await stripe.subscriptions.retrieve(subscription);
          const exhibitorId = subscriptionData.metadata?.exhibitorId;
          
          if (!exhibitorId) {
            console.warn('No exhibitorId found in subscription metadata');
            break;
          }
          
          // Update subscription status to active
          const { error } = await supabase
            .from('business_profiles')
            .update({
              subscription_status: 'active',
              subscription_updated_at: new Date().toISOString()
            })
            .eq('id', exhibitorId);
          
          if (error) {
            console.error('Failed to update business profile subscription status:', error);
          } else {
            console.log(`Updated subscription status to active for exhibitor: ${exhibitorId}`);
          }
        } catch (retrieveError) {
          console.error('Error retrieving subscription details:', retrieveError);
        }
        
        break;
      }
        
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscription = invoice.subscription;
        
        if (!subscription) {
          console.warn('No subscription ID found in failed invoice data');
          break;
        }
        
        console.log(`Payment failed for subscription: ${subscription}`);
        
        // Get subscription details to find exhibitorId
        try {
          const subscriptionData = await stripe.subscriptions.retrieve(subscription);
          const exhibitorId = subscriptionData.metadata?.exhibitorId;
          
          if (!exhibitorId) {
            console.warn('No exhibitorId found in subscription metadata');
            break;
          }
          
          // Update subscription status to past_due
          const { error } = await supabase
            .from('business_profiles')
            .update({
              subscription_status: 'past_due',
              subscription_updated_at: new Date().toISOString()
            })
            .eq('id', exhibitorId);
          
          if (error) {
            console.error('Failed to update business profile subscription status:', error);
          } else {
            console.log(`Updated subscription status to past_due for exhibitor: ${exhibitorId}`);
            
            // TODO: Send email notification to customer about payment failure
          }
        } catch (retrieveError) {
          console.error('Error retrieving subscription details:', retrieveError);
        }
        
        break;
      }
        
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const exhibitorId = subscription.metadata?.exhibitorId;
        
        if (!exhibitorId) {
          console.warn('No exhibitorId found in deleted subscription metadata');
          break;
        }
        
        console.log(`Subscription canceled for exhibitor: ${exhibitorId}`);
        
        // Update subscription status to canceled
        const { error } = await supabase
          .from('business_profiles')
          .update({
            subscription_status: 'canceled',
            subscription_updated_at: new Date().toISOString()
          })
          .eq('id', exhibitorId);
        
        if (error) {
          console.error('Failed to update business profile subscription status:', error);
        } else {
          console.log(`Updated subscription status to canceled for exhibitor: ${exhibitorId}`);
        }
        
        break;
      }
        
      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object;
        const exhibitorId = subscription.metadata?.exhibitorId;
        
        if (!exhibitorId) {
          console.warn('No exhibitorId found in trial ending subscription metadata');
          break;
        }
        
        console.log(`Trial ending soon for exhibitor: ${exhibitorId}`);
        
        // TODO: Send email notification to customer about trial ending
        
        break;
      }
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    res.status(500).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router; 