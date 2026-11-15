/**
 * @file techSettings.js
 * @description Маршрутизация нормативов и базовых тарифов технолога цеха (Модуль 6 ТЗ)
 */

const express = require("express");
const router = express.Router();
const { query } = require("../db");

// 1. Получение действующих нормативов технолога
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM tech_settings WHERE id = 1");
    const row = rows[0];
    if (!row) {
      return res.status(404).json({ error: "Настройки не найдены" });
    }

    res.json({
      sewingHourRate: Number(row.sewing_hour_rate),
      cuttingHourRate: Number(row.cutting_hour_rate),
      cuttingPartsPerHour: Number(row.cutting_parts_per_hour),
      hardwareBasePerItem: Number(row.hardware_base_per_item),
      brandingBasePerItem: Number(row.branding_base_per_item),
      workshopDailyHours: Number(row.workshop_daily_hours),
      updatedAt: row.updated_at,
    });
  } catch (err) {
    next(err);
  }
});

// 2. Обновление ставок технологом
router.put("/", async (req, res, next) => {
  try {
    const {
      sewingHourRate = 450,
      cuttingHourRate = 400,
      cuttingPartsPerHour = 32,
      hardwareBasePerItem = 10,
      brandingBasePerItem = 10,
      workshopDailyHours = 16,
    } = req.body;

    await query(`
      UPDATE tech_settings
      SET sewing_hour_rate = $1,
          cutting_hour_rate = $2,
          cutting_parts_per_hour = $3,
          hardware_base_per_item = $4,
          branding_base_per_item = $5,
          workshop_daily_hours = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1;
    `, [
      Number(sewingHourRate) || 450,
      Number(cuttingHourRate) || 400,
      Number(cuttingPartsPerHour) || 32,
      Number(hardwareBasePerItem) || 10,
      Number(brandingBasePerItem) || 10,
      Number(workshopDailyHours) || 16,
    ]);

    res.json({
      message: "Нормативы технолога успешно обновлены в PostgreSQL",
      settings: {
        sewingHourRate: Number(sewingHourRate),
        cuttingHourRate: Number(cuttingHourRate),
        cuttingPartsPerHour: Number(cuttingPartsPerHour),
        hardwareBasePerItem: Number(hardwareBasePerItem),
        brandingBasePerItem: Number(brandingBasePerItem),
        workshopDailyHours: Number(workshopDailyHours),
      },
    });
  } catch (err) {
    next(err);
  }
});

// 3. Сброс ставок к заводским
router.post("/reset", async (req, res, next) => {
  try {
    await query(`
      UPDATE tech_settings
      SET sewing_hour_rate = 450,
          cutting_hour_rate = 400,
          cutting_parts_per_hour = 32,
          hardware_base_per_item = 10,
          branding_base_per_item = 10,
          workshop_daily_hours = 16,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1;
    `);

    res.json({
      message: "Нормативы технолога сброшены к базовым",
      settings: {
        sewingHourRate: 450,
        cuttingHourRate: 400,
        cuttingPartsPerHour: 32,
        hardwareBasePerItem: 10,
        brandingBasePerItem: 10,
        workshopDailyHours: 16,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
