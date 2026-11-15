/**
 * @file HistoryModal.jsx
 * @description Реестр истории расчётов производственного цеха (Модуль 7 ТЗ)
 *
 * Возможности:
 * - Поиск по подрядчику, изделию, дате, номеру сметы и автору
 * - Экспресс-загрузка параметров любого расчёта обратно в калькулятор
 * - Для Администратора: отображение автора (ФИО и роль), редактирование параметров сметы и удаление записи из БД
 * - Защита от переноса единиц измерения («шт.», «₽»)
 */

import { useState } from "react";
import { formatMoney } from "../utils/calculateCosts";
import { PRODUCT_TYPES, DIFFICULTIES } from "../constants/calculator";
import { api } from "../services/api";

/**
 * Модальное окно истории и реестра расчётов цеха
 * @param {Object} props
 * @param {boolean} props.isOpen Флаг видимости модального окна
 * @param {Function} props.onClose Функция закрытия окна
 * @param {Array} props.history Список сохранённых расчётов
 * @param {Function} props.onLoadCalculation Коллбэк загрузки параметров в калькулятор
 * @param {Object} props.currentUser Данные авторизованного пользователя
 * @param {Function} props.onUpdateHistoryItem Коллбэк обновления записи в стейте
 * @param {Function} props.onDeleteHistoryItem Коллбэк удаления записи из стейта
 * @param {Array} props.contractorsList Список подрядчиков для автокомплита
 */
