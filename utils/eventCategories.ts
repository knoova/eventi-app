// utils/eventCategories.ts

import {
  EventMacroCategory,
  MusicGenre,
  ExperienceType,
  EventFormat,
  EventAtmosphere,
  EventMood,
  PriceRange,
  EventTimeSlot,
  EventMacroCategoryLabels,
  MusicGenreLabels,
  EventMoodLabels,
  PriceRangeLabels,
  EventTimeSlotLabels,
  TimeSlotRanges,
} from '@/types';

// Icone Material-UI per ogni categoria macro
export const CategoryIcons: Record<EventMacroCategory, string> = {
  [EventMacroCategory.CONCERT]: 'MusicNote',
  [EventMacroCategory.CLUB]: 'Nightlife',
  [EventMacroCategory.PUB_BAR]: 'LocalBar',
  [EventMacroCategory.FESTIVAL]: 'Festival',
  [EventMacroCategory.PRIVATE_PARTY]: 'Lock',
  [EventMacroCategory.LIVE_SHOW]: 'TheaterComedy',
  [EventMacroCategory.ROOFTOP_APERITIF]: 'Deck',
  [EventMacroCategory.BEACH_PARTY]: 'BeachAccess',
  [EventMacroCategory.AFTERPARTY]: 'NightlightRound',
  [EventMacroCategory.STREET_EVENT]: 'Streetview',
  [EventMacroCategory.BOAT_PARTY]: 'DirectionsBoat',
  [EventMacroCategory.RAVE_UNDERGROUND]: 'Bolt',
};

// Colori per mood
export const MoodColors: Record<EventMood, string> = {
  [EventMood.CHILL]: '#64B5F6', // Light Blue
  [EventMood.ENERGETIC]: '#FF6B6B', // Red
  [EventMood.ROMANTIC]: '#F06292', // Pink
  [EventMood.EXTREME]: '#7B1FA2', // Deep Purple
};

// Helper per ottenere il time slot da un orario
export function getTimeSlotFromHour(hour: number): EventTimeSlot {
  if (hour >= TimeSlotRanges.EARLY.start && hour < TimeSlotRanges.EARLY.end) {
    return EventTimeSlot.EARLY;
  } else if (hour >= TimeSlotRanges.NIGHT.start || hour < TimeSlotRanges.AFTERHOURS.start) {
    return EventTimeSlot.NIGHT;
  } else {
    return EventTimeSlot.AFTERHOURS;
  }
}

// Helper per ottenere il price range da un prezzo
export function getPriceRangeFromAmount(amount: number): PriceRange {
  if (amount === 0) return PriceRange.FREE;
  if (amount <= 15) return PriceRange.LOW;
  if (amount <= 30) return PriceRange.MEDIUM;
  return PriceRange.VIP;
}

// Gruppi di generi per UI
export const GenreGroups = {
  electronic: {
    label: 'Elettronica',
    genres: [
      MusicGenre.TECHNO,
      MusicGenre.HOUSE,
      MusicGenre.DEEP_HOUSE,
      MusicGenre.EDM,
      MusicGenre.TRANCE,
      MusicGenre.DRUM_AND_BASS,
      MusicGenre.ELECTRONIC_EXPERIMENTAL,
    ],
  },
  urban: {
    label: 'Urban',
    genres: [
      MusicGenre.HIP_HOP,
      MusicGenre.R_AND_B,
      MusicGenre.TRAP,
      MusicGenre.REGGAETON,
    ],
  },
  rock: {
    label: 'Rock',
    genres: [
      MusicGenre.ROCK_INDIE,
      MusicGenre.PUNK,
      MusicGenre.METAL,
    ],
  },
  classic: {
    label: 'Classici',
    genres: [
      MusicGenre.JAZZ,
      MusicGenre.BLUES,
      MusicGenre.FUNK,
      MusicGenre.DISCO_RETRO,
    ],
  },
  world: {
    label: 'World',
    genres: [
      MusicGenre.LATIN,
      MusicGenre.AFROBEAT,
      MusicGenre.KPOP,
    ],
  },
  live: {
    label: 'Live',
    genres: [
      MusicGenre.LIVE_MUSIC,
      MusicGenre.ACOUSTIC_UNPLUGGED,
      MusicGenre.POP_COMMERCIAL,
    ],
  },
};

