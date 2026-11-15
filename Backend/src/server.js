/**
 * @file server.js
 * @description Главная точка входа REST API производственного цеха
 * Проект: «II Калькулятор себестоимости и раскроя изделия»
 * Заказчик: Производственный цех (г. Сургут, ул. Комплектовочная, 5)
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDb } = require("./db");
const authRouter = require("./routes/auth");
const techSettingsRouter = require("./routes/techSettings");
const fabricsRouter = require("./routes/fabrics");
const contractorsRouter = require("./routes/contractors");
const calculationsRouter = require("./routes/calculations");
const proposalsRouter = require("./routes/proposals");

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// 1. ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ POSTGRESQL
// ============================================================================
initDb().catch((err) => console.error("Database initialization failed:", err));

// ============================================================================
// 2. БАЗОВЫЕ MIDDLEWARE (CORS И ПАРСИНГ JSON)
// ============================================================================
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// ============================================================================
// 3. СИСТЕМНЫЙ HEALTHCHECK МОНИТОРИНГ
// ============================================================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    workshop: "Производственный цех по пошиву мерча (г. Сургут, ул. Комплектовочная, 5)",
    version: "2.0.0-pro",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// 4. МАРШРУТЫ API ПО МОДУЛЯМ ТЗ
// ============================================================================
app.use("/api/auth", authRouter);                   // Модуль 1: Авторизация и пользователи
app.use("/api/tech-settings", techSettingsRouter); // Модуль 6: Нормативы технолога
app.use("/api/fabrics", fabricsRouter);             // Модуль 6: Справочник тканей
app.use("/api/contractors", contractorsRouter);     // Модуль 1: Справочник подрядчиков
app.use("/api/calculations", calculationsRouter);   // Модули 4 & 7: Расчёты и история
app.use("/api/proposals", proposalsRouter);         // Модуль 5: Коммерческие предложения

// ============================================================================
// 5. ЦЕНТРАЛИЗОВАННАЯ ОБРАБОТКА ОШИБОК
// ============================================================================
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err);
  res.status(err.status || 500).json({
    error: "Внутренняя ошибка сервера",
    details: err.message,
  });
});

// ============================================================================
// 6. ЗАПУСК HTTP СЕРВЕРА
// ============================================================================
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Сервер калькулятора запущен на порту ${PORT}`);
  console.log(`📍 Адрес цеха: г. Сургут, ул. Комплектовочная, 5`);
  console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

module.exports = app;