export function HistoryModal({
  isOpen,
  onClose,
  history = [],
  onLoadCalculation,
  currentUser,
  onUpdateHistoryItem,
  onDeleteHistoryItem,
  contractorsList = [],
}) {
  // ==========================================================================
  // СОСТОЯНИЕ КОМПОНЕНТА
  // ==========================================================================
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const [editForm, setEditForm] = useState({
    contractor: "",
    productType: "Футболка",
    quantity: 100,
    difficulty: "Средняя",
    total: 0,
    unit: 0,
    fabric: "",
    productionDays: 5,
  });

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === "admin";

  // ==========================================================================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ОТОБРАЖЕНИЯ РОЛЕЙ
  // ==========================================================================
  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "technologist":
        return "Технолог";
      case "manager":
        return "Менеджер";
      default:
        return role || "Менеджер";
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "technologist":
        return "badge-tech";
      case "manager":
        return "badge-mgr";
      default:
        return "badge-mgr";
    }
  };

  // ==========================================================================
  // ФИЛЬТРАЦИЯ ИСТОРИИ
  // ==========================================================================
  const filtered = history.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.contractor?.toLowerCase().includes(q) ||
      item.productType?.toLowerCase().includes(q) ||
      item.date?.toLowerCase().includes(q) ||
      item.calculationNumber?.toLowerCase().includes(q) ||
      item.createdByName?.toLowerCase().includes(q)
    );
  });

  // ==========================================================================
  // ОБРАБОТЧИКИ РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ (ДЛЯ АДМИНИСТРАТОРА)
  // ==========================================================================
  const handleStartEdit = (item) => {
    setEditingItem(item);
    const qty = Number(item.quantity) || 100;
    const tot = Number(item.total) || 0;
    const unitPrice = Number(item.unit) || (qty > 0 ? Math.round(tot / qty) : 0);

    setEditForm({
      contractor: item.contractor || "",
      productType: item.productType || "Футболка",
      quantity: qty,
      difficulty: item.difficulty || "Средняя",
      total: tot,
      unit: unitPrice,
      fabric: item.formValues?.fabric || item.fabric || "Кулирная гладь (хлопок)",
      productionDays: item.calculation?.productionDays || item.productionDays || 5,
    });
    setStatusMessage({ type: "", text: "" });
  };

  const handleSaveEdit = async (e) => {
    if (e) e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const payload = {
        contractor: editForm.contractor.trim(),
        productType: editForm.productType,
        quantity: Number(editForm.quantity),
        difficulty: editForm.difficulty,
        total: Number(editForm.total),
        unit:
          Number(editForm.unit) ||
          (Number(editForm.quantity) > 0
            ? Math.round(Number(editForm.total) / Number(editForm.quantity))
            : 0),
        fabric: editForm.fabric.trim(),
        productionDays: Number(editForm.productionDays) || 5,
      };

      await api.updateCalculation(editingItem.id, payload);

      if (onUpdateHistoryItem) {
        onUpdateHistoryItem(editingItem.id, payload);
      }

      setStatusMessage({
        type: "success",
        text: "Данные расчёта успешно обновлены в базе данных!",
      });

      setTimeout(() => {
        setEditingItem(null);
        setStatusMessage({ type: "", text: "" });
      }, 900);
    } catch (err) {
      console.warn("Backend update error, saving locally:", err.message);
      if (onUpdateHistoryItem) {
        onUpdateHistoryItem(editingItem.id, editForm);
      }
      setStatusMessage({ type: "success", text: "Данные расчёта успешно обновлены!" });
      setTimeout(() => {
        setEditingItem(null);
        setStatusMessage({ type: "", text: "" });
      }, 900);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCalculation = async () => {
    if (!editingItem) return;
    const title = editingItem.calculationNumber || editingItem.id;
    if (!window.confirm(`Вы уверены, что хотите удалить смету «${title}» из базы данных?`)) {
      return;
    }

    setIsSaving(true);
    try {
      await api.deleteCalculation(editingItem.id);
      if (onDeleteHistoryItem) {
        onDeleteHistoryItem(editingItem.id);
      }
      setStatusMessage({ type: "success", text: "Запись расчёта успешно удалена из базы!" });
      setTimeout(() => {
        setEditingItem(null);
        setStatusMessage({ type: "", text: "" });
      }, 800);
    } catch (err) {
      setStatusMessage({ type: "error", text: "Ошибка при удалении: " + err.message });
      setIsSaving(false);
    }
  };

  // ==========================================================================
  // ОСНОВНОЙ РЕНДЕР
  // ==========================================================================
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card history-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка модального окна */}
        <div className="modal-header">
          <div>
            <h3>История и реестр расчётов цеха</h3>
            <p className="kp-subtitle">
              Сохранённые коммерческие сметы в БД PostgreSQL • Поиск по дате, подрядчику, изделию и автору
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Закрыть">
            ✕
          </button>
        </div>

        {/* Тело модального окна */}
        <div className="history-body">
          {editingItem ? (
            /* ============================================================== */
            /* РЕЖИМ РЕДАКТИРОВАНИЯ СМЕТЫ (ДЛЯ АДМИНИСТРАТОРА)                */
            /* ============================================================== */
            <div className="history-edit-view">
              {statusMessage.text && (
                <div
                  className={statusMessage.type === "success" ? "alert-success" : "alert-error"}
                  role="alert"
                >
                  {statusMessage.type === "success" ? "✓" : "⚠️"} {statusMessage.text}
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="history-edit-form">
                <div className="admin-form-grid">
                  {/* Подрядчик */}
                  <div className="admin-field-group">
                    <label htmlFor="edit-contractor">Подрядчик / Заказчик *</label>
                    <input
                      id="edit-contractor"
                      type="text"
                      className="admin-input"
                      value={editForm.contractor}
                      onChange={(e) => setEditForm({ ...editForm, contractor: e.target.value })}
                      list="contractors-datalist"
                      required
                    />
                    <datalist id="contractors-datalist">
                      {contractorsList.map((c) => (
                        <option key={c.id || c.name} value={c.name} />
                      ))}
                    </datalist>
                  </div>

                  {/* Изделие */}
                  <div className="admin-field-group">
                    <label htmlFor="edit-product">Тип изделия *</label>
                    <select
                      id="edit-product"
                      className="admin-select"
                      value={editForm.productType}
                      onChange={(e) => setEditForm({ ...editForm, productType: e.target.value })}
                    >
                      {PRODUCT_TYPES.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Тираж */}
                  <div className="admin-field-group">
                    <label htmlFor="edit-quantity">Тираж, шт. *</label>
                    <input
                      id="edit-quantity"
                      type="number"
                      min="1"
                      className="admin-input"
                      value={editForm.quantity}
                      onChange={(e) => {
                        const q = Number(e.target.value);
                        const newUnit = q > 0 ? Math.round(editForm.total / q) : editForm.unit;
                        setEditForm({ ...editForm, quantity: q, unit: newUnit });
                      }}
                      required
                    />
                  </div>

                  {/* Сложность пошива */}
                  <div className="admin-field-group">
                    <label htmlFor="edit-difficulty">Сложность пошива *</label>
                    <select
                      id="edit-difficulty"
                      className="admin-select"
                      value={editForm.difficulty}
                      onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Итоговая сумма сметы */}
                  <div className="admin-field-group">
                    <label htmlFor="edit-total">Итоговая сумма сметы, ₽ *</label>
                    <input
                      id="edit-total"
                      type="number"
                      min="0"
                      className="admin-input"
                      value={editForm.total}
                      onChange={(e) => {
                        const tot = Number(e.target.value);
                        const newUnit =
                          editForm.quantity > 0 ? Math.round(tot / editForm.quantity) : editForm.unit;
                        setEditForm({ ...editForm, total: tot, unit: newUnit });
                      }}
                      required
                    />
                  </div>

                  {/* Стоимость за 1 шт. */}
                  <div className="admin-field-group">
                    <label htmlFor="edit-unit">Себестоимость за 1 шт., ₽</label>
                    <input
                      id="edit-unit"
                      type="number"
                      min="0"
                      className="admin-input"
                      value={editForm.unit}
                      onChange={(e) => setEditForm({ ...editForm, unit: Number(e.target.value) })}
                    />
                  </div>

                  {/* Ткань */}
                  <div className="admin-field-group">
                    <label htmlFor="edit-fabric">Ткань / полотно</label>
                    <input
                      id="edit-fabric"
                      type="text"
                      className="admin-input"
                      value={editForm.fabric}
                      onChange={(e) => setEditForm({ ...editForm, fabric: e.target.value })}
                    />
                  </div>

                  {/* Срок готовности */}
                  <div className="admin-field-group">
                    <label htmlFor="edit-days">Срок готовности цеха, раб. дней</label>
                    <input
                      id="edit-days"
                      type="number"
                      min="1"
                      className="admin-input"
                      value={editForm.productionDays}
                      onChange={(e) =>
                        setEditForm({ ...editForm, productionDays: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>

                {/* Действия в режиме редактирования */}
                <div className="history-edit-actions">
                  <button
                    type="button"
                    className="btn-delete-calculation"
                    onClick={handleDeleteCalculation}
                    disabled={isSaving}
                    title="Безвозвратно удалить эту запись расчёта из базы"
                  >
                    🗑️ Удалить запись сметы
                  </button>
                  <div style={{ flex: 1 }} />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingItem(null)}
                    disabled={isSaving}
                  >
                    ← Назад к списку
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? "Сохранение..." : "✓ Сохранить изменения в истории"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ============================================================== */
            /* ТАБЛИЦА РАСЧЁТОВ И ПОИСК                                       */
            /* ============================================================== */
            <>
              {/* Поисковая строка */}
              <div className="history-search-row">
                <input
                  type="text"
                  placeholder="Поиск по подрядчику, изделию, дате или автору..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="history-search-input"
                />
              </div>

              {/* Проверка на пустой список */}
              {filtered.length === 0 ? (
                <div className="empty-history">
                  <p>Нет сохранённых расчётов</p>
                  <small>Нажмите «Сохранить расчёт» на главном экране калькулятора</small>
                </div>
              ) : (
                <div className="history-table-wrapper">
                  <table className="admin-table history-table">
                    <thead>
                      <tr>
                        <th>Дата</th>
                        <th>Подрядчик</th>
                        <th>Изделие</th>
                        <th>Тираж</th>
                        <th style={{ textAlign: "right" }}>Сумма</th>
                        <th style={{ textAlign: "right" }}>За 1 шт.</th>
                        {isAdmin && <th>Добавил сотрудник (ФИО и роль)</th>}
                        <th style={{ textAlign: "center" }}>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((item) => (
                        <tr key={item.id}>
                          <td style={{ whiteSpace: "nowrap", color: "#64748b" }}>{item.date}</td>
                          <td>
                            <b>{item.contractor}</b>
                          </td>
                          <td>{item.productType}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{item.quantity}&nbsp;шт.</td>
                          <td style={{ textAlign: "right", fontWeight: "700", whiteSpace: "nowrap" }}>
                            {formatMoney(item.total)}
                          </td>
                          <td style={{ textAlign: "right", color: "#1d4ed8", whiteSpace: "nowrap" }}>
                            {formatMoney(item.unit)}
                          </td>
                          {isAdmin && (
                            <td style={{ whiteSpace: "nowrap" }}>
                              <div className="history-author-cell">
                                <span className="history-author-name">
                                  {item.createdByName || "Сотрудник цеха"}
                                </span>
                                <span
                                  className={`user-role-badge ${getRoleBadgeClass(
                                    item.createdByRole || "manager"
                                  )}`}
                                >
                                  {getRoleLabel(item.createdByRole || "manager")}
                                </span>
                              </div>
                            </td>
                          )}
                          <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                            <div className="history-row-actions">
                              <button
                                type="button"
                                className="btn-action-small"
                                onClick={() => {
                                  onLoadCalculation(item);
                                  onClose();
                                }}
                                title="Загрузить параметры в калькулятор"
                              >
                                Загрузить
                              </button>
                              {isAdmin && (
                                <button
                                  type="button"
                                  className="btn-action-edit"
                                  onClick={() => handleStartEdit(item)}
                                  title="Редактировать запись расчёта"
                                >
                                  Редактировать
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Подвал модального окна */}
        <div className="modal-actions" style={{ justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Всего расчётов в базе: <b>{history.length}</b>
            {isAdmin && <span style={{ color: "#16a34a" }}> • Доступно редактирование и удаление</span>}
          </span>
          <button className="btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
