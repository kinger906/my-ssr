import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | null = null

function getDatabaseUrl() {
  const config = useRuntimeConfig()
  const connectionString =
    config.databaseUrl ||
    process.env.NUXT_DATABASE_URL ||
    process.env.DATABASE_URL ||
    ''

  if (!connectionString) {
    console.error('[db] Missing DATABASE_URL/NUXT_DATABASE_URL at runtime')
    throw createError({
      statusCode: 500,
      statusMessage: 'Database configuration is missing'
    })
  }

  return connectionString
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    })

    pool.on('error', (err: Error) => {
      console.error('[db] Unexpected database pool error:', err.message)
    })
  }
  return pool
}

export async function query(text: string, params?: unknown[]) {
  let client: pg.PoolClient | null = null

  try {
    client = await getPool().connect()
    const result = await client.query(text, params)
    return result
  } catch (error) {
    console.error('[db] Query failed:', getErrorMessage(error))
    console.error('[db] SQL:', text.replace(/\s+/g, ' ').trim())

    throw createError({
      statusCode: 500,
      statusMessage: 'Database query failed'
    })
  } finally {
    client?.release()
  }
}
