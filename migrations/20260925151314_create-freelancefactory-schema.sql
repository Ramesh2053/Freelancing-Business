-- 1. Users table (stores both freelancers and clients)
CREATE TABLE IF NOT EXISTS public.users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('freelancer', 'client')),
  profile_photo_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  location TEXT DEFAULT '',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Freelancer Details table
CREATE TABLE IF NOT EXISTS public.freelancer_details (
  freelancer_id UUID PRIMARY KEY REFERENCES public.users(user_id) ON DELETE CASCADE,
  headline TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  hourly_rate NUMERIC DEFAULT 0,
  rate_type TEXT DEFAULT 'hourly' CHECK (rate_type IN ('hourly', 'project')),
  portfolio_links TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  availability_status TEXT DEFAULT 'Available' CHECK (availability_status IN ('Available', 'Busy', 'Not Available')),
  average_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  response_time TEXT DEFAULT 'Responds in <2 hours',
  member_since TEXT DEFAULT '2025'
);

-- 3. Client Details table
CREATE TABLE IF NOT EXISTS public.client_details (
  client_id UUID PRIMARY KEY REFERENCES public.users(user_id) ON DELETE CASCADE,
  company_name TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  company_description TEXT DEFAULT '',
  total_jobs_posted INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  average_rating NUMERIC DEFAULT 0
);

-- 4. Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_required TEXT[] DEFAULT '{}',
  budget NUMERIC NOT NULL,
  budget_type TEXT NOT NULL CHECK (budget_type IN ('fixed', 'hourly')),
  job_type TEXT NOT NULL CHECK (job_type IN ('one-time', 'ongoing')),
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'posted' CHECK (status IN ('posted', 'in-progress', 'completed', 'cancelled')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'invite-only')),
  attachments TEXT[] DEFAULT '{}',
  invited_freelancers TEXT[] DEFAULT '{}',
  work_submission_notes TEXT,
  work_submission_files TEXT[] DEFAULT '{}',
  work_submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Applications table
CREATE TABLE IF NOT EXISTS public.applications (
  application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(job_id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Transactions (Escrow) table
CREATE TABLE IF NOT EXISTS public.transactions (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(job_id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Khalti', 'eSewa')),
  status TEXT NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'released', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Disputes table
CREATE TABLE IF NOT EXISTS public.disputes (
  dispute_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(job_id) ON DELETE CASCADE,
  raised_by UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(job_id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Permissive policies for marketplace collaboration
CREATE POLICY "users_read_policy" ON public.users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "users_insert_policy" ON public.users FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "users_update_policy" ON public.users FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "freelancer_details_read_policy" ON public.freelancer_details FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "freelancer_details_insert_policy" ON public.freelancer_details FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "freelancer_details_update_policy" ON public.freelancer_details FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "client_details_read_policy" ON public.client_details FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "client_details_insert_policy" ON public.client_details FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "client_details_update_policy" ON public.client_details FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "jobs_read_policy" ON public.jobs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "jobs_insert_policy" ON public.jobs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "jobs_update_policy" ON public.jobs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "jobs_delete_policy" ON public.jobs FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "applications_read_policy" ON public.applications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "applications_insert_policy" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "applications_update_policy" ON public.applications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "messages_read_policy" ON public.messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "messages_insert_policy" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "messages_update_policy" ON public.messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "transactions_read_policy" ON public.transactions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "transactions_insert_policy" ON public.transactions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "transactions_update_policy" ON public.transactions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "disputes_read_policy" ON public.disputes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "disputes_insert_policy" ON public.disputes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "disputes_update_policy" ON public.disputes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "reviews_read_policy" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews_insert_policy" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "reviews_update_policy" ON public.reviews FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
