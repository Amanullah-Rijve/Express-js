import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:10,
});

// connection test
const testConnection = async()=>{
    try {
        const connection = await pool.getConnection();
        console.log('MYSQL Connected');
        connection.release();
    } catch (error) {
        console.error('MYSQL Connection failed');
        process.exit(1);
    }
};

testConnection();

export default pool;