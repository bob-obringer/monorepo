/**
 * Supabase server-side client utility
 *
 * This file provides a server-side Supabase client with admin privileges
 * using the service role key. This client should NEVER be exposed client-side.
 */
import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseServiceKey) {
  throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");
}

// Create the server-side client with admin privileges
// IMPORTANT: This client has full access and should NEVER be exposed client-side
export const supabaseServerClient = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false, // Don't persist auth state for server-side client
      autoRefreshToken: false, // Don't auto-refresh token for server-side client
    },
  },
);
