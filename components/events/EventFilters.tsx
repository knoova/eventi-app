// components/events/EventFilters.tsx

import React, { useState } from 'react';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Badge,
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
  MusicNote,
  Category,
  AttachMoney,
  AccessTime,
  Mood,
  Place,
} from '@mui/icons-material';
import {
  EventMacroCategory,
  MusicGenre,
  ExperienceType,
  EventFormat,
  EventAtmosphere,
  EventMood,
  PriceRange,
  EventTimeSlot,
  EventSearchParams,
} from '@/types';
import {
  EventMacroCategoryLabels,
  MusicGenreLabels,
  AtmosphereLabels,
  ExperienceLabels,
  FormatLabels,
  EventMoodLabels,
  PriceRangeLabels,
  EventTimeSlotLabels,
  GenreGroups,
} from '../../utils/eventCategories';

interface EventFiltersProps {
  filters: EventSearchParams;
  onFiltersChange: (filters: EventSearchParams) => void;
  onReset: () => void;
  showCompact?: boolean;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  showCompact = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories']);

  // Conta filtri attivi
  const activeFiltersCount = [
    filters.macroCategories?.length || 0,
    filters.musicGenres?.length || 0,
    filters.experienceTypes?.length || 0,
    filters.formats?.length || 0,
    filters.atmospheres?.length || 0,
    filters.priceRange?.length || 0,
    filters.timeSlots?.length || 0,
    filters.moods?.length || 0,
  ].reduce((a, b) => a + b, 0);

