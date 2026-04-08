import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Initialize with a fallback during build time to avoid crashing Netlify/Next.js prerendering
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
