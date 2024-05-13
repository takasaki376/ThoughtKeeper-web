import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function MemoViewerPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }
  return <div className="text-gray">MemoViewerPage</div>;
}
