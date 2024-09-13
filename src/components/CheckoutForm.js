import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
    },
  });

  const handleBillingDetailsChange = (event) => {
    const { name, value } = event.target;
    if (name.includes('address')) {
      const addressField = name.split('.')[1];
      setBillingDetails((prevDetails) => ({
        ...prevDetails,
        address: {
          ...prevDetails.address,
          [addressField]: value,
        },
      }));
    } else {
      setBillingDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: billingDetails,
    });

    if (error) {
      setErrorMessage(error.message);
      setPaymentProcessing(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/create-payment-intent', {
        paymentMethodId: paymentMethod.id,
        amount: amount,
      });

      const { clientSecret } = response.data;

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        setErrorMessage(confirmError.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSuccessMessage('Payment successful!');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const renderOrderSummary = () => (
    <Box mb={3}>
      <Typography variant="h6">Order Summary</Typography>
      <Typography>Product 1 - ${amount / 100}</Typography>
      <Typography variant="subtitle1">Total: ${amount / 100}</Typography>
    </Box>
  );

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Complete Your Purchase
      </Typography>
      {renderOrderSummary()}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={billingDetails.name}
          onChange={handleBillingDetailsChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={billingDetails.email}
          onChange={handleBillingDetailsChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Address"
          name="address.line1"
          value={billingDetails.address.line1}
          onChange={handleBillingDetailsChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="City"
          name="address.city"
          value={billingDetails.address.city}
          onChange={handleBillingDetailsChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="State"
          name="address.state"
          value={billingDetails.address.state}
          onChange={handleBillingDetailsChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Postal Code"
          name="address.postal_code"
          value={billingDetails.address.postal_code}
          onChange={handleBillingDetailsChange}
          margin="normal"
          required
        />
        <Box mt={3} mb={3}>
          <CardElement options={{ style: cardStyle }} />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!stripe || paymentProcessing}
        >
          {paymentProcessing ? 'Processing...' : `Pay $${amount / 100}`}
        </Button>
        {errorMessage && <Typography color="error" mt={2}>{errorMessage}</Typography>}
        {successMessage && <Typography color="primary" mt={2}>{successMessage}</Typography>}
      </form>
    </Container>
  );
};

export default CheckoutForm;
