import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowRightFromBracket, FaRegCircleUser } from "react-icons/fa6";

import { createSupabaseServerClient } from "@/app/utils/supabase/server";

export default async function AuthButton() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error);
      return (
        <Link href="/auth/login" className="relative">
          <FaRegCircleUser />
        </Link>
      );
    }

    const user = data?.user;

    const signOut = async () => {
      "use server";

      try {
        const supabase = createSupabaseServerClient();
        await supabase.auth.signOut();
        redirect("/auth/login");
      } catch (error) {
        console.error("Sign out error:", error);
        redirect("/auth/login");
      }
    };

    return user ? (
      <div className="flex items-center gap-4">
        <form action={signOut}>
          <button
            type="submit"
            aria-label="サインアウト"
            className="rounded-md bg-btn-background pr-2 no-underline hover:bg-btn-background-hover"
          >
            <FaArrowRightFromBracket />
          </button>
        </form>
      </div>
    ) : (
      <Link href="/auth/login" className="relative">
        <FaRegCircleUser />
      </Link>
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return (
      <Link href="/auth/login" className="relative">
        <FaRegCircleUser />
      </Link>
    );
  }
}
