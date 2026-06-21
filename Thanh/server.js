const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./db");
require("dotenv").config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// 🛠️ Serve cả folder cha (chứa Thanh, Blog, Shop) để link sang các folder khác hoạt động
app.use(express.static(path.join(__dirname, "..")));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false }
}));

// Route mặc định: Khi gõ http://localhost:3000/ sẽ chuyển sang trang chủ thật trong Thanh
app.get('/', (req, res) => {
    res.redirect("/Thanh/main.html");
});

// Các API đăng ký, đăng nhập giữ nguyên...
app.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    try {
        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Email đã được sử dụng" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)",
            [fullName, email, hashedPassword]
        );
        return res.status(201).json({ message: "Đăng ký thành công" });
    } catch (err) {
        console.error("Lỗi đăng ký:", err);
        return res.status(500).json({ message: "Lỗi server, vui lòng thử lại" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Sai thông tin đăng nhập" });
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Sai thông tin đăng nhập" });
        }
        req.session.user = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address
        };
        return res.json({ message: "Đăng nhập thành công" });
    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        return res.status(500).json({ message: "Lỗi server, vui lòng thử lại" });
    }
});

app.get("/api/account", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    return res.json(req.session.user);
});

app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Đã đăng xuất" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});