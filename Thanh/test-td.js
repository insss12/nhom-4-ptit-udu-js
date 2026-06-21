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
        console.log("✅ Kết nối MySQL thành công!");

        const [columns] = await conn.query("DESCRIBE users");
        console.log("Cấu trúc bảng users:");
        columns.forEach(col => console.log(" -", col.Field, "(", col.Type, ")"));

        await conn.end();
    } catch (err) {
        console.error("❌ Lỗi:", err.code, "-", err.message);
    }
})();