import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const localUrl = Deno.env.get('SUPABASE_URL')
    const localKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const externalUrl = Deno.env.get('EXTERNAL_SUPABASE_URL')
    const externalKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY')

    if (!localUrl || !localKey || !externalUrl || !externalKey) {
      throw new Error('Missing Supabase credentials')
    }

    console.log('Starting initial data sync...')

    // Create clients
    const localSupabase = createClient(localUrl, localKey)
    const externalSupabase = createClient(externalUrl, externalKey)

    // Tables to sync
    const tables = [
      'user_roles',
      'patients',
      'doctors',
      'hospitals',
      'health_workers',
      'relatives',
      'consultations',
      'emergency_cases',
      'relative_link_requests'
    ]

    let totalSynced = 0
    const results = []

    for (const table of tables) {
      try {
        console.log(`Syncing table: ${table}`)
        
        // Fetch all data from local database
        const { data: localData, error: fetchError } = await localSupabase
          .from(table)
          .select('*')

        if (fetchError) {
          console.error(`Error fetching from ${table}:`, fetchError)
          results.push({ table, status: 'error', error: fetchError.message })
          continue
        }

        if (!localData || localData.length === 0) {
          console.log(`No data to sync for ${table}`)
          results.push({ table, status: 'skipped', count: 0 })
          continue
        }

        // Insert data into external database (upsert to handle existing data)
        const { error: insertError } = await externalSupabase
          .from(table)
          .upsert(localData, { onConflict: 'id' })

        if (insertError) {
          console.error(`Error syncing to ${table}:`, insertError)
          results.push({ table, status: 'error', error: insertError.message })
          continue
        }

        console.log(`Successfully synced ${localData.length} records to ${table}`)
        totalSynced += localData.length
        results.push({ table, status: 'success', count: localData.length })
      } catch (error) {
        console.error(`Error processing table ${table}:`, error)
        results.push({ table, status: 'error', error: error.message })
      }
    }

    console.log(`Initial sync completed: ${totalSynced} total records synced`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully synced ${totalSynced} records`,
        results: results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in initial-sync:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
