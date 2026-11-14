import { PRODUCT_TYPES, DIFFICULTIES, EXTRA_OPTIONS } from "../constants/calculator";
import { ShirtBadgeIcon, MiniShirtIcon } from "./Icons";

export function ProductInfoCard({
  productType,
  setProductType,
  quantity,
  setQuantity,
  difficulty,
  setDifficulty,
  extras,
  toggleExtra,
}) {
  return (
    <section className="card product-card">
      <h2 className="section-title">
        <span className="section-icon">
          <ShirtBadgeIcon />
        </span>
        <span>Информация об изделии</span>
      </h2>

      <div className="product-grid">
        {/* Тип изделия */}
        <label className="field">
          <span className="field-label">Тип изделия</span>
          <div className="select-with-icon">
            <span className="input-adornment">
              <MiniShirtIcon />
            </span>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
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

      {/* Опции (карманы, капюшон, подкладка) */}
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
    </section>
  );
}
