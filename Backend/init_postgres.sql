-- ============================================================================
-- Схема базы данных PostgreSQL
-- Веб-сервис «II Калькулятор себестоимости и раскроя изделия»
-- Заказчик: Производственный цех мерча (г. Сургут, ул. Комплектовочная, 5)
-- ============================================================================

-- 1. Пользователи и роли (Модуль 1 ТЗ)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(64) UNIQUE,
  email VARCHAR(128) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'manager',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Нормативы технолога цеха (Модуль 6 ТЗ)
CREATE TABLE IF NOT EXISTS tech_settings (
  id INTEGER PRIMARY KEY,
  sewing_hour_rate NUMERIC NOT NULL DEFAULT 450,
  cutting_hour_rate NUMERIC NOT NULL DEFAULT 400,
  cutting_parts_per_hour NUMERIC NOT NULL DEFAULT 32,
  hardware_base_per_item NUMERIC NOT NULL DEFAULT 10,
  branding_base_per_item NUMERIC NOT NULL DEFAULT 10,
  workshop_daily_hours NUMERIC NOT NULL DEFAULT 16,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Справочник тканей (Модуль 6 ТЗ)
CREATE TABLE IF NOT EXISTS fabrics (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  roll_width NUMERIC NOT NULL DEFAULT 150,
  price_per_meter NUMERIC NOT NULL DEFAULT 300,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- 4. Справочник подрядчиков (Модуль 1 ТЗ)
CREATE TABLE IF NOT EXISTS contractors (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  contact_person VARCHAR(128),
  email VARCHAR(128),
  phone VARCHAR(64),
  inn VARCHAR(32),
  address TEXT
);

-- 5. Реестр истории расчётов (Модули 4 и 7 ТЗ)
-- Внимание: удаление записей запрещено регламентом цеха
CREATE TABLE IF NOT EXISTS calculations (
  id VARCHAR(64) PRIMARY KEY,
  calculation_number VARCHAR(64) NOT NULL,
  contractor_name VARCHAR(128) NOT NULL,
  product_type VARCHAR(64) NOT NULL,
  quantity INTEGER NOT NULL,
  difficulty VARCHAR(32) NOT NULL,
  parts_count INTEGER NOT NULL,
  fabric_name VARCHAR(128),
  fabric_price NUMERIC,
  roll_width NUMERIC,
  seam NUMERIC,
  length NUMERIC,
  chest NUMERIC,
  sleeve NUMERIC,
  waste NUMERIC,
  branding_type VARCHAR(64),
  extras_json TEXT,
  fabric_cost NUMERIC NOT NULL,
  cutting_cost NUMERIC NOT NULL,
  sewing_cost NUMERIC NOT NULL,
  hardware_cost NUMERIC NOT NULL,
  branding_cost NUMERIC NOT NULL,
  total_cost NUMERIC NOT NULL,
  unit_cost NUMERIC NOT NULL,
  total_meters NUMERIC NOT NULL,
  cutting_hours NUMERIC NOT NULL,
  sewing_hours NUMERIC NOT NULL,
  total_production_hours NUMERIC NOT NULL,
  production_days INTEGER NOT NULL,
  created_by_name VARCHAR(128),
  created_by_role VARCHAR(32),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Коммерческие предложения (Модуль 5 ТЗ)
CREATE TABLE IF NOT EXISTS commercial_proposals (
  id VARCHAR(64) PRIMARY KEY,
  kp_number VARCHAR(64) NOT NULL,
  calculation_id VARCHAR(64) REFERENCES calculations(id),
  public_token VARCHAR(64) UNIQUE NOT NULL,
  recipient_email VARCHAR(128),
  is_viewed INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ (SEED) ДЛЯ ЦЕХА В Г. СУРГУТ
-- ============================================================================

INSERT INTO tech_settings (id, sewing_hour_rate, cutting_hour_rate, cutting_parts_per_hour, hardware_base_per_item, branding_base_per_item, workshop_daily_hours)
VALUES (1, 450, 400, 32, 10, 10, 16)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, username, email, password_hash, full_name, role)
VALUES
  ('u-admin', 'admin', 'admin@surgut-sew.ru', '$2b$10$TzL0fEG53.X73t.vfX/Kz.Y97auLsNwpNU8aJrwnBdVHusLArIORO', 'Главный Администратор цеха', 'admin'),
  ('u-1', 'technologist', 'technologist@surgut-sew.ru', '$2b$10$aZNPcEee5JVB2RU8HT1dBOkqaf8Lngt2.OKCplfCL3hgF27dgp4ca', 'Петрова Анна Сергеевна (Технолог цеха)', 'technologist'),
  ('u-2', 'manager', 'manager@surgut-sew.ru', '$2b$10$A5UczVAoC8m3Sa9mDXHvf.i5V/roX3dlcWcsn.VGbXX3Mp.QWegJm', 'Сидоров Максим Игоревич (Менеджер заказов)', 'manager')
ON CONFLICT (id) DO NOTHING;

INSERT INTO fabrics (id, name, roll_width, price_per_meter)
VALUES
  ('f-1', 'Кулирная гладь (хлопок)', 150, 300),
  ('f-2', 'Футер 3-х нитка', 180, 650),
  ('f-3', 'Футер 2-х нитка', 180, 520),
  ('f-4', 'Интерлок', 160, 420),
  ('f-5', 'Саржа (для шопперов)', 150, 280)
ON CONFLICT (id) DO NOTHING;

INSERT INTO contractors (id, name, contact_person, email, phone, inn, address)
VALUES
  ('c-1', 'ООО «СеверМерч»', 'Иванов Алексей', 'merch@sever.ru', '+7 (3462) 55-22-11', '8602123456', 'г. Сургут, ул. Мира, 14'),
  ('c-2', 'ИП Смирнов А.В.', 'Смирнов Андрей', 'smirnov.print@yandex.ru', '+7 (922) 111-22-33', '8602987654', 'г. Сургут, ул. Профсоюзов, 21'),
  ('c-3', 'Тайга Брендинг', 'Ольга Васильева', 'order@taiga-brand.ru', '+7 (3462) 99-88-77', '8602456789', 'г. Сургут, ул. Ленина, 35'),
  ('c-4', 'Сургут НефтеМерч', 'Ковалёв Денис', 'zakaz@neftemerch.ru', '+7 (3462) 33-44-55', '8602888999', 'г. Сургут, ул. Нефтяников, 8')
ON CONFLICT (id) DO NOTHING;
