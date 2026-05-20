import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | null = null

export function getPool(): pg.Pool {
  if (!pool) {
    const config = useRuntimeConfig()
    const connectionString = config.databaseUrl || process.env.DATABASE_URL

    if (!connectionString) {
      console.error('[db] Missing DATABASE_URL')
      throw createError({
        statusCode: 500,
        statusMessage: 'Database configuration is missing'
      })
    }

    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    })

    pool.on('error', (err: Error) => {
      console.error('[db] Unexpected pool error:', err.message)
    })
  }
  return pool
}

export async function query(text: string, params?: unknown[]) {
  let client: pg.PoolClient | null = null

  try {
    client = await getPool().connect()
    return await client.query(text, params)
  } catch (error) {
    console.error('[db] Query failed:', error instanceof Error ? error.message : String(error))
    throw createError({
      statusCode: 500,
      statusMessage: 'Database query failed'
    })
  } finally {
    client?.release()
  }
}
