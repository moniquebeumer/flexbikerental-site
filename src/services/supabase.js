import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://euekfxqbvxdajbvsxgpf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZWtmeHFidnhkYWpidnN4Z3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Nzc4OTgsImV4cCI6MjA5NDE1Mzg5OH0.elYgPUj1e5HL-LgMMT1sJo6SKPJOuTJtovwJmXoDqi0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
