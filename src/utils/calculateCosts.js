import { COMPLEXITY_RATES, BASE_RATES, EXTRA_OPTIONS } from "../constants/calculator";

/**
 * Форматирует числовое значение в рубли с разделением тысяч: "69 800 ₽"
 */
export function formatMoney(value) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

/**
 * Изолированная бизнес-логика расчёта себестоимости партии и изделия.
 *
 * Формулы легко объяснить на защите проекта:
 * 1. Расход ткани на 1 шт.: (длина * 1.1 + рукав * 0.74 + припуски * 2) / 100 * (1 + отходы %)
 * 2. Стоимость ткани: расход * тираж * цена за метр
 * 3. Раскрой: тираж * 50 ₽
 * 4. Пошив: тираж * базовая ставка 288 ₽ * коэффициент сложности
 * 5. Фурнитура: тираж * (база 10 ₽ + надбавки за карман, капюшон, подкладку)
 * 6. Брендирование: тираж * 10 ₽
 */
export function calculateCosts(params) {
  const {
    quantity = 1,
    difficulty = "Средняя",
    fabricPrice = 0,
    length = 0,
    sleeve = 0,
    seam = 0,
    waste = 0,
    extras = {},
  } = params;

  const qty = Math.max(1, Number(quantity) || 1);

  // 1. Расчёт расхода ткани с учётом припусков и коэффициента отходов раскроя
  const consumptionMeters =
    ((length * 1.1 + sleeve * 0.74 + seam * 2.0) / 100) * (1 + waste / 100);
  const rawFabricCost = qty * fabricPrice * consumptionMeters;
  const fabricCost = Math.round(rawFabricCost / 100) * 100;

  // 2. Раскройные работы
  const cutting = qty * BASE_RATES.cuttingPerItem;

  // 3. Пошив с учётом коэффициента сложности изделия
  const multiplier = COMPLEXITY_RATES[difficulty] ?? 1.0;
  const sewing = Math.round(qty * BASE_RATES.sewingPerItem * multiplier);

  // 4. Фурнитура (базовая ставка + надбавки за дополнительные элементы)
  const extrasCostPerItem = EXTRA_OPTIONS.reduce(
    (sum, opt) => sum + (extras[opt.id] ? opt.cost : 0),
    0
  );
  const hardware = qty * (BASE_RATES.hardwareBase + extrasCostPerItem);

  // 5. Брендирование
  const branding = qty * BASE_RATES.brandingPerItem;

  // 6. Итоговые показатели
  const total = fabricCost + cutting + sewing + hardware + branding;
  const unit = Math.round(total / qty);
  const meters = fabricPrice > 0 ? Math.round(fabricCost / fabricPrice) : 0;
  const estimatedMetersNotice = Math.max(1, Math.ceil(meters / 10));

  return {
    fabricCost,
    cutting,
    sewing,
    hardware,
    branding,
    total,
    unit,
    meters,
    estimatedMetersNotice,
  };
}
