// types/index.ts - Tutte le interfacce per l'app Eventi

// ==================== ENUMS ====================
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN'
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// ==================== CATEGORIE EVENTI ====================
export enum EventMacroCategory {
  CONCERT = 'CONCERT',
  CLUB = 'CLUB',
  PUB_BAR = 'PUB_BAR',
  FESTIVAL = 'FESTIVAL',
  PRIVATE_PARTY = 'PRIVATE_PARTY',
  LIVE_SHOW = 'LIVE_SHOW',
  ROOFTOP_APERITIF = 'ROOFTOP_APERITIF',
  BEACH_PARTY = 'BEACH_PARTY',
  AFTERPARTY = 'AFTERPARTY',
  STREET_EVENT = 'STREET_EVENT',
  BOAT_PARTY = 'BOAT_PARTY',
  RAVE_UNDERGROUND = 'RAVE_UNDERGROUND'
}

export enum MusicGenre {
  TECHNO = 'TECHNO',
  HOUSE = 'HOUSE',
  DEEP_HOUSE = 'DEEP_HOUSE',
  EDM = 'EDM',
  TRANCE = 'TRANCE',
  DRUM_AND_BASS = 'DRUM_AND_BASS',
  HIP_HOP = 'HIP_HOP',
  R_AND_B = 'R_AND_B',
  REGGAETON = 'REGGAETON',
  TRAP = 'TRAP',
  POP_COMMERCIAL = 'POP_COMMERCIAL',
  ROCK_INDIE = 'ROCK_INDIE',
  PUNK = 'PUNK',
  METAL = 'METAL',
  JAZZ = 'JAZZ',
  BLUES = 'BLUES',
  FUNK = 'FUNK',
  DISCO_RETRO = 'DISCO_RETRO',
  KPOP = 'KPOP',
  LATIN = 'LATIN',
  AFROBEAT = 'AFROBEAT',
  ELECTRONIC_EXPERIMENTAL = 'ELECTRONIC_EXPERIMENTAL',
  ACOUSTIC_UNPLUGGED = 'ACOUSTIC_UNPLUGGED',
  LIVE_MUSIC = 'LIVE_MUSIC'
}

export enum ExperienceType {
  DJ_SET = 'DJ_SET',
  LIVE_BAND = 'LIVE_BAND',
  JAM_SESSION = 'JAM_SESSION',
  SILENT_DISCO = 'SILENT_DISCO',
  KARAOKE = 'KARAOKE',
  DANCE_SHOW = 'DANCE_SHOW',
  OPEN_MIC = 'OPEN_MIC',
  GUEST_STAR = 'GUEST_STAR',
  VISUAL_SHOW = 'VISUAL_SHOW',
  TRIBUTE_BAND = 'TRIBUTE_BAND'
}

export enum EventFormat {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
  BEACH = 'BEACH',
  BOAT = 'BOAT',
  POOL = 'POOL',
  MOUNTAIN = 'MOUNTAIN',
  SECRET_LOCATION = 'SECRET_LOCATION'
}

export enum EventAtmosphere {
  CHIC_DRESS_CODE = 'CHIC_DRESS_CODE',
  CASUAL = 'CASUAL',
  UNDERGROUND = 'UNDERGROUND',
  LGBTQ_FRIENDLY = 'LGBTQ_FRIENDLY',
  INTERNATIONAL = 'INTERNATIONAL',
  OVER_30 = 'OVER_30',
  UNIVERSITY = 'UNIVERSITY',
  ALL_AGES = 'ALL_AGES',
  LOCAL_ONLY = 'LOCAL_ONLY'
}

// Filtri smart per UX
export enum PriceRange {
  FREE = 'FREE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  VIP = 'VIP'
}

export enum EventTimeSlot {
  EARLY = 'EARLY', // 18:00-22:00
  NIGHT = 'NIGHT', // 22:00-02:00
  AFTERHOURS = 'AFTERHOURS' // 02:00+
}

export enum EventMood {
  CHILL = 'CHILL',
  ENERGETIC = 'ENERGETIC',
  ROMANTIC = 'ROMANTIC',
  EXTREME = 'EXTREME'
}

export interface EventAccessibility {
  petFriendly: boolean;
  wheelchairAccessible: boolean;
  inviteOnly: boolean;
}

