/**
 * @file CuttingParamsCard.jsx
 * @description Карточка «Параметры раскроя» (Модуль 3 ТЗ)
 *
 * Включает:
 * - Выбор ткани из справочника цеха с автоподстановкой ширины и цены
 * - Размеры кроя (длина, ширина по груди, длина рукава)
 * - Припуски на швы и бейдж количества деталей кроя
 * - Коэффициент межлекальных отходов с интерактивной подсказкой ТЗ
 */

import { useState } from "react";
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
  partsCount,
  setPartsCount,
  fabricsList,
  onNumberChange,
}) {
  const [showWasteTooltip, setShowWasteTooltip] = useState(false);

  const handleFabricSelect = (e) => {
    const selectedName = e.target.value;
    setFabric(selectedName);
    const found = fabricsList.find((f) => f.name === selectedName);
    if (found) {
      setRollWidth(found.rollWidth);
      setFabricPrice(found.pricePerMeter);
    }
  };

  return (
    <section className="card cutting-card">
      <div className="card-header-flex">
        <h2 className="section-title">
          <span className="section-icon">
            <ScissorsGreenIcon />
          </span>
          <span>Параметры раскроя</span>
        </h2>
        <span className="badge-details-count" title="Количество деталей в комплекте изделия">
          Деталей в крое: <b>{partsCount} шт.</b>
        </span>
      </div>

      <div className="form-grid">
        {/* Ткань */}
        <label className="field">
          <span className="field-label">Ткань</span>
          <select value={fabric} onChange={handleFabricSelect}>
            {fabricsList.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
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
        <label className="field field-waste">
          <span className="field-label">
            <span>Коэффициент отходов</span>
            <span className="tooltip-container">
              <button
                type="button"
                className="hint-badge"
                aria-label="Подсказка по коэффициенту отходов"
                aria-describedby="waste-hint-tooltip"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowWasteTooltip((prev) => !prev);
                }}
                onMouseEnter={() => setShowWasteTooltip(true)}
                onMouseLeave={() => setShowWasteTooltip(false)}
                onFocus={() => setShowWasteTooltip(true)}
                onBlur={() => setShowWasteTooltip(false)}
              >
                ?
              </button>
              <span
                id="waste-hint-tooltip"
                role="tooltip"
                className={`custom-tooltip ${showWasteTooltip ? "is-visible" : ""}`}
              >
                Коэффициент межлекальных отходов при раскрое (по умолчанию 15–20%, возможность ручного изменения)
              </span>
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
