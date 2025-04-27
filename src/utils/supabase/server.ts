import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieOptions = {
  domain?: string;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
};

export const createSupabaseServerClient = () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    // 環境変数の詳細なログ
    console.log("Environment check:", {
      KEY_LENGTH: supabaseKey?.length,
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_ANON_KEY: supabaseKey ? "Present" : "Missing",
      SUPABASE_URL: supabaseUrl ? "Present" : "Missing",
      URL_LENGTH: supabaseUrl?.length,
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        `Missing required environment variables:
        SUPABASE_URL: ${supabaseUrl ? "Present" : "Missing"}
        SUPABASE_ANON_KEY: ${supabaseKey ? "Present" : "Missing"}
        Please check your .env.local file.`
      );
    }

    // URLとキーの形式チェック
    if (!supabaseUrl.startsWith("https://")) {
      throw new Error("SUPABASE_URL must start with https://");
    }
    if (supabaseKey.length < 20) {
      throw new Error("SUPABASE_ANON_KEY appears to be invalid (too short)");
    }

    const cookieStore = cookies();

    console.log("Creating Supabase client...");
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
      cookies: {
        get(name: string) {
          try {
            const value = cookieStore.get(name)?.value;
            console.log(
              `Getting cookie ${name}:`,
              value ? "Present" : "Missing"
            );
            return value;
          } catch (error) {
            console.error("Error getting cookie:", {
              name,
              error: error instanceof Error ? error.message : "Unknown error",
            });
            return undefined;
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            console.log(`Removing cookie ${name}`);
            cookieStore.set(name, "", options);
          } catch (error) {
            console.error("Error removing cookie:", {
              name,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            console.log(`Setting cookie ${name}`);
            cookieStore.set(name, value, options);
          } catch (error) {
            console.error("Error setting cookie:", {
              name,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        },
      },
    });

    // クライアントの検証
    if (!supabase) {
      throw new Error("Failed to create Supabase client instance");
    }

    if (!supabase.auth) {
      throw new Error("Supabase auth module is not available");
    }

    // 接続テスト
    console.log("Testing Supabase connection...");
    const testResult = supabase.auth.getSession();
    console.log("Connection test result:", testResult ? "Success" : "Failed");

    console.log("Supabase client initialized successfully");
    return supabase;
  } catch (error) {
    console.error("Failed to create Supabase client:", {
      name: error instanceof Error ? error.name : "Unknown error",
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
          ? "Present"
          : "Missing",
        SUPABASE_URL: process.env.SUPABASE_URL ? "Present" : "Missing",
      },
      error,
      message: error instanceof Error ? error.message : "Unknown error message",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(
      `Failed to initialize Supabase client: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
