-- Create donations table to track all temple donations
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  amount_cents INTEGER NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON public.donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_session_id ON public.donations(stripe_session_id);

-- Enable Row Level Security
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to view non-anonymous donations
CREATE POLICY "donations_select_public" 
  ON public.donations FOR SELECT 
  USING (is_anonymous = false AND payment_status = 'completed');

-- Policy: Allow insert for new donations (before payment completion)
CREATE POLICY "donations_insert_all" 
  ON public.donations FOR INSERT 
  WITH CHECK (true);

-- Policy: Allow update for payment status updates
CREATE POLICY "donations_update_stripe" 
  ON public.donations FOR UPDATE 
  USING (true)
  WITH CHECK (true);
