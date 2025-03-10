import { Pool } from "pg";

export const pool = new Pool({
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // database: process.env.DB_NAME,
    // password: process.env.DB_PASSWORD,
    // port: parseInt(process.env.DB_PORT || "5432"),
    connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params: unknown[] = []) => 
    pool.query(text, params);