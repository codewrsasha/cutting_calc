const express = require("express");
const router = express.Router();
const { query } = require("../db");

// Вход пользователя цеха (Модуль 1 ТЗ)
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    const { rows } = await query(
      "SELECT id, email, full_name, role, password_hash FROM users WHERE email = $1 AND is_active = 1",
      [email]
    );
    const user = rows[0];
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      token: `token-${user.id}-${Date.now()}`,
    });
  } catch (err) {
    next(err);
  }
});

// Получение профилей сотрудников цеха
router.get("/users", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT id, email, full_name, role FROM users WHERE is_active = 1");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
