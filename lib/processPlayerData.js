// import Mysql
import mysql from 'mysql2/promise';

//Create database connector
export async function getDatabaseConnect () {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}