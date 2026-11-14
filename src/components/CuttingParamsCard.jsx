import { FABRIC_TYPES } from "../constants/calculator";
import { ScissorsGreenIcon } from "./Icons";

export function CuttingParamsCard({
  fabric,
  setFabric,
  rollWidth,
  setRollWidth,
  fabricPrice,
  setFabricPrice,
  seam,
  setSeam,
  length,
  setLength,
  chest,
  setChest,
  sleeve,
  setSleeve,
  waste,
  setWaste,
  onNumberChange,
}) {
  return (
    <section className="card cutting-card">
      <h2 className="section-title">
        <span className="section-icon">
          <ScissorsGreenIcon />
        </span>
        <span>Параметры раскроя</span>
      </h2>

      <div className="form-grid">
        {/* Ткань */}
        <label className="field">
          <span className="field-label">Ткань</span>
          <select value={fabric} onChange={(e) => setFabric(e.target.value)}>
            {FABRIC_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        {/* Ширина рулона */}
        <label className="field">
          <span className="field-label">Ширина рулона, см</span>
          <input
            type="number"
            value={rollWidth}
            onChange={onNumberChange(setRollWidth)}
          />
        </label>

        {/* Цена за 1 м */}
        <label className="field">
          <span className="field-label">Цена за 1 м, ₽</span>
          <input
            type="number"
            value={fabricPrice}
            onChange={onNumberChange(setFabricPrice)}
          />
        </label>

        {/* Припуски на швы */}
        <label className="field">
          <span className="field-label">Припуски на швы, см</span>
          <input
            type="number"
            step="0.1"
            value={seam}
            onChange={onNumberChange(setSeam)}
          />
        </label>

        {/* Длина изделия */}
        <label className="field">
          <span className="field-label">Длина изделия</span>
          <input
            type="number"
            value={length}
            onChange={onNumberChange(setLength)}
          />
        </label>

        {/* Ширина по груди */}
        <label className="field">
          <span className="field-label">Ширина по груди</span>
          <input
            type="number"
            value={chest}
            onChange={onNumberChange(setChest)}
          />
        </label>

        {/* Длина рукава */}
        <label className="field">
          <span className="field-label">Длина рукава</span>
          <input
            type="number"
            value={sleeve}
            onChange={onNumberChange(setSleeve)}
          />
        </label>

        {/* Коэффициент отходов */}
        <label className="field">
          <span className="field-label">
            <span>Коэффициент отходов</span>
            <span className="hint-badge" title="Процент технологических отходов при раскрое">
              ?
            </span>
          </span>
          <div className="suffix-input">
            <input
              type="number"
              value={waste}
              onChange={onNumberChange(setWaste)}
            />
            <b>%</b>
          </div>
        </label>
      </div>
    </section>
  );
}
