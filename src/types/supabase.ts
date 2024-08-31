// src/types/supabase.ts

import { User as AuthUser } from "@supabase/supabase-js";

/**
 * Represents a Supabase Auth User (discord server owner)
 * This type is an alias for the AuthUser type from @supabase/supabase-js
 */
export type User = AuthUser;
