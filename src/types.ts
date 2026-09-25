/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'freelancer' | 'client';
export type AvailabilityStatus = 'Available' | 'Busy' | 'Not Available';
export type JobStatus = 'posted' | 'in-progress' | 'completed' | 'cancelled';
export type BudgetType = 'fixed' | 'hourly';
export type JobType = 'one-time' | 'ongoing';
export type JobVisibility = 'public' | 'invite-only';
export type EscrowStatus = 'held' | 'released' | 'refunded';
export type DisputeStatus = 'pending' | 'resolved';
export type DisputeReason = 'Quality not met' | 'Non-payment' | 'Other';

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  password?: string; // stored hashed or simulated
  role: UserRole;
  profile_photo_url: string;
  bio: string;
  location: string; // Timezone/Location
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_active: boolean;
}

export interface FreelancerDetails {
  freelancer_id: string; // FK to users
  headline: string;
  skills: string[];
  hourly_rate: number;
  rate_type: 'hourly' | 'project'; // Toggle
  portfolio_links: string[];
  certifications: string[];
  languages: string[];
  availability_status: AvailabilityStatus;
  average_rating: number;
  total_reviews: number;
  total_earned: number;
  response_time: string; // e.g., "Responds in <2 hours"
  member_since: string;
}

export interface ClientDetails {
  client_id: string; // FK to users
  company_name: string;
  industry: string;
  company_description: string;
  total_jobs_posted: number;
  total_spent: number;
  average_rating: number;
}

export interface Job {
  job_id: string;
  client_id: string; // FK to users
  title: string;
  category: string;
  description: string;
  skills_required: string[];
  budget: number;
  budget_type: BudgetType;
  job_type: JobType;
  deadline: string; // date string
  status: JobStatus;
  visibility: JobVisibility;
  attachments: string[]; // filenames/URLs
  invited_freelancers?: string[]; // IDs of invited freelancers
  created_at: string;
  updated_at: string;
  work_submission_notes?: string;
  work_submission_files?: string[];
  work_submitted_at?: string;
}

export interface Application {
  application_id: string;
  job_id: string;
  freelancer_id: string; // FK to users
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  attachment_url?: string;
  timestamp: string;
  is_read: boolean;
}

export interface Conversation {
  other_user_id: string;
  last_message: Message;
  unread_count: number;
}

export interface Transaction {
  transaction_id: string;
  job_id: string;
  freelancer_id: string;
  client_id: string;
  amount: number;
  payment_method: 'Khalti' | 'eSewa';
  status: EscrowStatus;
  timestamp: string;
}

export interface Dispute {
  dispute_id: string;
  job_id: string;
  raised_by: string; // user_id
  reason: DisputeReason;
  description: string;
  evidence_urls: string[];
  status: DisputeStatus;
  resolution_notes?: string;
  created_at: string;
}

export interface Review {
  review_id: string;
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