// Suggerimenti di combinazioni popolari
export const PopularCombinations = [
  {
    name: 'Serata Techno Underground',
    category: EventMacroCategory.CLUB,
    genres: [MusicGenre.TECHNO],
    atmosphere: [EventAtmosphere.UNDERGROUND],
    mood: EventMood.ENERGETIC,
  },
  {
    name: 'Aperitivo Sunset',
    category: EventMacroCategory.ROOFTOP_APERITIF,
    genres: [MusicGenre.DEEP_HOUSE, MusicGenre.LIVE_MUSIC],
    atmosphere: [EventAtmosphere.CHIC_DRESS_CODE],
    mood: EventMood.CHILL,
  },
  {
    name: 'Beach Party Reggaeton',
    category: EventMacroCategory.BEACH_PARTY,
    genres: [MusicGenre.REGGAETON, MusicGenre.LATIN],
    atmosphere: [EventAtmosphere.CASUAL, EventAtmosphere.INTERNATIONAL],
    mood: EventMood.ENERGETIC,
  },
  {
    name: 'Jazz Night',
    category: EventMacroCategory.PUB_BAR,
    genres: [MusicGenre.JAZZ, MusicGenre.BLUES],
    atmosphere: [EventAtmosphere.OVER_30],
    mood: EventMood.CHILL,
  },
];

// Validazione combinazioni
export function isValidCombination(
  category: EventMacroCategory,
  format: EventFormat
): boolean {
  const invalidCombinations: Partial<Record<EventMacroCategory, EventFormat[]>> = {
    [EventMacroCategory.BEACH_PARTY]: [EventFormat.INDOOR, EventFormat.MOUNTAIN],
    [EventMacroCategory.BOAT_PARTY]: [EventFormat.INDOOR, EventFormat.MOUNTAIN, EventFormat.BEACH],
    [EventMacroCategory.ROOFTOP_APERITIF]: [EventFormat.BEACH, EventFormat.BOAT, EventFormat.MOUNTAIN],
  };

  const invalid = invalidCombinations[category];
  return !invalid || !invalid.includes(format);
}

// Export all labels for easy access
export {
  EventMacroCategoryLabels,
  MusicGenreLabels,
  EventMoodLabels,
  PriceRangeLabels,
  EventTimeSlotLabels,
};

// Helper per atmosfere
export const AtmosphereLabels: Record<EventAtmosphere, string> = {
  [EventAtmosphere.CHIC_DRESS_CODE]: 'Chic / Dress code',
  [EventAtmosphere.CASUAL]: 'Casual',
  [EventAtmosphere.UNDERGROUND]: 'Underground',
  [EventAtmosphere.LGBTQ_FRIENDLY]: 'LGBTQ+ Friendly',
  [EventAtmosphere.INTERNATIONAL]: 'Internazionale',
  [EventAtmosphere.OVER_30]: 'Over 30',
  [EventAtmosphere.UNIVERSITY]: 'Universitari',
  [EventAtmosphere.ALL_AGES]: 'Per tutti',
  [EventAtmosphere.LOCAL_ONLY]: 'Solo locali',
};

// Helper per esperienze
export const ExperienceLabels: Record<ExperienceType, string> = {
  [ExperienceType.DJ_SET]: 'DJ Set',
  [ExperienceType.LIVE_BAND]: 'Live Band',
  [ExperienceType.JAM_SESSION]: 'Jam Session',
  [ExperienceType.SILENT_DISCO]: 'Silent Disco',
  [ExperienceType.KARAOKE]: 'Karaoke Night',
  [ExperienceType.DANCE_SHOW]: 'Dance Show / Animazione',
  [ExperienceType.OPEN_MIC]: 'Open Mic',
  [ExperienceType.GUEST_STAR]: 'Guest Star / Artist',
  [ExperienceType.VISUAL_SHOW]: 'Visual Show / Lights',
  [ExperienceType.TRIBUTE_BAND]: 'Tribute / Cover Band',
};

// Helper per formati
export const FormatLabels: Record<EventFormat, string> = {
  [EventFormat.INDOOR]: 'Al chiuso',
  [EventFormat.OUTDOOR]: 'All\'aperto',
  [EventFormat.BEACH]: 'In spiaggia',
  [EventFormat.BOAT]: 'In barca',
  [EventFormat.POOL]: 'In piscina',
  [EventFormat.MOUNTAIN]: 'In montagna',
  [EventFormat.SECRET_LOCATION]: 'Location segreta',
};