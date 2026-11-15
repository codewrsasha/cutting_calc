/**
 * @file contractors.js
 * @description Маршрутизация справочника подрядчиков цеха (Модуль 1 ТЗ)
 */

const express = require("express");
const router = express.Router();
const crypto = require("node:crypto");
const { query, persistState } = require("../db");

// 1. Получение списка контрагентов
router.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;
    let result;
    if (q && q.trim()) {
      const search = `%${q.trim()}%`;
      result = await query(`
        SELECT id, name, contact_person as contact, email, phone, inn, address
        FROM contractors
        WHERE name ILIKE $1 OR contact_person ILIKE $1
        ORDER BY name ASC;
      `, [search]);
    } else {
      result = await query(`
        SELECT id, name, contact_person as contact, email, phone, inn, address
        FROM contractors
        ORDER BY name ASC;
      `);
    }
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// 2. Добавление нового подрядчика
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

    await persistState();

    res.status(201).json({
      id,
      name: name.trim(),
      contact: contact.trim(),
      email: email.trim(),
      phone: phone.trim(),
      inn: inn.trim(),
      address: address.trim(),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
