import { redirect } from "next/navigation";

import { Tiptap } from "@/component/TipTap";
import { createClient } from "@/utils/supabase/server";

export default async function MemoEditorPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }
  return <Tiptap />;
}
