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

// Инициализация базы данных PostgreSQL
initDb().catch((err) => console.error("Database initialization failed:", err));

// CORS и парсинг JSON
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Базовый мониторинг работоспособности сервиса
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    workshop: "Производственный цех по пошиву мерча (г. Сургут, ул. Комплектовочная, 5)",
    version: "2.0.0-pro",
    timestamp: new Date().toISOString(),
  });
});

// Регистрация маршрутов API (7 модулей ТЗ)
app.use("/api/auth", authRouter);
app.use("/api/tech-settings", techSettingsRouter);
app.use("/api/fabrics", fabricsRouter);
app.use("/api/contractors", contractorsRouter);
app.use("/api/calculations", calculationsRouter);
app.use("/api/proposals", proposalsRouter);

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({
    error: "Внутренняя ошибка сервера",
    details: err.message,
  });
});

// Запуск HTTP-сервера
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Сервер калькулятора запущен на порту ${PORT}`);
  console.log(`📍 Адрес цеха: г. Сургут, ул. Комплектовочная, 5`);
  console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

module.exports = app;
