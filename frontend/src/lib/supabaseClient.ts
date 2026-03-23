import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kbamlfeclhikvsuxqeza.supabase.co";
const supabaseKey = "sb_publishable_isQguuQEkRnyqIdkGRxW9Q__Gt_GktE";

export const supabase = createClient(supabaseUrl, supabaseKey);