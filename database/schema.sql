-- =============================================
-- π∞ Pi Challenge - Supabase Database Schema
-- =============================================
-- Run this in Supabase SQL Editor (supabase.com/dashboard)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS PROFILE (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(20) UNIQUE NOT NULL,
    display_name VARCHAR(50),
    avatar_url TEXT,
    lives INT DEFAULT 3 CHECK (lives >= 0),
    lives_last_regen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_lives_purchased INT DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    best_digits INT DEFAULT 0,
    total_attempts INT DEFAULT 0,
    total_digits_entered BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- GAME SESSIONS (for anti-cheat & history)
-- =============================================
CREATE TABLE public.game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    final_digits INT NOT NULL DEFAULT 0,
    final_time_ms INT,
    mistakes INT DEFAULT 0,
    
    -- Anti-cheat data
    suspicion_score INT DEFAULT 0,
    avg_input_time_ms FLOAT,
    input_variance FLOAT,
    mouse_movements INT DEFAULT 0,
    touch_events INT DEFAULT 0,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    
    -- Validation
    is_validated BOOLEAN DEFAULT FALSE,
    validated_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SPEED LEADERBOARD
-- Best time to reach X digits
-- =============================================
CREATE TABLE public.speed_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username VARCHAR(20) NOT NULL,
    digit_milestone INT NOT NULL CHECK (digit_milestone > 0),
    time_ms INT NOT NULL CHECK (time_ms > 0),
    session_id UUID REFERENCES public.game_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One record per user per milestone (keep best only)
    UNIQUE(user_id, digit_milestone)
);

-- =============================================
-- ENDURANCE LEADERBOARD  
-- Most digits ever entered
-- =============================================
CREATE TABLE public.endurance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username VARCHAR(20) NOT NULL,
    max_digits INT NOT NULL CHECK (max_digits > 0),
    time_ms INT NOT NULL,
    session_id UUID REFERENCES public.game_sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PURCHASES
-- =============================================
CREATE TABLE public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_type VARCHAR(50) NOT NULL, -- 'lives_10', 'lives_50', 'premium_monthly'
    lives_granted INT DEFAULT 0,
    amount_cents INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_provider VARCHAR(20), -- 'stripe', 'admob_reward'
    payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES for fast queries
-- =============================================

-- Speed leaderboard queries
CREATE INDEX idx_speed_milestone_time ON public.speed_records(digit_milestone, time_ms ASC);
CREATE INDEX idx_speed_user ON public.speed_records(user_id);

-- Endurance leaderboard queries
CREATE INDEX idx_endurance_digits ON public.endurance_records(max_digits DESC);
CREATE INDEX idx_endurance_user ON public.endurance_records(user_id);

-- Game sessions
CREATE INDEX idx_sessions_user ON public.game_sessions(user_id);
CREATE INDEX idx_sessions_flagged ON public.game_sessions(is_flagged) WHERE is_flagged = TRUE;

