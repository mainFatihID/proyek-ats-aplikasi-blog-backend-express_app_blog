import mysql from 'mysql2/promise';

const pool = await mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    database    : 'db_app_blog',
    password    : 'EK9iFaWG_6OY@dn'
});

export default pool 