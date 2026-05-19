import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | null = null

export function getPool(): pg.Pool {
  if (!pool) {
    const config = useRuntimeConfig()
    const connectionString = config.databaseUrl

    if (!connectionString) {
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
      console.error('Unexpected database pool error:', err.message)
    })
  }
  return pool
}

export async function query(text: string, params?: unknown[]) {
  const client = await getPool().connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}