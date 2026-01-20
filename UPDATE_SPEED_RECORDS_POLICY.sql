-- =============================================
-- Quick Fix: Update Speed Records Policy
-- =============================================
-- Run this if you get "policy already exists" error
-- This allows anonymous users to update speed records

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can update own speed records" ON public.speed_records;
DROP POLICY IF EXISTS "Anyone can update speed records" ON public.speed_records;

-- Create the update policy
CREATE POLICY "Anyone can update speed records" 
    ON public.speed_records FOR UPDATE 
    USING (true);
