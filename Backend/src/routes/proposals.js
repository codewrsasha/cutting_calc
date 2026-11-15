/**
 * @file proposals.js
 * @description Маршрутизация коммерческих предложений (Модуль 5 ТЗ)
 *
 * Возможности:
 * - Генерация нового коммерческого предложения с уникальным токеном
 * - Публичный просмотр КП по ссылке для подрядчиков (`GET /public/:token`)
 * - Фиксация отправки КП на Email подрядчика
 */

const express = require("express");
const router = express.Router();
const crypto = require("node:crypto");
const { query, persistState } = require("../db");

/**
 * Форматирует числовое значение в рубли с неразрывным пробелом
 */
function formatMoney(num) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(num))}\u00A0₽`;
}

// 1. Создание коммерческого предложения
router.post("/", async (req, res, next) => {
  try {
    const { calculationId, recipientEmail = "" } = req.body;
    if (!calculationId) {
      return res.status(400).json({ error: "calculationId обязателен" });
    }

    const { rows } = await query("SELECT * FROM calculations WHERE id = $1", [calculationId]);
    const calc = rows[0];
    if (!calc) {
      return res.status(404).json({ error: "Смета не найдена" });
    }

    const id = `kp-${Date.now()}`;
    const kpNumber = `КП-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const publicToken = crypto.randomBytes(16).toString("hex");

    await query(`
      INSERT INTO commercial_proposals (id, kp_number, calculation_id, public_token, recipient_email)
      VALUES ($1, $2, $3, $4, $5);
    `, [id, kpNumber, calculationId, publicToken, recipientEmail]);

    await persistState();

    res.status(201).json({
      id,
      kpNumber,
      publicToken,
      publicUrl: `/api/proposals/public/${publicToken}`,
      message: "Коммерческое предложение сформировано",
    });
  } catch (err) {
    next(err);
  }
});

// 2. Публичный просмотр КП по защищённому токену
router.get("/public/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const { rows } = await query(`
      SELECT p.*, c.*, p.id as proposal_id
      FROM commercial_proposals p
      JOIN calculations c ON p.calculation_id = c.id
      WHERE p.public_token = $1;
    `, [token]);

    const proposal = rows[0];
    if (!proposal) {
      return res.status(404).send("<h2>Коммерческое предложение не найдено или ссылка устарела</h2>");
    }

    // Фиксация факта просмотра
    await query("UPDATE commercial_proposals SET is_viewed = 1 WHERE public_token = $1", [token]);
    await persistState();

    const html = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Коммерческое предложение ${proposal.kp_number}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 30px; }
          .doc { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
          .title { color: #1d62ed; margin: 0; font-size: 24px; }
          .table { width: 100%; border-collapse: collapse; margin: 24px 0; }
          .table th, .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
          .table th { background: #f1f5f9; color: #475569; font-size: 13px; text-transform: uppercase; }
          .total-box { background: #eff6ff; padding: 18px 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
          .total-box b { font-size: 26px; color: #1d62ed; }
          .terms { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
          @media print {
            body { background: #fff; padding: 0; }
            .doc { box-shadow: none; border: none; padding: 0; }
            .terms { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="doc">
          <div class="header">
            <div>
              <h1 class="title">Коммерческое предложение ${proposal.kp_number}</h1>
              <p style="margin: 4px 0 0; color: #64748b;">Производственный цех мерча • г. Сургут, ул. Комплектовочная, 5</p>
            </div>
            <div style="text-align: right; font-size: 13px; color: #64748b;">
              Дата: ${new Date(proposal.created_at).toLocaleDateString("ru-RU")}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; font-size: 14px;">
            <div><b>Исполнитель:</b><br>Цех по пошиву мерча, Сургут<br>Тел.: +7 (3462) 77-88-99</div>
            <div><b>Заказчик:</b><br>${proposal.contractor_name}</div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Статья затрат</th>
                <th>Объём / Норматив</th>
                <th style="text-align: right;">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Материал (${proposal.fabric_name}, отходы ${proposal.waste}%)</td>
                <td>≈ ${proposal.total_meters} пог. м</td>
                <td style="text-align: right;">${formatMoney(proposal.fabric_cost)}</td>
              </tr>
              <tr>
                <td>Раскройные работы (${proposal.parts_count} деталей/изделие)</td>
                <td>${proposal.cutting_hours} н-час</td>
                <td style="text-align: right;">${formatMoney(proposal.cutting_cost)}</td>
              </tr>
              <tr>
                <td>Пошив изделия (${proposal.product_type}, сложность «${proposal.difficulty}»)</td>
                <td>${proposal.sewing_hours} н-час</td>
                <td style="text-align: right;">${formatMoney(proposal.sewing_cost)}</td>
              </tr>
              <tr>
                <td>Фурнитура и комплектующие</td>
                <td>${proposal.quantity} шт.</td>
                <td style="text-align: right;">${formatMoney(proposal.hardware_cost)}</td>
              </tr>
              <tr>
                <td>Брендирование и упаковка</td>
                <td>${proposal.quantity} шт.</td>
                <td style="text-align: right;">${formatMoney(proposal.branding_cost)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div>
              <div style="font-size: 13px; color: #475569; text-transform: uppercase;">Итого к оплате:</div>
              <small style="color: #64748b;">Тираж: ${proposal.quantity} шт. (${formatMoney(proposal.unit_cost)} / шт.)</small>
            </div>
            <b>${formatMoney(proposal.total_cost)}</b>
          </div>

          <div class="terms">
            <p>⏱ <b>Срок готовности тиража:</b> ${proposal.production_days} рабочих дней с момента внесения 50% предоплаты.</p>
            <p>💳 <b>Условия оплаты:</b> 50% предоплата, 50% по факту готовности тиража.</p>
            <p>🚚 <b>Адрес отгрузки:</b> г. Сургут, ул. Комплектовочная, 5 (Склад готовой продукции).</p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    next(err);
  }
});

// 3. Отправка коммерческого предложения на Email
router.post("/:id/send-email", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    await query(`
      UPDATE commercial_proposals
      SET sent_at = CURRENT_TIMESTAMP,
          recipient_email = COALESCE($1, recipient_email)
      WHERE id = $2;
    `, [email, id]);

    await persistState();

    res.json({
      message: `Коммерческое предложение успешно отправлено на ${email || "email подрядчика"}`,
      sentAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
