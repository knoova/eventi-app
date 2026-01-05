// pages/auth/register-business.tsx

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
  CircularProgress,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth as firebaseAuth, db, COLLECTIONS, serverTimestamp } from '@/lib/firebase/config';
import { UserRole } from '@/types';

// Schema di validazione
const registerBusinessSchema = z.object({
  // Step 1: Dati aziendali
  businessName: z.string().min(2, 'Nome azienda richiesto'),
  vatNumber: z.string().regex(/^[0-9]{11}$/, 'P.IVA deve essere di 11 cifre'),
  iban: z.string().regex(/^IT\d{2}[A-Z]\d{22}$/, 'IBAN non valido (formato IT...)'),
  
  // Step 2: Credenziali
  email: z.string().email('Email non valida'),
  password: z.string()
    .min(8, 'La password deve essere di almeno 8 caratteri')
    .regex(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola')
    .regex(/[0-9]/, 'La password deve contenere almeno un numero'),
  confirmPassword: z.string(),
  
  // Step 3: Termini
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: 'Devi accettare la privacy policy',
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Devi accettare i termini e condizioni',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
});

type RegisterBusinessFormData = z.infer<typeof registerBusinessSchema>;

const steps = ['Dati Aziendali', 'Credenziali', 'Termini e Condizioni'];

export default function RegisterBusinessPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<RegisterBusinessFormData>({
    resolver: zodResolver(registerBusinessSchema),
    defaultValues: {
      acceptPrivacy: false,
      acceptTerms: false,
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof RegisterBusinessFormData)[] = [];
    
    switch (activeStep) {
      case 0:
        fieldsToValidate = ['businessName', 'vatNumber', 'iban'];
        break;
      case 1:
        fieldsToValidate = ['email', 'password', 'confirmPassword'];
        break;
      case 2:
        fieldsToValidate = ['acceptPrivacy', 'acceptTerms'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (activeStep === steps.length - 1) {
        handleSubmit(onSubmit)();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data: RegisterBusinessFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Verifica che la P.IVA non sia già registrata
      const vatQuery = await getDoc(doc(db, 'businessVAT', data.vatNumber));
      if (vatQuery.exists()) {
        throw new Error('P.IVA già registrata');
      }

      // Crea l'utente in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );

      const userId = userCredential.user.uid;

      // Crea il documento business in Firestore
      await setDoc(doc(db, COLLECTIONS.BUSINESSES, userId), {
        id: userId,
        email: data.email,
        role: UserRole.BUSINESS,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // Dati aziendali
        businessName: data.businessName,
        vatNumber: data.vatNumber,
        iban: data.iban,
        fiscalCode: '',
        
        // Profilo pubblico (da completare dopo)
        description: '',
        profileImage: '',
        coverImage: '',
        location: null,
        phone: '',
        website: '',
        socialLinks: {},
        
        // Configurazioni
        commissionPercentage: 10, // Default 10%
        paymentThreshold: 100, // Default 100€
        
        // Compliance
        privacyAcceptedAt: serverTimestamp(),
        termsAcceptedAt: serverTimestamp(),
        
        // Stato account
        isActive: true,
        isVerified: false,
        isPremium: false,
        rating: null,
        totalEvents: 0,
        totalTicketsSold: 0,
        
        lastLoginAt: serverTimestamp(),
      });

      // Registra la P.IVA come utilizzata
      await setDoc(doc(db, 'businessVAT', data.vatNumber), {
        businessId: userId,
        createdAt: serverTimestamp(),
      });

      enqueueSnackbar('Registrazione business completata con successo!', { variant: 'success' });

      // Auto login dopo registrazione
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.ok) {
        router.push('/business/complete-profile');
      }
    } catch (error: any) {
      console.error('Errore registrazione business:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('Email già registrata');
      } else if (error.message === 'P.IVA già registrata') {
        setError('P.IVA già registrata');
      } else {
        setError('Si è verificato un errore durante la registrazione');
      }
      
      enqueueSnackbar(error.message || 'Errore durante la registrazione', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              {...register('businessName')}
              margin="normal"
              required
              fullWidth
              label="Nome Azienda / Locale"
              autoComplete="organization"
              error={!!errors.businessName}
              helperText={errors.businessName?.message}
              autoFocus
            />

            <TextField
              {...register('vatNumber')}
              margin="normal"
              required
              fullWidth
              label="Partita IVA"
              placeholder="12345678901"
              error={!!errors.vatNumber}
              helperText={errors.vatNumber?.message || 'Solo numeri, 11 cifre'}
              inputProps={{ maxLength: 11 }}
            />

            <TextField
              {...register('iban')}
              margin="normal"
              required
              fullWidth
              label="IBAN"
              placeholder="IT60X0542811101000000123456"
              error={!!errors.iban}
              helperText={errors.iban?.message || 'Per ricevere i pagamenti'}
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />
          </>
        );

      case 1:
        return (
          <>
            <TextField
              {...register('email')}
              margin="normal"
              required
              fullWidth
              label="Email aziendale"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

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
          </>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              La commissione standard è del 10% su ogni biglietto venduto. 
              Potrai richiedere condizioni personalizzate dopo la registrazione.
            </Alert>

            <Controller
              name="acceptPrivacy"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <Typography variant="body2">
                      Accetto la{' '}
                      <Link href="/business/privacy" passHref>
                        <Typography component="a" variant="body2" sx={{ color: 'primary.main' }}>
                          Privacy Policy Business
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
                      <Link href="/business/terms" passHref>
                        <Typography component="a" variant="body2" sx={{ color: 'primary.main' }}>
                          Termini e Condizioni Business
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
          </Box>
        );

      default:
        return null;
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

          <BusinessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />

          <Typography component="h1" variant="h4" gutterBottom>
            Registra la tua Azienda
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
            Inizia a vendere biglietti per i tuoi eventi
          </Typography>

          <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3, mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ width: '100%', mt: 2 }}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Indietro
              </Button>
              
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Registrati'
                ) : (
                  'Avanti'
                )}
              </Button>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2">
              La tua azienda è già registrata?{' '}
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
        destination: '/business/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};