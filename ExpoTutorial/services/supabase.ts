import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pergcqdvwbasvtkranfd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlcmdjcWR2d2Jhc3Z0a3JhbmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDQ0MzQsImV4cCI6MjA5NTIyMDQzNH0.HYI_qMVjCl5UmbXfrNIoiMNIGB1B_m-VKQ7YJ-OcoMg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
