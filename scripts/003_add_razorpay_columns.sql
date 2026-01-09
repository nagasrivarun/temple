-- Add Razorpay columns to donations table
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

-- Remove Stripe columns (optional, keep for migration)
-- ALTER TABLE donations DROP COLUMN IF EXISTS stripe_session_id;
-- ALTER TABLE donations DROP COLUMN IF EXISTS stripe_payment_intent;

-- Add index for faster Razorpay lookups
CREATE INDEX IF NOT EXISTS idx_donations_razorpay_order_id ON donations(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_donations_razorpay_payment_id ON donations(razorpay_payment_id);
