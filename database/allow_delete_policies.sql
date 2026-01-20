-- =============================================
-- Allow DELETE Operations for Leaderboards
-- =============================================
-- Run this in Supabase SQL Editor to enable DELETE operations
-- WARNING: This allows anyone with the anon key to delete records
-- Only use this if you need programmatic deletion (e.g., dev tools)
-- For production, consider using RPC functions with proper authentication instead

-- Allow DELETE on speed_records
DROP POLICY IF EXISTS "Anyone can delete speed records" ON public.speed_records;
CREATE POLICY "Anyone can delete speed records" 
    ON public.speed_records FOR DELETE 
    USING (true);

-- Allow DELETE on endurance_records
DROP POLICY IF EXISTS "Anyone can delete endurance records" ON public.endurance_records;
CREATE POLICY "Anyone can delete endurance records" 
    ON public.endurance_records FOR DELETE 
    USING (true);
