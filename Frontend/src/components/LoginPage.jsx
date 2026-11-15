/**
 * @file LoginPage.jsx
 * @description Экран авторизации сотрудников цеха (Модуль 1 ТЗ)
 *
 * Возможности:
 * - Вход по логину/email и паролю с bcrypt-проверкой на сервере
 * - Интерактивное переключение видимости пароля
 * - Экспресс-карточки быстрого входа для тестирования ролей:
 *   1. Администратор (admin / admin123)
 *   2. Технолог (technologist / tech123)
 *   3. Менеджер (manager / manager123)
 */

import { useState } from "react";
import { api } from "../services/api";

export function LoginPage({ onLoginSuccess }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!login.trim() || !password.trim()) {
      setErrorMessage("Пожалуйста, введите логин и пароль");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await api.login(login.trim(), password.trim());
      if (data && data.user) {
        localStorage.setItem("sew_auth_user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("sew_auth_token", data.token);
        }
        onLoginSuccess(data.user);
      } else {
        setErrorMessage("Не удалось войти: неверный ответ сервера");
      }
    } catch (err) {
      setErrorMessage(err.message || "Ошибка авторизации. Проверьте логин и пароль.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (quickLogin, quickPass) => {
    setLogin(quickLogin);
    setPassword(quickPass);
    setErrorMessage("");
    setIsLoading(true);

    api.login(quickLogin, quickPass)
      .then((data) => {
        if (data && data.user) {
          localStorage.setItem("sew_auth_user", JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem("sew_auth_token", data.token);
          }
          onLoginSuccess(data.user);
        }
      })
      .catch((err) => {
        setErrorMessage(err.message || "Ошибка входа");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Шапка карточки логина */}
        <div className="login-header">
          <div className="login-brand-icon">
            <span className="login-brand-roman">II</span>
          </div>
          <h1 className="login-title">Калькулятор себестоимости и раскроя</h1>
          <p className="login-subtitle">
            Производственный цех по пошиву мерча (г. Сургут, ул. Комплектовочная, 5)
          </p>
        </div>

        {/* Форма ввода учетных данных */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="login-input">Логин или Email:</label>
            <input
              id="login-input"
              type="text"
              className="login-input"
              placeholder="admin, technologist, manager или email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoFocus
              disabled={isLoading}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password-input">Пароль:</label>
            <div className="password-input-wrapper">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? "Скрыть" : "Показать"}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="login-error-alert" role="alert">
              <span>⚠️ {errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Выполняется вход..." : "Войти в систему"}
          </button>
        </form>

        {/* Демо-карточки для быстрого тестирования 3-х ролей */}
        <div className="quick-roles-section">
          <div className="quick-roles-title">
            <span>Быстрый вход по ролям (для демонстрации):</span>
          </div>
          <div className="quick-roles-grid">
            {/* Администратор */}
            <button
              type="button"
              className="quick-role-card role-admin-card"
              onClick={() => handleQuickLogin("admin", "admin123")}
              disabled={isLoading}
            >
              <div className="quick-role-badge badge-admin">Администратор</div>
              <div className="quick-role-creds">
                Логин: <b>admin</b> | Пароль: <b>admin123</b>
              </div>
              <div className="quick-role-desc">
                Полный доступ: калькулятор, справочники и управление профилями
              </div>
            </button>

            {/* Технолог */}
            <button
              type="button"
              className="quick-role-card role-tech-card"
              onClick={() => handleQuickLogin("technologist", "tech123")}
              disabled={isLoading}
            >
              <div className="quick-role-badge badge-tech">Технолог</div>
              <div className="quick-role-creds">
                Логин: <b>technologist</b> | Пароль: <b>tech123</b>
              </div>
              <div className="quick-role-desc">
                Доступны «Справочники»; скрыта плашка предварительного расчёта
              </div>
            </button>

            {/* Менеджер */}
            <button
              type="button"
              className="quick-role-card role-mgr-card"
              onClick={() => handleQuickLogin("manager", "manager123")}
              disabled={isLoading}
            >
              <div className="quick-role-badge badge-mgr">Менеджер</div>
              <div className="quick-role-creds">
                Логин: <b>manager</b> | Пароль: <b>manager123</b>
              </div>
              <div className="quick-role-desc">
                Расчёт и КП; кнопка «Справочники» строго отсутствует
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
