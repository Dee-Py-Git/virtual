import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { handleResendVerificationEmail } from './emailUtils'; // Import the utility function


import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <a color="inherit" href="https://mui.com/">
        Scanmehuis
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [allowExtraEmails, setAllowExtraEmails] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/register', {
        firstName,
        lastName,
        email,
        password,
        allowExtraEmails,
      });
      console.log(response);
      setIsSignedUp(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Er was een fout bij de registratie!', error);
      setErrorMessage('Er is een fout opgetreden bij de registratie. Probeer het opnieuw.');
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {!isSignedUp ? (
            <>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Aanmelden
              </Typography>
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="Voornaam"
                      autoFocus
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Achternaam"
                      name="lastName"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="E-mailadres"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="wachtwoord"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="allowExtraEmails"
                          color="primary"
                          checked={allowExtraEmails}
                          onChange={(e) => setAllowExtraEmails(e.target.checked)}
                        />
                      }
                      label="Ik wil marketingacties en updates ontvangen via e-mail."
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Aanmelden
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <RouterLink to="/login" variant="body2">
                      Heb je al een account? Log in
                    </RouterLink>
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            <>
              <Typography component="h1" variant="h5">
                Account bevestigen
              </Typography>
              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Bedankt voor je aanmelding!
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                We hebben je een e-mail gestuurd met een persoonlijke link.
                Klik op deze link om je e-mailadres te bevestigen en in te loggen.
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Heeft u de e-mail met de link om uw account te bevestigen niet ontvangen?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleResendVerificationEmail(email)} // Use the imported utility function
                >
                Nieuwe bevestigingsmail aanvragen
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/login')}
              >
                Terug naar Scanmehuis
              </Button>
            </>
          )}
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
