export type Role = 'DOCTOR' | 'PATIENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  profile: PatientProfile | DoctorProfile | null;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
}

export interface DoctorProfile {
  id: string;
  fullName: string;
  specialty: string;
  hospitalName?: string;
  licenseNumber?: string;
}

export interface Conversation {
  id: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  otherParticipant: {
    id: string;
    email: string;
    role: Role;
    profile: PatientProfile | DoctorProfile | null;
  };
  lastMessage: Message | null;
}

export interface Message {
  id: string;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
  readAt?: string;
  sender: {
    id: string;
    email: string;
    role: Role;
    fullName: string;
  };
  isOwnMessage: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