-- Profiles
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_best ON public.profiles(best_digits DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speed_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endurance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, but only update their own
CREATE POLICY "Profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Game sessions: Users can only see/create their own
CREATE POLICY "Users can view own sessions" 
    ON public.game_sessions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" 
    ON public.game_sessions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" 
    ON public.game_sessions FOR UPDATE 
    USING (auth.uid() = user_id);

-- Speed records: Everyone can read, authenticated users can insert
CREATE POLICY "Speed records are viewable by everyone" 
    ON public.speed_records FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can insert speed records" 
    ON public.speed_records FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own speed records" 
    ON public.speed_records FOR UPDATE 
    USING (auth.uid() = user_id);

-- Endurance records: Everyone can read, authenticated users can insert
CREATE POLICY "Endurance records are viewable by everyone" 
    ON public.endurance_records FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can insert endurance records" 
    ON public.endurance_records FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Purchases: Users can only see their own
CREATE POLICY "Users can view own purchases" 
    ON public.purchases FOR SELECT 
    USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to regenerate lives (1 per hour, max 3 for free users)
CREATE OR REPLACE FUNCTION regenerate_lives()
RETURNS TRIGGER AS $$
DECLARE
    hours_passed FLOAT;
    lives_to_add INT;
    max_lives INT;
BEGIN
    -- Premium users get max 10 lives, free users get 3
    max_lives := CASE WHEN NEW.is_premium THEN 10 ELSE 3 END;
    
    -- Calculate hours since last regen
    hours_passed := EXTRACT(EPOCH FROM (NOW() - OLD.lives_last_regen)) / 3600;
    lives_to_add := FLOOR(hours_passed);
    
    -- Only update if lives need regenerating
    IF lives_to_add > 0 AND OLD.lives < max_lives THEN
        NEW.lives := LEAST(max_lives, OLD.lives + lives_to_add);
        NEW.lives_last_regen := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for life regeneration on profile access
CREATE TRIGGER trigger_regenerate_lives
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION regenerate_lives();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'player_' || LEFT(NEW.id::TEXT, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to validate and record a game score
CREATE OR REPLACE FUNCTION submit_game_score(
    p_session_id UUID,
    p_digits INT,
    p_time_ms INT,
    p_suspicion_score INT,
    p_avg_input_time FLOAT,
    p_input_variance FLOAT
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_username VARCHAR(20);
    v_is_valid BOOLEAN := TRUE;
    v_flag_reason TEXT := NULL;
    v_is_new_best BOOLEAN := FALSE;
    v_milestones INT[] := ARRAY[10, 20, 50, 100, 200, 500, 1000];
    v_milestone INT;
BEGIN
    -- Get user info
    SELECT id, username INTO v_user_id, v_username 
    FROM public.profiles 
    WHERE id = auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Server-side anti-cheat validation
    IF p_suspicion_score >= 50 THEN
        v_is_valid := FALSE;
        v_flag_reason := 'High suspicion score: ' || p_suspicion_score;
    ELSIF p_avg_input_time < 50 THEN
        v_is_valid := FALSE;
        v_flag_reason := 'Input too fast: ' || p_avg_input_time || 'ms avg';
    ELSIF p_input_variance IS NOT NULL AND p_input_variance < 100 THEN
        v_is_valid := FALSE;
        v_flag_reason := 'Timing too consistent (bot pattern): variance=' || p_input_variance;
    ELSIF p_time_ms < (p_digits * 40) THEN
        v_is_valid := FALSE;
        v_flag_reason := 'Impossible time for digit count';
    END IF;
    
    -- Update game session
    UPDATE public.game_sessions SET
        final_digits = p_digits,
        final_time_ms = p_time_ms,
        ended_at = NOW(),
        suspicion_score = p_suspicion_score,
        avg_input_time_ms = p_avg_input_time,
        input_variance = p_input_variance,
        is_flagged = NOT v_is_valid,
        flag_reason = v_flag_reason,
        is_validated = TRUE,
        validated_at = NOW()
    WHERE id = p_session_id AND user_id = v_user_id;
    
    -- If valid, update leaderboards
    IF v_is_valid AND p_digits >= 10 THEN
        -- Update endurance leaderboard
        INSERT INTO public.endurance_records (user_id, username, max_digits, time_ms, session_id)
        VALUES (v_user_id, v_username, p_digits, p_time_ms, p_session_id);
        
        -- Update speed records for each milestone reached
        FOREACH v_milestone IN ARRAY v_milestones LOOP
            IF p_digits >= v_milestone THEN
                -- Insert or update if better time
                INSERT INTO public.speed_records (user_id, username, digit_milestone, time_ms, session_id)
                VALUES (v_user_id, v_username, v_milestone, p_time_ms)
                ON CONFLICT (user_id, digit_milestone) 
                DO UPDATE SET 
                    time_ms = EXCLUDED.time_ms,
                    session_id = EXCLUDED.session_id,
                    created_at = NOW()
                WHERE public.speed_records.time_ms > EXCLUDED.time_ms;
            END IF;
        END LOOP;
        
        -- Update user's best score
        UPDATE public.profiles SET
            best_digits = GREATEST(best_digits, p_digits),
            total_attempts = total_attempts + 1,
            total_digits_entered = total_digits_entered + p_digits,
            updated_at = NOW()
        WHERE id = v_user_id
        RETURNING (best_digits = p_digits) INTO v_is_new_best;
    ELSE
        -- Still count the attempt
        UPDATE public.profiles SET
            total_attempts = total_attempts + 1,
            total_digits_entered = total_digits_entered + p_digits,
            updated_at = NOW()
        WHERE id = v_user_id;
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'is_valid', v_is_valid,
        'is_new_best', v_is_new_best,
        'flag_reason', v_flag_reason
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use a life
CREATE OR REPLACE FUNCTION use_life()
RETURNS JSON AS $$
DECLARE
    v_lives INT;
BEGIN
    -- Get current lives (this triggers regeneration)
    UPDATE public.profiles SET updated_at = NOW() WHERE id = auth.uid();
    
    SELECT lives INTO v_lives FROM public.profiles WHERE id = auth.uid();
    
    IF v_lives <= 0 THEN
        RETURN json_build_object('success', false, 'error', 'No lives remaining', 'lives', 0);
    END IF;
    
    -- Deduct life
    UPDATE public.profiles SET 
        lives = lives - 1,
        lives_last_regen = CASE WHEN lives = 3 THEN NOW() ELSE lives_last_regen END
    WHERE id = auth.uid()
    RETURNING lives INTO v_lives;
    
    RETURN json_build_object('success', true, 'lives', v_lives);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add lives (after purchase/ad)
CREATE OR REPLACE FUNCTION add_lives(p_amount INT, p_source VARCHAR DEFAULT 'purchase')
RETURNS JSON AS $$
DECLARE
    v_lives INT;
    v_max_lives INT;
BEGIN
    SELECT 
        CASE WHEN is_premium THEN 999 ELSE 99 END 
    INTO v_max_lives 
    FROM public.profiles WHERE id = auth.uid();
    
    UPDATE public.profiles SET 
        lives = LEAST(v_max_lives, lives + p_amount),
        total_lives_purchased = total_lives_purchased + p_amount
    WHERE id = auth.uid()
    RETURNING lives INTO v_lives;
    
    RETURN json_build_object('success', true, 'lives', v_lives);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- VIEWS for leaderboards
-- =============================================

-- Top 100 endurance scores
CREATE OR REPLACE VIEW public.leaderboard_endurance AS
SELECT DISTINCT ON (user_id)
    user_id,
    username,
    max_digits,
    time_ms,
    created_at
FROM public.endurance_records
ORDER BY user_id, max_digits DESC, time_ms ASC;

-- Speed records view (for easy querying)
CREATE OR REPLACE VIEW public.leaderboard_speed AS
SELECT 
    user_id,
    username,
    digit_milestone,
    time_ms,
    created_at
FROM public.speed_records
ORDER BY digit_milestone, time_ms ASC;



