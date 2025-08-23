import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vqjjuvgbekhmdxeuknpm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxamp1dmdiZWtobWR4ZXVrbnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4OTQ5NjEsImV4cCI6MjA3MTQ3MDk2MX0.5LeSVA9MEisvZQhB9Mfddh9SW5wMETvPnLi1cJHsH1I'

export const supabase = createClient(supabaseUrl, supabaseKey)