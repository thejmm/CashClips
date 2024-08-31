// src/utils/cookies.ts

import Cookies from "js-cookie";

export const setLastSignInMethod = (method: "email") => {
  Cookies.set("lastSignInMethod", method, { expires: 400 * 365 });
};

export const getLastSignInMethod = (): "email" | null => {
  return Cookies.get("lastSignInMethod") as "email" | null;
};
