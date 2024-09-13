import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you for your payment! Your session ID is: {sessionId}</p>
    </div>
  );
};

export default PaymentSuccess;
