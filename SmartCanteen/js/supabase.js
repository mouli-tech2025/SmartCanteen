
const SUPABASE_URL = "https://kiugqcbkgvciviuabjph.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Uny45oEzfPU4Yv79hnk7_A_iOQmhib6";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase client initialized successfully!");
