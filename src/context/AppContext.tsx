/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  FreelancerDetails, 
  ClientDetails, 
  Job, 
  Application, 
  Message, 
  Transaction, 
  Dispute, 
  Review,
  UserRole,
  AvailabilityStatus,
  BudgetType,
  JobType,
  JobVisibility,
  DisputeReason,
  Conversation
} from '../types';
import { insforge, safeDb } from '../lib/insforge';

interface AppContextProps {
  users: User[];
  freelanceDetails: FreelancerDetails[];
  clientDetails: ClientDetails[];
  jobs: Job[];
  applications: Application[];
  messages: Message[];
  transactions: Transaction[];
  disputes: Dispute[];
  reviews: Review[];
  
  // Auth state
  currentUser: User | null;
  currentFreelancerDetail: FreelancerDetails | null;
  currentClientDetail: ClientDetails | null;
  
  // Auth operations
  signUp: (data: any) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string; error?: string; user?: User }>;
  login: (emailOrPhone: string, pass: string, rememberMe: boolean) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string; error?: string; user?: User }>;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>, roleDetails: any) => void;
  sendVerificationCode: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyEmailCode: (email: string, code: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  verifyOTP: (email: string, otp: string) => boolean;
  
  // Marketplace operations
  postJob: (jobData: Omit<Job, 'job_id' | 'client_id' | 'status' | 'created_at' | 'updated_at'>) => Job;
  editJob: (jobId: string, updatedFields: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  applyForJob: (jobId: string, coverLetter: string) => Application;
  updateApplicationStatus: (appId: string, status: 'accepted' | 'rejected') => void;
  
  // Escrow & Payment
  initiatePayment: (jobId: string, freelancerId: string, amount: number, method: 'Khalti' | 'eSewa') => Transaction;
  
  // Work submission
  submitWork: (jobId: string, notes: string, files: string[]) => void;
  approveWork: (jobId: string) => void;
  requestChanges: (jobId: string, notes: string) => void;
  
  // Messaging
  sendMessage: (receiverId: string, text: string, attachment_url?: string) => Message;
  getConversations: () => Conversation[];
  getChatHistory: (otherUserId: string) => Message[];
  markMessagesAsRead: (otherUserId: string) => void;
  
  // Reviews & Disputes
  submitReview: (jobId: string, revieweeId: string, rating: number, comment: string) => void;
  raiseDispute: (jobId: string, reason: DisputeReason, description: string, evidenceFiles: string[]) => Dispute;
  resolveDispute: (disputeId: string, resolutionNotes: string, action: 'release_to_freelancer' | 'refund_to_client') => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Initial Static Seed Data
const DEFAULT_USERS: User[] = [
  {
    user_id: 'user_f1',
    full_name: 'Bishal Shrestha',
    email: 'bishal@factory.com',
    phone_number: '9841234561',
    role: 'freelancer',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Passionate UI/UX designer with 4+ years of expertise. I craft intuitive digital interfaces that balance beautiful form with powerful human-centric function.',
    location: 'Kathmandu, Nepal (GMT+5:45)',
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2026-06-05T12:00:00Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_f2',
    full_name: 'Pooja Thapa',
    email: 'pooja@factory.com',
    phone_number: '9841234562',
    role: 'freelancer',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bio: 'Fullstack engineer with major experience in React, TypeScript, Node.js, and Express. Focused on fast database speeds, clean codebases, and scalability solutions.',
    location: 'Lalitpur, Nepal (GMT+5:45)',
    created_at: '2025-02-15T09:00:00Z',
    updated_at: '2026-06-03T11:30:00Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_f3',
    full_name: 'Sandesh Adhikari',
    email: 'sandesh@factory.com',
    phone_number: '9841234563',
    role: 'freelancer',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Senior Android and iOS developer specializing in Flutter and Kotlin. Dedicated to deploying fluid mobile products with flawless performance statistics.',
    location: 'Pokhara, Nepal (GMT+5:45)',
    created_at: '2025-03-01T08:00:00Z',
    updated_at: '2026-06-01T15:45:00Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_f4',
    full_name: 'Anjali Joshi',
    email: 'anjali@factory.com',
    phone_number: '9841234564',
    role: 'freelancer',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bio: 'SEO copywriter and editor. I help technical brands translate complex service scopes into highly readable articles, marketing plans, and Google-boosting blogs.',
    location: 'Kathmandu, Nepal (GMT+5:45)',
    created_at: '2025-04-10T14:22:00Z',
    updated_at: '2026-06-05T09:15:00Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_f5',
    full_name: 'Rohan Pyakurel',
    email: 'rohan@factory.com',
    phone_number: '9841234565',
    role: 'freelancer',
    profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'Illustrator and logo developer. Focused on custom brand-marks, packaging labels, and vector layouts that embody the authentic core of emerging local brands.',
    location: 'Bhaktapur, Nepal (GMT+5:45)',
    created_at: '2025-05-12T11:00:00Z',
    updated_at: '2026-06-06T14:30:00Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_f6',
    full_name: 'Sujata Karki',
    email: 'sujata@factory.com',
    phone_number: '9841234566',
    role: 'freelancer',
    profile_photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bio: 'Highly structured virtual executive assistant and data operator. Dedicated to maintaining flawless corporate calendars, sorting database files, and emails.',
    location: 'Biratnagar, Nepal (GMT+5:45)',
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2026-06-04T12:00:00Z',
    is_verified: true,
    is_active: true
  },
  // Clients
  {
    user_id: 'user_c1',
    full_name: 'Suresh Tech Solutions',
    email: 'suresh@synergy.com',
    phone_number: '9851123451',
    role: 'client',
    profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    bio: 'Modern digital consultancy deploying end-to-end cloud and web designs for local and international retail brands.',
    location: 'Lalitpur, Nepal',
    created_at: '2025-01-05T08:00:00Z',
    updated_at: '2026-06-01T10:00:00Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_c2',
    full_name: 'Everest Coffee Co.',
    email: 'hr@everestcoffee.com',
    phone_number: '9851123452',
    role: 'client',
    profile_photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    bio: 'Premium organic coffee roasters cultivating standard and custom blends sourced from Himalayan farms.',
    location: 'Kathmandu, Nepal',
    created_at: '2025-02-10T11:00:00Z',
    updated_at: '2026-06-02T12:00:00Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_c3',
    full_name: 'Apex Digital Agency',
    email: 'contact@apexagency.com',
    phone_number: '9851123453',
    role: 'client',
    profile_photo_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
    bio: 'Full service digital marketing outfit with goals to push brands into the top ranks of search listings.',
    location: 'Kathmandu, Nepal',
    created_at: '2025-03-20T10:00:00Z',
    updated_at: '2026-06-04T16:00:00Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_1790352577058',
    full_name: 'Alex Cooper',
    email: 'alexcooper1342@gmail.com',
    phone_number: '9801234567',
    role: 'freelancer',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Experienced full-stack engineer and UI/UX developer. Specializing in fast, secure, modern web applications, scalable APIs, and responsive design systems.',
    location: 'Kathmandu, Nepal (GMT+5:45)',
    created_at: '2026-09-25T16:09:37.652Z',
    updated_at: '2026-09-27T08:10:23.034Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_1790353225910',
    full_name: 'Anish Paudel',
    email: 'paudelr2053@gmail.com',
    phone_number: '9841987654',
    role: 'client',
    profile_photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    bio: 'Founder and client managing tech initiatives, contracting top-tier vetted developers and creative designers.',
    location: 'Kathmandu, Nepal (GMT+5:45)',
    created_at: '2026-09-25T16:20:26.483Z',
    updated_at: '2026-09-25T16:20:46.797Z',
    is_verified: true,
    is_active: true
  },
  {
    user_id: 'user_1790351056892',
    full_name: 'Ramesh Paudel',
    email: 'paudelr28@gmail.com',
    phone_number: '9861234567',
    role: 'freelancer',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Senior Technical Lead & Cloud Developer. Specialized in backend architecture, authentication pipelines, and data systems.',
    location: 'Kathmandu, Nepal (GMT+5:45)',
    created_at: '2026-09-25T15:44:16.892Z',
    updated_at: '2026-09-25T15:56:11.000Z',
    is_verified: true,
    is_active: true
  }
];

const DEFAULT_FREELANCERS: FreelancerDetails[] = [
  {
    freelancer_id: 'user_1790352577058',
    headline: 'Full-Stack Web & Mobile App Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Figma', 'UI/UX'],
    hourly_rate: 20,
    rate_type: 'hourly',
    portfolio_links: ['github.com/alexcooper', 'alexcooper.dev'],
    certifications: ['Verified Fullstack Engineer', 'React & Node Certified'],
    languages: ['English', 'Nepali'],
    availability_status: 'Available',
    average_rating: 5.0,
    total_reviews: 2,
    total_earned: 450,
    response_time: 'Responds in <2 hours',
    member_since: 'September 2026'
  },
  {
    freelancer_id: 'user_1790351056892',
    headline: 'Senior Cloud & Backend Architect',
    skills: ['Node.js', 'PostgreSQL', 'Cloud Infrastructure', 'Security'],
    hourly_rate: 30,
    rate_type: 'hourly',
    portfolio_links: ['github.com/ramesh-paudel'],
    certifications: ['Certified Cloud Architect'],
    languages: ['English', 'Nepali'],
    availability_status: 'Available',
    average_rating: 5.0,
    total_reviews: 1,
    total_earned: 300,
    response_time: 'Responds in <1 hour',
    member_since: 'September 2026'
  },
  {
    freelancer_id: 'user_f1',
    headline: 'Logo Designer & Brand Strategist',
    skills: ['UI/UX Design', 'Figma', 'Brand Identity', 'Logo Design'],
    hourly_rate: 35,
    rate_type: 'hourly',
    portfolio_links: ['behance.net/bishal-uiux', 'dribbble.com/bishal-shrestha'],
    certifications: ['Google UX Design Certificate', 'Adobe Certified Professional'],
    languages: ['Nepali (Native)', 'English (Fluent)'],
    availability_status: 'Available',
    average_rating: 4.9,
    total_reviews: 14,
    total_earned: 4200,
    response_time: 'Responds in <2 hours',
    member_since: 'January 2025'
  },
  {
    freelancer_id: 'user_f2',
    headline: 'Senior MERN Developer | React & Node.js Expert',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Figma'],
    hourly_rate: 45,
    rate_type: 'hourly',
    portfolio_links: ['github.com/pooja-codes', 'poojathapa.dev'],
    certifications: ['AWS Certified Cloud Practitioner', 'MongoDB Associate Developer'],
    languages: ['Nepali (Native)', 'English (Fluent)', 'Hindi (Conversational)'],
    availability_status: 'Available',
    average_rating: 4.85,
    total_reviews: 21,
    total_earned: 9450,
    response_time: 'Responds in <1 hour',
    member_since: 'February 2025'
  },
  {
    freelancer_id: 'user_f3',
    headline: 'Mobile App Developer | Flutter & Kotlin Specialist',
    skills: ['Google Maps Platform', 'Firebase', 'TypeScript', 'Node.js'],
    hourly_rate: 40,
    rate_type: 'hourly',
    portfolio_links: ['github.com/sandesh-mobile', 'play.google.com/dev?id=sandesh'],
    certifications: ['Flutter Certified Expert (Udacity)'],
    languages: ['Nepali (Native)', 'English (Fluent)'],
    availability_status: 'Busy',
    average_rating: 4.7,
    total_reviews: 9,
    total_earned: 6200,
    response_time: 'Responds in <3 hours',
    member_since: 'March 2025'
  },
  {
    freelancer_id: 'user_f4',
    headline: 'Content Writer & SEO Strategist',
    skills: ['Copywriting', 'SEO Writing', 'Content Strategy'],
    hourly_rate: 25,
    rate_type: 'hourly',
    portfolio_links: ['medium.com/@anjalijoshi', 'anjali-writes.com'],
    certifications: ['HubSpot Content Marketing Certified', 'SEMrush SEO Expert'],
    languages: ['Nepali (Native)', 'English (Bilingual)'],
    availability_status: 'Available',
    average_rating: 4.95,
    total_reviews: 12,
    total_earned: 3800,
    response_time: 'Responds in <1 hour',
    member_since: 'April 2025'
  },
  {
    freelancer_id: 'user_f5',
    headline: 'Creative Illustrator & Graphic Designer',
    skills: ['Logo Design', 'Illustration', 'Figma', 'Brand Identity'],
    hourly_rate: 30,
    rate_type: 'project',
    portfolio_links: ['rohan-art.artstation.com', 'behance.net/rohan-draws'],
    certifications: [],
    languages: ['Nepali (Native)', 'English (Fluent)'],
    availability_status: 'Available',
    average_rating: 4.8,
    total_reviews: 8,
    total_earned: 2700,
    response_time: 'Responds in <24 hours',
    member_since: 'May 2025'
  },
  {
    freelancer_id: 'user_f6',
    headline: 'Executive Virtual Assistant & Data Analyst',
    skills: ['Virtual Assistant', 'Data Entry', 'Customer Support'],
    hourly_rate: 20,
    rate_type: 'hourly',
    portfolio_links: ['linkedin.com/in/sujata-karki-va'],
    certifications: ['Microsoft Office Specialist Expert'],
    languages: ['Nepali (Native)', 'English (Fluent)', 'Hindi (Fluent)'],
    availability_status: 'Not Available',
    average_rating: 5.0,
    total_reviews: 5,
    total_earned: 1950,
    response_time: 'Responds in <2 hours',
    member_since: 'June 2025'
  }
];

const DEFAULT_CLIENTS: ClientDetails[] = [
  {
    client_id: 'user_c1',
    company_name: 'Synergy Tech Solutions',
    industry: 'Software Development',
    company_description: 'We build beautiful ecommerce pipelines and modern website prototypes for companies growing dynamic client listings across the Himalayan ecosystem.',
    total_jobs_posted: 6,
    total_spent: 4500,
    average_rating: 4.9
  },
  {
    client_id: 'user_c2',
    company_name: 'Everest Coffee Co.',
    industry: 'Food & Beverage',
    company_description: 'Everest Coffee Co. roasts premium organic beans harvested by small-scale mountain farmers. We emphasize transparent trade practices and elegant local designs.',
    total_jobs_posted: 3,
    total_spent: 1200,
    average_rating: 4.8
  },
  {
    client_id: 'user_c3',
    company_name: 'Apex Digital Agency',
    industry: 'Business Development & Marketing',
    company_description: 'Apex specializes in helping technology firms, logistics providers, and local hotels rank first on search listings. We hire creative, results-driven content teams.',
    total_jobs_posted: 4,
    total_spent: 2400,
    average_rating: 4.7
  },
  {
    client_id: 'user_1790353225910',
    company_name: 'Paudel Ventures Tech',
    industry: 'Software & Technology',
    company_description: 'Technology solutions client hiring senior verified developers and creative talent.',
    total_jobs_posted: 2,
    total_spent: 450,
    average_rating: 5.0
  }
];

const DEFAULT_JOBS: Job[] = [
  {
    job_id: 'direct_review',
    client_id: 'user_c1',
    title: 'Direct Client Collaboration & General Review',
    category: 'Software Development',
    description: 'Direct collaboration and verified crew review milestone for talent.',
    skills_required: ['Communication', 'Quality Deliverables'],
    budget: 50,
    budget_type: 'fixed',
    job_type: 'one-time',
    deadline: '2026-12-31',
    status: 'completed',
    visibility: 'public',
    attachments: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    job_id: 'job_1',
    client_id: 'user_c1',
    title: 'E-Commerce Website Redesign',
    category: 'Software Development',
    description: 'We are seeking a talented React & Tailwind developer to completely overhaul our main store landing pages. Must build optimized, fluid interfaces with motion effects. Perfect clean code practices are necessary so our internal dev squad can continue maintenance easily. High opportunity for long-term contract work.',
    skills_required: ['React', 'Figma', 'TypeScript'],
    budget: 1200,
    budget_type: 'fixed',
    job_type: 'one-time',
    deadline: '2026-06-25',
    status: 'posted',
    visibility: 'public',
    attachments: ['ecommerce_wireframe.pdf'],
    created_at: '2026-06-03T10:00:00Z',
    updated_at: '2026-06-03T10:00:00Z'
  },
  {
    job_id: 'job_2',
    client_id: 'user_c2',
    title: 'Premium Brand Identity & Logo Design',
    category: 'Design & Creative',
    description: 'Looking for a dedicated logo and typography guru to create the brand kit for our new Himalayan espresso brand extension. We need a primary logo, secondary variations, a beautiful typographic system, and color guidelines that reflect a sophisticated, organic feel.',
    skills_required: ['Logo Design', 'Brand Identity', 'Figma'],
    budget: 450,
    budget_type: 'fixed',
    job_type: 'one-time',
    deadline: '2026-06-18',
    status: 'posted',
    visibility: 'public',
    attachments: ['cafe_vibe_moodboard.jpg'],
    created_at: '2026-06-04T11:00:00Z',
    updated_at: '2026-06-04T11:00:00Z'
  },
  {
    job_id: 'job_3',
    client_id: 'user_c3',
    title: 'Social Media Campaign SEO Content Writer',
    category: 'Marketing & Writing',
    description: 'Looking for a writer to generate 10 clean, SEO-optimized articles and social media copy drafts targeting small logistics businesses. You will work with our manager to identify keyword volumes and execute interesting drafts. Fluent English skills are necessary.',
    skills_required: ['SEO Writing', 'Copywriting', 'Content Strategy'],
    budget: 30,
    budget_type: 'hourly',
    job_type: 'ongoing',
    deadline: '2026-07-10',
    status: 'posted',
    visibility: 'public',
    attachments: [],
    created_at: '2026-06-05T08:00:00Z',
    updated_at: '2026-06-05T08:00:00Z'
  },
  {
    job_id: 'job_4',
    client_id: 'user_c1',
    title: 'Cross-Platform Mobile App in Flutter',
    category: 'Software Development',
    description: 'Build a prototype mobile application representing passenger ride-sharing parameters. Must integrate mapping routes, local address searches, and secure state handling. We will share the full interactive mock flow designed in Figma.',
    skills_required: ['Google Maps Platform', 'Firebase', 'TypeScript'],
    budget: 3500,
    budget_type: 'fixed',
    job_type: 'one-time',
    deadline: '2026-07-20',
    status: 'posted',
    visibility: 'public',
    attachments: ['mobile_spec_doc.docx'],
    created_at: '2026-06-05T14:30:00Z',
    updated_at: '2026-06-05T14:30:00Z'
  },
  {
    job_id: 'job_5',
    client_id: 'user_c2',
    title: 'Virtual Assistant for Executive Calendar Management',
    category: 'Administration & Support',
    description: 'Looking to hire a reliable administrative assistant to manage executive emails, sort incoming customer support query tickets, coordinate our calendar, and log weekly expense accounts. Looking for ~15 hours of support every week.',
    skills_required: ['Virtual Assistant', 'Data Entry', 'Customer Support'],
    budget: 15,
    budget_type: 'hourly',
    job_type: 'ongoing',
    deadline: '2026-08-01',
    status: 'posted',
    visibility: 'public',
    attachments: [],
    created_at: '2026-06-06T09:00:00Z',
    updated_at: '2026-06-06T09:00:00Z'
  },
  {
    job_id: 'job_6',
    client_id: 'user_c3',
    title: 'React Dashboard Implementation',
    category: 'Software Development',
    description: 'We need an experienced developer to translate our financial analytics views from Figma into live interactive components. Must hook up clean dashboards, styled tables, custom sliders, and simple search queries in React. We will provide full documentation.',
    skills_required: ['React', 'Figma', 'TypeScript'],
    budget: 800,
    budget_type: 'fixed',
    job_type: 'one-time',
    deadline: '2026-06-30',
    status: 'posted',
    visibility: 'public',
    attachments: ['design_screenshots.zip'],
    created_at: '2026-06-06T15:00:00Z',
    updated_at: '2026-06-06T15:00:00Z'
  }
];

const DEFAULT_APPLICATIONS: Application[] = [
  {
    application_id: 'app_1',
    job_id: 'job_1',
    freelancer_id: 'user_f2',
    cover_letter: 'Hello, I have excellent React and Tailwind design skills and would love to revamp your main e-commerce pipeline. I build semantic interfaces with fluid motion paths. Check out my GitHub!',
    status: 'pending',
    created_at: '2026-06-04T12:00:00Z'
  },
  {
    application_id: 'app_2',
    job_id: 'job_2',
    freelancer_id: 'user_f1',
    cover_letter: 'Dear Everest Coffee, I am Bishal, a specialized logo and brand layout designer. Coffee branding is one of my core focuses in brand design. I will produce a breathtaking visual mark that highlights both organic heritage and premium taste.',
    status: 'pending',
    created_at: '2026-06-05T13:00:00Z'
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    review_id: 'rev_1',
    job_id: 'job_prev_1',
    reviewer_id: 'user_c1',
    reviewee_id: 'user_f2',
    rating: 5,
    comment: 'Pooja is an absolute coding champion! Handled our database queries flawlessly and built a highly secure payment verification proxy. Highly recommended for complex full-stack developments.',
    created_at: '2026-05-10T12:00:00Z'
  },
  {
    review_id: 'rev_2',
    job_id: 'job_prev_2',
    reviewer_id: 'user_c2',
    reviewee_id: 'user_f1',
    rating: 5,
    comment: 'Exceptional work by Bishal! Understood our core values and produced a stunning modern brand kit. Looking forward to our next design collaboration.',
    created_at: '2026-05-18T10:00:00Z'
  },
  {
    review_id: 'rev_3',
    job_id: 'job_prev_3',
    reviewer_id: 'user_f1',
    reviewee_id: 'user_c1',
    rating: 5,
    comment: 'Synergy Tech was spectacular to work with. Highly clear instructions, regular milestones, and released escrow funding immediately. A premium client!',
    created_at: '2026-05-12T14:00:00Z'
  },
  {
    review_id: 'rev_alex_1',
    job_id: 'direct_review',
    reviewer_id: 'user_1790353225910',
    reviewee_id: 'user_1790352577058',
    rating: 5,
    comment: 'Alex Cooper is an outstanding full-stack talent. Super fast at turnaround, exceptional code quality, and crystal clear communication. Highly recommended crew member!',
    created_at: '2026-09-26T10:00:00Z'
  }
];

const DEFAULT_MESSAGES: Message[] = [
  {
    message_id: 'probe_1',
    sender_id: 'user_1790353225910',
    receiver_id: 'user_1790352577058',
    text: 'Hello Alex, I reviewed your profile and expertise on FreelanceFactory. I would like to hire you for our web application project!',
    timestamp: '2026-09-27T08:06:51.413Z',
    created_at: '2026-09-27T08:06:51.413Z',
    is_read: false
  },
  {
    message_id: 'probe_2',
    sender_id: 'user_1790352577058',
    receiver_id: 'user_1790353225910',
    text: 'Hi Anish! Thanks for reaching out. I am available and would be thrilled to collaborate on your project. Please send over the requirements or contract scope.',
    timestamp: '2026-09-27T08:10:00.000Z',
    created_at: '2026-09-27T08:10:00.000Z',
    is_read: true
  },
  {
    message_id: 'msg_1',
    sender_id: 'user_f2',
    receiver_id: 'user_c1',
    text: 'Hello, modern Synergy Solutions! Thanks for giving me the opportunity to apply for the React Developer position. Let me know if we can schedule a quick brief meeting.',
    timestamp: '2026-06-05T09:00:00Z',
    is_read: false
  },
  {
    message_id: 'msg_2',
    sender_id: 'user_c1',
    receiver_id: 'user_f2',
    text: 'Greetings Pooja! Your resume is highly impressive. Could you confirm if you are available to start immediately?',
    timestamp: '2026-06-05T09:12:00Z',
    is_read: true
  }
];

const SYNC_CHANNEL_NAME = 'freelance_factory_sync';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or Default
  const getStored = <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`ff_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`ff_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  const [users, setUsers] = useState<User[]>(() => getStored('users', DEFAULT_USERS));
  const [freelanceDetails, setFreelanceDetails] = useState<FreelancerDetails[]>(() => getStored('freelanceDetails', DEFAULT_FREELANCERS));
  const [clientDetails, setClientDetails] = useState<ClientDetails[]>(() => getStored('clientDetails', DEFAULT_CLIENTS));
  const [jobs, setJobs] = useState<Job[]>(() => getStored('jobs', DEFAULT_JOBS));
  const [applications, setApplications] = useState<Application[]>(() => getStored('applications', DEFAULT_APPLICATIONS));
  const [messages, setMessages] = useState<Message[]>(() => getStored('messages', DEFAULT_MESSAGES));
  const [transactions, setTransactions] = useState<Transaction[]>(() => getStored('transactions', []));
  const [disputes, setDisputes] = useState<Dispute[]>(() => getStored('disputes', []));
  const [reviews, setReviews] = useState<Review[]>(() => getStored('reviews', DEFAULT_REVIEWS));

  // Current Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('currentUser', null));

  // Derived detail states
  const currentFreelancerDetail = currentUser && currentUser.role === 'freelancer'
    ? freelanceDetails.find(f => f.freelancer_id === currentUser.user_id) || null
    : null;

  const currentClientDetail = currentUser && currentUser.role === 'client'
    ? clientDetails.find(c => c.client_id === currentUser.user_id) || null
    : null;

  // Sync state writes back to local storage
  useEffect(() => { setStored('users', users); }, [users]);
  useEffect(() => { setStored('freelanceDetails', freelanceDetails); }, [freelanceDetails]);
  useEffect(() => { setStored('clientDetails', clientDetails); }, [clientDetails]);
  useEffect(() => { setStored('jobs', jobs); }, [jobs]);
  useEffect(() => { setStored('applications', applications); }, [applications]);
  useEffect(() => { setStored('messages', messages); }, [messages]);
  useEffect(() => { setStored('transactions', transactions); }, [transactions]);
  useEffect(() => { setStored('disputes', disputes); }, [disputes]);
  useEffect(() => { setStored('reviews', reviews); }, [reviews]);
  useEffect(() => { setStored('currentUser', currentUser); }, [currentUser]);

  // Initial Hydration and Real-Time Sync from InsForge Database
  useEffect(() => {
    let isMounted = true;
    async function loadInsForgeData() {
      try {
        const [
          { data: dbUsers },
          { data: dbFreelancers },
          { data: dbClients },
          { data: dbJobs },
          { data: dbApplications },
          { data: dbMessages },
          { data: dbTransactions },
          { data: dbDisputes },
          { data: dbReviews }
        ] = await Promise.all([
          insforge.database.from('users').select('*').limit(150),
          insforge.database.from('freelancer_details').select('*').limit(150),
          insforge.database.from('client_details').select('*').limit(150),
          insforge.database.from('jobs').select('*').limit(150),
          insforge.database.from('applications').select('*').limit(150),
          insforge.database.from('messages').select('*').limit(200),
          insforge.database.from('transactions').select('*').limit(150),
          insforge.database.from('disputes').select('*').limit(150),
          insforge.database.from('reviews').select('*').limit(150),
        ]);

        if (!isMounted) return;

        if (dbUsers && dbUsers.length > 0) {
          setUsers(prev => {
            const map = new Map<string, User>();
            DEFAULT_USERS.forEach(u => map.set(u.user_id, u));
            prev.forEach(u => map.set(u.user_id, u));
            (dbUsers as User[]).forEach(u => map.set(u.user_id, { ...(map.get(u.user_id) || {}), ...u }));
            return Array.from(map.values());
          });
        }
        if (dbFreelancers && dbFreelancers.length > 0) {
          setFreelanceDetails(prev => {
            const map = new Map<string, FreelancerDetails>();
            DEFAULT_FREELANCERS.forEach(f => map.set(f.freelancer_id, f));
            prev.forEach(f => map.set(f.freelancer_id, f));
            (dbFreelancers as FreelancerDetails[]).forEach(f => map.set(f.freelancer_id, { ...(map.get(f.freelancer_id) || {}), ...f }));
            return Array.from(map.values());
          });
        }
        if (dbClients && dbClients.length > 0) {
          setClientDetails(prev => {
            const map = new Map<string, ClientDetails>();
            DEFAULT_CLIENTS.forEach(c => map.set(c.client_id, c));
            prev.forEach(c => map.set(c.client_id, c));
            (dbClients as ClientDetails[]).forEach(c => map.set(c.client_id, { ...(map.get(c.client_id) || {}), ...c }));
            return Array.from(map.values());
          });
        }
        if (dbJobs && dbJobs.length > 0) {
          setJobs(prev => {
            const map = new Map<string, Job>();
            DEFAULT_JOBS.forEach(j => map.set(j.job_id, j));
            prev.forEach(j => map.set(j.job_id, j));
            (dbJobs as Job[]).forEach(j => map.set(j.job_id, { ...(map.get(j.job_id) || {}), ...j }));
            return Array.from(map.values());
          });
        }
        if (dbApplications && dbApplications.length > 0) {
          setApplications(dbApplications as Application[]);
        }
        if (dbMessages && dbMessages.length > 0) {
          const formatted = dbMessages.map((m: any) => ({
            ...m,
            text: m.text || m.message_text || '',
            created_at: m.created_at || m.timestamp || new Date().toISOString(),
            timestamp: m.created_at || m.timestamp || new Date().toISOString()
          }));
          setMessages(prev => {
            const map = new Map<string, Message>();
            DEFAULT_MESSAGES.forEach(m => map.set(m.message_id, m));
            prev.forEach(m => map.set(m.message_id, m));
            formatted.forEach((m: Message) => map.set(m.message_id, m));
            return Array.from(map.values());
          });
        }
        if (dbTransactions && dbTransactions.length > 0) setTransactions(dbTransactions as Transaction[]);
        if (dbDisputes && dbDisputes.length > 0) setDisputes(dbDisputes as Dispute[]);
        if (dbReviews && dbReviews.length > 0) {
          setReviews(prev => {
            const map = new Map<string, Review>();
            DEFAULT_REVIEWS.forEach(r => map.set(r.review_id, r));
            prev.forEach(r => map.set(r.review_id, r));
            (dbReviews as Review[]).forEach(r => map.set(r.review_id, r));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('InsForge backend load notice (using cached/default state):', err);
      }
    }

    loadInsForgeData();

    // Background poller every 3.5s for real-time messages & reviews across tabs and devices
    const interval = setInterval(async () => {
      if (!isMounted) return;
      try {
        const [{ data: latestMsgs }, { data: latestReviews }] = await Promise.all([
          insforge.database.from('messages').select('*').limit(200),
          insforge.database.from('reviews').select('*').limit(150),
        ]);
        if (!isMounted) return;

        if (latestMsgs && latestMsgs.length > 0) {
          const formatted = latestMsgs.map((m: any) => ({
            ...m,
            text: m.text || m.message_text || '',
            created_at: m.created_at || m.timestamp || new Date().toISOString(),
            timestamp: m.created_at || m.timestamp || new Date().toISOString()
          }));
          setMessages(prev => {
            const map = new Map<string, Message>();
            prev.forEach(m => map.set(m.message_id, m));
            formatted.forEach((m: Message) => map.set(m.message_id, m));
            return Array.from(map.values());
          });
        }

        if (latestReviews && latestReviews.length > 0) {
          setReviews(prev => {
            const map = new Map<string, Review>();
            prev.forEach(r => map.set(r.review_id, r));
            (latestReviews as Review[]).forEach(r => map.set(r.review_id, r));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        // silent polling catch
      }
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // BROADCAST CHANNEL FOR REAL-TIME DEVICING/TABS SINKS
  useEffect(() => {
    const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    
    const handleBroadcastMessage = (event: MessageEvent) => {
      if (event.data === 'SYNC_STATE') {
        // Reload all state variables from localStorage
        setUsers(getStored('users', DEFAULT_USERS));
        setFreelanceDetails(getStored('freelanceDetails', DEFAULT_FREELANCERS));
        setClientDetails(getStored('clientDetails', DEFAULT_CLIENTS));
        setJobs(getStored('jobs', DEFAULT_JOBS));
        setApplications(getStored('applications', DEFAULT_APPLICATIONS));
        setMessages(getStored('messages', DEFAULT_MESSAGES));
        setTransactions(getStored('transactions', []));
        setDisputes(getStored('disputes', []));
        setReviews(getStored('reviews', DEFAULT_REVIEWS));
        
        // Refresh current user if changed elsewhere
        const currentId = currentUser?.user_id;
        const allUsers: User[] = getStored('users', DEFAULT_USERS);
        if (currentId) {
          const freshUser = allUsers.find(u => u.user_id === currentId);
          if (freshUser) {
            setCurrentUser(freshUser);
          }
        }
      }
    };

    channel.addEventListener('message', handleBroadcastMessage);
    
    // Cross-tab storage listener as backup
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('ff_')) {
        channel.postMessage('SYNC_STATE');
        handleBroadcastMessage(new MessageEvent('message', { data: 'SYNC_STATE' }));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      channel.removeEventListener('message', handleBroadcastMessage);
      channel.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser]);

  const triggerGlobalSync = () => {
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage('SYNC_STATE');
      channel.close();
    } catch (e) {
      console.log('Broadcast error: ', e);
    }
  };

  // Auth Handlers
  const sendVerificationCode = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await insforge.auth.resendVerificationEmail({ email: cleanEmail });
      if (error) {
        return { success: false, error: (error as any).message || 'Failed to send verification email.' };
      }
      return { success: true, message: data?.message || 'Verification code sent! Please check your email inbox.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error sending verification email.' };
    }
  };

  const verifyEmailCode = async (email: string, code: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email: cleanEmail,
        otp: cleanCode
      });

      if (error) {
        return { success: false, error: (error as any).message || 'Invalid or expired verification code. Please check your email or click resend.' };
      }

      // Mark user verified in local state and InsForge database
      let verifiedUser: User | null = null;
      setUsers(prev => prev.map(u => {
        if (u.email.toLowerCase() === cleanEmail) {
          verifiedUser = { ...u, is_verified: true };
          return verifiedUser;
        }
        return u;
      }));

      safeDb(insforge.database.from('users').update({ is_verified: true }).eq('email', cleanEmail));

      if (verifiedUser) {
        setCurrentUser(verifiedUser);
      } else {
        // Fallback: fetch from db
        const { data: dbMatches } = await insforge.database
          .from('users')
          .select('*')
          .ilike('email', cleanEmail)
          .limit(1);
        if (dbMatches && dbMatches.length > 0) {
          verifiedUser = { ...dbMatches[0], is_verified: true } as User;
          setCurrentUser(verifiedUser);
        }
      }

      triggerGlobalSync();
      return { success: true, user: verifiedUser || undefined };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error verifying code.' };
    }
  };

  const signUp = async (data: any) => {
    const { full_name, email, phone_number, password, role } = data;
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    
    // Check if user already exists in current state
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'User with this email already exists!' };
    }

    const new_id = `user_${Date.now()}`;
    const newUser: User = {
      user_id: new_id,
      full_name: full_name.trim(),
      email: cleanEmail,
      phone_number: phone_number || '',
      password,
      role,
      profile_photo_url: `https://images.unsplash.com/photo-${role === 'freelancer' ? '1534528741775-53994a69daeb' : '1519085360753-af0119f7cbe7'}?auto=format&fit=crop&w=300&q=80`,
      bio: '',
      location: 'Kathmandu, Nepal (GMT+5:45)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_verified: false,
      is_active: true
    };

    setUsers(prev => [...prev, newUser]);
    
    let roleDetailsData: any = null;
    if (role === 'freelancer') {
      const newD: FreelancerDetails = {
        freelancer_id: new_id,
        headline: '',
        skills: [],
        hourly_rate: 20,
        rate_type: 'hourly',
        portfolio_links: [],
        certifications: [],
        languages: ['English', 'Nepali'],
        availability_status: 'Available',
        average_rating: 5.0,
        total_reviews: 0,
        total_earned: 0,
        response_time: 'Responds in <2 hours',
        member_since: 'Just Joined'
      };
      roleDetailsData = newD;
      setFreelanceDetails(prev => [...prev, newD]);
    } else {
      const newC: ClientDetails = {
        client_id: new_id,
        company_name: '',
        industry: 'Technology',
        company_description: '',
        total_jobs_posted: 0,
        total_spent: 0,
        average_rating: 5.0
      };
      roleDetailsData = newC;
      setClientDetails(prev => [...prev, newC]);
    }

    // Persist to InsForge backend and trigger verification email
    try {
      const signUpResult = await insforge.auth.signUp({
        email: cleanEmail,
        password,
        name: full_name.trim()
      });

      if (signUpResult.error) {
        console.warn('InsForge auth signUp warning:', signUpResult.error);
      }

      await insforge.database.from('users').insert([{
        user_id: new_id,
        full_name: full_name.trim(),
        email: cleanEmail,
        phone_number: phone_number || '',
        role,
        profile_photo_url: newUser.profile_photo_url,
        bio: newUser.bio,
        location: newUser.location,
        is_verified: false,
        is_active: true
      }]);

      if (role === 'freelancer' && roleDetailsData) {
        await insforge.database.from('freelancer_details').insert([roleDetailsData]);
      } else if (roleDetailsData) {
        await insforge.database.from('client_details').insert([roleDetailsData]);
      }

      // Ensure verification email is sent
      await insforge.auth.resendVerificationEmail({ email: cleanEmail }).catch(() => {});
    } catch (err: any) {
      console.error('InsForge signup sync error:', err);
    }

    triggerGlobalSync();
    return { success: true, requiresVerification: true, email: cleanEmail, user: newUser };
  };

  const verifyOTP = (email: string, otp: string) => {
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const updated = { ...u, is_verified: true };
        if (currentUser && currentUser.email === u.email) {
          setCurrentUser(updated);
        }
        safeDb(insforge.database.from('users').update({ is_verified: true }).eq('email', email));
        return updated;
      }
      return u;
    }));
    triggerGlobalSync();
    return true;
  };

  const login = async (emailOrPhone: string, pass: string, rememberMe: boolean) => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    let matched = users.find(u => 
      u.email.toLowerCase() === cleanInput || 
      (u.phone_number && u.phone_number.trim() === emailOrPhone.trim())
    );

    // If not in local memory, fetch directly from InsForge database
    if (!matched) {
      try {
        const { data: dbMatches } = await insforge.database
          .from('users')
          .select('*')
          .ilike('email', cleanInput)
          .limit(1);

        if (dbMatches && dbMatches.length > 0) {
          matched = dbMatches[0] as User;
          setUsers(prev => {
            if (prev.some(u => u.user_id === matched!.user_id)) return prev;
            return [...prev, matched!];
          });

          // Fetch matching role details if not yet present
          if (matched.role === 'freelancer') {
            const { data: flData } = await insforge.database
              .from('freelancer_details')
              .select('*')
              .eq('freelancer_id', matched.user_id)
              .limit(1);
            if (flData && flData.length > 0) {
              setFreelanceDetails(prev => {
                if (prev.some(f => f.freelancer_id === matched!.user_id)) return prev;
                return [...prev, flData[0] as FreelancerDetails];
              });
            }
          } else {
            const { data: clData } = await insforge.database
              .from('client_details')
              .select('*')
              .eq('client_id', matched.user_id)
              .limit(1);
            if (clData && clData.length > 0) {
              setClientDetails(prev => {
                if (prev.some(c => c.client_id === matched!.user_id)) return prev;
                return [...prev, clData[0] as ClientDetails];
              });
            }
          }
        }
      } catch (err) {
        console.warn('InsForge user lookup notice:', err);
      }
    }

    if (!matched) {
      return { success: false, error: 'User account not found. Please check your email or create an account.' };
    }

    // If password was stored and doesn't match
    if (matched.password && matched.password !== pass) {
      return { success: false, error: 'Incorrect password. Please verify your credentials and try again.' };
    }

    // Check if user requires email verification
    if (!matched.is_verified) {
      // Send code automatically to their email
      await insforge.auth.resendVerificationEmail({ email: matched.email }).catch(console.warn);
      return {
        success: false,
        requiresVerification: true,
        email: matched.email,
        error: 'Please verify your email address. We have sent a 6-digit verification code to your inbox.'
      };
    }

    if (matched.email && pass) {
      insforge.auth.signInWithPassword({
        email: matched.email,
        password: pass
      }).catch(e => console.warn('InsForge signIn notice:', e));
    }

    setCurrentUser(matched);
    triggerGlobalSync();
    return { success: true, user: matched };
  };

  const logout = () => {
    setCurrentUser(null);
    insforge.auth.signOut().catch(e => console.warn('InsForge signOut notice:', e));
    triggerGlobalSync();
  };

  const updateProfile = (updatedUser: Partial<User>, roleDetails: any) => {
    if (!currentUser) return;
    
    const uid = currentUser.user_id;
    
    setUsers(prev => prev.map(u => {
      if (u.user_id === uid) {
        const fresh = { ...u, ...updatedUser, updated_at: new Date().toISOString() };
        setCurrentUser(fresh);
        return fresh;
      }
      return u;
    }));

    if (currentUser.role === 'freelancer') {
      setFreelanceDetails(prev => prev.map(fd => {
        if (fd.freelancer_id === uid) {
          return { ...fd, ...roleDetails };
        }
        return fd;
      }));
      safeDb(insforge.database.from('freelancer_details').update(roleDetails).eq('freelancer_id', uid));
    } else {
      setClientDetails(prev => prev.map(cd => {
        if (cd.client_id === uid) {
          return { ...cd, ...roleDetails };
        }
        return cd;
      }));
      safeDb(insforge.database.from('client_details').update(roleDetails).eq('client_id', uid));
    }

    safeDb(insforge.database.from('users').update({
      ...updatedUser,
      updated_at: new Date().toISOString()
    }).eq('user_id', uid));

    triggerGlobalSync();
  };

  // Marketplace Handlers
  const postJob = (jobData: Omit<Job, 'job_id' | 'client_id' | 'status' | 'created_at' | 'updated_at'>) => {
    if (!currentUser || currentUser.role !== 'client') {
      throw new Error('Only clients can post jobs.');
    }

    const budgetValue = (jobData as any).budget !== undefined 
      ? Number((jobData as any).budget)
      : Number((jobData as any).budget_max || (jobData as any).budget_min || 100);

    const deadlineValue = (jobData as any).deadline || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();

    const newJob: Job = {
      job_id: `job_${Date.now()}`,
      client_id: currentUser.user_id,
      title: jobData.title || `Custom Project Offer`,
      category: jobData.category || 'Software Development',
      description: jobData.description || 'Custom project milestone and collaboration contract.',
      skills_required: jobData.skills_required && jobData.skills_required.length > 0 ? jobData.skills_required : ['Remote Collaboration'],
      budget: budgetValue,
      budget_type: jobData.budget_type || 'fixed',
      job_type: jobData.job_type || 'one-time',
      deadline: deadlineValue,
      status: (jobData as any).status || 'posted',
      visibility: jobData.visibility || 'public',
      attachments: jobData.attachments || [],
      invited_freelancers: (jobData as any).invited_freelancers || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);
    
    // Update client total jobs count
    setClientDetails(prev => prev.map(c => {
      if (c.client_id === currentUser.user_id) {
        return { ...c, total_jobs_posted: (c.total_jobs_posted || 0) + 1 };
      }
      return c;
    }));

    // Send exact matching columns to InsForge table
    safeDb(insforge.database.from('jobs').insert([{
      job_id: newJob.job_id,
      client_id: newJob.client_id,
      title: newJob.title,
      category: newJob.category,
      description: newJob.description,
      skills_required: newJob.skills_required,
      budget: newJob.budget,
      budget_type: newJob.budget_type,
      job_type: newJob.job_type,
      deadline: newJob.deadline,
      status: newJob.status,
      visibility: newJob.visibility,
      attachments: newJob.attachments,
      invited_freelancers: newJob.invited_freelancers || [],
      created_at: newJob.created_at,
      updated_at: newJob.updated_at
    }]));

    safeDb(insforge.database.from('client_details')
      .update({ total_jobs_posted: (currentClientDetail?.total_jobs_posted || 0) + 1 })
      .eq('client_id', currentUser.user_id));

    triggerGlobalSync();
    return newJob;
  };

  const editJob = (jobId: string, updatedFields: Partial<Job>) => {
    setJobs(prev => prev.map(j => {
      if (j.job_id === jobId) {
        return { ...j, ...updatedFields, updated_at: new Date().toISOString() };
      }
      return j;
    }));

    safeDb(insforge.database.from('jobs').update({
      ...updatedFields,
      updated_at: new Date().toISOString()
    }).eq('job_id', jobId));

    triggerGlobalSync();
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.job_id !== jobId));
    if (currentUser) {
      setClientDetails(prev => prev.map(c => {
        if (c.client_id === currentUser.user_id) {
          return { ...c, total_jobs_posted: Math.max(0, c.total_jobs_posted - 1) };
        }
        return c;
      }));
    }
    safeDb(insforge.database.from('jobs').delete().eq('job_id', jobId));
    triggerGlobalSync();
  };

  const applyForJob = (jobId: string, coverLetter: string) => {
    if (!currentUser || currentUser.role !== 'freelancer') {
      throw new Error('Only freelancers can apply.');
    }

    const newApp: Application = {
      application_id: `app_${Date.now()}`,
      job_id: jobId,
      freelancer_id: currentUser.user_id,
      cover_letter: coverLetter,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setApplications(prev => [...prev, newApp]);
    safeDb(insforge.database.from('applications').insert([newApp]));

    triggerGlobalSync();
    return newApp;
  };

  const updateApplicationStatus = (appId: string, status: 'accepted' | 'rejected') => {
    setApplications(prev => prev.map(a => {
      if (a.application_id === appId) {
        return { ...a, status };
      }
      return a;
    }));

    safeDb(insforge.database.from('applications').update({ status }).eq('application_id', appId));

    if (status === 'accepted') {
      const app = applications.find(a => a.application_id === appId);
      if (app) {
        setJobs(prev => prev.map(j => {
          if (j.job_id === app.job_id) {
            return { ...j, status: 'in-progress' };
          }
          return j;
        }));
        safeDb(insforge.database.from('jobs').update({ status: 'in-progress' }).eq('job_id', app.job_id));
      }
    }
    triggerGlobalSync();
  };

  // Payment/Escrow
  const initiatePayment = (jobId: string, freelancerId: string, amount: number, method: 'Khalti' | 'eSewa') => {
    if (!currentUser) throw new Error('Not logged in.');
    
    const newTx: Transaction = {
      transaction_id: `tx_${Date.now()}`,
      job_id: jobId,
      freelancer_id: freelancerId,
      client_id: currentUser.user_id,
      amount,
      payment_method: method,
      status: 'held',
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);

    setJobs(prev => prev.map(j => {
      if (j.job_id === jobId) {
        return { ...j, status: 'in-progress' };
      }
      return j;
    }));

    const sysMsg: Message = {
      message_id: `sys_${Date.now()}`,
      sender_id: currentUser.user_id,
      receiver_id: freelancerId,
      text: `🔔 PAYMENT RECEIVED: Escrow payment of $${amount} has been secured via ${method} for job details. You are authorized to begin working immediately!`,
      timestamp: new Date().toISOString(),
      is_read: false
    };
    setMessages(prev => [...prev, sysMsg]);

    safeDb(insforge.database.from('transactions').insert([newTx]));
    safeDb(insforge.database.from('jobs').update({ status: 'in-progress' }).eq('job_id', jobId));
    safeDb(insforge.database.from('messages').insert([sysMsg]));

    triggerGlobalSync();
    return newTx;
  };

  // Work Submission
  const submitWork = (jobId: string, notes: string, files: string[]) => {
    const submittedAt = new Date().toISOString();
    setJobs(prev => prev.map(j => {
      if (j.job_id === jobId) {
        return {
          ...j,
          work_submission_notes: notes,
          work_submission_files: files,
          work_submitted_at: submittedAt
        };
      }
      return j;
    }));

    safeDb(insforge.database.from('jobs').update({
      work_submission_notes: notes,
      work_submission_files: files,
      work_submitted_at: submittedAt
    }).eq('job_id', jobId));

    const targetJob = jobs.find(j => j.job_id === jobId);
    if (targetJob && currentUser) {
      const clientNotify: Message = {
        message_id: `sys_submit_${Date.now()}`,
        sender_id: currentUser.user_id,
        receiver_id: targetJob.client_id,
        text: `🚀 WORK SUBMISSION: Deliverables have been uploaded and submitted for review on job titled: "${targetJob.title}". Please inspect and approve payment.`,
        timestamp: new Date().toISOString(),
        is_read: false
      };
      setMessages(prev => [...prev, clientNotify]);
      safeDb(insforge.database.from('messages').insert([clientNotify]));
    }

    triggerGlobalSync();
  };

  const approveWork = (jobId: string) => {
    const targetJob = jobs.find(j => j.job_id === jobId);
    if (!targetJob) return;

    setTransactions(prev => prev.map(t => {
      if (t.job_id === jobId && t.status === 'held') {
        return { ...t, status: 'released' };
      }
      return t;
    }));

    setJobs(prev => prev.map(j => {
      if (j.job_id === jobId) {
        return { ...j, status: 'completed' };
      }
      return j;
    }));

    safeDb(insforge.database.from('jobs').update({ status: 'completed' }).eq('job_id', jobId));
    safeDb(insforge.database.from('transactions').update({ status: 'released' }).eq('job_id', jobId));

    const txBudget = targetJob.budget;
    const flId = targetJob.work_submission_notes ? (applications.find(a => a.job_id === jobId && a.status === 'accepted')?.freelancer_id || '') : '';
    const actualFreelancerId = flId || freelanceDetails[0]?.freelancer_id;

    if (actualFreelancerId) {
      setFreelanceDetails(prev => prev.map(f => {
        if (f.freelancer_id === actualFreelancerId) {
          return { ...f, total_earned: f.total_earned + txBudget };
        }
        return f;
      }));
      safeDb(insforge.database.from('freelancer_details')
        .update({ total_earned: (freelanceDetails.find(f => f.freelancer_id === actualFreelancerId)?.total_earned || 0) + txBudget })
        .eq('freelancer_id', actualFreelancerId));
    }

    setClientDetails(prev => prev.map(c => {
      if (c.client_id === targetJob.client_id) {
        return { ...c, total_spent: c.total_spent + txBudget };
      }
      return c;
    }));
    safeDb(insforge.database.from('client_details')
      .update({ total_spent: (clientDetails.find(c => c.client_id === targetJob.client_id)?.total_spent || 0) + txBudget })
      .eq('client_id', targetJob.client_id));

    if (currentUser && actualFreelancerId) {
      const approveNotify: Message = {
        message_id: `sys_approve_${Date.now()}`,
        sender_id: currentUser.user_id,
        receiver_id: actualFreelancerId,
        text: `🎉 PAYMENT RELEASED! Client has reviewed your work and approved the submission for "${targetJob.title}". Payment of $${txBudget} has been released from Escrow into your account.`,
        timestamp: new Date().toISOString(),
        is_read: false
      };
      setMessages(prev => [...prev, approveNotify]);
      safeDb(insforge.database.from('messages').insert([approveNotify]));
    }

    triggerGlobalSync();
  };

  const requestChanges = (jobId: string, notes: string) => {
    const targetJob = jobs.find(j => j.job_id === jobId);
    if (!targetJob) return;

    const flId = applications.find(a => a.job_id === jobId && a.status === 'accepted')?.freelancer_id || freelanceDetails[0]?.freelancer_id;

    if (currentUser && flId) {
      const revisionNotify: Message = {
        message_id: `sys_revision_${Date.now()}`,
        sender_id: currentUser.user_id,
        receiver_id: flId,
        text: `🔄 REVISION REQUESTED: Client requested modification for "${targetJob.title}". Revision Feedback: "${notes}"`,
        timestamp: new Date().toISOString(),
        is_read: false
      };
      setMessages(prev => [...prev, revisionNotify]);
      safeDb(insforge.database.from('messages').insert([revisionNotify]));
    }

    triggerGlobalSync();
  };

  // Messaging / Chat
  const sendMessage = (receiverId: string, text: string, attachment_url?: string) => {
    if (!currentUser) throw new Error('Must sign in to message.');

    const now = new Date().toISOString();
    const cleanText = text.trim();
    const newMsg: Message = {
      message_id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender_id: currentUser.user_id,
      receiver_id: receiverId,
      text: cleanText,
      attachment_url: attachment_url || null,
      created_at: now,
      timestamp: now,
      is_read: false
    };

    setMessages(prev => [...prev.filter(m => m.message_id !== newMsg.message_id), newMsg]);

    // Insert into InsForge database messages table with exact column names
    safeDb(insforge.database.from('messages').insert([{
      message_id: newMsg.message_id,
      sender_id: newMsg.sender_id,
      receiver_id: newMsg.receiver_id,
      text: newMsg.text,
      attachment_url: newMsg.attachment_url,
      is_read: false,
      created_at: now
    }]));

    triggerGlobalSync();
    return newMsg;
  };

  const getChatHistory = (otherUserId: string) => {
    if (!currentUser) return [];
    return messages.filter(m => 
      (m.sender_id === currentUser.user_id && m.receiver_id === otherUserId) ||
      (m.sender_id === otherUserId && m.receiver_id === currentUser.user_id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getConversations = (): Conversation[] => {
    if (!currentUser) return [];

    const conversationsMap: { [key: string]: { lastMsg: Message, unread: number } } = {};

    messages.forEach(m => {
      const isSender = m.sender_id === currentUser.user_id;
      const isReceiver = m.receiver_id === currentUser.user_id;

      if (!isSender && !isReceiver) return;

      const otherId = isSender ? m.receiver_id : m.sender_id;
      
      const currentEntry = conversationsMap[otherId];
      const isNewer = !currentEntry || new Date(m.timestamp).getTime() > new Date(currentEntry.lastMsg.timestamp).getTime();
      
      const isUnread = !isSender && !m.is_read;

      if (isNewer) {
        conversationsMap[otherId] = {
          lastMsg: m,
          unread: (currentEntry?.unread || 0) + (isUnread ? 1 : 0)
        };
      } else {
        if (isUnread) {
          conversationsMap[otherId].unread += 1;
        }
      }
    });

    return Object.keys(conversationsMap).map(otherId => ({
      other_user_id: otherId,
      last_message: conversationsMap[otherId].lastMsg,
      unread_count: conversationsMap[otherId].unread
    }));
  };

  const markMessagesAsRead = (otherUserId: string) => {
    if (!currentUser) return;
    setMessages(prev => prev.map(m => {
      if (m.sender_id === otherUserId && m.receiver_id === currentUser.user_id && !m.is_read) {
        return { ...m, is_read: true };
      }
      return m;
    }));
    safeDb(insforge.database.from('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', currentUser.user_id));
    triggerGlobalSync();
  };

  // Review & Dispute Resolution
  const submitReview = async (jobId: string, revieweeId: string, rating: number, comment: string) => {
    if (!currentUser) return null;

    const newReview: Review = {
      review_id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      job_id: jobId || 'direct_review',
      reviewer_id: currentUser.user_id,
      reviewee_id: revieweeId,
      rating,
      comment: comment.trim(),
      created_at: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev.filter(r => r.review_id !== newReview.review_id)]);

    // Ensure insert to InsForge reviews table
    safeDb(insforge.database.from('reviews').insert([{
      review_id: newReview.review_id,
      job_id: newReview.job_id,
      reviewer_id: newReview.reviewer_id,
      reviewee_id: newReview.reviewee_id,
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: newReview.created_at
    }]));

    // Recalculate average reviews for the reviewee
    const allMatchingReviewsForUser = [newReview, ...reviews.filter(r => r.reviewee_id === revieweeId && r.review_id !== newReview.review_id)];
    const sumRatings = allMatchingReviewsForUser.reduce((sum, r) => sum + r.rating, 0);
    const avg = parseFloat((sumRatings / allMatchingReviewsForUser.length).toFixed(1));

    setFreelanceDetails(prev => prev.map(f => {
      if (f.freelancer_id === revieweeId) {
        return {
          ...f,
          average_rating: avg,
          total_reviews: allMatchingReviewsForUser.length
        };
      }
      return f;
    }));
    safeDb(insforge.database.from('freelancer_details')
      .update({ average_rating: avg, total_reviews: allMatchingReviewsForUser.length })
      .eq('freelancer_id', revieweeId));

    setClientDetails(prev => prev.map(c => {
      if (c.client_id === revieweeId) {
        return {
          ...c,
          average_rating: avg
        };
      }
      return c;
    }));
    safeDb(insforge.database.from('client_details')
      .update({ average_rating: avg })
      .eq('client_id', revieweeId));

    triggerGlobalSync();
    return newReview;
  };

  const raiseDispute = (jobId: string, reason: DisputeReason, description: string, evidenceFiles: string[]) => {
    if (!currentUser) throw new Error('Sign in required.');

    const newDispute: Dispute = {
      dispute_id: `dis_${Date.now()}`,
      job_id: jobId,
      raised_by: currentUser.user_id,
      reason,
      description,
      evidence_urls: evidenceFiles,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setDisputes(prev => [newDispute, ...prev]);
    safeDb(insforge.database.from('disputes').insert([newDispute]));

    // Notify other party
    const targetJob = jobs.find(j => j.job_id === jobId);
    if (targetJob) {
      const otherId = currentUser.role === 'client' 
        ? (applications.find(a => a.job_id === jobId && a.status === 'accepted')?.freelancer_id || '')
        : targetJob.client_id;
      
      if (otherId) {
        const disputeNotify: Message = {
          message_id: `sys_dispute_${Date.now()}`,
          sender_id: currentUser.user_id,
          receiver_id: otherId,
          text: `⚠️ DISPUTE RAISED: A payment dispute has been opened for "${targetJob.title}". Escrow has been temporarily frozen. Admin is reviewing all submissions.`,
          timestamp: new Date().toISOString(),
          is_read: false
        };
        setMessages(prev => [...prev, disputeNotify]);
        safeDb(insforge.database.from('messages').insert([disputeNotify]));
      }
    }

    triggerGlobalSync();
    return newDispute;
  };

  const resolveDispute = (disputeId: string, resolutionNotes: string, action: 'release_to_freelancer' | 'refund_to_client') => {
    setDisputes(prev => prev.map(d => {
      if (d.dispute_id === disputeId) {
        return { ...d, status: 'resolved', resolution_notes: resolutionNotes };
      }
      return d;
    }));

    const dispute = disputes.find(d => d.dispute_id === disputeId);
    if (!dispute) return;

    safeDb(insforge.database.from('disputes').update({
      status: 'resolved',
      resolution_notes: resolutionNotes
    }).eq('dispute_id', disputeId));

    // Release or refund transaction
    setTransactions(prev => prev.map(t => {
      if (t.job_id === dispute.job_id && t.status === 'held') {
        return { ...t, status: action === 'release_to_freelancer' ? 'released' : 'refunded' };
      }
      return t;
    }));
    safeDb(insforge.database.from('transactions').update({
      status: action === 'release_to_freelancer' ? 'released' : 'refunded'
    }).eq('job_id', dispute.job_id));

    // Update job status
    setJobs(prev => prev.map(j => {
      if (j.job_id === dispute.job_id) {
        return { ...j, status: action === 'release_to_freelancer' ? 'completed' : 'cancelled' };
      }
      return j;
    }));
    safeDb(insforge.database.from('jobs').update({
      status: action === 'release_to_freelancer' ? 'completed' : 'cancelled'
    }).eq('job_id', dispute.job_id));

    const targetJob = jobs.find(j => j.job_id === dispute.job_id);
    if (targetJob) {
      const flId = applications.find(a => a.job_id === dispute.job_id && a.status === 'accepted')?.freelancer_id || freelanceDetails[0]?.freelancer_id;
      
      // Update totals if released to freelancer
      if (action === 'release_to_freelancer' && flId) {
        setFreelanceDetails(prev => prev.map(f => {
          if (f.freelancer_id === flId) {
            return { ...f, total_earned: f.total_earned + targetJob.budget };
          }
          return f;
        }));
        safeDb(insforge.database.from('freelancer_details')
          .update({ total_earned: (freelanceDetails.find(f => f.freelancer_id === flId)?.total_earned || 0) + targetJob.budget })
          .eq('freelancer_id', flId));

        setClientDetails(prev => prev.map(c => {
          if (c.client_id === targetJob.client_id) {
            return { ...c, total_spent: c.total_spent + targetJob.budget };
          }
          return c;
        }));
        safeDb(insforge.database.from('client_details')
          .update({ total_spent: (clientDetails.find(c => c.client_id === targetJob.client_id)?.total_spent || 0) + targetJob.budget })
          .eq('client_id', targetJob.client_id));
      }

      // Send status messages to both
      const flNotify: Message = {
        message_id: `sys_dis_res_fl_${Date.now()}`,
        sender_id: 'admin',
        receiver_id: flId,
        text: `⚖️ DISPUTE RESOLVED: Admin has completed reviewing "${targetJob.title}". Decision: ${action === 'release_to_freelancer' ? 'Escrow Released to Freelancer' : 'Escrow Refunded to Client'}. Notes: "${resolutionNotes}"`,
        timestamp: new Date().toISOString(),
        is_read: false
      };
      const clNotify: Message = {
        message_id: `sys_dis_res_cl_${Date.now()}`,
        sender_id: 'admin',
        receiver_id: targetJob.client_id,
        text: `⚖️ DISPUTE RESOLVED: Admin has completed reviewing "${targetJob.title}". Decision: ${action === 'release_to_freelancer' ? 'Escrow Released to Freelancer' : 'Escrow Refunded to Client'}. Notes: "${resolutionNotes}"`,
        timestamp: new Date().toISOString(),
        is_read: false
      };
      setMessages(prev => [...prev, flNotify, clNotify]);
      safeDb(insforge.database.from('messages').insert([flNotify, clNotify]));
    }

    triggerGlobalSync();
  };

  return (
    <AppContext.Provider value={{
      users,
      freelanceDetails,
      clientDetails,
      jobs,
      applications,
      messages,
      transactions,
      disputes,
      reviews,
      
      currentUser,
      currentFreelancerDetail,
      currentClientDetail,
      
      signUp,
      login,
      logout,
      updateProfile,
      sendVerificationCode,
      verifyEmailCode,
      verifyOTP,
      
      postJob,
      editJob,
      deleteJob,
      applyForJob,
      updateApplicationStatus,
      
      initiatePayment,
      
      submitWork,
      approveWork,
      requestChanges,
      
      sendMessage,
      getConversations,
      getChatHistory,
      markMessagesAsRead,
      
      submitReview,
      raiseDispute,
      resolveDispute
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
