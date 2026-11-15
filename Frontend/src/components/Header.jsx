/**
 * @file Header.jsx
 * @description Верхняя панель навигации (Модуль 1 ТЗ)
 *
 * Ролевые правила доступа:
 * - У менеджера кнопка «Справочники» строго отсутствует в DOM
 * - Технолог и Администратор имеют доступ к разделу «Справочники»
 * - Только Администратор имеет доступ к разделу «Пользователи»
 * - Адрес цеха («г. Сургут, ул. Комплектовочная, 5») зафиксирован в одну строку
 */

export function Header({
  currentUser,
  onLogout,
  historyCount,
  onOpenHistory,
  onOpenTechModal,
  onOpenAdminUsersModal,
}) {
  const role = currentUser?.role || "manager";

  const getRoleLabel = (r) => {
    switch (r) {
      case "admin":
        return "Администратор";
      case "technologist":
        return "Технолог";
      case "manager":
        return "Менеджер";
      default:
        return "Пользователь";
    }
  };

  const getRoleBadgeClass = (r) => {
    switch (r) {
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

  // Проверка прав по ТЗ:
  // 1. У менеджера не должна существовать кнопка «Справочник» в принципе
  // 2. Технолог и Администратор имеют доступ к Справочникам
  const canAccessReferences = role === "technologist" || role === "admin";

  // 3. Администратор обладает функциями всех ролей и управляет пользователями
  const isAdmin = role === "admin";

  return (
    <header className="topbar">
      <div className="brand">
        <div>
          <h1>
            <span className="brand-roman">II</span> Калькулятор
            <br />
            себестоимости и раскроя изделия
          </h1>
          <span className="brand-tag">Экспресс-расчёт мерча для подрядчиков</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Карточка авторизованного сотрудника */}
        <div className="user-auth-card">
          <div className="user-avatar-circle">
            {role === "admin" ? "🛡️" : role === "technologist" ? "⚙️" : "📋"}
          </div>
          <div className="user-auth-meta">
            <span className="user-fullname" title={currentUser?.fullName || currentUser?.username}>
              {currentUser?.fullName || currentUser?.username || "Сотрудник"}
            </span>
            <div className="user-role-row">
              <span className={`user-role-badge ${getRoleBadgeClass(role)}`}>
                {getRoleLabel(role)}
              </span>
              <button
                type="button"
                className="user-logout-btn"
                onClick={onLogout}
                title="Выйти из учетной записи"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Навигационные кнопки быстрого доступа */}
        <div className="nav-actions">
          {/* История расчётов: доступна всем ролям */}
          <button
            type="button"
            className="nav-btn"
            onClick={onOpenHistory}
            title="Открыть историю и реестр расчётов"
          >
            <span>История</span>
            {historyCount > 0 && <span className="nav-badge">{historyCount}</span>}
          </button>

          {/* Кнопка справочников: у менеджера НЕ ДОЛЖНА СУЩЕСТВОВАТЬ (не рендерится в DOM) */}
          {canAccessReferences && (
            <button
              type="button"
              className="nav-btn nav-btn-highlight"
              onClick={onOpenTechModal}
              title="Открыть справочники нормо-часов и тканей"
            >
              <span>Справочники</span>
            </button>
          )}

          {/* Кнопка панели администратора: доступна только администратору */}
          {isAdmin && (
            <button
              type="button"
              className="nav-btn nav-btn-admin"
              onClick={onOpenAdminUsersModal}
              title="Управление пользователями и назначение ролей"
            >
              <span>Пользователи</span>
            </button>
          )}
        </div>

        {/* Реквизиты цеха */}
        <div className="workshop">
          <div>
            <b>Производственный цех</b>
            <span>г. Сургут, ул. Комплектовочная, 5</span>
          </div>
        </div>
      </div>
    </header>
  );
}
