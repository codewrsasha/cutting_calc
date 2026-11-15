/**
 * @file calculateCosts.js
 * @description Математическое ядро расчёта себестоимости и параметров раскроя
 * Реализация алгоритмов разделов 3.1, 3.2, 3.3 и 4 ТЗ цеха (г. Сургут, ул. Комплектовочная, 5)
 */

import {
  COMPLEXITY_RATES,
  EXTRA_OPTIONS,
  BRANDING_TYPES,
  INITIAL_TECH_SETTINGS,
} from "../constants/calculator";

/**
 * Форматирует числовое значение в российские рубли с неразрывным пробелом: "69 800 ₽"
 * @param {number} value Сумма в рублях
 * @returns {string} Отформатированная строка суммы
 */
export function formatMoney(value) {
  const rounded = Math.round(Number(value) || 0);
  return `${new Intl.NumberFormat("ru-RU").format(rounded)}\u00A0₽`;
}

/**
 * Алгоритм экспресс-расчёта пошива, раскроя и себестоимости партии мерча
 *
 * @param {Object} params Входные параметры менеджера
 * @param {number} [params.quantity=1] Тираж изделий (шт.)
 * @param {string} [params.difficulty="Средняя"] Сложность изделия ("Базовая" | "Средняя" | "Сложная")
 * @param {number} [params.partsCount=4] Количество деталей кроя на 1 изделие
 * @param {number} [params.fabricPrice=0] Цена погонного метра ткани (руб.)
 * @param {number} [params.length=0] Длина изделия (см)
 * @param {number} [params.sleeve=0] Длина рукава (см)
 * @param {number} [params.seam=0] Технологический припуск на шов (см)
 * @param {number} [params.waste=0] Коэффициент межлекальных отходов (%)
 * @param {string} [params.brandingType="none"] Тип нанесения брендирования
 * @param {Object<string, boolean>} [params.extras={}] Дополнительные элементы (карманы, капюшон, подкладка)
 *
 * @param {Object} [techSettings=INITIAL_TECH_SETTINGS] Действующие ставки и нормативы технолога цеха
 * @param {number} [techSettings.sewingHourRate=450] Стоимость нормо-часа швеи (руб./час)
 * @param {number} [techSettings.cuttingHourRate=400] Стоимость нормо-часа раскройщика (руб./час)
 * @param {number} [techSettings.cuttingPartsPerHour=32] Норма выработки раскройщика (деталей/час)
 * @param {number} [techSettings.hardwareBasePerItem=10] Базовая фурнитура на 1 изделие (руб.)
 * @param {number} [techSettings.brandingBasePerItem=10] Базовая маркировка на 1 изделие (руб.)
 * @param {number} [techSettings.workshopDailyHours=16] Мощность цеха в день (часов/смену)
 *
 * @returns {Object} Итоговые статьи сметы, объёмы материалов и сроки готовности
 */
export function calculateCosts(params, techSettings = INITIAL_TECH_SETTINGS) {
  const {
    quantity = 1,
    difficulty = "Средняя",
    partsCount = 4,
    fabricPrice = 0,
    length = 0,
    sleeve = 0,
    seam = 0,
    waste = 0,
    brandingType = "none",
    extras = {},
  } = params;

  // Безопасная нормализация числовых параметров
  const qty = Math.max(1, Number(quantity) || 1);
  const parts = Math.max(1, Number(partsCount) || 4);

  // --------------------------------------------------------------------------
  // 1. РАСЧЁТ РАСКРОЯ И МАТЕРИАЛА (Раздел 3.3 ТЗ)
  // --------------------------------------------------------------------------
  // Оптимальная длина кроя с учётом припусков на швы и коэффициента межлекальных отходов (в пог. метрах)
  const consumptionMeters =
    ((length * 1.1 + sleeve * 0.74 + seam * 2.0) / 100) * (1 + waste / 100);
  const rawFabricCost = qty * fabricPrice * consumptionMeters;
  const fabricCost = Math.round(rawFabricCost / 100) * 100;
  const totalMeters = fabricPrice > 0 ? Math.round(fabricCost / fabricPrice) : 0;
  const estimatedMetersNotice = Math.max(1, Math.ceil(totalMeters / 10));

  // Трудоёмкость и стоимость раскройщика:
  // (общее количество деталей / норма выработки в час) × ставка нормо-часа
  const totalParts = parts * qty;
  const cuttingNormPerHour = techSettings.cuttingPartsPerHour || 32;
  const cuttingHours = Math.round((totalParts / cuttingNormPerHour) * 10) / 10;
  const cuttingRate = techSettings.cuttingHourRate || 400;
  const cutting = Math.round(cuttingHours * cuttingRate);

  // --------------------------------------------------------------------------
  // 2. РАСЧЁТ ПОШИВА ИЗДЕЛИЯ (Раздел 3.2 ТЗ)
  // --------------------------------------------------------------------------
  // Трудоёмкость пошива = (базовое время на ед. × коэффициент сложности) × тираж
  // Базовая норма времени на футболку: 0.64 нормо-часа (~38 мин)
  const complexityMultiplier = COMPLEXITY_RATES[difficulty] ?? 1.0;
  const baseSewingHoursPerUnit = 0.64;
  const sewingHours = Math.round(qty * baseSewingHoursPerUnit * complexityMultiplier * 10) / 10;
  const sewingRate = techSettings.sewingHourRate || 450;
  const sewing = Math.round(sewingHours * sewingRate);

  // --------------------------------------------------------------------------
  // 3. СТОИМОСТЬ ФУРНИТУРЫ (Раздел 3.1 ТЗ)
  // --------------------------------------------------------------------------
  // Базовая фурнитура (нитки, этикетка) + дополнительные конструктивные элементы
  const extrasCostPerItem = EXTRA_OPTIONS.reduce(
    (sum, opt) => sum + (extras[opt.id] ? opt.cost : 0),
    0
  );
  const hardwarePerUnit = (techSettings.hardwareBasePerItem || 10) + extrasCostPerItem;
  const hardware = qty * hardwarePerUnit;

  // --------------------------------------------------------------------------
  // 4. СТОИМОСТЬ БРЕНДИРОВАНИЯ (Раздел 3.1 ТЗ)
  // --------------------------------------------------------------------------
  const selectedBranding =
    BRANDING_TYPES.find((b) => b.id === brandingType) || BRANDING_TYPES[0];
  const brandingPerUnit = (techSettings.brandingBasePerItem || 10) + selectedBranding.costPerUnit;
  const branding = qty * brandingPerUnit;

  // --------------------------------------------------------------------------
  // 5. ИТОГОВАЯ СВОДНАЯ СМЕТА (Модуль 4 ТЗ)
  // --------------------------------------------------------------------------
  const total = fabricCost + cutting + sewing + hardware + branding;
  const unit = Math.round(total / qty);

  // --------------------------------------------------------------------------
  // 6. СРОК ИЗГОТОВЛЕНИЯ В РАБОЧИХ ДНЯХ (Модуль 5 ТЗ)
  // --------------------------------------------------------------------------
  const totalProductionHours = Math.round((cuttingHours + sewingHours) * 10) / 10;
  const dailyCapacityHours = techSettings.workshopDailyHours || 16;
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
    selectedBranding,
  };
}
