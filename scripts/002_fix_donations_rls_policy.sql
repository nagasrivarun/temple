-- Drop the existing insert policy
DROP POLICY IF EXISTS "donations_insert_all" ON public.donations;

-- Create a more explicit policy that allows anonymous inserts
-- This allows anyone (authenticated or not) to insert donation records
CREATE POLICY "donations_insert_anonymous" 
  ON public.donations 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Also update the select policy to be more explicit
DROP POLICY IF EXISTS "donations_select_public" ON public.donations;

CREATE POLICY "donations_select_public" 
  ON public.donations 
  FOR SELECT 
  TO anon, authenticated
  USING (is_anonymous = false AND payment_status = 'completed');

-- Update policy should also be explicit
DROP POLICY IF EXISTS "donations_update_stripe" ON public.donations;

CREATE POLICY "donations_update_all" 
  ON public.donations 
  FOR UPDATE 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
