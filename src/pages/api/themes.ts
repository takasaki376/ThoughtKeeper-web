import { supabase } from "@/utils/supabaseClient";

export const getThemes = async () => {
  const { data, error } = await supabase.from("themes").select("*");
  console.log(`data:${data}`);

  if (error) {
    console.error("Error fetching themes:", error.message);
    return [];
  }
  return data;
};
