// frontend/src/components/auth/Auth.jsx
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, provider } from '../../firebaseConfig';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Button, CircularProgress, Container, Typography, Paper, Grid, TextField, FormControlLabel, Checkbox, Link, CssBaseline } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import './Auth.css';

const Auth = () => {
    const [user, loading, error] = useAuthState(auth);
    const [isSignUp, setIsSignUp] = useState(false);
    const [authError, setAuthError] = useState(null);

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).catch(error => setAuthError(error.message));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");

        if (isSignUp) {
            createUserWithEmailAndPassword(auth, email, password)
                .catch(error => setAuthError(error.message));
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .catch(error => setAuthError(error.message));
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || authError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">
                    Erro: {error?.message || authError}
                </Typography>
            </Box>
        );
    }

    return (
        <div className="AuthContainer">
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box sx={{ marginTop: 8 }}>
                    <Grid container>
                        <Grid
                            item
                            xs={false}
                            sm={4}
                            md={7}
                            className="auth-background"
                        />
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                            <Box
                                sx={{
                                    my: 8,
                                    mx: 4,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography component="h1" variant="h5">
                                    {isSignUp ? 'Registrar-se' : 'Entrar'}
                                </Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Endereço de E-mail"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Senha"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox value="remember" color="primary" />}
                                        label="Lembrar-me"
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        {isSignUp ? 'Registrar-se' : 'Entrar'}
                                    </Button>
                                    <Grid container>
                                        <Grid item xs>
                                            <Link href="#" variant="body2">
                                                Esqueceu a senha?
                                            </Link>
                                        </Grid>
                                        <Grid item>
                                            <Link href="#" variant="body2" onClick={() => setIsSignUp(!isSignUp)}>
                                                {isSignUp ? "Já tem uma conta? Entre" : "Não tem uma conta? Registre-se"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                                        Ou
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<GoogleIcon />}
                                        onClick={signInWithGoogle}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Entrar com Google
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    );
};

export default Auth;
