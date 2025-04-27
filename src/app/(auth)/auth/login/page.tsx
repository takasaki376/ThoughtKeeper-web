import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/app/utils/supabase/server";

import { SubmitButton } from "./submit-button";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    try {
      const supabase = createSupabaseServerClient();

      if (!supabase?.auth) {
        console.error("Supabase client initialization failed");
        return { error: "Authentication service is currently unavailable" };
      }

      console.log("Attempting to sign in with:", { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error details:", {
          name: error.name,
          cause: error.cause,
          message: error.message,
          status: error.status,
        });

        if (error.message.includes("Invalid login credentials")) {
          return { error: "Invalid email or password" };
        }
        if (error.message.includes("Email not confirmed")) {
          return { error: "Please confirm your email first" };
        }
        if (error.message.includes("Too many requests")) {
          return { error: "Too many attempts. Please try again later" };
        }

        return { error: `Authentication failed: ${error.message}` };
      }

      if (!data?.user) {
        console.error("No user data returned from sign in");
        return { error: "Authentication failed. Please try again" };
      }

      console.log("Sign in successful for user:", data.user.id);
      redirect("/");
    } catch (error) {
      console.error("Unexpected sign in error:", {
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
            ? `Authentication error: ${error.message}`
            : "An unexpected error occurred. Please try again later",
      };
    }
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

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
