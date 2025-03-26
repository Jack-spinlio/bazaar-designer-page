-- Create exhibitors table
CREATE TABLE IF NOT EXISTS exhibitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  booth_info TEXT,
  address TEXT,
  telephone TEXT,
  fax TEXT,
  website TEXT,
  email TEXT,
  products TEXT,
  description TEXT,
  thumbnail_url TEXT,
  source_url TEXT,
  claimed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS exhibitors_slug_idx ON exhibitors (slug);

-- Create index on name for faster text searches
CREATE INDEX IF NOT EXISTS exhibitors_name_idx ON exhibitors (name);

-- Create exhibitor gallery images table
CREATE TABLE IF NOT EXISTS exhibitor_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exhibitor_id UUID NOT NULL REFERENCES exhibitors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on exhibitor_id for faster lookups
CREATE INDEX IF NOT EXISTS exhibitor_gallery_exhibitor_id_idx ON exhibitor_gallery (exhibitor_id);

-- Enable Row Level Security
ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for exhibitors table
-- Everyone can read exhibitors
CREATE POLICY "Allow public read access to exhibitors" 
  ON exhibitors FOR SELECT USING (true);

-- Only authenticated users can claim exhibitors
CREATE POLICY "Allow authenticated users to claim exhibitors"
  ON exhibitors FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (claimed = true AND user_id = auth.uid());

-- Exhibitor owners can edit their own exhibitor
CREATE POLICY "Allow exhibitor owners to update their exhibitor"
  ON exhibitors FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for exhibitor_gallery table
-- Everyone can read gallery images
CREATE POLICY "Allow public read access to exhibitor gallery"
  ON exhibitor_gallery FOR SELECT USING (true);

-- Only exhibitor owners can add/edit/delete gallery images
CREATE POLICY "Allow exhibitor owners to update gallery"
  ON exhibitor_gallery FOR ALL USING (
    EXISTS (
      SELECT 1 FROM exhibitors
      WHERE exhibitors.id = exhibitor_gallery.exhibitor_id
      AND exhibitors.user_id = auth.uid()
    )
  ); 