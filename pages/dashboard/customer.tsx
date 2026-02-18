import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  CalendarToday,
  FavoriteBorder,
  Favorite,
  ConfirmationNumber,
  TrendingUp,
  MusicNote,
} from '@mui/icons-material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRequireAuth } from '@/contexts/AuthContext';
import { UserRole, UserProfile, EventMacroCategoryLabels, EventMacroCategory } from '@/types';

const mockEvents = [
  {
    id: '1',
    title: 'Saturday Night Techno',
    description: 'Una serata indimenticabile con i migliori DJ della scena techno italiana.',
    macroCategory: EventMacroCategory.CLUB,
    startDate: '2026-03-01T23:00:00',
    venue: 'Fabric Club Milano',
    city: 'Milano',
    price: 20,
    image: '',
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Jazz & Wine Night',
    description: 'Serata jazz con degustazione vini in un\'atmosfera intima e raffinata.',
    macroCategory: EventMacroCategory.PUB_BAR,
    startDate: '2026-03-05T20:30:00',
    venue: 'Blue Note',
    city: 'Milano',
    price: 15,
    image: '',
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Beach Reggaeton Festival',
    description: 'Il festival estivo piu\' grande d\'Italia con artisti internazionali.',
    macroCategory: EventMacroCategory.BEACH_PARTY,
    startDate: '2026-06-15T18:00:00',
    venue: 'Spiaggia Libera',
    city: 'Rimini',
    price: 35,
    image: '',
    isFavorite: false,
  },
  {
    id: '4',
    title: 'Rooftop Sunset Aperitif',
    description: 'Aperitivo al tramonto con DJ set deep house e vista panoramica sulla citta\'.',
    macroCategory: EventMacroCategory.ROOFTOP_APERITIF,
    startDate: '2026-03-10T18:30:00',
    venue: 'Sky Terrace Roma',
    city: 'Roma',
    price: 25,
    image: '',
    isFavorite: false,
  },
];

const popularCategories = [
  { category: EventMacroCategory.CLUB, count: 128 },
  { category: EventMacroCategory.CONCERT, count: 95 },
  { category: EventMacroCategory.FESTIVAL, count: 42 },
  { category: EventMacroCategory.ROOFTOP_APERITIF, count: 67 },
  { category: EventMacroCategory.BEACH_PARTY, count: 31 },
  { category: EventMacroCategory.LIVE_SHOW, count: 58 },
];

export default function CustomerDashboard() {
  const { user, isLoading } = useRequireAuth([UserRole.CUSTOMER]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['2']));

  if (isLoading || !user) return null;

  const customerUser = user as UserProfile;
  const displayName = customerUser.firstName || customerUser.email.split('@')[0];

  const toggleFavorite = (eventId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout title="Scopri Eventi">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ciao {displayName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Scopri i migliori eventi nella tua zona
        </Typography>
      </Box>

      {/* Barra di ricerca */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Cerca eventi, artisti, locali..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="medium"
        />
      </Paper>

      {/* Categorie popolari */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp /> Categorie Popolari
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {popularCategories.map(({ category, count }) => (
            <Chip
              key={category}
              label={`${EventMacroCategoryLabels[category]} (${count})`}
              onClick={() => {}}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Per Te" icon={<MusicNote />} iconPosition="start" />
          <Tab label="Vicino a Te" icon={<LocationOn />} iconPosition="start" />
          <Tab label="In Arrivo" icon={<CalendarToday />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Eventi */}
      <Grid container spacing={3}>
        {mockEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  height: 180,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <MusicNote sx={{ fontSize: 48, color: 'grey.400' }} />
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
                  onClick={() => toggleFavorite(event.id)}
                >
                  {favorites.has(event.id) ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                <Chip
                  label={EventMacroCategoryLabels[event.macroCategory]}
                  size="small"
                  color="primary"
                  sx={{ position: 'absolute', bottom: 8, left: 8 }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {event.description.substring(0, 80)}...
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(event.startDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {event.venue}, {event.city}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">
                  {event.price === 0 ? 'Gratis' : `€${event.price}`}
                </Typography>
                <Button variant="contained" size="small" startIcon={<ConfirmationNumber />}>
                  Biglietti
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stats rapide */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">0</Typography>
              <Typography variant="body2" color="text.secondary">Biglietti Acquistati</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="secondary">{favorites.size}</Typography>
              <Typography variant="body2" color="text.secondary">Eventi Preferiti</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">0</Typography>
              <Typography variant="body2" color="text.secondary">Eventi Partecipati</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
