import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function main() {
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError) {
    console.error('Error fetching users:', usersError)
    return
  }

  const testUsers = usersData.users.filter(u => u.email.includes('test'))
  console.log(`Found ${testUsers.length} test users to delete.`)

  for (const user of testUsers) {
    console.log(`Deleting ${user.email} (${user.id})...`)
    const { error } = await supabase.auth.admin.deleteUser(user.id)
    if (error) {
      console.error(`Failed to delete ${user.email}:`, error)
    } else {
      console.log(`Deleted ${user.email}`)
    }
  }

  console.log('Done.')
}

main()
