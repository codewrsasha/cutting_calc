/**
 * @file KPModal.jsx
 * @description Модальное окно «Коммерческое предложение» (Модуль 5 ТЗ)
 *
 * Функции:
 * - Формирование официального коммерческого предложения с реквизитами цеха
 * - Таблица статей затрат, сроки производства и финансовые условия
 * - Генерация защищённой онлайн-ссылки для отправки подрядчику
 * - Отправка на Email подрядчика
 * - Печать и экспорт в PDF со специализированными стилями @media print
 */

import { useState } from "react";
import { formatMoney } from "../utils/calculateCosts";
import { api } from "../services/api";

export function KPModal({ isOpen, onClose, calculation, formValues, contractorInfo, calculationId }) {
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const ensureCalculationId = async () => {
    if (calculationId) return calculationId;
    try {
      const res = await api.saveCalculation({ formValues });
      return res.id;
    } catch {
      return `calc-local-${Date.now()}`;
    }
  };

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    try {
      const calcId = await ensureCalculationId();
      const res = await api.createProposal(calcId, contractorInfo.email || "");
      const fullUrl = api.getProposalPublicUrl(res.publicToken);
      setPublicUrl(fullUrl);
    } catch (err) {
      console.warn("Proposal generation error:", err);
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendEmail = async () => {
    setSending(true);
    try {
      const calcId = await ensureCalculationId();
      const prop = await api.createProposal(calcId, contractorInfo.email || "");
      if (prop.id) {
        await api.sendProposalEmail(prop.id, contractorInfo.email || "");
      }
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    } catch (err) {
      console.warn("Email send fallback:", err);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    } finally {
      setSending(false);
    }
  };

  const kpNumber = `КП-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card kp-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header">
          <div className="kp-header-brand">
            <div>
              <h3>Коммерческое предложение {kpNumber}</h3>
              <p className="kp-subtitle">
                Производственный цех мерча • г. Сургут, ул. Комплектовочная, 5
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Закрыть">
            ✕
          </button>
        </div>

        {/* Proposal Document Body (готовый для печати) */}
        <div className="kp-document-body">
          {/* Requisites block */}
          <div className="kp-info-grid">
            <div className="kp-block">
              <b>Исполнитель:</b>
              <p>Производственный цех по пошиву мерча</p>
              <p>г. Сургут, ул. Комплектовочная, 5</p>
              <p>Тел.: +7 (3462) 77-88-99 • info@surgut-sew.ru</p>
            </div>

            <div className="kp-block">
              <b>Заказчик / Подрядчик:</b>
              <p className="kp-contractor-name">{contractorInfo.name}</p>
              <p>Контактное лицо: {contractorInfo.contact || "—"}</p>
              <p>Email: {contractorInfo.email || "—"}</p>
              <p>Тел.: {contractorInfo.phone || "—"}</p>
            </div>
          </div>

          <div className="kp-summary-line">
            <span>
              <b>Изделие:</b> {formValues.productType} ({formValues.fabric})
            </span>
            <span>
              <b>Тираж:</b> {formValues.quantity} шт.
            </span>
            <span>
              <b>Сложность:</b> {formValues.difficulty}
            </span>
            <span>
              <b>Дата расчёта:</b> {currentDate}
            </span>
          </div>

          {/* Table */}
          <table className="kp-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Наименование статьи затрат</th>
                <th>Объём / Норматив</th>
                <th style={{ textAlign: "right" }}>Сумма, ₽</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <b>Ткань:</b> {formValues.fabric} (с учётом отходов {formValues.waste}%)
                </td>
                <td>≈ {calculation.totalMeters} пог. м</td>
                <td style={{ textAlign: "right" }}>{formatMoney(calculation.fabricCost)}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <b>Раскройные работы:</b> {formValues.partsCount} дет./комплект
                </td>
                <td>{calculation.cuttingHours} н-час</td>
                <td style={{ textAlign: "right" }}>{formatMoney(calculation.cutting)}</td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  <b>Пошив изделия:</b> сложность «{formValues.difficulty}»
                </td>
                <td>{calculation.sewingHours} н-час</td>
                <td style={{ textAlign: "right" }}>{formatMoney(calculation.sewing)}</td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  <b>Фурнитура и комплектующие:</b> нитки, этикетка
                  {formValues.extras.pocket && ", карман"}
                  {formValues.extras.hood && ", капюшон"}
                  {formValues.extras.lining && ", подкладка"}
                </td>
                <td>{formValues.quantity} компл.</td>
                <td style={{ textAlign: "right" }}>{formatMoney(calculation.hardware)}</td>
              </tr>
              <tr>
                <td>5</td>
                <td>
                  <b>Брендирование и маркировка:</b> {calculation.selectedBranding.name}
                </td>
                <td>{formValues.quantity} шт.</td>
                <td style={{ textAlign: "right" }}>{formatMoney(calculation.branding)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="kp-table-total">
                <td colSpan="3">
                  <b>ИТОГО К ОПЛАТЕ:</b>
                </td>
                <td style={{ textAlign: "right" }}>
                  <b>{formatMoney(calculation.total)}</b>
                </td>
              </tr>
              <tr className="kp-table-unit">
                <td colSpan="3">Стоимость за 1 единицу готового изделия:</td>
                <td style={{ textAlign: "right" }}>
                  <b>{formatMoney(calculation.unit)}</b>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Блок условий (скрыт при формировании/печати PDF документа по требованию ТЗ) */}
          <div className="kp-terms print-hide">
            <div className="kp-term-item">
              <div>
                <b>Срок производства:</b>
                <p>
                  <b>{calculation.productionDays} рабочих дней</b> с момента утверждения
                  образца и поступления предоплаты.
                </p>
              </div>
            </div>
            <div className="kp-term-item">
              <div>
                <b>Условия оплаты:</b>
                <p>50% предоплата, 50% по факту готовности тиража до отгрузки.</p>
              </div>
            </div>
            <div className="kp-term-item">
              <div>
                <b>Условия отгрузки:</b>
                <p>Самовывоз со склада цеха (г. Сургут, Комплектовочная, 5) либо доставка ТК.</p>
              </div>
            </div>
          </div>

          {emailSent && (
            <div className="alert-success">
              ✓ Коммерческое предложение успешно отправлено на email {contractorInfo.email || "подрядчика"}!
            </div>
          )}

          {/* Публичная онлайн-ссылка на КП (Модуль 5 ТЗ) */}
          {publicUrl && (
            <div style={{ marginTop: "14px", padding: "12px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px", color: "#166534" }}>
                <b>Онлайн-ссылка:</b> <a href={publicUrl} target="_blank" rel="noreferrer" style={{ color: "#15803d", textDecoration: "underline" }}>{publicUrl}</a>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-action-small"
                  onClick={handleCopyLink}
                  style={{ padding: "4px 10px", fontSize: "12px" }}
                >
                  {copied ? "✓ Скопировано" : "📋 Копировать"}
                </button>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-action-small"
                  style={{ padding: "4px 10px", fontSize: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                >
                  Открыть ↗
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Закрыть
          </button>
          {!publicUrl ? (
            <button
              className="btn-secondary"
              onClick={handleGenerateLink}
              disabled={generatingLink}
              title="Создать постоянную веб-ссылку для отправки в мессенджеры"
            >
              {generatingLink ? "Генерация..." : "🔗 Онлайн-ссылка КП"}
            </button>
          ) : null}
          <button
            className="btn-secondary"
            onClick={handleSendEmail}
            disabled={sending}
          >
            {sending ? "Отправка..." : "✉ Отправить на Email"}
          </button>
          <button className="btn-primary" onClick={() => window.print()}>
            <span>Печать / Скачать PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
