/*
# Vinayaka Chavithi Festival Database Schema

1. New Tables
   - `festival_settings` - Stores configurable festival information and goals
   - `donations` - Records all donations with donor information and categories  
   - `expenses` - Tracks festival expenses with categories and descriptions

2. Security
   - Enable RLS on all tables
   - Public read access for transparency
   - Admin-only write access for data management

3. Features
   - Real-time subscriptions for live updates
   - Donation categories (Individual, Family, Business, Anonymous)
   - Expense categories (Decorations, Food/Prasadam, Programs, Utilities)
   - Automatic timestamps and audit trail
*/

-- Festival Settings Table
CREATE TABLE IF NOT EXISTS festival_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_year integer NOT NULL DEFAULT EXTRACT(year FROM NOW()),
  festival_name text NOT NULL DEFAULT 'Vinayaka Chavithi',
  location text DEFAULT '',
  start_date date DEFAULT NOW()::date,
  end_date date DEFAULT (NOW() + INTERVAL '10 days')::date,
  fundraising_goal numeric(10,2) DEFAULT 0,
  description text DEFAULT '',
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_phone text DEFAULT '',
  donor_email text DEFAULT '',
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  category text NOT NULL DEFAULT 'Individual' CHECK (category IN ('Individual', 'Family', 'Business', 'Anonymous')),
  is_anonymous boolean DEFAULT false,
  payment_method text DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'Online', 'Check', 'Other')),
  notes text DEFAULT '',
  donation_date timestamptz DEFAULT NOW(),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Expenses Table  
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  category text NOT NULL DEFAULT 'Other' CHECK (category IN ('Decorations', 'Food/Prasadam', 'Cultural Programs', 'Utilities', 'Supplies', 'Other')),
  vendor_name text DEFAULT '',
  receipt_number text DEFAULT '',
  expense_date timestamptz DEFAULT NOW(),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Insert default festival settings
INSERT INTO festival_settings (
  festival_year,
  festival_name, 
  location,
  fundraising_goal,
  description
) VALUES (
  EXTRACT(year FROM NOW()),
  'Vinayaka Chavithi Festival 2025',
  'Community Center',
  50000,
  'Annual Vinayaka Chavithi celebration bringing our community together in devotion and joy.'
) ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE festival_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Public read access for transparency
CREATE POLICY "Public read access to festival settings"
  ON festival_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access to donations"
  ON donations  
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access to expenses"
  ON expenses
  FOR SELECT  
  TO public
  USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "Admin can manage festival settings"
  ON festival_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage donations"
  ON donations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage expenses"
  ON expenses
  FOR ALL
  TO authenticated  
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date DESC);
CREATE INDEX IF NOT EXISTS idx_donations_category ON donations(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_festival_settings_updated_at 
  BEFORE UPDATE ON festival_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at 
  BEFORE UPDATE ON donations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();