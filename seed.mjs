import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function createTestUser(email, password, role, metadata) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      terms_version: 1,
      ...metadata
    }
  })

  if (error) {
    console.error(`Error creating ${role}:`, error.message)
    return
  }

  console.log(`Created ${role}: ${email} - ID: ${data.user.id}`)

  // Insert into terms_acceptances so they bypass terms check
  const { error: termsError } = await supabase
    .from('terms_acceptances')
    .insert({
      user_id: data.user.id,
      terms_version: 1,
      ip_address: '127.0.0.1',
      user_agent: 'Seed Script'
    })

  if (termsError) {
    console.error(`Error accepting terms for ${role}:`, termsError.message)
  }
}

async function main() {
  await createTestUser('ogrenci@test.com', 'test1234', 'student', {
    name: 'Test Öğrenci',
    grade: 12,
    track: 'sayisal',
    school_name: 'Test Lisesi',
    grade_track: 'yks'
  })

  await createTestUser('egitmen@test.com', 'test1234', 'instructor', {
    name: 'Test Eğitmen'
  })

  await createTestUser('veli@test.com', 'test1234', 'parent', {
    name: 'Test Veli'
  })

  console.log('Done.')
}

main()
