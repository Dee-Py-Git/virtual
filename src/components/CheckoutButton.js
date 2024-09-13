// CheckoutButton.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import PropTypes from 'prop-types';

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe('pk_test_51PqehG2N8W9T8gipXUuE6GIXNbA2HylV9Y2QmrjaPbaSWiviLXX34tlPAaG7GfwM5DERXO3W6RyUq9K7uJ6EIIFQ00dRTpuMhN');

function CheckoutButton({ amount }) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default to card payment

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    // Call your backend to create a Checkout session
    const response = await axios.post('http://127.0.0.1:5000/create-checkout-session', {
      amount: parseInt(amount, 10), // Convert amount to integer
      payment_method_type: paymentMethod,
    });

    const { id: sessionId } = response.data;

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      console.error('Stripe checkout error:', error);
    }
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={() => setPaymentMethod('card')}
        />
        Credit Card
      </label>
      <label>
        <input
          type="radio"
          value="ideal"
          checked={paymentMethod === 'ideal'}
          onChange={() => setPaymentMethod('ideal')}
        />
        iDEAL
      </label>
      <button onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}

CheckoutButton.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CheckoutButton;
