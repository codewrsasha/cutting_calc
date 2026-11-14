const express = require("express");
const router = express.Router();
const { query, persistState } = require("../db");
const { calculateOrder } = require("../services/calculator");

// Вспомогательная функция получения текущих тарифов
async function getCurrentTechSettings() {
  const { rows } = await query("SELECT * FROM tech_settings WHERE id = 1");
  return rows[0] || {
    sewing_hour_rate: 450,
    cutting_hour_rate: 400,
    cutting_parts_per_hour: 32,
    hardware_base_per_item: 10,
    branding_base_per_item: 10,
    workshop_daily_hours: 16,
  };
}

// 1. Предварительный расчёт без сохранения в БД (экспресс-проверка формул)
router.post("/preview", async (req, res, next) => {
  try {
    const techSettings = await getCurrentTechSettings();
    const result = calculateOrder(req.body, techSettings);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 2. Получение реестра истории расчётов из БД PostgreSQL (Модуль 7 ТЗ)
router.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;
    let result;
    if (q && q.trim()) {
      const search = `%${q.trim()}%`;
      result = await query(`
        SELECT * FROM calculations
        WHERE contractor_name ILIKE $1 OR product_type ILIKE $1 OR created_at::text ILIKE $1
        ORDER BY created_at DESC;
      `, [search]);
    } else {
      result = await query("SELECT * FROM calculations ORDER BY created_at DESC;");
    }

    const items = result.rows.map((r) => {
      let extras = {};
      try {
        extras = JSON.parse(r.extras_json || "{}");
      } catch {}

      const dateFormatted = new Date(r.created_at).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: r.id,
        calculationNumber: r.calculation_number,
        date: dateFormatted,
        contractor: r.contractor_name,
        productType: r.product_type,
        quantity: Number(r.quantity),
        difficulty: r.difficulty,
        total: Number(r.total_cost),
        unit: Number(r.unit_cost),
        formValues: {
          contractor: r.contractor_name,
          productType: r.product_type,
          quantity: Number(r.quantity),
          difficulty: r.difficulty,
          partsCount: Number(r.parts_count),
          fabric: r.fabric_name,
          fabricPrice: Number(r.fabric_price),
          rollWidth: Number(r.roll_width),
          seam: Number(r.seam),
          length: Number(r.length),
          chest: Number(r.chest),
          sleeve: Number(r.sleeve),
          waste: Number(r.waste),
          brandingType: r.branding_type,
          extras,
        },
        calculation: {
          fabricCost: Number(r.fabric_cost),
          cutting: Number(r.cutting_cost),
          sewing: Number(r.sewing_cost),
          hardware: Number(r.hardware_cost),
          branding: Number(r.branding_cost),
          total: Number(r.total_cost),
          unit: Number(r.unit_cost),
          totalMeters: Number(r.total_meters),
          cuttingHours: Number(r.cutting_hours),
          sewingHours: Number(r.sewing_hours),
          totalProductionHours: Number(r.total_production_hours),
          productionDays: Number(r.production_days),
        },
      };
    });

    res.json(items);
  } catch (err) {
    next(err);
  }
});

// 3. Сохранение расчёта в БД PostgreSQL (Модуль 7 ТЗ)
router.post("/", async (req, res, next) => {
  try {
    const formValues = req.body.formValues || req.body;
    const techSettings = await getCurrentTechSettings();
    const calc = calculateOrder(formValues, techSettings);

    const id = `calc-${Date.now()}`;
    const calcNumber = `СМЕТА-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    await query(`
      INSERT INTO calculations (
        id, calculation_number, contractor_name, product_type, quantity, difficulty, parts_count,
        fabric_name, fabric_price, roll_width, seam, length, chest, sleeve, waste, branding_type, extras_json,
        fabric_cost, cutting_cost, sewing_cost, hardware_cost, branding_cost, total_cost, unit_cost,
        total_meters, cutting_hours, sewing_hours, total_production_hours, production_days
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28, $29
      );
    `, [
      id,
      calcNumber,
      formValues.contractor || "ООО «СеверМерч»",
      formValues.productType || "Футболка",
      Number(formValues.quantity) || 100,
      formValues.difficulty || "Средняя",
      Number(formValues.partsCount) || 4,
      formValues.fabric || "Кулирная гладь (хлопок)",
      Number(formValues.fabricPrice) || 300,
      Number(formValues.rollWidth) || 150,
      Number(formValues.seam) || 1.5,
      Number(formValues.length) || 70,
      Number(formValues.chest) || 55,
      Number(formValues.sleeve) || 25,
      Number(formValues.waste) || 15,
      formValues.brandingType || "none",
      JSON.stringify(formValues.extras || {}),
      calc.fabricCost,
      calc.cutting,
      calc.sewing,
      calc.hardware,
      calc.branding,
      calc.total,
      calc.unit,
      calc.totalMeters,
      calc.cuttingHours,
      calc.sewingHours,
      calc.totalProductionHours,
      calc.productionDays
    ]);

    await persistState();

    res.status(201).json({
      id,
      calculationNumber: calcNumber,
      message: "Расчёт успешно сохранён в базу данных PostgreSQL",
      calculation: calc,
    });
  } catch (err) {
    next(err);
  }
});

// 4. Запрет на удаление расчётов (Требование ТЗ: История должна сохраняться в БД)
router.delete("/:id", (req, res) => {
  res.status(403).json({
    error: "Удаление записей истории запрещено политикой цеха. Все расчёты сохраняются в БД.",
  });
});

router.delete("/", (req, res) => {
  res.status(403).json({
    error: "Очистка истории расчётов запрещена политикой цеха.",
  });
});

module.exports = router;
