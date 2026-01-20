-- =============================================
-- Allow UPDATE Operations for Endurance Records
-- =============================================
-- Run this in Supabase SQL Editor to enable UPDATE operations for endurance_records
-- This allows anonymous users to update their endurance records (for UPSERT logic)

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can update own endurance records" ON public.endurance_records;
DROP POLICY IF EXISTS "Anyone can update endurance records" ON public.endurance_records;

-- Create the update policy
CREATE POLICY "Anyone can update endurance records" 
    ON public.endurance_records FOR UPDATE 
    USING (true);
