import React, { useState } from 'react';
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
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Euro as EuroIcon,
  TrendingUp,
  Visibility,
  Block,
  CheckCircle,
  Warning,
  Settings,
  BarChart,
  AdminPanelSettings,
  Refresh,
} from '@mui/icons-material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRequireAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const mockPlatformStats = {
  totalUsers: 1247,
  totalBusinesses: 89,
  totalEvents: 342,
  totalRevenue: 156780,
  monthlyRevenue: 23450,
  activeEvents: 67,
  pendingApprovals: 5,
  ticketsSoldToday: 156,
};

const mockRecentUsers = [
  { id: '1', name: 'Marco Rossi', email: 'marco@email.com', role: UserRole.CUSTOMER, createdAt: '2026-02-17', isActive: true },
  { id: '2', name: 'Evento Milano SRL', email: 'info@eventomilano.it', role: UserRole.BUSINESS, createdAt: '2026-02-16', isActive: true },
  { id: '3', name: 'Laura Bianchi', email: 'laura@email.com', role: UserRole.CUSTOMER, createdAt: '2026-02-16', isActive: true },
  { id: '4', name: 'Night Club Roma', email: 'booking@ncroma.it', role: UserRole.BUSINESS, createdAt: '2026-02-15', isActive: false },
  { id: '5', name: 'Giovanni Verdi', email: 'giovanni@email.com', role: UserRole.CUSTOMER, createdAt: '2026-02-15', isActive: true },
];

const mockRecentEvents = [
  { id: '1', title: 'Saturday Night Techno', business: 'Fabric Club', status: 'PUBLISHED', ticketsSold: 180, revenue: 3600, date: '2026-03-01' },
  { id: '2', title: 'Jazz Night Special', business: 'Blue Note', status: 'PUBLISHED', ticketsSold: 95, revenue: 1425, date: '2026-03-05' },
  { id: '3', title: 'Beach Festival 2026', business: 'Rimini Events', status: 'DRAFT', ticketsSold: 0, revenue: 0, date: '2026-06-15' },
  { id: '4', title: 'Underground Rave', business: 'Bunker Club', status: 'PUBLISHED', ticketsSold: 250, revenue: 5000, date: '2026-03-10' },
];

const mockAlerts = [
  { id: '1', type: 'warning' as const, message: '5 nuove aziende in attesa di approvazione', action: 'Revisiona' },
  { id: '2', type: 'info' as const, message: '3 eventi segnalati dagli utenti', action: 'Controlla' },
  { id: '3', type: 'success' as const, message: 'Pagamenti mensili elaborati correttamente', action: '' },
];

