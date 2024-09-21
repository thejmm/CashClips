// src/utils/supabase/last-used-method.ts

import Cookies from "js-cookie";

export const setLastSignInMethod = (method: "github" | "google" | "email") => {
  Cookies.set("lastSignInMethod", method, { expires: 400 * 365 });
};

export const getLastSignInMethod = (): "github" | "google" | "email" | null => {
  return Cookies.get("lastSignInMethod") as
    | "github"
    | "google"
    | "email"
    | null;
};
