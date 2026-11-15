/**
 * @file ResultsCard.jsx
 * @description Карточка «Результаты отчёта и сводная смета» (Модуль 4 ТЗ)
 *
 * Отображает:
 * - Итоговую себестоимость партии и себестоимость 1 изделия
 * - Детализацию 5 статей затрат (материал, раскрой, пошив, фурнитура, брендирование)
 * - Расход ткани в погонных метрах и расчётный срок готовности партии
 * - Переход к формированию коммерческого предложения (КП) и сохранение в базу
 */

import { useState } from "react";
import { formatMoney } from "../utils/calculateCosts";
import {
  CheckCircleIcon,
  FabricRollIcon,
  ScissorsBlueIcon,
  SewingMachineIcon,
  ButtonIcon,
  StarIcon,
} from "./Icons";

export function ResultsCard({
  calculation,
  quantity,
  onOpenKP,
  onSaveToHistory,
}) {
  const [justSaved, setJustSaved] = useState(false);

  const formattedHours = Number(calculation.totalProductionHours || 0)
    .toFixed(1)
    .replace(/\.0$/, "");

  const handleSave = () => {
    onSaveToHistory();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const breakdownItems = [
    {
      icon: <FabricRollIcon />,
      label: "Материал (с учётом отходов)",
      value: calculation.fabricCost,
    },
    {
      icon: <ScissorsBlueIcon />,
      label: "Раскрой",
      value: calculation.cutting,
    },
    {
      icon: <SewingMachineIcon />,
      label: "Пошив",
      value: calculation.sewing,
    },
    {
      icon: <ButtonIcon />,
      label: "Фурнитура",
      value: calculation.hardware,
    },
    {
      icon: <StarIcon />,
      label: "Брендирование",
      value: calculation.branding,
    },
  ];

  return (
    <section className="card results-card">
      {/* Заголовок результатов */}
      <div className="results-heading">
        <div className="results-title">
          <CheckCircleIcon />
          <h2>Результаты отчёта</h2>
        </div>
        <span className="date">
          Дата расчёта: {new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Главный блок с ключевыми суммами */}
      <div className="hero-total">
        <div className="hero-stat main-total">
          <p>Итоговая себестоимость</p>
          <strong>{formatMoney(calculation.total)}</strong>
        </div>
        <div className="hero-divider" />
        <div className="hero-stat unit-total">
          <p>Стоимость за 1 изделие</p>
          <strong>{formatMoney(calculation.unit)}</strong>
          <small>При тираже {quantity} шт.</small>
        </div>
      </div>

      {/* Таблица детализации статей затрат */}
      <div className="breakdown">
        <h3>Детализация стоимости</h3>
        {breakdownItems.map(({ icon, label, value }) => (
          <div className="cost-row" key={label}>
            <div className="row-label">
              <span className="row-icon">{icon}</span>
              <span>{label}</span>
            </div>
            <b>{formatMoney(value)}</b>
          </div>
        ))}
      </div>

      {/* 1. Информационный блок по расходу ткани */}
      <div className="notice">
        <p>
          Для изготовления данной партии потребуется:{" "}
          <b>≈ {calculation.estimatedMetersNotice} погонных метров ткани.</b>
        </p>
      </div>

      {/* 2. Компактный блок расчетного срока готовности в едином стиле */}
      <div className="notice">
        <p>
          Расчётный срок готовности:{" "}
          <b>{calculation.productionDays} рабочих дней</b>{" "}
          <span className="notice-subtext">
            (общая трудоёмкость: {formattedHours} н-час)
          </span>
        </p>
      </div>

      {/* Кнопки действий (Модули 4, 5, 7 ТЗ) */}
      <div className="action-buttons">
        <button className="primary" onClick={onOpenKP} title="Сформировать коммерческое предложение для подрядчика">
          <span>Сформировать КП</span>
        </button>
        <button
          className="secondary"
          onClick={handleSave}
          title="Сохранить текущую смету в реестр истории"
        >
          <span>{justSaved ? "Сохранено в базу!" : "Сохранить расчёт"}</span>
        </button>
      </div>

      {/* Вспомогательные кнопки быстрого перехода */}
      <div className="secondary-export-row">
        <button className="btn-link" onClick={onOpenKP}>
          Подробнее о смете →
        </button>
      </div>
    </section>
  );
}
