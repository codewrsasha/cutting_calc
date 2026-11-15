/**
 * @file ProductInfoCard.jsx
 * @description Карточка «Информация об изделии» (Модуль 2 ТЗ)
 *
 * Включает:
 * - Выбор контрагента/подрядчика из справочника
 * - Выбор типа изделия (футболка, худи, шоппер, свитшот, бейсболка)
 * - Ввод тиража партии и сегментированный выбор сложности пошива
 * - Конструктивные элементы (карманы, капюшон, подкладка) и брендирование
 */

import {
  PRODUCT_TYPES,
  DIFFICULTIES,
  EXTRA_OPTIONS,
  BRANDING_TYPES,
  INITIAL_CONTRACTORS,
} from "../constants/calculator";
import { ShirtBadgeIcon } from "./Icons";

export function ProductInfoCard({
  contractor,
  setContractor,
  contractorsList = INITIAL_CONTRACTORS,
  productType,
  setProductType,
  quantity,
  setQuantity,
  difficulty,
  setDifficulty,
  brandingType,
  setBrandingType,
  extras,
  toggleExtra,
  onProductTypeSelect,
}) {
  const displayContractors = contractorsList && contractorsList.length > 0 ? contractorsList : INITIAL_CONTRACTORS;

  return (
    <section className="card product-card">
      <div className="card-header-flex">
        <h2 className="section-title">
          <span className="section-icon">
            <ShirtBadgeIcon />
          </span>
          <span>Информация об изделии</span>
        </h2>

        {/* Выбор подрядчика (Модуль 1 ТЗ) */}
        <div className="contractor-select-wrap">
          <span className="contractor-label">Подрядчик:</span>
          <select
            className="contractor-select"
            value={contractor}
            onChange={(e) => setContractor(e.target.value)}
          >
            {displayContractors.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name} {c.contact ? `(${c.contact})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="product-grid">
        {/* Тип изделия */}
        <label className="field">
          <span className="field-label">Тип изделия</span>
          <select
            value={productType}
            onChange={(e) => onProductTypeSelect(e.target.value)}
          >
            {PRODUCT_TYPES.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        {/* Тираж */}
        <label className="field">
          <span className="field-label">Тираж, шт.</span>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>

        {/* Сложность пошива */}
        <div className="field">
          <span className="field-label">Сложность пошива</span>
          <div className="segmented">
            {DIFFICULTIES.map((item) => (
              <button
                type="button"
                key={item}
                className={difficulty === item ? "selected" : ""}
                onClick={() => setDifficulty(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Опции и брендирование */}
      <div className="product-footer-row">
        <div className="checks">
          {EXTRA_OPTIONS.map(({ id, label }) => (
            <label key={id} className="checkbox-label">
              <input
                type="checkbox"
                checked={Boolean(extras[id])}
                onChange={() => toggleExtra(id)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="branding-select-field">
          <span className="field-label">Брендирование:</span>
          <select
            value={brandingType}
            onChange={(e) => setBrandingType(e.target.value)}
            className="compact-select"
          >
            {BRANDING_TYPES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} {b.costPerUnit > 0 ? `(+${b.costPerUnit} ₽/шт)` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
