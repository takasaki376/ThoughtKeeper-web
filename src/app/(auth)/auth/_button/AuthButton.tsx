import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowRightFromBracket, FaRegCircleUser } from "react-icons/fa6";

import { create_ServerClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = create_ServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = create_ServerClient();
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
