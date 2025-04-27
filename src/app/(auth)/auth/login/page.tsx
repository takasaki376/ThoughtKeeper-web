import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers"; // クッキー操作用
import { redirect } from "next/navigation";

import { SubmitButton } from "./submit-button";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const signIn = async (email: string, password: string) => {
    "use server";
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      return redirect(`/auth/login?message=${error.message}`);
    }

    // クッキーにトークンを保存
    const cookieStore = cookies();
    const token = data.session?.access_token;
    if (token) {
      cookieStore.set("supabase-auth-token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7日間有効
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return redirect("/"); // ログイン後のリダイレクト先
  };

  const signUp = async (formData: FormData) => {
    "use server";
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
<<<<<<< HEAD
    // const supabase = createSupabaseServerClient();
=======
>>>>>>> dad14083df65f59219dd3c6c45e75215d07ba3a2

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    try {
      const supabase = createSupabaseServerClient();

      if (!supabase?.auth) {
        console.error("Supabase client initialization failed");
        return { error: "Authentication service is currently unavailable" };
      }

      console.log("Attempting to sign up with:", { email });
      const { data, error } = await supabase.auth.signUp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
        password,
      });

      if (error) {
        console.error("Sign up error details:", {
          name: error.name,
          cause: error.cause,
          message: error.message,
          status: error.status,
        });

        if (error.message.includes("User already registered")) {
          return { error: "This email is already registered" };
        }
        if (error.message.includes("Password should be at least")) {
          return { error: "Password is too weak" };
        }
        if (error.message.includes("Invalid email")) {
          return { error: "Please enter a valid email address" };
        }

        return { error: `Registration failed: ${error.message}` };
      }

      if (!data?.user) {
        console.error("No user data returned from sign up");
        return { error: "Registration failed. Please try again" };
      }

      console.log("Sign up successful for user:", data.user.id);
      return { success: "Check email to continue sign in process" };
    } catch (error) {
      console.error("Unexpected sign up error:", {
        name: error instanceof Error ? error.name : "Unknown error",
        error,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        error:
          error instanceof Error
            ? `Registration error: ${error.message}`
            : "An unexpected error occurred. Please try again later",
      };
    }
  };
  return (
    <div className="flex justify-center gap-2 px-8">
      <form className="flex w-full flex-col gap-2 text-foreground md:w-1/2">
        <label className="text-base" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-base" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
<<<<<<< HEAD
          formAction={signIn}
          className="text-foregroun mb-2 rounded-md bg-green-700 px-4 py-2"
=======
          formAction={async (formData) => {
            "use server";
            const result = await signIn(formData);
            if (result?.error) {
              redirect(
                `/auth/login?message=${encodeURIComponent(result.error)}`
              );
            }
          }}
          className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
>>>>>>> dad14083df65f59219dd3c6c45e75215d07ba3a2
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <SubmitButton
          formAction={async (formData) => {
            "use server";
            const result = await signUp(formData);
            if (result?.error) {
              redirect(
                `/auth/login?message=${encodeURIComponent(result.error)}`
              );
            } else if (result?.success) {
              redirect(
                `/auth/login?message=${encodeURIComponent(result.success)}`
              );
            }
          }}
          className="mb-2 rounded-md border border-foreground/20 px-4 py-2 text-foreground"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 text-center text-tomato">
            {decodeURIComponent(searchParams.message)}
          </p>
        )}
      </form>
    </div>
  );
}