  const handleSectionToggle = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const updateFilter = <K extends keyof EventSearchParams>(
    key: K,
    value: EventSearchParams[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T,>(
    key: keyof EventSearchParams,
    value: T,
    currentArray?: T[]
  ) => {
    const array = currentArray || [];
    const newArray = array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
    
    updateFilter(key, newArray.length > 0 ? newArray as string[] : undefined);
  };

  if (showCompact) {
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge badgeContent={activeFiltersCount} color="primary">
            <IconButton size="small">
              <FilterList />
            </IconButton>
          </Badge>
          
          {filters.macroCategories?.map((cat) => (
            <Chip
              key={cat}
              label={EventMacroCategoryLabels[cat]}
              onDelete={() => toggleArrayFilter('macroCategories', cat, filters.macroCategories)}
              size="small"
            />
          ))}
          
          {filters.musicGenres?.map((genre) => (
            <Chip
              key={genre}
              label={MusicGenreLabels[genre]}
              onDelete={() => toggleArrayFilter('musicGenres', genre, filters.musicGenres)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
          
          {activeFiltersCount > 0 && (
            <Button size="small" onClick={onReset} startIcon={<Clear />}>
              Pulisci filtri
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Filtri {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Typography>
        {activeFiltersCount > 0 && (
          <Button size="small" onClick={onReset} startIcon={<Clear />}>
            Reset
          </Button>
        )}
      </Box>

      {/* Categorie Macro */}
      <Accordion
        expanded={expandedSections.includes('categories')}
        onChange={() => handleSectionToggle('categories')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Category sx={{ mr: 1 }} />
          <Typography>Categorie Eventi</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(EventMacroCategoryLabels).map(([key, label]) => (
              <Chip
                key={key}
                label={label as string}
                onClick={() =>
                  toggleArrayFilter(
                    'macroCategories',
                    key as EventMacroCategory,
                    filters.macroCategories
                  )
                }
                color={filters.macroCategories?.includes(key as EventMacroCategory) ? 'primary' : 'default'}
                variant={filters.macroCategories?.includes(key as EventMacroCategory) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Generi Musicali */}
      <Accordion
        expanded={expandedSections.includes('genres')}
        onChange={() => handleSectionToggle('genres')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <MusicNote sx={{ mr: 1 }} />
          <Typography>Generi Musicali</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(GenreGroups).map(([groupKey, group]) => {
            const typedGroup = group as { label: string; genres: MusicGenre[] };
            return (
              <Box key={groupKey} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {typedGroup.label}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {typedGroup.genres.map((genre) => (
                    <Chip
                      key={genre}
                      label={MusicGenreLabels[genre]}
                      size="small"
                      onClick={() =>
                        toggleArrayFilter('musicGenres', genre, filters.musicGenres)
                      }
                      color={filters.musicGenres?.includes(genre) ? 'primary' : 'default'}
                      variant={filters.musicGenres?.includes(genre) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
        </AccordionDetails>
      </Accordion>

      {/* Fasce di Prezzo */}
      <Accordion
        expanded={expandedSections.includes('price')}
        onChange={() => handleSectionToggle('price')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <AttachMoney sx={{ mr: 1 }} />
          <Typography>Fascia di Prezzo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {Object.entries(PriceRangeLabels).map(([key, label]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={filters.priceRange?.includes(key as PriceRange) || false}
                    onChange={() =>
                      toggleArrayFilter('priceRange', key as PriceRange, filters.priceRange)
                    }
                  />
                }
                label={label as string}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Orari */}
      <Accordion
        expanded={expandedSections.includes('time')}
        onChange={() => handleSectionToggle('time')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <AccessTime sx={{ mr: 1 }} />
          <Typography>Orario</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {Object.entries(EventTimeSlotLabels).map(([key, label]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={filters.timeSlots?.includes(key as EventTimeSlot) || false}
                    onChange={() =>
                      toggleArrayFilter('timeSlots', key as EventTimeSlot, filters.timeSlots)
                    }
                  />
                }
                label={label as string}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Mood */}
      <Accordion
        expanded={expandedSections.includes('mood')}
        onChange={() => handleSectionToggle('mood')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Mood sx={{ mr: 1 }} />
          <Typography>Mood</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(EventMoodLabels).map(([key, label]) => (
              <Chip
                key={key}
                label={label as string}
                onClick={() =>
                  toggleArrayFilter('moods', key as EventMood, filters.moods)
                }
                color={filters.moods?.includes(key as EventMood) ? 'secondary' : 'default'}
                variant={filters.moods?.includes(key as EventMood) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Atmosfera */}
      <Accordion
        expanded={expandedSections.includes('atmosphere')}
        onChange={() => handleSectionToggle('atmosphere')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Place sx={{ mr: 1 }} />
          <Typography>Atmosfera</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {Object.entries(AtmosphereLabels).map(([key, label]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={filters.atmospheres?.includes(key as EventAtmosphere) || false}
                    onChange={() =>
                      toggleArrayFilter('atmospheres', key as EventAtmosphere, filters.atmospheres)
                    }
                    size="small"
                  />
                }
                label={<Typography variant="body2">{label as string}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Accessibilità */}
      <Accordion
        expanded={expandedSections.includes('accessibility')}
        onChange={() => handleSectionToggle('accessibility')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Accessibilità & Extra</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.accessibility?.petFriendly || false}
                  onChange={(e) =>
                    updateFilter('accessibility', {
                      ...filters.accessibility,
                      petFriendly: e.target.checked,
                    })
                  }
                />
              }
              label="Pet Friendly"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.accessibility?.wheelchairAccessible || false}
                  onChange={(e) =>
                    updateFilter('accessibility', {
                      ...filters.accessibility,
                      wheelchairAccessible: e.target.checked,
                    })
                  }
                />
              }
              label="Accessibile in carrozzina"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.foodDrink?.openBar || false}
                  onChange={(e) =>
                    updateFilter('foodDrink', {
                      ...filters.foodDrink,
                      openBar: e.target.checked,
                    })
                  }
                />
              }
              label="Open Bar"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.foodDrink?.streetFood || false}
                  onChange={(e) =>
                    updateFilter('foodDrink', {
                      ...filters.foodDrink,
                      streetFood: e.target.checked,
                    })
                  }
                />
              }
              label="Street Food"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};