import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://edlauwvnlnxbkaiovmal.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkbGF1d3ZubG54YmthaW92bWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODk1NDEsImV4cCI6MjA4OTk2NTU0MX0.kqpXSqDie2QfAJSFZSBkAe8YeW-Hrh-nPw7idmlkfbo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
