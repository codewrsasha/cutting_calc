import { useMemo, useState } from "react";
import { DEFAULT_FORM_VALUES } from "./constants/calculator";
import { calculateCosts } from "./utils/calculateCosts";
import { Header } from "./components/Header";
import { ProductInfoCard } from "./components/ProductInfoCard";
import { CuttingParamsCard } from "./components/CuttingParamsCard";
import { ResultsCard } from "./components/ResultsCard";
import { Footer } from "./components/Footer";

export default function App() {
  // Состояние формы калькулятора
  const [productType, setProductType] = useState(DEFAULT_FORM_VALUES.productType);
  const [quantity, setQuantity] = useState(DEFAULT_FORM_VALUES.quantity);
  const [difficulty, setDifficulty] = useState(DEFAULT_FORM_VALUES.difficulty);
  const [fabric, setFabric] = useState(DEFAULT_FORM_VALUES.fabric);
  const [fabricPrice, setFabricPrice] = useState(DEFAULT_FORM_VALUES.fabricPrice);
  const [rollWidth, setRollWidth] = useState(DEFAULT_FORM_VALUES.rollWidth);
  const [seam, setSeam] = useState(DEFAULT_FORM_VALUES.seam);
  const [length, setLength] = useState(DEFAULT_FORM_VALUES.length);
  const [chest, setChest] = useState(DEFAULT_FORM_VALUES.chest);
  const [sleeve, setSleeve] = useState(DEFAULT_FORM_VALUES.sleeve);
  const [waste, setWaste] = useState(DEFAULT_FORM_VALUES.waste);
  const [extras, setExtras] = useState(DEFAULT_FORM_VALUES.extras);

  // Переключение чекбоксов дополнительных элементов
  const toggleExtra = (id) =>
    setExtras((prev) => ({ ...prev, [id]: !prev[id] }));

  // Хелпер для числовых инпутов
  const handleNumberChange = (setter) => (event) => {
    const val = parseFloat(event.target.value);
    setter(isNaN(val) ? 0 : val);
  };

  // Мемоизированный расчёт себестоимости через чистую функцию calculateCosts
  const calculation = useMemo(
    () =>
      calculateCosts({
        quantity,
        difficulty,
        fabricPrice,
        length,
        sleeve,
        seam,
        waste,
        extras,
      }),
    [quantity, difficulty, fabricPrice, length, sleeve, seam, waste, extras]
  );

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard">
        <div className="left-column">
          <ProductInfoCard
            productType={productType}
            setProductType={setProductType}
            quantity={quantity}
            setQuantity={setQuantity}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            extras={extras}
            toggleExtra={toggleExtra}
          />

          <CuttingParamsCard
            fabric={fabric}
            setFabric={setFabric}
            rollWidth={rollWidth}
            setRollWidth={setRollWidth}
            fabricPrice={fabricPrice}
            setFabricPrice={setFabricPrice}
            seam={seam}
            setSeam={setSeam}
            length={length}
            setLength={setLength}
            chest={chest}
            setChest={setChest}
            sleeve={sleeve}
            setSleeve={setSleeve}
            waste={waste}
            setWaste={setWaste}
            onNumberChange={handleNumberChange}
          />
        </div>

        <ResultsCard calculation={calculation} quantity={quantity} />
      </main>

      <Footer />
    </div>
  );
}
