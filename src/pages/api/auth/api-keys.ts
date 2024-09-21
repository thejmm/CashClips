// src/pages/api/auth/api-keys.ts

import { NextApiRequest, NextApiResponse } from "next";

import createClient from "@/utils/supabase/api";
import crypto from "crypto";

// Helper to encrypt the API key before storing
const encryptAPIKey = (apiKey: string) => {
  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    Buffer.from(process.env.ENCRYPTION_KEY!, "hex"),
    Buffer.from(process.env.IV!, "hex"),
  );
  let encrypted = cipher.update(apiKey, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Helper to decrypt the API key for viewing
const decryptAPIKey = (encryptedKey: string) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(process.env.ENCRYPTION_KEY!, "hex"),
    Buffer.from(process.env.IV!, "hex"),
  );
  let decrypted = decipher.update(encryptedKey, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createClient(req, res);
  const { action, description, password, api_key_id } = req.body;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return res.status(401).json({ message: "Unauthorized: No valid session" });
  }

  const user_id = session.user.id;

  if (req.method === "POST") {
    try {
      if (action === "generate") {
        const apiKeyPlain = crypto.randomUUID();
        const encryptedApiKey = encryptAPIKey(apiKeyPlain);

        const { data, error } = await supabase
          .from("api_keys")
          .insert({
            user_id,
            api_key: encryptedApiKey,
            description,
            status: "active",
          })
          .select();

        if (error) {
          return res
            .status(500)
            .json({ message: "Failed to create API key", error });
        }

        return res.status(200).json({ apiKey: apiKeyPlain, keyData: data[0] });
      } else if (action === "revoke") {
        const { error } = await supabase
          .from("api_keys")
          .update({ status: "revoked" })
          .eq("id", api_key_id)
          .eq("user_id", user_id);

        if (error) {
          return res
            .status(500)
            .json({ message: "Failed to revoke API key", error });
        }

        return res
          .status(200)
          .json({ message: "API key revoked successfully" });
      } else if (action === "authenticate") {
        if (!session?.user?.email) {
          return res
            .status(400)
            .json({ message: "User email not found in session" });
        }

        const { data, error: authError } =
          await supabase.auth.signInWithPassword({
            email: session.user.email,
            password,
          });

        if (authError || !data.user) {
          return res.status(401).json({ message: "Authentication failed" });
        }

        const { data: apiKeyData, error } = await supabase
          .from("api_keys")
          .select("api_key")
          .eq("id", api_key_id)
          .eq("user_id", user_id)
          .single();

        if (error || !apiKeyData) {
          return res.status(404).json({ message: "API key not found" });
        }

        const decryptedApiKey = decryptAPIKey(apiKeyData.api_key);
        return res.status(200).json({ apiKey: decryptedApiKey });
      }

      return res.status(400).json({ message: "Invalid action" });
    } catch (error) {
      console.error("Error handling API request:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return res
        .status(500)
        .json({ message: "Failed to fetch API keys", error });
    }

    // Don't decrypt keys here, only when specifically requested
    return res.status(200).json(data);
  }

  res.status(405).json({ message: "Method not allowed" });
}
