const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { newDb } = require("pg-mem");
require("dotenv").config();

let pool = null;
let isRealPg = false;
const DATA_DIR = path.join(__dirname, "..", "data");
const PERSIST_FILE = path.join(DATA_DIR, "postgres_storage.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Загрузка SQL-схемы
const sqlInit = fs.readFileSync(path.join(__dirname, "..", "init_postgres.sql"), "utf8");

async function initDb() {
  const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/sewing_calc";
  
  // 1. Попытка подключения к реальному PostgreSQL серверу
  try {
    const testPool = new Pool({
      connectionString: dbUrl,
      connectionTimeoutMillis: 1500,
    });

    const client = await testPool.connect();
    await client.query("SELECT 1;");
    await client.query(sqlInit);
    client.release();

    pool = testPool;
    isRealPg = true;
    console.log(`[PostgreSQL] Подключено к активному серверу: ${dbUrl}`);
    return;
  } catch (err) {
    console.log(`[PostgreSQL] Локальный порт 5432 недоступен (${err.message}). Инициализируем изолированный PostgreSQL движок с дисковым хранилищем.`);
  }

  // 2. Инициализация PostgreSQL движка через pg-mem (сохраняет 100% совместимость с PG)
  const memDb = newDb();
  memDb.public.none(sqlInit);
  const pgAdapter = memDb.adapters.createPg();
  pool = new pgAdapter.Pool();

  // Восстановление сохранённых расчётов и настроек с диска
  if (fs.existsSync(PERSIST_FILE)) {
    try {
      const persisted = JSON.parse(fs.readFileSync(PERSIST_FILE, "utf8"));
      if (Array.isArray(persisted.calculations)) {
        for (const c of persisted.calculations) {
          try {
            await pool.query(`
              INSERT INTO calculations (
                id, calculation_number, contractor_name, product_type, quantity, difficulty, parts_count,
                fabric_name, fabric_price, roll_width, seam, length, chest, sleeve, waste, branding_type, extras_json,
                fabric_cost, cutting_cost, sewing_cost, hardware_cost, branding_cost, total_cost, unit_cost,
                total_meters, cutting_hours, sewing_hours, total_production_hours, production_days, created_at
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7,
                $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
                $18, $19, $20, $21, $22, $23, $24,
                $25, $26, $27, $28, $29, $30
              ) ON CONFLICT (id) DO NOTHING;
            `, [
              c.id, c.calculation_number, c.contractor_name, c.product_type, c.quantity, c.difficulty, c.parts_count,
              c.fabric_name, c.fabric_price, c.roll_width, c.seam, c.length, c.chest, c.sleeve, c.waste, c.branding_type, c.extras_json,
              c.fabric_cost, c.cutting_cost, c.sewing_cost, c.hardware_cost, c.branding_cost, c.total_cost, c.unit_cost,
              c.total_meters, c.cutting_hours, c.sewing_hours, c.total_production_hours, c.production_days, c.created_at || new Date().toISOString()
            ]);
          } catch (e) {
            // ignore duplicates
          }
        }
      }
      if (Array.isArray(persisted.proposals)) {
        for (const p of persisted.proposals) {
          try {
            await pool.query(`
              INSERT INTO commercial_proposals (id, kp_number, calculation_id, public_token, recipient_email, is_viewed, created_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT (id) DO NOTHING;
            `, [p.id, p.kp_number, p.calculation_id, p.public_token, p.recipient_email, p.is_viewed || 0, p.created_at || new Date().toISOString()]);
          } catch (e) {}
        }
      }
      console.log(`[PostgreSQL Storage] Восстановлено с диска: расчётов: ${persisted.calculations?.length || 0}`);
    } catch (e) {
      console.warn("[PostgreSQL Storage] Ошибка чтения хранилища:", e.message);
    }
  }

  console.log(`[PostgreSQL] Движок БД успешно активирован (схемы, таблицы и начальные данные загружены).`);
}

async function query(text, params = []) {
  if (!pool) {
    await initDb();
  }
  return pool.query(text, params);
}

// Функция синхронизации на диск для надёжности
async function persistState() {
  if (isRealPg) return; // Реальный сервер пишет на диск сам
  try {
    const calcs = await pool.query("SELECT * FROM calculations ORDER BY created_at DESC;");
    const props = await pool.query("SELECT * FROM commercial_proposals ORDER BY created_at DESC;");
    const data = {
      calculations: calcs.rows,
      proposals: props.rows,
      savedAt: new Date().toISOString(),
    };
    fs.writeFileSync(PERSIST_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("[PostgreSQL Persist Error]:", err.message);
  }
}

module.exports = {
  initDb,
  query,
  persistState,
  getPool: () => pool,
};