export default function AdminDashboard() {
  const { user, isLoading } = useRequireAuth([UserRole.ADMIN]);
  const [tabValue, setTabValue] = useState(0);

  if (isLoading || !user) return null;

  return (
    <DashboardLayout title="Pannello Amministrazione">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AdminPanelSettings /> Pannello Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestione completa della piattaforma Eventi App
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />}>
          Aggiorna Dati
        </Button>
      </Box>

      {/* Alerts */}
      <Box sx={{ mb: 3 }}>
        {mockAlerts.map((alert) => (
          <Alert
            key={alert.id}
            severity={alert.type}
            sx={{ mb: 1 }}
            action={
              alert.action ? (
                <Button color="inherit" size="small">{alert.action}</Button>
              ) : undefined
            }
          >
            {alert.message}
          </Alert>
        ))}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Utenti Totali</Typography>
                  <Typography variant="h3">{mockPlatformStats.totalUsers.toLocaleString()}</Typography>
                  <Typography variant="caption" color="success.main">+48 questa settimana</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'secondary.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Aziende</Typography>
                  <Typography variant="h3">{mockPlatformStats.totalBusinesses}</Typography>
                  <Chip label={`${mockPlatformStats.pendingApprovals} in attesa`} size="small" color="warning" sx={{ mt: 0.5 }} />
                </Box>
                <BusinessIcon sx={{ fontSize: 40, color: 'secondary.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'success.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Eventi</Typography>
                  <Typography variant="h3">{mockPlatformStats.totalEvents}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mockPlatformStats.activeEvents} attivi
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, color: 'success.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Ricavo Piattaforma</Typography>
                  <Typography variant="h3">€{(mockPlatformStats.totalRevenue / 1000).toFixed(0)}K</Typography>
                  <Typography variant="caption" color="success.main">
                    €{mockPlatformStats.monthlyRevenue.toLocaleString()} questo mese
                  </Typography>
                </Box>
                <EuroIcon sx={{ fontSize: 40, color: 'warning.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs per sezioni dettagliate */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Utenti Recenti" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Eventi Recenti" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Configurazione" icon={<Settings />} iconPosition="start" />
        </Tabs>

        {/* Tab Utenti */}
        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utente</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Ruolo</TableCell>
                  <TableCell>Registrazione</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockRecentUsers.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: u.role === UserRole.BUSINESS ? 'secondary.main' : 'primary.main' }}>
                          {u.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2">{u.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role === UserRole.BUSINESS ? 'Business' : 'Utente'}
                        color={u.role === UserRole.BUSINESS ? 'secondary' : 'primary'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{u.createdAt}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.isActive ? 'Attivo' : 'Sospeso'}
                        color={u.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Dettagli">
                        <IconButton size="small"><Visibility /></IconButton>
                      </Tooltip>
                      <Tooltip title={u.isActive ? 'Sospendi' : 'Riattiva'}>
                        <IconButton size="small">
                          {u.isActive ? <Block color="error" /> : <CheckCircle color="success" />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tab Eventi */}
        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Evento</TableCell>
                  <TableCell>Organizzatore</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Vendite</TableCell>
                  <TableCell>Ricavo</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockRecentEvents.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell><Typography variant="subtitle2">{event.title}</Typography></TableCell>
                    <TableCell>{event.business}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.status === 'PUBLISHED' ? 'Pubblicato' : event.status === 'DRAFT' ? 'Bozza' : event.status}
                        color={event.status === 'PUBLISHED' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{event.ticketsSold}</TableCell>
                    <TableCell>€{event.revenue.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Dettagli"><IconButton size="small"><Visibility /></IconButton></Tooltip>
                      <Tooltip title="Analytics"><IconButton size="small"><BarChart /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tab Configurazione */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Configurazione Piattaforma</Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Commissioni</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Commissione standard:</Typography>
                    <Typography variant="body2" fontWeight="bold">10%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Commissione minima:</Typography>
                    <Typography variant="body2" fontWeight="bold">5%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Commissione massima:</Typography>
                    <Typography variant="body2" fontWeight="bold">20%</Typography>
                  </Box>
                  <Button variant="outlined" size="small" sx={{ mt: 2 }}>Modifica</Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Limiti</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Max eventi per business:</Typography>
                    <Typography variant="body2" fontWeight="bold">50</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Max biglietti per evento:</Typography>
                    <Typography variant="body2" fontWeight="bold">10.000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Soglia pagamento minima:</Typography>
                    <Typography variant="body2" fontWeight="bold">€100</Typography>
                  </Box>
                  <Button variant="outlined" size="small" sx={{ mt: 2 }}>Modifica</Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Sponsorizzazioni</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Prezzo sponsorizzazione:</Typography>
                    <Typography variant="body2" fontWeight="bold">€50</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Durata sponsorizzazione:</Typography>
                    <Typography variant="body2" fontWeight="bold">7 giorni</Typography>
                  </Box>
                  <Button variant="outlined" size="small" sx={{ mt: 2 }}>Modifica</Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Stato Piattaforma</Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Piattaforma attiva"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Modalita' manutenzione"
                  />
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Provider pagamento: Stripe, PayPal, Satispay
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </DashboardLayout>
  );
}
