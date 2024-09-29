import { createClient } from "@/utils/supabase/client";

export const getThemes = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("themes").select("*");
  // console.log(`data:${data}`);

  if (error) {
    console.error("Error fetching themes:", error.message);
    return [];
  }
  return data;
};
