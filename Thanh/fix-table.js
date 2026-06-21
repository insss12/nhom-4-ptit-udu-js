require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        await conn.query("DROP TABLE IF EXISTS users");
        console.log("Đã xóa bảng users cũ");

        await conn.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullName VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                address VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Đã tạo lại bảng users với đúng cấu trúc");

        const [columns] = await conn.query("DESCRIBE users");
        columns.forEach(col => console.log(" -", col.Field, "(", col.Type, ")"));

        await conn.end();
    } catch (err) {
        console.error("❌ Lỗi:", err.code, "-", err.message);
    }
})();
