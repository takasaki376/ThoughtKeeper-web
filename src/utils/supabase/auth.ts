import { createClient } from "@supabase/supabase-js";
import { NextApiRequest } from "next";

export async function getLoggedInUser(req: NextApiRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing required environment variables for Supabase client");
  }

  const token = req.cookies["supabase-auth-token"];

  if (!token) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  supabase.auth.setAuth(token);

  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Failed to get user:", error);
    return null;
  }

  return user;
}