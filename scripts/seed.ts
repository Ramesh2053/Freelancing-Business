/**
 * Seeding script for FreelanceFactory in InsForge
 */
import { createClient } from '@insforge/sdk';

const baseUrl = 'https://jif755gs.us-east.insforge.app';
const anonKey = 'anon_bb0a61d83b65244d5c68daf58fe916c91257d51098330f1935a6da41c97526ab';

const insforge = createClient({
  baseUrl,
  anonKey,
});

const DEFAULT_USERS = [
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
  }
];

const DEFAULT_FREELANCERS = [
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

const DEFAULT_CLIENTS = [
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
  }
];

const DEFAULT_JOBS = [
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
    deadline: '2026-06-25T00:00:00Z',
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
    deadline: '2026-06-18T00:00:00Z',
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
    deadline: '2026-07-10T00:00:00Z',
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
    deadline: '2026-07-20T00:00:00Z',
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
    deadline: '2026-08-01T00:00:00Z',
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
    deadline: '2026-06-30T00:00:00Z',
    status: 'posted',
    visibility: 'public',
    attachments: ['design_screenshots.zip'],
    created_at: '2026-06-06T15:00:00Z',
    updated_at: '2026-06-06T15:00:00Z'
  }
];

const DEFAULT_APPLICATIONS = [
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

const DEFAULT_REVIEWS = [
  {
    review_id: 'rev_1',
    job_id: 'job_1',
    reviewer_id: 'user_c1',
    reviewee_id: 'user_f2',
    rating: 5,
    comment: 'Pooja is an absolute coding champion! Handled our database queries flawlessly and built a highly secure payment verification proxy. Highly recommended for complex full-stack developments.',
    created_at: '2026-05-10T12:00:00Z'
  },
  {
    review_id: 'rev_2',
    job_id: 'job_2',
    reviewer_id: 'user_c2',
    reviewee_id: 'user_f1',
    rating: 5,
    comment: 'Exceptional work by Bishal! Understood our core values and produced a stunning modern brand kit. Looking forward to our next design collaboration.',
    created_at: '2026-05-18T10:00:00Z'
  }
];

const DEFAULT_MESSAGES = [
  {
    message_id: 'msg_1',
    sender_id: 'user_f2',
    receiver_id: 'user_c1',
    text: 'Hello, modern Synergy Solutions! Thanks for giving me the opportunity to apply for the React Developer position. Let me know if we can schedule a quick brief meeting.',
    is_read: false,
    created_at: '2026-06-05T09:00:00Z'
  },
  {
    message_id: 'msg_2',
    sender_id: 'user_c1',
    receiver_id: 'user_f2',
    text: 'Greetings Pooja! Your resume is highly impressive. Could you confirm if you are available to start immediately?',
    is_read: true,
    created_at: '2026-06-05T09:12:00Z'
  },
  {
    message_id: 'msg_3',
    sender_id: 'user_c1',
    receiver_id: 'user_f1',
    text: 'Hi Bishal, I saw your design portfolio on FreelanceFactory. We are looking for custom branding assets for our new product line.',
    is_read: false,
    created_at: '2026-06-06T10:00:00Z'
  },
  {
    message_id: 'msg_4',
    sender_id: 'user_f1',
    receiver_id: 'user_c1',
    text: 'Hi Suresh! Thank you. I would love to assist with the branding. Feel free to send over the project brief or initiate a contract!',
    is_read: true,
    created_at: '2026-06-06T10:15:00Z'
  }
];

async function seed() {
  console.log('Seeding InsForge database...');

  // 1. Insert users
  const { error: userErr } = await insforge.database.from('users').upsert(DEFAULT_USERS);
  if (userErr) {
    console.error('Error inserting users:', userErr);
  } else {
    console.log(`✓ Inserted ${DEFAULT_USERS.length} users`);
  }

  // 2. Insert freelancer details
  const { error: fErr } = await insforge.database.from('freelancer_details').upsert(DEFAULT_FREELANCERS);
  if (fErr) {
    console.error('Error inserting freelancer details:', fErr);
  } else {
    console.log(`✓ Inserted ${DEFAULT_FREELANCERS.length} freelancer profiles`);
  }

  // 3. Insert client details
  const { error: cErr } = await insforge.database.from('client_details').upsert(DEFAULT_CLIENTS);
  if (cErr) {
    console.error('Error inserting client details:', cErr);
  } else {
    console.log(`✓ Inserted ${DEFAULT_CLIENTS.length} client profiles`);
  }

  // 4. Insert jobs
  const { error: jErr } = await insforge.database.from('jobs').upsert(DEFAULT_JOBS);
  if (jErr) {
    console.error('Error inserting jobs:', jErr);
  } else {
    console.log(`✓ Inserted ${DEFAULT_JOBS.length} jobs`);
  }

  // 5. Insert applications
  const { error: aErr } = await insforge.database.from('applications').upsert(DEFAULT_APPLICATIONS);
  if (aErr) {
    console.error('Error inserting applications:', aErr);
  } else {
    console.log(`✓ Inserted ${DEFAULT_APPLICATIONS.length} applications`);
  }

  // 6. Insert reviews
  const { error: rErr } = await insforge.database.from('reviews').upsert(DEFAULT_REVIEWS);
  if (rErr) {
    console.error('Error inserting reviews:', rErr);
  } else {
    console.log(`✓ Inserted ${DEFAULT_REVIEWS.length} reviews`);
  }

  // 7. Insert messages
  const { error: mErr } = await insforge.database.from('messages').upsert(DEFAULT_MESSAGES);
  if (mErr) {
    console.error('Error inserting messages:', mErr);
  } else {
    console.log(`✓ Inserted ${DEFAULT_MESSAGES.length} messages`);
  }

  console.log('Seeding completed successfully!');
}

seed().catch(console.error);
