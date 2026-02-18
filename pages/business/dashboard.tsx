import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Event as EventIcon,
  ConfirmationNumber as TicketIcon,
  Euro as EuroIcon,
  TrendingUp,
  Visibility,
  Edit,
  MoreVert,
  People,
  BarChart,
} from '@mui/icons-material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRequireAuth } from '@/contexts/AuthContext';
import { UserRole, BusinessProfile, EventStatus } from '@/types';

const mockStats = {
  totalEvents: 5,
  activeEvents: 2,
  totalTicketsSold: 342,
  totalRevenue: 6840,
  monthlyRevenue: 2150,
  conversionRate: 12.4,
};

const mockEvents = [
  {
    id: '1',
    title: 'Saturday Night Techno',
    startDate: '2026-03-01T23:00:00',
    status: EventStatus.PUBLISHED,
    ticketsSold: 180,
    maxCapacity: 300,
    revenue: 3600,
  },
  {
    id: '2',
    title: 'Deep House Sunday',
    startDate: '2026-03-08T20:00:00',
    status: EventStatus.PUBLISHED,
    ticketsSold: 95,
    maxCapacity: 200,
    revenue: 1425,
  },
  {
    id: '3',
    title: 'Aperitivo Live Jazz',
    startDate: '2026-03-15T18:30:00',
    status: EventStatus.DRAFT,
    ticketsSold: 0,
    maxCapacity: 100,
    revenue: 0,
  },
  {
    id: '4',
    title: 'Notte Latina',
    startDate: '2026-02-15T22:00:00',
    status: EventStatus.COMPLETED,
    ticketsSold: 67,
    maxCapacity: 150,
    revenue: 1815,
  },
];

const statusColors: Record<EventStatus, 'success' | 'warning' | 'default' | 'error'> = {
  [EventStatus.PUBLISHED]: 'success',
  [EventStatus.DRAFT]: 'warning',
  [EventStatus.COMPLETED]: 'default',
  [EventStatus.CANCELLED]: 'error',
};

const statusLabels: Record<EventStatus, string> = {
  [EventStatus.PUBLISHED]: 'Pubblicato',
  [EventStatus.DRAFT]: 'Bozza',
  [EventStatus.COMPLETED]: 'Completato',
  [EventStatus.CANCELLED]: 'Annullato',
};

export default function BusinessDashboard() {
  const { user, isLoading } = useRequireAuth([UserRole.BUSINESS]);
  const router = useRouter();

  if (isLoading || !user) return null;

  const businessUser = user as BusinessProfile;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout title="Dashboard Business">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {businessUser.businessName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Panoramica della tua attivita'
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => router.push('/business/events/create')}
        >
          Crea Nuovo Evento
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Eventi Attivi</Typography>
                  <Typography variant="h3">{mockStats.activeEvents}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    su {mockStats.totalEvents} totali
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, color: 'primary.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Biglietti Venduti</Typography>
                  <Typography variant="h3">{mockStats.totalTicketsSold}</Typography>
                  <Typography variant="caption" color="success.main">
                    +23% vs mese scorso
                  </Typography>
                </Box>
                <TicketIcon sx={{ fontSize: 40, color: 'secondary.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Ricavo Totale</Typography>
                  <Typography variant="h3">€{mockStats.totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    €{mockStats.monthlyRevenue} questo mese
                  </Typography>
                </Box>
                <EuroIcon sx={{ fontSize: 40, color: 'success.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Tasso Conversione</Typography>
                  <Typography variant="h3">{mockStats.conversionRate}%</Typography>
                  <Typography variant="caption" color="success.main">
                    +2.1% vs media
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabella Eventi */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">I Miei Eventi</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push('/business/events')}
          >
            Vedi Tutti
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Evento</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Stato</TableCell>
                <TableCell>Biglietti</TableCell>
                <TableCell>Ricavo</TableCell>
                <TableCell align="right">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{event.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(event.startDate)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[event.status]}
                      color={statusColors[event.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1, maxWidth: 100 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(event.ticketsSold / event.maxCapacity) * 100}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      <Typography variant="caption">
                        {event.ticketsSold}/{event.maxCapacity}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      €{event.revenue.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizza">
                      <IconButton size="small"><Visibility /></IconButton>
                    </Tooltip>
                    <Tooltip title="Modifica">
                      <IconButton size="small"><Edit /></IconButton>
                    </Tooltip>
                    <Tooltip title="Analytics">
                      <IconButton size="small"><BarChart /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom>Azioni Rapide</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => router.push('/business/events/create')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1">Crea Evento</Typography>
              <Typography variant="caption" color="text.secondary">
                Pubblica un nuovo evento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => router.push('/business/tickets')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <TicketIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="subtitle1">Gestisci Biglietti</Typography>
              <Typography variant="caption" color="text.secondary">
                Controlla vendite e check-in
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => router.push('/business/analytics')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <BarChart sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="subtitle1">Analytics</Typography>
              <Typography variant="caption" color="text.secondary">
                Statistiche dettagliate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            onClick={() => router.push('/business/profile')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <People sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="subtitle1">Profilo Azienda</Typography>
              <Typography variant="caption" color="text.secondary">
                Modifica informazioni
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
