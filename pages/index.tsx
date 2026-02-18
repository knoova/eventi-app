import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    switch (user?.role) {
      case UserRole.BUSINESS:
        router.replace('/business/dashboard');
        break;
      case UserRole.ADMIN:
        router.replace('/admin/dashboard');
        break;
      case UserRole.CUSTOMER:
      default:
        router.replace('/dashboard/customer');
        break;
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">Caricamento...</Typography>
    </Box>
  );
}
