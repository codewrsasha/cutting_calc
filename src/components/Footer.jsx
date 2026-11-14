import { SkylineGraphic } from "./Icons";

export function Footer() {
  return (
    <footer className="footer-banner">
      <div className="footer-left">
        <span className="footer-info-icon">i</span>
        <p className="footer-text">
          Расчёт является предварительным. Окончательное решение принимает технолог цеха.
        </p>
      </div>
      <SkylineGraphic className="footer-skyline" />
    </footer>
  );
}
