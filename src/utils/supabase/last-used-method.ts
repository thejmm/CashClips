// src/utils/supabase/last-used-method.ts

import Cookies from "js-cookie";

export type SignInMethod = "email" | "google" | "twitch";

export const setLastSignInMethod = (method: SignInMethod) => {
  Cookies.set("lastSignInMethod", method, { expires: 400 * 365 });
};

export const getLastSignInMethod = (): SignInMethod | null => {
  return Cookies.get("lastSignInMethod") as SignInMethod | null;
};
