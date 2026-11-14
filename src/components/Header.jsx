import { BrandShirtIcon, FactoryIcon } from "./Icons";

export function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <BrandShirtIcon className="brand-shirt" />
        <h1>
          <span className="brand-roman">II</span> Калькулятор
          <br />
          себестоимости и раскроя изделия
        </h1>
      </div>
      <div className="workshop">
        <FactoryIcon className="factory-icon" />
        <div>
          <b>Производственный цех</b>
          <span>г. Сургут, ул. Комплектовочная, 5</span>
        </div>
      </div>
    </header>
  );
}
