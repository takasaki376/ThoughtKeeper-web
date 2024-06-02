import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

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
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return "/login?message=Could not authenticate user";
    }

    return "/";
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
      password,
    });

    if (error) {
      return redirect("/auth/login?message=Could not authenticate user");
    }

    return redirect(
      "/auth/login?message=Check email to continue sign in process"
    );
  };

  return (
    <div className="flex justify-center gap-2 px-8">
      <form className="flex w-full flex-col gap-2 text-foreground md:w-1/2">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
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
          formAction={signIn}
          className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <SubmitButton
          formAction={signUp}
          className="mb-2 rounded-md border border-foreground/20 px-4 py-2 text-foreground"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 text-center text-tomato">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}