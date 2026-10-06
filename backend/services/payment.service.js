const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

const createCheckoutSession = async (orderId, successUrl, cancelUrl) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    client_reference_id: orderId,
    success_url: successUrl || 'http://localhost:5173/payment-success',
    cancel_url: cancelUrl || 'http://localhost:5173/payment-cancel',
    metadata: { orderId },
    // Minimal line item - total amount
    line_items: [{
      price_data: {
        currency: 'pkr'.toUpperCase(),
        product_data: { name: 'Wear Out Order' },
        unit_amount: 0, // Will be set by frontend from order total
      },
      quantity: 1,
    }],
  });

  return { sessionId: session.id, url: session.url };
};

module.exports = { createCheckoutSession };