export interface EventFoodDrink {
  streetFood: boolean;
  openBar: boolean;
  cocktailsOnly: boolean;
  restaurantService: boolean;
}

export enum TicketType {
  ENTRANCE = 'ENTRANCE',
  SINGLE_DRINK = 'SINGLE_DRINK',
  MULTIPLE_DRINKS = 'MULTIPLE_DRINKS',
  TABLE = 'TABLE'
}

export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  PURCHASED = 'PURCHASED',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  SATISPAY = 'SATISPAY'
}

// ==================== USER INTERFACES (B2C) ====================
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  
  // Dati personali
  firstName: string;
  lastName: string;
  birthDate: Date;
  birthPlace: string;
  profileImage?: string;
  
  // Preferenze (AGGIORNATE)
  interests: string[]; // hashtags di interesse
  favoriteGenres: MusicGenre[]; // Generi musicali preferiti
  favoriteCategories: EventMacroCategory[]; // Categorie eventi preferite
  favoriteExperiences: ExperienceType[]; // Tipi di esperienza preferiti
  preferredAtmospheres: EventAtmosphere[]; // Atmosfere preferite
  preferredMoods: EventMood[]; // Mood preferiti
  defaultLocation?: LocationData;
  
  // Preferenze filtri (NUOVO)
  pricePreference?: PriceRange;
  timeSlotPreference?: EventTimeSlot[];
  
  // Compliance
  privacyAcceptedAt: Date;
  termsAcceptedAt: Date;
  marketingConsent: boolean;
  
  // Stato account
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
}

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

// ==================== BUSINESS INTERFACES (B2B) ====================
export interface BusinessProfile {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  
  // Dati aziendali
  businessName: string;
  vatNumber: string; // P.IVA
  iban: string;
  fiscalCode?: string; // Codice fiscale se necessario
  
  // Profilo pubblico
  description?: string;
  profileImage?: string;
  coverImage?: string;
  location: LocationData;
  phone?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  
  // Configurazioni
  commissionPercentage: number; // Percentuale trattenuta dalla piattaforma
  paymentThreshold: number; // Soglia minima per pagamenti
  
  // Compliance
  privacyAcceptedAt: Date;
  termsAcceptedAt: Date;
  
  // Stato account
  isActive: boolean;
  isVerified: boolean;
  isPremium: boolean; // Per features avanzate
  rating?: number; // Media recensioni future
  totalEvents: number;
  totalTicketsSold: number;
}

// ==================== EVENT INTERFACES ====================
export interface Event {
  id: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Informazioni base
  title: string;
  description: string;
  hashtags: string[];
  images: string[]; // Prima immagine è la copertina
  
  // Data e luogo
  startDate: Date;
  endDate: Date;
  location: LocationData;
  venue?: string; // Nome specifico venue se diverso da business
  
  // Categorizzazione (NUOVO)
  macroCategory: EventMacroCategory;
  musicGenres: MusicGenre[]; // Può avere più generi
  experienceTypes: ExperienceType[]; // Può offrire più esperienze
  format: EventFormat;
  atmospheres: EventAtmosphere[]; // Può avere più atmosfere
  
  // Filtri smart (NUOVO)
  priceRange: PriceRange;
  timeSlot: EventTimeSlot;
  mood: EventMood;
  accessibility: EventAccessibility;
  foodDrink: EventFoodDrink;
  
  // Età e restrizioni (NUOVO)
  minAge?: number; // null = all ages
  maxCapacity: number;
  currentCapacity?: number; // Per eventi con limite
  
  // Stato e visibilità
  status: EventStatus;
  isSpecial: boolean; // Eventi sponsorizzati
  specialUntil?: Date; // Scadenza sponsorizzazione
  
  // Statistiche
  viewCount: number;
  interestedCount: number;
  ticketsSold: number;
  revenue: number;
  
  // SEO
  slug: string;
}

// ==================== TICKET INTERFACES ====================
export interface TicketTypeConfig {
  id: string;
  eventId: string;
  type: TicketType;
  name: string;
  description?: string;
  
  // Prezzi e disponibilità
  price: number;
  originalPrice?: number; // Per mostrare sconti
  quantity: number;
  sold: number;
  maxPerPurchase: number;
  
