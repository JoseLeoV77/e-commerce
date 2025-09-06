import { createClient } from '@supabase/supabase-js'
import "dotenv/config"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY


if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase Key or URL not set in .env")
  process.exit(1)
}

export const supabase = createClient(supabaseUrl, supabaseKey)