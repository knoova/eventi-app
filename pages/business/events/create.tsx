import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CreateEventForm } from '@/components/business/CreateEventForm';
import { useRequireAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

export default function CreateEventPage() {
  const { user, isLoading } = useRequireAuth([UserRole.BUSINESS]);
  const router = useRouter();

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="Crea Nuovo Evento">
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/business/dashboard')}
          sx={{ mb: 2 }}
        >
          Torna alla Dashboard
        </Button>
        <Typography variant="h4" gutterBottom>
          Crea un Nuovo Evento
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Compila i dettagli del tuo evento e inizia a vendere biglietti
        </Typography>
      </Box>

      <CreateEventForm />
    </DashboardLayout>
  );
}
