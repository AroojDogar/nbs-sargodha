// Supabase connection for the attendance portal. Both values come from the Supabase project
// (Project Settings > API) and go in .env.local and in the Vercel project settings.
// If they are missing the portal shows a "not set up yet" message instead of breaking.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = url && key ? createClient(url, key) : null;
