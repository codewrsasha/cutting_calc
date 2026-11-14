import { formatMoney } from "../utils/calculateCosts";
import {
  CheckCircleIcon,
  GoldCoinsIcon,
  FabricRollIcon,
  ScissorsBlueIcon,
  SewingMachineIcon,
  ButtonIcon,
  StarIcon,
  LightbulbIcon,
  DownloadIcon,
  DocumentIcon,
} from "./Icons";

export function ResultsCard({ calculation, quantity }) {
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
          <h2>Результаты расчёта</h2>
        </div>
        <span className="date">Дата расчёта: 24.04.2025, 14:37</span>
      </div>

      {/* Главный блок с монетами и ключевыми суммами */}
      <div className="hero-total">
        <div className="coins-wrapper">
          <GoldCoinsIcon />
        </div>
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
        <div className="cost-total">
          <span>Итого</span>
          <b>{formatMoney(calculation.total)}</b>
        </div>
      </div>

      {/* Информационный блок по расходу ткани */}
      <div className="notice">
        <span className="notice-icon">
          <LightbulbIcon />
        </span>
        <p>
          Для изготовления данной партии потребуется:
          <br />
          <b>≈ {calculation.estimatedMetersNotice} погонных метров ткани.</b>
        </p>
      </div>

      {/* Кнопки экспорта / печати */}
      <div className="action-buttons">
        <button className="primary" onClick={() => window.print()}>
          <DownloadIcon />
          <span>Скачать PDF раскроя</span>
        </button>
        <button className="secondary" onClick={() => window.print()}>
          <DocumentIcon />
          <span>Скачать PDF сметы</span>
        </button>
      </div>
    </section>
  );
}
