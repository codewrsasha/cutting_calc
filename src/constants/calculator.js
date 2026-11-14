/**
 * Конфигурация и справочные данные калькулятора.
 * Все базовые тарифы, коэффициенты и списки вынесены сюда,
 * чтобы их можно было легко менять без правки логики компонентов.
 */

export const PRODUCT_TYPES = ["Футболка", "Худи", "Свитшот"];

export const DIFFICULTIES = ["Базовая", "Средняя", "Сложная"];

export const COMPLEXITY_RATES = {
  Базовая: 0.85,
  Средняя: 1.0,
  Сложная: 1.25,
};

export const FABRIC_TYPES = [
  "Кулирная гладь (хлопок)",
  "Футер 3-х нитка",
  "Футер 2-х нитка",
  "Интерлок",
];

// Дополнительные элементы изделия и надбавка к фурнитуре (в рублях за шт.)
export const EXTRA_OPTIONS = [
  { id: "pocket", label: "Карман", cost: 4 },
  { id: "hood", label: "Капюшон", cost: 12 },
  { id: "lining", label: "Подкладка", cost: 8 },
];

// Базовые расценки производства (в рублях за 1 шт.)
export const BASE_RATES = {
  cuttingPerItem: 50,    // Стоимость раскроя
  sewingPerItem: 288,    // Базовая ставка пошива (при сложности 1.0)
  hardwareBase: 10,      // Базовая фурнитура
  brandingPerItem: 10,   // Брендирование (бирка/печать)
};

// Значения формы по умолчанию
export const DEFAULT_FORM_VALUES = {
  productType: "Футболка",
  quantity: 100,
  difficulty: "Средняя",
  fabric: "Кулирная гладь (хлопок)",
  fabricPrice: 300,
  rollWidth: 150,
  seam: 1.5,
  length: 70,
  chest: 55,
  sleeve: 25,
  waste: 15,
  extras: {
    pocket: false,
    hood: false,
    lining: false,
  },
};
