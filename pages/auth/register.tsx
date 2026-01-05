// pages/auth/register.tsx

import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  ArrowBack,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth as firebaseAuth, db, COLLECTIONS, serverTimestamp } from '@/lib/firebase/config';
import { UserRole } from '@/types';
import dayjs, { Dayjs } from 'dayjs';

// Schema di validazione
const registerSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string()
    .min(8, 'La password deve essere di almeno 8 caratteri')
    .regex(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola')
    .regex(/[0-9]/, 'La password deve contenere almeno un numero'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  lastName: z.string().min(2, 'Il cognome deve essere di almeno 2 caratteri'),
  birthDate: z.any().refine((val) => val && dayjs(val).isValid(), {
    message: 'Data di nascita richiesta',
  }),
  birthPlace: z.string().min(2, 'Luogo di nascita richiesto'),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: 'Devi accettare la privacy policy',
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Devi accettare i termini e condizioni',
  }),
  marketingConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptPrivacy: false,
      acceptTerms: false,
      marketingConsent: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Crea l'utente in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );

      const userId = userCredential.user.uid;

      // Crea il documento utente in Firestore
      await setDoc(doc(db, COLLECTIONS.USERS, userId), {
        id: userId,
        email: data.email,
        role: UserRole.CUSTOMER,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // Dati personali
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: dayjs(data.birthDate).toDate(),
        birthPlace: data.birthPlace,
        profileImage: '',
        
        // Preferenze (vuote per ora)
        interests: [],
        musicGenres: [],
        eventTypes: [],
        defaultLocation: null,
        
        // Compliance
        privacyAcceptedAt: serverTimestamp(),
        termsAcceptedAt: serverTimestamp(),
        marketingConsent: data.marketingConsent || false,
        
        // Stato account
        isActive: true,
        isVerified: false,
        emailVerified: null,
        lastLoginAt: serverTimestamp(),
      });

      enqueueSnackbar('Registrazione completata con successo!', { variant: 'success' });

      // Auto login dopo registrazione
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.ok) {
        router.push('/');
      }
    } catch (error: any) {
      console.error('Errore registrazione:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('Email già registrata');
      } else if (error.code === 'auth/weak-password') {
        setError('Password troppo debole');
      } else {
        setError('Si è verificato un errore durante la registrazione');
      }
      
      enqueueSnackbar(error.message || 'Errore durante la registrazione', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      enqueueSnackbar('Errore durante il login con Google', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ width: '100%', mb: 2 }}>
            <IconButton onClick={() => router.push('/auth/login')} edge="start">
              <ArrowBack />
            </IconButton>
          </Box>

          <Typography component="h1" variant="h4" gutterBottom>
            Crea il tuo account
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
            Registrati per prenotare biglietti e scoprire eventi incredibili
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                {...register('firstName')}
                margin="normal"
                required
                fullWidth
                label="Nome"
                autoComplete="given-name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                {...register('lastName')}
                margin="normal"
                required
                fullWidth
                label="Cognome"
                autoComplete="family-name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Box>

            <TextField
              {...register('email')}
              margin="normal"
              required
              fullWidth
              label="Email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data di nascita"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        margin: 'normal',
                        required: true,
                        fullWidth: true,
                        error: !!errors.birthDate,
                        helperText: errors.birthDate?.message as string,
                      },
                    }}
                    maxDate={dayjs().subtract(18, 'year')}
                  />
                )}
              />

              <TextField
                {...register('birthPlace')}
                margin="normal"
                required
                fullWidth
                label="Luogo di nascita"
                error={!!errors.birthPlace}
                helperText={errors.birthPlace?.message}
              />
            </Box>

            <TextField
              {...register('password')}
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              {...register('confirmPassword')}
              margin="normal"
              required
              fullWidth
              label="Conferma Password"
              type={showConfirmPassword ? 'text' : 'password'}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 2 }}>
              <Controller
                name="acceptPrivacy"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={
                      <Typography variant="body2">
                        Accetto la{' '}
                        <Link href="/privacy" passHref>
                          <Typography component="a" variant="body2" sx={{ color: 'primary.main' }}>
                            Privacy Policy
                          </Typography>
                        </Link>
                      </Typography>
                    }
                  />
                )}
              />
              {errors.acceptPrivacy && (
                <FormHelperText error>{errors.acceptPrivacy.message}</FormHelperText>
              )}

              <Controller
                name="acceptTerms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={
                      <Typography variant="body2">
                        Accetto i{' '}
                        <Link href="/terms" passHref>
                          <Typography component="a" variant="body2" sx={{ color: 'primary.main' }}>
                            Termini e Condizioni
                          </Typography>
                        </Link>
                      </Typography>
                    }
                  />
                )}
              />
              {errors.acceptTerms && (
                <FormHelperText error>{errors.acceptTerms.message}</FormHelperText>
              )}

              <Controller
                name="marketingConsent"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={
                      <Typography variant="body2">
                        Accetto di ricevere comunicazioni promozionali (opzionale)
                      </Typography>
                    }
                  />
                )}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Registrati'}
            </Button>

            <Divider sx={{ my: 3 }}>oppure</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              Continua con Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Hai già un account?{' '}
                <Link href="/auth/login" passHref>
                  <Typography
                    variant="body2"
                    component="a"
                    sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'medium' }}
                  >
                    Accedi
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

// Redirect se già autenticato
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};