  // Configurazioni specifiche
  benefits?: string[]; // Lista benefici inclusi
  
  // Per consumazioni
  drinksIncluded?: number;
  
  // Per tavoli
  tableCapacity?: number;
  tableLocation?: string;
  includesBottle?: boolean;
  
  // Validità
  validFrom?: Date;
  validUntil?: Date;
  isActive: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  ticketTypeId: string;
  purchaseId: string;
  
  // Dati biglietto
  ticketNumber: string; // Numero univoco biglietto
  qrCode: string; // QR code univoco
  qrSecret: string; // Per validazione sicura
  
  // Stato
  status: TicketStatus;
  purchasedAt: Date;
  usedAt?: Date;
  
  // Dati intestatario (per biglietti multipli)
  holderFirstName?: string;
  holderLastName?: string;
  holderBirthDate?: Date;
  holderBirthPlace?: string;
  
  // Metadati
  isMainTicket: boolean; // Se è il biglietto principale dell'acquisto
  groupId?: string; // Per raggruppare biglietti multipli
}

// ==================== PURCHASE & PAYMENT INTERFACES ====================
export interface Purchase {
  id: string;
  userId: string;
  eventId: string;
  businessId: string;
  createdAt: Date;
  
  // Dettagli ordine
  tickets: PurchaseItem[];
  subtotal: number;
  platformFee: number;
  total: number;
  
  // Pagamento
  paymentStatus: PaymentStatus;
  paymentProvider: PaymentProvider;
  paymentIntentId?: string; // ID esterno (Stripe, PayPal, etc)
  
  // Dati fatturazione
  billingEmail: string;
  billingName?: string;
  billingAddress?: string;
  billingVatNumber?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
}

export interface PurchaseItem {
  ticketTypeId: string;
  ticketType: TicketType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ==================== SYSTEM CONFIG INTERFACES ====================
export interface PlatformConfig {
  id: string;
  
  // Commissioni
  defaultCommissionPercentage: number;
  minCommissionPercentage: number;
  maxCommissionPercentage: number;
  
  // Pagamenti
  minPaymentThreshold: number;
  paymentProviders: PaymentProvider[];
  
  // Limiti
  maxEventsPerBusiness: number;
  maxTicketsPerEvent: number;
  maxImagesPerEvent: number;
  
  // Features
  specialEventPrice: number; // Costo sponsorizzazione
  specialEventDuration: number; // Giorni di sponsorizzazione
  
  // Manutenzione
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

// ==================== ANALYTICS INTERFACES ====================
export interface EventAnalytics {
  eventId: string;
  date: Date;
  
  // Visualizzazioni
  totalViews: number;
  uniqueViews: number;
  viewsBySource: {
    search: number;
    direct: number;
    social: number;
    other: number;
  };
  
  // Conversioni
  ticketViews: number;
  purchaseAttempts: number;
  completedPurchases: number;
  conversionRate: number;
  
  // Revenue
  ticketsSold: number;
  grossRevenue: number;
  netRevenue: number;
  platformFees: number;
  
  // Demografia (NUOVO)
  viewsByAgeGroup?: {
    '18-24': number;
    '25-34': number;
    '35-44': number;
    '45+': number;
  };
  
  // Interessi (NUOVO)
  viewerInterests?: {
    genre: MusicGenre;
    count: number;
  }[];
}

export interface BusinessAnalytics {
  businessId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  
  // Eventi
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  
  // Vendite
  totalTicketsSold: number;
  totalRevenue: number;
  totalPlatformFees: number;
  netRevenue: number;
  
  // Performance
  averageConversionRate: number;
  topPerformingEvents: Array<{
    eventId: string;
    title: string;
    revenue: number;
  }>;
  
  // Clienti
  uniqueCustomers: number;
  repeatCustomers: number;
  averageTicketsPerCustomer: number;
}

// ==================== API RESPONSE INTERFACES ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: PaginationInfo;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ==================== SEARCH & FILTER INTERFACES ====================
export interface EventSearchParams {
  query?: string;
  location?: {
    lat: number;
    lng: number;
    radiusKm: number;
  };
  dateFrom?: Date;
  dateTo?: Date;
  
