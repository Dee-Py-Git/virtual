import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleResendVerificationEmail } from './emailUtils'; // Import the utility function

import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme(); // Use the theme

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/verify/${token}`);
        setMessage(response.data.message);
        setStatus('success');
      } catch (error) {
        setMessage(error.response?.data?.message || 'Er is iets misgegaan bij de verificatie.');
        setEmail(error.response?.data?.email || null); // Store the email from the error response
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress />
            <Typography component="h1" variant="h5" sx={{ mt: 2 }} color="text.primary">
              Bezig met verifiëren...
            </Typography>
          </>
        )}
        {status === 'success' && (
          <>
            <Avatar sx={{ m: 1, bgcolor: theme.palette.success.main }}>
              <CheckCircleOutlineIcon />
            </Avatar>
            <Typography component="h1" variant="h5" color="text.primary">
              Succesvol Geverifieerd
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              {message}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => navigate('/')}
            >
              Ga naar Inloggen
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <Avatar sx={{ m: 1, bgcolor: theme.palette.error.main }}>
              <ErrorOutlineIcon />
            </Avatar>
            <Typography component="h1" variant="h5" color="text.primary">
              Verificatie Mislukt
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              {message}
            </Typography>
            <TextField
              label="E-mailadres"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => handleResendVerificationEmail(email)}
            >
              Nieuwe bevestigingsmail aanvragen
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
