import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ioyibfroghjjytewyakv.supabase.co'; // remplace par ton URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveWliZnJvZ2hqanl0ZXd5YWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTUyODAsImV4cCI6MjA2MjEzMTI4MH0.v4ZBbOfyfUaWzGBIehvS78ukcdpEfhmjr0gQaF2ZBB4'; // remplace par ta clé anon

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
