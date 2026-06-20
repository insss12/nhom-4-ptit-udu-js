const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");
const db = require("./db");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.static("public")); // Phục vụ file từ thư mục public

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false } // secure: true nếu dùng HTTPS
}));

// Route Đăng ký
app.post("/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const [exist] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (exist.length > 0) return res.status(400).json({ message: "Email đã tồn tại" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users(fullName, email, password) VALUES(?,?,?)", [fullName, email, hashedPassword]);
        res.json({ message: "Đăng ký thành công" });
    } catch (err) { res.status(500).json({ message: "Lỗi server" }); }
});

// Route Đăng nhập
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query("SELECT * FROM users WHERE email=?", [email]);
        if (users.length === 0) return res.status(400).json({ message: "Sai thông tin đăng nhập" });

        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) return res.status(400).json({ message: "Sai thông tin đăng nhập" });

        req.session.userId = users[0].id;
        res.json({ message: "Đăng nhập thành công" });
    } catch (err) { res.status(500).json({ message: "Lỗi server" }); }
});

// Route Lấy thông tin cá nhân
app.get("/api/account", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Chưa đăng nhập" });
    const [user] = await db.query("SELECT fullName, email, phone, address FROM users WHERE id = ?", [req.session.userId]);
    res.json(user[0] || {});
});

// Route Đăng xuất
app.post("/api/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Đã đăng xuất" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server chạy tại: http://localhost:${process.env.PORT || 3000}`);
});