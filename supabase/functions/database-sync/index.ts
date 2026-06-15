import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncPayload {
  table: string
  operation: 'INSERT' | 'UPDATE' | 'DELETE'
  record: any
  old_record?: any
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const externalUrl = Deno.env.get('EXTERNAL_SUPABASE_URL')
    const externalKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY')

    if (!externalUrl || !externalKey) {
      throw new Error('External Supabase credentials not configured')
    }

    // Create client for external Supabase
    const externalSupabase = createClient(externalUrl, externalKey)

    const payload: SyncPayload = await req.json()
    console.log('Syncing data:', { table: payload.table, operation: payload.operation })

    let result

    switch (payload.operation) {
      case 'INSERT':
        result = await externalSupabase
          .from(payload.table)
          .upsert(payload.record, { onConflict: 'id' })
        break

      case 'UPDATE':
        result = await externalSupabase
          .from(payload.table)
          .upsert(payload.record, { onConflict: 'id' })
        break

      case 'DELETE':
        result = await externalSupabase
          .from(payload.table)
          .delete()
          .eq('id', payload.old_record.id)
        break

      default:
        throw new Error(`Unknown operation: ${payload.operation}`)
    }

    if (result.error) {
      console.error('Sync error:', result.error)
      throw result.error
    }

    console.log('Sync successful:', { table: payload.table, operation: payload.operation })

    return new Response(
      JSON.stringify({ success: true, message: 'Data synced successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in database-sync:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
