-- =============================================
-- Migration: Allow Anonymous Submissions
-- =============================================
-- Run this AFTER the main schema.sql to enable anonymous/guest submissions
-- This allows players to submit scores without creating an account

-- Make user_id nullable in speed_records and endurance_records
ALTER TABLE public.speed_records 
    ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.endurance_records 
    ALTER COLUMN user_id DROP NOT NULL;

-- Add guest_name column for anonymous submissions
ALTER TABLE public.speed_records 
    ADD COLUMN IF NOT EXISTS guest_name VARCHAR(20);

ALTER TABLE public.endurance_records 
    ADD COLUMN IF NOT EXISTS guest_name VARCHAR(20);

-- Drop old unique constraint and create new one that handles both user_id and guest_name
ALTER TABLE public.speed_records 
    DROP CONSTRAINT IF EXISTS speed_records_user_id_digit_milestone_key;

-- Create a unique constraint that works for both authenticated and anonymous users
-- For authenticated: (user_id, digit_milestone)
-- For anonymous: (guest_name, digit_milestone)
CREATE UNIQUE INDEX IF NOT EXISTS speed_records_unique_user 
    ON public.speed_records (user_id, digit_milestone) 
    WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS speed_records_unique_guest 
    ON public.speed_records (guest_name, digit_milestone) 
    WHERE user_id IS NULL AND guest_name IS NOT NULL;

-- Update RLS policies to allow anonymous inserts and updates
DROP POLICY IF EXISTS "Authenticated users can insert speed records" ON public.speed_records;
DROP POLICY IF EXISTS "Users can update own speed records" ON public.speed_records;
DROP POLICY IF EXISTS "Anyone can insert speed records" ON public.speed_records;
DROP POLICY IF EXISTS "Anyone can update speed records" ON public.speed_records;

CREATE POLICY "Anyone can insert speed records" 
    ON public.speed_records FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Anyone can update speed records" 
    ON public.speed_records FOR UPDATE 
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert endurance records" ON public.endurance_records;
DROP POLICY IF EXISTS "Anyone can insert endurance records" ON public.endurance_records;
CREATE POLICY "Anyone can insert endurance records" 
    ON public.endurance_records FOR INSERT 
    WITH CHECK (true);

-- Update views to include guest names
DROP VIEW IF EXISTS public.leaderboard_endurance;
CREATE OR REPLACE VIEW public.leaderboard_endurance AS
SELECT DISTINCT ON (COALESCE(user_id::text, guest_name))
    COALESCE(user_id::text, guest_name) as player_id,
    COALESCE(username, guest_name) as username,
    max_digits,
    time_ms,
    created_at
FROM public.endurance_records
ORDER BY COALESCE(user_id::text, guest_name), max_digits DESC, time_ms ASC;

-- Update speed records view
DROP VIEW IF EXISTS public.leaderboard_speed;
CREATE OR REPLACE VIEW public.leaderboard_speed AS
SELECT 
    COALESCE(user_id::text, guest_name) as player_id,
    COALESCE(username, guest_name) as username,
    digit_milestone,
    time_ms,
    created_at
FROM public.speed_records
ORDER BY digit_milestone, time_ms ASC;
