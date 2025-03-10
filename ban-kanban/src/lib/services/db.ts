import { Pool } from "pg";

// Check if the app is running in a Docker container
const isDocker = !!process.env.DATABASE_URL;

console.log("isDocker", isDocker);

export const pool = new Pool(
    isDocker
        ? { connectionString: process.env.DATABASE_URL }
        : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || "5432"),
        }
);

export const query = (text: string, params: unknown[] = []) => 
    pool.query(text, params);