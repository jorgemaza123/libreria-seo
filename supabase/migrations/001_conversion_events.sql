-- Conversion Events table for analytics tracking
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for time-based queries (admin analytics dashboard)
CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at ON conversion_events(created_at DESC);

-- Index for event type filtering
CREATE INDEX IF NOT EXISTS idx_conversion_events_event_type ON conversion_events(event_type);

-- Enable RLS
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking from public pages)
CREATE POLICY "Allow anonymous insert" ON conversion_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated read" ON conversion_events
  FOR SELECT
  TO authenticated
  USING (true);