  // Categorie e generi (AGGIORNATO)
  macroCategories?: EventMacroCategory[];
  musicGenres?: MusicGenre[];
  experienceTypes?: ExperienceType[];
  formats?: EventFormat[];
  atmospheres?: EventAtmosphere[];
  
  // Filtri smart (NUOVO)
  priceRange?: PriceRange[];
  timeSlots?: EventTimeSlot[];
  moods?: EventMood[];
  
  // Altri filtri (NUOVO)
  minAge?: number;
  accessibility?: {
    petFriendly?: boolean;
    wheelchairAccessible?: boolean;
    inviteOnly?: boolean;
  };
  foodDrink?: {
    streetFood?: boolean;
    openBar?: boolean;
    cocktailsOnly?: boolean;
    restaurantService?: boolean;
  };
  
  // Esistenti
  hashtags?: string[];
  ticketTypes?: TicketType[];
  priceMin?: number;
  priceMax?: number;
  onlySpecial?: boolean;
  onlyAvailable?: boolean; // Solo eventi con biglietti disponibili
  
  // Paginazione e ordinamento
  page?: number;
  pageSize?: number;
  sortBy?: 'date' | 'distance' | 'price' | 'popularity' | 'trending';
  sortOrder?: 'asc' | 'desc';
}

// ==================== NOTIFICATION INTERFACES ====================
export interface Notification {
  id: string;
  userId: string;
  type: 'purchase' | 'reminder' | 'update' | 'marketing';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

// ==================== SESSION INTERFACES ====================
export interface UserSession {
  user: UserProfile | BusinessProfile;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
}

// ==================== UTILITY TYPES ====================
// Per le label nel frontend
export const EventMacroCategoryLabels: Record<EventMacroCategory, string> = {
  [EventMacroCategory.CONCERT]: 'Concerti',
  [EventMacroCategory.CLUB]: 'Discoteche / Club',
  [EventMacroCategory.PUB_BAR]: 'Pub & Bar con eventi',
  [EventMacroCategory.FESTIVAL]: 'Festival',
  [EventMacroCategory.PRIVATE_PARTY]: 'Eventi Privati / Party esclusivi',
  [EventMacroCategory.LIVE_SHOW]: 'Live Show / Performance',
  [EventMacroCategory.ROOFTOP_APERITIF]: 'Rooftop & Aperitivi musicali',
  [EventMacroCategory.BEACH_PARTY]: 'Beach Party',
  [EventMacroCategory.AFTERPARTY]: 'Afterparty',
  [EventMacroCategory.STREET_EVENT]: 'Street Events / Urban vibes',
  [EventMacroCategory.BOAT_PARTY]: 'Boat Party / Crociere musicali',
  [EventMacroCategory.RAVE_UNDERGROUND]: 'Rave & Underground'
};

export const MusicGenreLabels: Record<MusicGenre, string> = {
  [MusicGenre.TECHNO]: 'Techno',
  [MusicGenre.HOUSE]: 'House',
  [MusicGenre.DEEP_HOUSE]: 'Deep House',
  [MusicGenre.EDM]: 'EDM',
  [MusicGenre.TRANCE]: 'Trance',
  [MusicGenre.DRUM_AND_BASS]: 'Drum & Bass',
  [MusicGenre.HIP_HOP]: 'Hip Hop',
  [MusicGenre.R_AND_B]: 'R&B',
  [MusicGenre.REGGAETON]: 'Reggaeton',
  [MusicGenre.TRAP]: 'Trap',
  [MusicGenre.POP_COMMERCIAL]: 'Pop Commerciale',
  [MusicGenre.ROCK_INDIE]: 'Rock / Indie',
  [MusicGenre.PUNK]: 'Punk',
  [MusicGenre.METAL]: 'Metal',
  [MusicGenre.JAZZ]: 'Jazz',
  [MusicGenre.BLUES]: 'Blues',
  [MusicGenre.FUNK]: 'Funk',
  [MusicGenre.DISCO_RETRO]: 'Disco \'70/\'80/\'90',
  [MusicGenre.KPOP]: 'K-pop',
  [MusicGenre.LATIN]: 'Latin / Salsa / Bachata',
  [MusicGenre.AFROBEAT]: 'Afrobeat',
  [MusicGenre.ELECTRONIC_EXPERIMENTAL]: 'Elettronica Sperimentale',
  [MusicGenre.ACOUSTIC_UNPLUGGED]: 'Acustico / Unplugged',
  [MusicGenre.LIVE_MUSIC]: 'Musica dal vivo'
};

export const EventMoodLabels: Record<EventMood, string> = {
  [EventMood.CHILL]: 'Chill',
  [EventMood.ENERGETIC]: 'Energico',
  [EventMood.ROMANTIC]: 'Romantico',
  [EventMood.EXTREME]: 'Estremo'
};

export const PriceRangeLabels: Record<PriceRange, string> = {
  [PriceRange.FREE]: 'Gratis',
  [PriceRange.LOW]: 'Economico',
  [PriceRange.MEDIUM]: 'Medio',
  [PriceRange.VIP]: 'VIP'
};

export const EventTimeSlotLabels: Record<EventTimeSlot, string> = {
  [EventTimeSlot.EARLY]: 'Early (18:00-22:00)',
  [EventTimeSlot.NIGHT]: 'Night (22:00-02:00)',
  [EventTimeSlot.AFTERHOURS]: 'Afterhours (02:00+)'
};

// Definizione orari per time slot
export const TimeSlotRanges: Record<EventTimeSlot, { start: number; end: number }> = {
  [EventTimeSlot.EARLY]: { start: 18, end: 22 },
  [EventTimeSlot.NIGHT]: { start: 22, end: 2 },
  [EventTimeSlot.AFTERHOURS]: { start: 2, end: 6 }
};

// Helper per suggerimenti basati su categorie
export const CategorySuggestions: Partial<Record<EventMacroCategory, {
  suggestedGenres: MusicGenre[];
  suggestedExperiences: ExperienceType[];
  suggestedFormats: EventFormat[];
  suggestedAtmospheres: EventAtmosphere[];
}>> = {
  [EventMacroCategory.CLUB]: {
    suggestedGenres: [MusicGenre.TECHNO, MusicGenre.HOUSE, MusicGenre.EDM],
    suggestedExperiences: [ExperienceType.DJ_SET, ExperienceType.VISUAL_SHOW],
    suggestedFormats: [EventFormat.INDOOR],
    suggestedAtmospheres: [EventAtmosphere.UNDERGROUND, EventAtmosphere.CHIC_DRESS_CODE]
  },
  [EventMacroCategory.BEACH_PARTY]: {
    suggestedGenres: [MusicGenre.HOUSE, MusicGenre.REGGAETON, MusicGenre.LATIN],
    suggestedExperiences: [ExperienceType.DJ_SET, ExperienceType.DANCE_SHOW],
    suggestedFormats: [EventFormat.BEACH, EventFormat.OUTDOOR],
    suggestedAtmospheres: [EventAtmosphere.CASUAL, EventAtmosphere.INTERNATIONAL]
  },
  // ... altri suggerimenti per altre categorie
};

// ==================== RECOMMENDATION INTERFACES ====================
export interface EventRecommendation {
  event: Event;
  score: number; // 0-100
  reasons: RecommendationReason[];
}

export interface RecommendationReason {
  type: 'genre_match' | 'category_match' | 'location_proximity' | 'time_preference' | 
        'atmosphere_match' | 'price_range' | 'trending' | 'friends_attending';
  description: string;
  weight: number; // Peso nel calcolo del punteggio
}

// Per l'algoritmo di raccomandazione
export interface UserEventPreferences {
  userId: string;
  
  // Cronologia interazioni
  viewedEvents: string[]; // ID eventi visualizzati
  purchasedEvents: string[]; // ID eventi acquistati
  likedEvents: string[]; // ID eventi piaciuti
  
  // Preferenze derivate dal comportamento
  preferredTimeSlots: Record<EventTimeSlot, number>; // Peso per fascia oraria
  preferredPriceRanges: Record<PriceRange, number>; // Peso per fascia prezzo
  genreAffinities: Record<MusicGenre, number>; // Affinità 0-100 per genere
  categoryAffinities: Record<EventMacroCategory, number>; // Affinità per categoria
  
  // Località frequentate
  frequentLocations: {
    location: LocationData;
    visitCount: number;
  }[];
  
  lastUpdated: Date;
}