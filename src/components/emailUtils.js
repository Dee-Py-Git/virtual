import axios from 'axios';

export const handleResendVerificationEmail = async (email) => {
  console.log("Resending email to:", email);  // Debugging line to check email value

  if (!email) {
    alert('Ongeldig e-mailadres. Probeer het opnieuw.');
    return;
  }

  try {
    const response = await axios.post('http://127.0.0.1:5000/resend-verification-email', { email });
    console.log('Server response:', response.data);  // Debugging line to check server response
    alert('Een nieuwe bevestigingsmail is verzonden.');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);  // More detailed error logging
    alert('Er is een fout opgetreden bij het verzenden van de bevestigingsmail. Probeer het opnieuw.');
  }
};
