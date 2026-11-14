const express = require("express");
const router = express.Router();
const crypto = require("node:crypto");
const { query } = require("../db");

// Список активных тканей (Модуль 6 ТЗ)
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT id, name, roll_width as \"rollWidth\", price_per_meter as \"pricePerMeter\" FROM fabrics WHERE is_active = 1 ORDER BY name ASC"
    );
    res.json(rows.map(r => ({
      id: r.id,
      name: r.name,
      rollWidth: Number(r.rollWidth),
      pricePerMeter: Number(r.pricePerMeter),
    })));
  } catch (err) {
    next(err);
  }
});

// Добавление новой ткани в справочник
router.post("/", async (req, res, next) => {
  try {
    const { name, rollWidth = 150, pricePerMeter = 300 } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Название ткани обязательно" });
    }

    const id = `f-${crypto.randomUUID()}`;
    await query(`
      INSERT INTO fabrics (id, name, roll_width, price_per_meter, is_active)
      VALUES ($1, $2, $3, $4, 1);
    `, [id, name.trim(), Number(rollWidth) || 150, Number(pricePerMeter) || 300]);

    res.status(201).json({ id, name: name.trim(), rollWidth: Number(rollWidth), pricePerMeter: Number(pricePerMeter) });
  } catch (err) {
    next(err);
  }
});

// Удаление ткани из справочника
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await query("UPDATE fabrics SET is_active = 0 WHERE id = $1", [id]);
    res.json({ message: "Ткань удалена из справочника" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
