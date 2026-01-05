// components/business/CreateEventForm.tsx (ESEMPIO)

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Autocomplete,
  Alert,
  FormHelperText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  EventMacroCategory,
  MusicGenre,
  ExperienceType,
  EventFormat,
  EventAtmosphere,
  EventMood,
  PriceRange,
  EventTimeSlot,
  CategorySuggestions,
  EventTimeSlotLabels,
} from '@/types';
import {
  EventMacroCategoryLabels,
  MusicGenreLabels,
  ExperienceLabels,
  FormatLabels,
  AtmosphereLabels,
  EventMoodLabels,
  getTimeSlotFromHour,
  getPriceRangeFromAmount,
} from '@/utils/eventCategories';
import dayjs from 'dayjs';

interface CreateEventFormData {
  title: string;
  description: string;
  macroCategory: EventMacroCategory | '';
  musicGenres: MusicGenre[];
  experienceTypes: ExperienceType[];
  format: EventFormat | '';
  atmospheres: EventAtmosphere[];
  mood: EventMood | '';
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  hashtags: string[];
}

export const CreateEventForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: '',
    description: '',
    macroCategory: '',
    musicGenres: [],
    experienceTypes: [],
    format: '',
    atmospheres: [],
    mood: '',
    startDate: null,
    endDate: null,
    hashtags: [],
  });

  const [suggestions, setSuggestions] = useState<typeof CategorySuggestions[EventMacroCategory.CLUB]>();

  // Quando cambia la categoria, mostra suggerimenti
  const handleCategoryChange = (category: EventMacroCategory) => {
    setFormData({ ...formData, macroCategory: category });
    const categorySuggestions = CategorySuggestions[category];
    setSuggestions(categorySuggestions);
  };

  // Auto-calcola time slot e price range basandosi su orario e prezzi
  const getAutoCalculatedValues = () => {
    if (!formData.startDate) return {};
    
    const hour = formData.startDate.hour();
    const timeSlot = getTimeSlotFromHour(hour);
    
    return { timeSlot };
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Crea Nuovo Evento
      </Typography>

      <Grid container spacing={3}>
        {/* Informazioni Base */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Titolo Evento"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            helperText="Es: Saturday Night Techno"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descrizione"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            helperText="Descrivi l'atmosfera, gli artisti, cosa rende speciale questo evento"
          />
        </Grid>

        {/* Categoria Principale */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Tipo di Evento</InputLabel>
            <Select
              value={formData.macroCategory}
              onChange={(e) => handleCategoryChange(e.target.value as EventMacroCategory)}
              label="Tipo di Evento"
            >
              {Object.entries(EventMacroCategoryLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Scegli la categoria principale del tuo evento</FormHelperText>
          </FormControl>
        </Grid>

        {/* Formato */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Formato</InputLabel>
            <Select
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value as EventFormat })}
              label="Formato"
            >
              {Object.entries(FormatLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Suggerimenti basati sulla categoria */}
        {suggestions && (
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                Suggerimenti per {EventMacroCategoryLabels[formData.macroCategory as EventMacroCategory]}:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {suggestions.suggestedGenres.map((genre) => (
                  <Chip
                    key={genre}
                    label={MusicGenreLabels[genre]}
                    size="small"
                    onClick={() => {
                      if (!formData.musicGenres.includes(genre)) {
                        setFormData({
                          ...formData,
                          musicGenres: [...formData.musicGenres, genre],
                        });
                      }
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Alert>
          </Grid>
        )}

        {/* Generi Musicali */}
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={Object.keys(MusicGenreLabels) as MusicGenre[]}
            getOptionLabel={(option) => MusicGenreLabels[option]}
            value={formData.musicGenres}
            onChange={(_, newValue) => setFormData({ ...formData, musicGenres: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Generi Musicali"
                placeholder="Seleziona uno o più generi"
                helperText="I generi aiutano gli utenti a trovare eventi di loro interesse"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={MusicGenreLabels[option]}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </Grid>

        {/* Tipo di Esperienza */}
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={Object.keys(ExperienceLabels) as ExperienceType[]}
            getOptionLabel={(option) => ExperienceLabels[option]}
            value={formData.experienceTypes}
            onChange={(_, newValue) => setFormData({ ...formData, experienceTypes: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo di Esperienza"
                placeholder="DJ Set, Live Band, etc."
              />
            )}
          />
        </Grid>

        {/* Atmosfera */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={Object.keys(AtmosphereLabels) as EventAtmosphere[]}
            getOptionLabel={(option) => AtmosphereLabels[option]}
            value={formData.atmospheres}
            onChange={(_, newValue) => setFormData({ ...formData, atmospheres: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Atmosfera"
                placeholder="Seleziona l'atmosfera dell'evento"
              />
            )}
          />
        </Grid>

        {/* Mood */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Mood</InputLabel>
            <Select
              value={formData.mood}
              onChange={(e) => setFormData({ ...formData, mood: e.target.value as EventMood })}
              label="Mood"
            >
              {Object.entries(EventMoodLabels).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Date e Orari */}
        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Inizio Evento"
            value={formData.startDate}
            onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="Fine Evento"
            value={formData.endDate}
            onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
            minDateTime={formData.startDate || undefined}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
            }}
          />
        </Grid>

        {/* Hashtags */}
        <Grid item xs={12}>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formData.hashtags}
            onChange={(_, newValue) => setFormData({ ...formData, hashtags: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Hashtags"
                placeholder="Aggiungi hashtags (premi Enter)"
                helperText="Gli hashtag aiutano nella ricerca e nel targeting"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={`#${option}`}
                  {...getTagProps({ index })}
                  size="small"
                />
              ))
            }
          />
        </Grid>

        {/* Auto-calculated values preview */}
        {formData.startDate && (
          <Grid item xs={12}>
            <Alert severity="success">
              <Typography variant="body2">
                Fascia oraria automatica: {getAutoCalculatedValues().timeSlot && 
                  EventTimeSlotLabels[getAutoCalculatedValues().timeSlot as EventTimeSlot]
                }
              </Typography>
            </Alert>
          </Grid>
        )}

        {/* Submit */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined">
              Salva Bozza
            </Button>
            <Button variant="contained" color="primary">
              Continua con i Biglietti
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};