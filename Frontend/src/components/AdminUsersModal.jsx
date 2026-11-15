/**
 * @file AdminUsersModal.jsx
 * @description Панель администратора цеха: Управление пользователями и подрядчиками (Модуль 1 ТЗ)
 * Доступно только для роли «Администратор»
 *
 * Функционал:
 * - Создание учетных записей сотрудников с назначением ролей (Admin, Technologist, Manager)
 * - Просмотр списка активных пользователей системы и удаление учетных записей
 * - Добавление контрагентов / подрядчиков цеха с реквизитами
 */

import { useState, useEffect } from "react";
import { api } from "../services/api";

/**
 * Модальное окно управления профилями и подрядчиками
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.currentUser
 * @param {Array} props.contractorsList
 * @param {Function} props.onAddContractor
 * @param {string} props.initialTab
 */
export function AdminUsersModal({
  isOpen,
  onClose,
  currentUser,
  contractorsList = [],
  onAddContractor,
  initialTab = "users",
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // "users" | "contractors"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Поля формы создания нового пользователя
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("manager"); // manager | technologist | admin
  const [isCreating, setIsCreating] = useState(false);

  // Поля формы создания нового подрядчика
  const [contractorName, setContractorName] = useState("");
  const [contractorContact, setContractorContact] = useState("");
  const [contractorPhone, setContractorPhone] = useState("");
  const [contractorEmail, setContractorEmail] = useState("");
  const [contractorInn, setContractorInn] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [isCreatingContractor, setIsCreatingContractor] = useState(false);

  // Загрузка списка пользователей с сервера
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await api.getUsers();
      if (Array.isArray(list)) {
        setUsers(list);
      }
    } catch (err) {
      setError("Не удалось загрузить список пользователей: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setError("");
      setSuccessMsg("");
      setActiveTab(initialTab || "users");
    }
  }, [isOpen, initialTab]);

  // ==========================================================================
  // ОБРАБОТЧИКИ СОЗДАНИЯ И УДАЛЕНИЯ ПОЛЬЗОВАТЕЛЕЙ
  // ==========================================================================
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newFullName.trim() || !newPassword.trim()) {
      setError("Логин, ФИО и пароль обязательны для заполнения");
      return;
    }

    try {
      setIsCreating(true);
      setError("");
      setSuccessMsg("");

      const payload = {
        username: newUsername.trim(),
        fullName: newFullName.trim(),
        password: newPassword.trim(),
        email: newEmail.trim() || `${newUsername.trim()}@surgut-sew.ru`,
        role: newRole,
      };

      const result = await api.createUser(payload);
      if (result && result.success) {
        setSuccessMsg(
          `Пользователь «${newFullName.trim()}» с ролью «${getRoleLabel(newRole)}» успешно создан!`
        );
        setNewUsername("");
        setNewFullName("");
        setNewPassword("");
        setNewEmail("");
        setNewRole("manager");
        await fetchUsers();
      } else {
        setError(result?.error || "Ошибка создания пользователя");
      }
    } catch (err) {
      setError(err.message || "Ошибка при создании пользователя");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (id === "u-admin" || username === "admin") {
      alert("Нельзя удалить главного администратора системы!");
      return;
    }

    if (!window.confirm(`Вы уверены, что хотите удалить сотрудника с логином «${username}»?`)) {
      return;
    }

    try {
      setError("");
      setSuccessMsg("");
      const result = await api.deleteUser(id);
      if (result && result.success) {
        setSuccessMsg(`Пользователь «${username}» успешно удален.`);
        await fetchUsers();
      }
    } catch (err) {
      setError(err.message || "Ошибка удаления пользователя");
    }
  };

  // ==========================================================================
  // ОБРАБОТЧИК ДОБАВЛЕНИЯ ПОДРЯДЧИКА
  // ==========================================================================
  const handleCreateContractor = async (e) => {
    e.preventDefault();
    if (!contractorName.trim()) {
      setError("Наименование подрядчика обязательно для заполнения");
      return;
    }

    try {
      setIsCreatingContractor(true);
      setError("");
      setSuccessMsg("");

      const payload = {
        name: contractorName.trim(),
        contact: contractorContact.trim(),
        phone: contractorPhone.trim(),
        email: contractorEmail.trim(),
        inn: contractorInn.trim(),
        address: contractorAddress.trim(),
      };

      const result = await api.addContractor(payload);
      if (result && result.id) {
        setSuccessMsg(`Подрядчик «${contractorName.trim()}» успешно добавлен в базу цеха!`);
        setContractorName("");
        setContractorContact("");
        setContractorPhone("");
        setContractorEmail("");
        setContractorInn("");
        setContractorAddress("");

        if (onAddContractor) {
          onAddContractor(result);
        }
      }
    } catch (err) {
      setError(err.message || "Ошибка при добавлении подрядчика");
    } finally {
      setIsCreatingContractor(false);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "technologist":
        return "Технолог";
      case "manager":
        return "Менеджер";
      default:
        return role;
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
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card admin-users-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка модального окна */}
        <div className="modal-header">
          <div>
            <h3>Панель администратора цеха</h3>
            <p className="kp-subtitle">
              Управление профилями сотрудников цеха, ролями доступа и базой подрядчиков
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Закрыть">
            ✕
          </button>
        </div>

        {/* Переключатель вкладок */}
        <div className="admin-tabs-bar">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("users");
              setError("");
              setSuccessMsg("");
            }}
          >
            👥 Пользователи и роли ({users.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === "contractors" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("contractors");
              setError("");
              setSuccessMsg("");
            }}
          >
            🏢 База подрядчиков ({contractorsList.length})
          </button>
        </div>

        {/* Сообщения об ошибках и успехе */}
        {error && (
          <div style={{ margin: "16px 24px 0" }} className="alert-error" role="alert">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div style={{ margin: "16px 24px 0" }} className="alert-success" role="alert">
            ✓ {successMsg}
          </div>
        )}

        <div className="admin-body">
          {activeTab === "users" ? (
            /* ============================================================== */
            /* ВКЛАДКА 1: ПОЛЬЗОВАТЕЛИ И РОЛИ                                 */
            /* ============================================================== */
            <>
              {/* Форма создания нового пользователя */}
              <section className="admin-section">
                <h4>Создать нового пользователя</h4>
                <form onSubmit={handleCreateUser} className="admin-create-user-form">
                  <div className="admin-grid">
                    <label className="field">
                      <span className="field-label">Логин для входа *</span>
                      <input
                        type="text"
                        placeholder="например, petrov"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                        disabled={isCreating}
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">Пароль *</span>
                      <input
                        type="password"
                        placeholder="Минимум 6 символов"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isCreating}
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">ФИО сотрудника *</span>
                      <input
                        type="text"
                        placeholder="Петров Пётр Петрович"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        required
                        disabled={isCreating}
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">Роль в системе *</span>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        disabled={isCreating}
                      >
                        <option value="manager">Менеджер по работе с подрядчиками</option>
                        <option value="technologist">Технолог цеха (Справочники и тарифы)</option>
                        <option value="admin">Администратор цеха (Полный доступ)</option>
                      </select>
                    </label>

                    <label className="field" style={{ gridColumn: "1 / -1" }}>
                      <span className="field-label">Корпоративный Email (необязательно)</span>
                      <input
                        type="email"
                        placeholder="petrov@surgut-sew.ru"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        disabled={isCreating}
                      />
                    </label>
                  </div>

                  <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn-primary" disabled={isCreating}>
                      {isCreating ? "Создание..." : "+ Создать пользователя"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Список действующих пользователей */}
              <section className="admin-section">
                <h4>Действующие сотрудники цеха</h4>
                {loading ? (
                  <p style={{ color: "#64748b" }}>Загрузка списка пользователей...</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ФИО сотрудника</th>
                        <th>Логин</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th style={{ width: "60px", textAlign: "center" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => {
                        const isMainAdmin = u.username === "admin" || u.id === "u-admin";
                        return (
                          <tr key={u.id}>
                            <td>
                              <b>{u.fullName || u.full_name}</b>
                              {isMainAdmin && (
                                <small style={{ display: "block", color: "#64748b", fontSize: "11px" }}>
                                  Главный администратор
                                </small>
                              )}
                            </td>
                            <td><code>{u.username}</code></td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`user-role-badge ${getRoleBadgeClass(u.role)}`}>
                                {getRoleLabel(u.role)}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {!isMainAdmin ? (
                                <button
                                  type="button"
                                  className="btn-danger-icon"
                                  title="Удалить пользователя"
                                  onClick={() => handleDeleteUser(u.id, u.username)}
                                >
                                  ✕
                                </button>
                              ) : (
                                <span title="Нельзя удалить" style={{ color: "#cbd5e1" }}>🔒</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </section>
            </>
          ) : (
            /* ============================================================== */
            /* ВКЛАДКА 2: РЕЕСТР ПОДРЯДЧИКОВ                                  */
            /* ============================================================== */
            <>
              {/* Форма добавления подрядчика */}
              <section className="admin-section">
                <h4>Добавить нового подрядчика цеха</h4>
                <form onSubmit={handleCreateContractor} className="admin-create-user-form">
                  <div className="admin-grid">
                    <label className="field">
                      <span className="field-label">Наименование организации / ИП *</span>
                      <input
                        type="text"
                        placeholder="ООО «ЮграМерч»"
                        value={contractorName}
                        onChange={(e) => setContractorName(e.target.value)}
                        required
                        disabled={isCreatingContractor}
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">Контактное лицо</span>
                      <input
                        type="text"
                        placeholder="Иванов Сергей"
                        value={contractorContact}
                        onChange={(e) => setContractorContact(e.target.value)}
                        disabled={isCreatingContractor}
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">Телефон</span>
                      <input
                        type="text"
                        placeholder="+7 (3462) 55-00-11"
                        value={contractorPhone}
                        onChange={(e) => setContractorPhone(e.target.value)}
                        disabled={isCreatingContractor}
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">Email для отправки КП</span>
                      <input
                        type="email"
                        placeholder="order@ugramerch.ru"
                        value={contractorEmail}
                        onChange={(e) => setContractorEmail(e.target.value)}
                        disabled={isCreatingContractor}
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">ИНН подрядчика</span>
                      <input
                        type="text"
                        placeholder="8602123456"
                        value={contractorInn}
                        onChange={(e) => setContractorInn(e.target.value)}
                        disabled={isCreatingContractor}
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">Фактический адрес</span>
                      <input
                        type="text"
                        placeholder="г. Сургут, ул. Ленина, 15"
                        value={contractorAddress}
                        onChange={(e) => setContractorAddress(e.target.value)}
                        disabled={isCreatingContractor}
                      />
                    </label>
                  </div>

                  <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn-primary" disabled={isCreatingContractor}>
                      {isCreatingContractor ? "Сохранение..." : "+ Добавить подрядчика"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Список активных подрядчиков */}
              <section className="admin-section">
                <h4>Реестр зарегистрированных подрядчиков</h4>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Подрядчик</th>
                      <th>Контактное лицо</th>
                      <th>Телефон</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractorsList.map((c) => (
                      <tr key={c.id || c.name}>
                        <td><b>{c.name}</b></td>
                        <td>{c.contact || c.contact_person || "—"}</td>
                        <td>{c.phone || "—"}</td>
                        <td>{c.email || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>

        {/* Действия в модальном окне */}
        <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
