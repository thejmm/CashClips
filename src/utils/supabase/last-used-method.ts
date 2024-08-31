// src/utils/cookies.ts

import Cookies from "js-cookie";

export const setLastSignInMethod = (method: "google" | "email") => {
  Cookies.set("lastSignInMethod", method, { expires: 400 * 365 });
};

export const getLastSignInMethod = (): "google" | "email" | null => {
  return Cookies.get("lastSignInMethod") as "google" | "email" | null;
};
