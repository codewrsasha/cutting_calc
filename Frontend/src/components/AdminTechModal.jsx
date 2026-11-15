/**
 * @file AdminTechModal.jsx
 * @description Панель технолога: Справочники цеха и нормативы (Модуль 6 ТЗ)
 * Доступно для роли «Технолог» и «Администратор»
 *
 * Управление константами:
 * - Стоимость нормо-часа швеи (руб./час)
 * - Стоимость нормо-часа раскройщика (руб./час)
 * - Норма выработки кроя (деталей/час)
 * - Мощность цеха (рабочих часов/день)
 * - Справочник тканей (добавление, просмотр, удаление)
 */

import { useState, useEffect } from "react";
import { INITIAL_TECH_SETTINGS, INITIAL_FABRICS } from "../constants/calculator";
import { api } from "../services/api";

/**
 * Модальное окно справочников технолога
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.techSettings
 * @param {Function} props.setTechSettings
 * @param {Array} props.fabrics
 * @param {Function} props.setFabrics
 */
export function AdminTechModal({
  isOpen,
  onClose,
  techSettings,
  setTechSettings,
  fabrics,
  setFabrics,
}) {
  const [localSettings, setLocalSettings] = useState({ ...techSettings });
  const [newFabric, setNewFabric] = useState({ name: "", rollWidth: 150, pricePerMeter: 350 });
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings({ ...techSettings });
    }
  }, [isOpen, techSettings]);

  if (!isOpen) return null;

  // Сохранение нормативов технолога в БД
  const handleSave = async () => {
    try {
      await api.updateTechSettings(localSettings);
    } catch (e) {
      console.warn("Could not save to backend, using local:", e);
    }
    setTechSettings(localSettings);
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 900);
  };

  // Сброс к заводским нормативам
  const handleReset = async () => {
    try {
      const res = await api.resetTechSettings();
      if (res.settings) {
        setLocalSettings(res.settings);
        setTechSettings(res.settings);
      }
      const newFabrics = await api.getFabrics();
      setFabrics(newFabrics);
    } catch (e) {
      setLocalSettings({ ...INITIAL_TECH_SETTINGS });
      setFabrics([...INITIAL_FABRICS]);
    }
  };

  // Добавление новой ткани в справочник
  const handleAddFabric = async (e) => {
    e.preventDefault();
    if (!newFabric.name.trim()) return;
    try {
      const created = await api.addFabric(newFabric);
      setFabrics([...fabrics, created]);
    } catch (err) {
      setFabrics([...fabrics, { ...newFabric, id: `f-${Date.now()}` }]);
    }
    setNewFabric({ name: "", rollWidth: 150, pricePerMeter: 350 });
  };

  // Удаление ткани из справочника
  const handleRemoveFabric = async (item, index) => {
    try {
      if (item.id) {
        await api.deleteFabric(item.id);
      }
    } catch (err) {
      console.warn("Delete fabric error:", err);
    }
    setFabrics(fabrics.filter((f, i) => (item.id && f.id ? f.id !== item.id : i !== index)));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Шапка модального окна */}
        <div className="modal-header">
          <div>
            <h3>Панель технолога: Справочники и тарифы цеха</h3>
            <p className="kp-subtitle">
              Управление базовыми константами расчёта • Доступно для роли «Технолог»
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Закрыть">
            ✕
          </button>
        </div>

        {/* Тело модального окна */}
        <div className="admin-body">
          {savedAlert && (
            <div className="alert-success">
              ✓ Настройки и тарифы технолога успешно обновлены!
            </div>
          )}

          {/* 1. Базовые тарифы нормо-часов и производительности */}
          <section className="admin-section">
            <h4>1. Базовые тарифы нормо-часов и производительности</h4>
            <div className="admin-grid">
              <label className="field">
                <span className="field-label">Нормо-час швеи, ₽/час</span>
                <input
                  type="number"
                  value={localSettings.sewingHourRate}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      sewingHourRate: Number(e.target.value) || 0,
                    })
                  }
                />
              </label>

              <label className="field">
                <span className="field-label">Нормо-час раскройщика, ₽/час</span>
                <input
                  type="number"
                  value={localSettings.cuttingHourRate}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      cuttingHourRate: Number(e.target.value) || 0,
                    })
                  }
                />
              </label>

              <label className="field">
                <span className="field-label">Норма выработки кроя, дет./час</span>
                <input
                  type="number"
                  value={localSettings.cuttingPartsPerHour}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      cuttingPartsPerHour: Number(e.target.value) || 1,
                    })
                  }
                />
              </label>

              <label className="field">
                <span className="field-label">Мощность цеха, рабочих часов/день</span>
                <input
                  type="number"
                  value={localSettings.workshopDailyHours}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      workshopDailyHours: Number(e.target.value) || 8,
                    })
                  }
                />
              </label>
            </div>
          </section>

          {/* 2. Справочник тканей цеха */}
          <section className="admin-section">
            <h4>2. Справочник тканей цеха</h4>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Название ткани</th>
                  <th>Ширина рулона, см</th>
                  <th>Цена за 1 м, ₽</th>
                  <th style={{ width: "60px" }}></th>
                </tr>
              </thead>
              <tbody>
                {fabrics.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td><b>{item.name}</b></td>
                    <td>{item.rollWidth} см</td>
                    <td>{item.pricePerMeter} ₽</td>
                    <td>
                      <button
                        className="btn-danger-icon"
                        title="Удалить ткань из справочника"
                        onClick={() => handleRemoveFabric(item, idx)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Форма добавления ткани */}
            <form className="add-fabric-form" onSubmit={handleAddFabric}>
              <input
                placeholder="Новая ткань (например, Рибана)"
                value={newFabric.name}
                onChange={(e) => setNewFabric({ ...newFabric, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Ширина, см"
                style={{ width: "120px" }}
                value={newFabric.rollWidth}
                onChange={(e) =>
                  setNewFabric({ ...newFabric, rollWidth: Number(e.target.value) || 150 })
                }
              />
              <input
                type="number"
                placeholder="Цена, ₽"
                style={{ width: "110px" }}
                value={newFabric.pricePerMeter}
                onChange={(e) =>
                  setNewFabric({ ...newFabric, pricePerMeter: Number(e.target.value) || 100 })
                }
              />
              <button type="submit" className="btn-secondary">
                + Добавить
              </button>
            </form>
          </section>
        </div>

        {/* Действия в модальном окне */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={handleReset}>
            Сброс к заводским
          </button>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
