// src/pages/api/themes.ts

import { supabase } from "@/utils/supabaseClient";

export const getThemes = async () => {
  const { data, error } = await supabase.from("themes").select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};
