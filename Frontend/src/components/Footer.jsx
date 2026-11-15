/**
 * @file Footer.jsx
 * @description Подвал приложения с регламентом и дисклеймером расчёта
 * Правило ТЗ: для роли «Технолог» плашка предварительного расчёта полностью скрыта
 */

export function Footer({ currentRole }) {
  // По требованию ТЗ: у технолога не должна быть надпись снизу
  // "Расчёт является предварительным. Окончательное решение принимает технолог цеха."
  if (currentRole === "technologist") {
    return null;
  }

  return (
    <footer className="footer-banner">
      <div className="footer-left">
        <p className="footer-text">
          Расчёт является предварительным. Окончательное решение принимает технолог цеха.
        </p>
      </div>
    </footer>
  );
}
