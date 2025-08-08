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
  
  // Preferenze
  interests: string[]; // hashtags di interesse
  musicGenres: string[]; // gusti musicali
  eventTypes: string[]; // tipologie eventi preferiti
  defaultLocation?: LocationData;
  
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
  hashtags?: string[];
  musicGenres?: string[];
  ticketTypes?: TicketType[];
  priceMin?: number;
  priceMax?: number;
  onlySpecial?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'date' | 'distance' | 'price' | 'popularity';
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

export interface EventType {
  
}