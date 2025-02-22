import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowRightFromBracket, FaRegCircleUser } from "react-icons/fa6";

import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    user ? redirect("/") : redirect("/auth/login");
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
    <Link href="/auth/login" className=" relative">
      <FaRegCircleUser />
    </Link>
  );
}
