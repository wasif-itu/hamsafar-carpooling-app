// ─── Core domain types ─────────────────────────────────────────────────────

export type Gender = 'male' | 'female' | 'unspecified';
export type RideContext = 'campus' | 'city' | 'intercity';
export type RideStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type VerificationType = 'cnic' | 'university' | 'workplace';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export type PaymentMethod = 'cash' | 'jazzcash' | 'easypaisa';

// ─── Verification ──────────────────────────────────────────────────────────

export interface Verification {
  type: VerificationType;
  status: VerificationStatus;
  verifiedAt?: string;
  institution?: string; // uni/company name
}

// ─── User ──────────────────────────────────────────────────────────────────

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender: Gender;
  city: 'Lahore' | 'Karachi' | 'Islamabad' | 'Rawalpindi';
  university?: string;
  workplace?: string;
  avatar: string;             // DiceBear URL
  bio?: string;
  rating: number;
  totalRides: number;
  ridesOffered: number;
  ridesTaken: number;
  totalSavedPKR: number;
  memberSince: string;        // ISO date
  verifications: Verification[];
  trustedContacts: TrustedContact[];
  vehicle?: Vehicle;
}

// ─── Vehicle ───────────────────────────────────────────────────────────────

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  color: string;
  plate: string;
}

// ─── Location ──────────────────────────────────────────────────────────────

export interface Location {
  label: string;
  city: string;
  lat: number;
  lng: number;
}

// ─── Ride ──────────────────────────────────────────────────────────────────

export interface RecurringSchedule {
  type: 'daily' | 'weekdays' | 'custom';
  days?: string[];   // ['Mon','Wed','Fri'] for custom
  endDate?: string;
}

export interface Ride {
  id: string;
  driver: User;
  context: RideContext;
  from: Location;
  to: Location;
  stops?: Location[];
  date: string;      // ISO date
  time: string;      // 'HH:mm'
  seats: number;
  seatsLeft: number;
  pricePKR: number;
  genderPreference: Gender | 'any';
  requireCnic: boolean;
  requireUniversity: boolean;
  status: RideStatus;
  passengers: User[];
  vehicle?: Vehicle;
  driverNote?: string;
  estimatedMinutes?: number;
  distanceKm?: number;
  recurring?: RecurringSchedule;
  baggageAllowed: 'none' | 'small' | 'large';
}

// ─── Request ───────────────────────────────────────────────────────────────

export interface RideRequest {
  id: string;
  rideId: string;
  passenger: User;
  status: RequestStatus;
  seats: number;
  note?: string;
  requestedAt: string;
}

// ─── Chat ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'location' | 'system';
}

export interface ChatThread {
  id: string;
  participants: User[];
  rideId?: string;
  messages: ChatMessage[];
  updatedAt: string;
}

// ─── Notification ──────────────────────────────────────────────────────────

export type NotifType = 'request_received' | 'request_accepted' | 'request_declined' | 'ride_reminder' | 'system';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  rideId?: string;
}

// ─── Savings ───────────────────────────────────────────────────────────────

export interface MonthlySaving {
  month: string;  // 'Jan' | 'Feb' etc.
  year: number;
  savedPKR: number;
  rides: number;
  co2Kg: number;
}

// ─── Rating ────────────────────────────────────────────────────────────────

export interface Rating {
  id: string;
  rideId: string;
  reviewer: User;
  reviewee: User;
  stars: number;
  tags: string[];
  comment?: string;
  createdAt: string;
}
