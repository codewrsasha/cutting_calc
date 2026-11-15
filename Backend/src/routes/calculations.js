/**
 * @file calculations.js
 * @description Маршрутизация расчётов сметы и реестра истории (Модули 4 и 7 ТЗ)
 *
 * Возможности:
 * - Экспресс-превью расчёта без сохранения в БД (`POST /preview`)
 * - Получение истории с поиском по подрядчику, изделию, дате (`GET /`)
 * - Сохранение нового расчёта в PostgreSQL (`POST /`)
 * - Редактирование существующего расчёта (`PUT /:id`)
 * - Удаление расчёта с каскадной очисткой связанных КП (`DELETE /:id`)
 */

const express = require("express");
const router = express.Router();
const { query, persistState } = require("../db");
const { calculateOrder } = require("../services/calculator");

/**
 * Получение текущих действующих нормативов технолога из БД
 */
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

// ============================================================================
// 1. ПРЕДВАРИТЕЛЬНЫЙ ЭКСПРЕСС-РАСЧЁТ (POST /api/calculations/preview)
// ============================================================================
router.post("/preview", async (req, res, next) => {
  try {
    const techSettings = await getCurrentTechSettings();
    const result = calculateOrder(req.body, techSettings);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 2. ПОЛУЧЕНИЕ ИСТОРИИ РАСЧЁТОВ (GET /api/calculations)
// ============================================================================
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
        createdByName: r.created_by_name || (Number(r.quantity) > 120 ? "Петрова Анна Сергеевна" : "Сидоров Максим Игоревич"),
        createdByRole: r.created_by_role || (Number(r.quantity) > 120 ? "technologist" : "manager"),
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

// ============================================================================
// 3. СОХРАНЕНИЕ РАСЧЁТА В РЕЕСТР (POST /api/calculations)
// ============================================================================
router.post("/", async (req, res, next) => {
  try {
    const { formValues, createdByName, createdByRole } = req.body;
    if (!formValues) {
      return res.status(400).json({ error: "Данные формы обязательны" });
    }

    const techSettings = await getCurrentTechSettings();
    const result = calculateOrder(formValues, techSettings);

    const id = `calc-${Date.now()}`;
    const calcNum = `СМЕТА-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const authorName = createdByName || "Сидоров Максим Игоревич";
    const authorRole = createdByRole || "manager";

    await query(`
      INSERT INTO calculations (
        id, calculation_number, contractor_name, product_type, quantity, difficulty, parts_count,
        fabric_name, fabric_price, roll_width, seam, length, chest, sleeve, waste, branding_type, extras_json,
        fabric_cost, cutting_cost, sewing_cost, hardware_cost, branding_cost, total_cost, unit_cost,
        total_meters, cutting_hours, sewing_hours, total_production_hours, production_days, created_by_name, created_by_role
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28, $29, $30, $31
      );
    `, [
      id,
      calcNum,
      formValues.contractor || "Не указан",
      formValues.productType || "Футболка",
      Number(formValues.quantity) || 1,
      formValues.difficulty || "Средняя",
      Number(formValues.partsCount) || 4,
      formValues.fabric || "Кулирная гладь",
      Number(formValues.fabricPrice) || 300,
      Number(formValues.rollWidth) || 150,
      Number(formValues.seam) || 1.5,
      Number(formValues.length) || 70,
      Number(formValues.chest) || 55,
      Number(formValues.sleeve) || 25,
      Number(formValues.waste) || 15,
      formValues.brandingType || "none",
      JSON.stringify(formValues.extras || {}),
      result.fabricCost,
      result.cutting,
      result.sewing,
      result.hardware,
      result.branding,
      result.total,
      result.unit,
      result.totalMeters,
      result.cuttingHours,
      result.sewingHours,
      result.totalProductionHours,
      result.productionDays,
      authorName,
      authorRole,
    ]);

    await persistState();

    res.status(201).json({
      id,
      calculationNumber: calcNum,
      calculation: result,
      message: "Расчёт успешно сохранён в базе данных PostgreSQL",
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 4. ОБНОВЛЕНИЕ РАСЧЁТА АДМИНИСТРАТОРОМ (PUT /api/calculations/:id)
// ============================================================================
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contractor, productType, quantity, difficulty, total, unit, fabric, productionDays } = req.body;

    const { rows } = await query("SELECT * FROM calculations WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Расчёт не найден в базе данных" });
    }

    const current = rows[0];
    const newContractor = contractor || current.contractor_name;
    const newProductType = productType || current.product_type;
    const newQuantity = Number(quantity) || Number(current.quantity);
    const newDifficulty = difficulty || current.difficulty;
    const newTotal = total !== undefined ? Number(total) : Number(current.total_cost);
    const newUnit = unit !== undefined ? Number(unit) : (newQuantity > 0 ? Math.round(newTotal / newQuantity) : Number(current.unit_cost));
    const newFabric = fabric || current.fabric_name;
    const newDays = productionDays !== undefined ? Number(productionDays) : Number(current.production_days);

    await query(`
      UPDATE calculations
      SET contractor_name = $1,
          product_type = $2,
          quantity = $3,
          difficulty = $4,
          total_cost = $5,
          unit_cost = $6,
          fabric_name = $7,
          production_days = $8
      WHERE id = $9;
    `, [newContractor, newProductType, newQuantity, newDifficulty, newTotal, newUnit, newFabric, newDays, id]);

    await persistState();

    res.json({
      success: true,
      message: "Расчёт успешно обновлён",
      item: {
        id,
        contractor: newContractor,
        productType: newProductType,
        quantity: newQuantity,
        difficulty: newDifficulty,
        total: newTotal,
        unit: newUnit,
        fabric: newFabric,
        productionDays: newDays,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 5. УДАЛЕНИЕ РАСЧЁТА АДМИНИСТРАТОРОМ (DELETE /api/calculations/:id)
// ============================================================================
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await query("SELECT id, calculation_number FROM calculations WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Расчёт не найден в базе данных" });
    }

    // Каскадное удаление связанных коммерческих предложений
    await query("DELETE FROM commercial_proposals WHERE calculation_id = $1", [id]);

    // Удаление самой сметы
    await query("DELETE FROM calculations WHERE id = $1", [id]);

    await persistState();

    res.json({
      success: true,
      message: `Запись расчёта ${rows[0].calculation_number || id} успешно удалена из базы данных`,
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 6. ОЧИСТКА ВСЕЙ ИСТОРИИ (DELETE /api/calculations)
// ============================================================================
router.delete("/", async (req, res, next) => {
  try {
    await query("DELETE FROM commercial_proposals;");
    await query("DELETE FROM calculations;");
    await persistState();
    res.json({ message: "Реестр истории расчётов полностью очищен" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
