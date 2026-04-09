import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export default async function conectar() {
    if (!global.poolConexoes) {
        const { Pool } = pg;
        
        const pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: {
                rejectUnauthorized: false 
            },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        global.poolConexoes = pool;
    }
    
    return await global.poolConexoes.connect();
}