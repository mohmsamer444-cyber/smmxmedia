import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigMissing = !supabaseUrl || !supabaseAnonKey;

if (supabaseConfigMissing) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase env vars missing: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Set them in Vercel > Settings > Environment Variables and redeploy.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
