/**
 * @file calculator.js
 * @description Серверное математическое ядро расчёта себестоимости и раскроя изделия
 * Согласно разделам 3.1, 3.2 и 3.3 ТЗ цеха (г. Сургут, ул. Комплектовочная, 5)
 */

const COMPLEXITY_RATES = {
  Базовая: 0.85,
  Средняя: 1.0,
  Сложная: 1.25,
};

const EXTRA_OPTIONS = [
  { id: "pocket", label: "Карман", cost: 4 },
  { id: "hood", label: "Капюшон", cost: 12 },
  { id: "lining", label: "Подкладка", cost: 8 },
];

const BRANDING_COSTS = {
  none: 0,
  silkscreen: 60,
  transfer: 80,
  embroidery: 140,
};

/**
 * Серверный расчёт себестоимости заказа по укрупнённым параметрам
 * @param {Object} params Параметры изделия и раскроя
 * @param {Object} techSettings Нормативы и ставки цеха
 * @returns {Object} Детализированная смета
 */
function calculateOrder(params, techSettings) {
  const {
    quantity = 1,
    difficulty = "Средняя",
    partsCount = 4,
    fabricPrice = 0,
    length = 70,
    sleeve = 25,
    seam = 1.5,
    waste = 15,
    brandingType = "none",
    extras = {},
  } = params;

  const qty = Math.max(1, Number(quantity) || 1);
  const parts = Math.max(1, Number(partsCount) || 4);

  // 1. РАСЧЁТ РАСКРОЯ И МАТЕРИАЛА (п. 3.3 ТЗ)
  const consumptionMeters =
    ((length * 1.1 + sleeve * 0.74 + seam * 2.0) / 100) * (1 + waste / 100);
  const rawFabricCost = qty * fabricPrice * consumptionMeters;
  const fabricCost = Math.round(rawFabricCost / 100) * 100;
  const totalMeters = fabricPrice > 0 ? Math.round(fabricCost / fabricPrice) : 0;
  const estimatedMetersNotice = Math.max(1, Math.ceil(totalMeters / 10));

  // Трудоёмкость и стоимость раскройщика (п. 3.3 ТЗ)
  const totalParts = parts * qty;
  const cuttingNormPerHour = techSettings.cuttingPartsPerHour || techSettings.cutting_parts_per_hour || 32;
  const cuttingHours = Math.round((totalParts / cuttingNormPerHour) * 10) / 10;
  const cuttingRate = techSettings.cuttingHourRate || techSettings.cutting_hour_rate || 400;
  const cutting = Math.round(cuttingHours * cuttingRate);

  // 2. РАСЧЁТ ПОШИВА ИЗДЕЛИЯ (п. 3.2 ТЗ)
  const complexityMultiplier = COMPLEXITY_RATES[difficulty] ?? 1.0;
  const baseSewingHoursPerUnit = 0.64;
  const sewingHours = Math.round(qty * baseSewingHoursPerUnit * complexityMultiplier * 10) / 10;
  const sewingRate = techSettings.sewingHourRate || techSettings.sewing_hour_rate || 450;
  const sewing = Math.round(sewingHours * sewingRate);

  // 3. СТОИМОСТЬ ФУРНИТУРЫ (п. 3.1 ТЗ)
  const extrasCostPerItem = EXTRA_OPTIONS.reduce(
    (sum, opt) => sum + (extras[opt.id] ? opt.cost : 0),
    0
  );
  const hardwareBase = techSettings.hardwareBasePerItem || techSettings.hardware_base_per_item || 10;
  const hardwarePerUnit = hardwareBase + extrasCostPerItem;
  const hardware = qty * hardwarePerUnit;

  // 4. СТОИМОСТЬ БРЕНДИРОВАНИЯ (п. 3.1 ТЗ)
  const brandingCostUnit = BRANDING_COSTS[brandingType] ?? 0;
  const brandingBase = techSettings.brandingBasePerItem || techSettings.branding_base_per_item || 10;
  const brandingPerUnit = brandingBase + brandingCostUnit;
  const branding = qty * brandingPerUnit;

  // 5. ИТОГОВАЯ СМЕТА (Модуль 4 ТЗ)
  const total = fabricCost + cutting + sewing + hardware + branding;
  const unit = Math.round(total / qty);

  // 6. СРОК ИЗГОТОВЛЕНИЯ (Модуль 5 ТЗ)
  const totalProductionHours = Math.round((cuttingHours + sewingHours) * 10) / 10;
  const dailyCapacityHours = techSettings.workshopDailyHours || techSettings.workshop_daily_hours || 16;
  const productionDays = Math.max(2, Math.ceil(totalProductionHours / dailyCapacityHours));

  return {
    fabricCost,
    cutting,
    sewing,
    hardware,
    branding,
    total,
    unit,
    totalMeters,
    estimatedMetersNotice,
    cuttingHours,
    sewingHours,
    totalProductionHours,
    productionDays,
  };
}

module.exports = {
  calculateOrder,
  COMPLEXITY_RATES,
  EXTRA_OPTIONS,
  BRANDING_COSTS,
};
