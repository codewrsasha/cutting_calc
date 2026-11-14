const express = require("express");
const router = express.Router();
const crypto = require("node:crypto");
const { query } = require("../db");

// Список подрядчиков (Модуль 1 ТЗ)
router.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;
    let result;
    if (q && q.trim()) {
      const search = `%${q.trim()}%`;
      result = await query(
        "SELECT * FROM contractors WHERE name ILIKE $1 OR contact_person ILIKE $1 OR inn ILIKE $1 ORDER BY name ASC",
        [search]
      );
    } else {
      result = await query("SELECT * FROM contractors ORDER BY name ASC");
    }

    res.json(result.rows.map(c => ({
      id: c.id,
      name: c.name,
      contact: c.contact_person,
      email: c.email,
      phone: c.phone,
      inn: c.inn,
      address: c.address,
    })));
  } catch (err) {
    next(err);
  }
});

// Создание нового подрядчика
router.post("/", async (req, res, next) => {
  try {
    const { name, contact = "", email = "", phone = "", inn = "", address = "" } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Наименование подрядчика обязательно" });
    }

    const id = `c-${crypto.randomUUID()}`;
    await query(`
      INSERT INTO contractors (id, name, contact_person, email, phone, inn, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `, [id, name.trim(), contact.trim(), email.trim(), phone.trim(), inn.trim(), address.trim()]);

    res.status(201).json({ id, name, contact, email, phone, inn, address });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
