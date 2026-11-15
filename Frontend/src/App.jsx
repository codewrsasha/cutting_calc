/**
 * @file App.jsx
 * @description Корневой компонент веб-сервиса «II Калькулятор себестоимости и раскроя изделия»
 * Заказчик: Производственный цех (г. Сургут, ул. Комплектовочная, 5)
 *
 * Архитектура и функционал:
 * - Модуль 1: Авторизация (Admin, Technologist, Manager) и реестр подрядчиков
 * - Модули 2 & 3: Калькуляторы пошива и раскроя с экспресс-вводом
 * - Модуль 4: Сводная детализированная смета затрат
 * - Модуль 5: Генерация коммерческого предложения (КП) и экспорт в PDF
 * - Модуль 6: Настройка технологических констант и справочников
 * - Модуль 7: Реестр истории расчётов с фильтрацией, загрузкой и редактированием
 */

import { useMemo, useState, useEffect } from "react";
import {
  DEFAULT_FORM_VALUES,
  INITIAL_TECH_SETTINGS,
  INITIAL_FABRICS,
  INITIAL_CONTRACTORS,
  PRODUCT_TYPES,
} from "./constants/calculator";
import { calculateCosts } from "./utils/calculateCosts";
import { api } from "./services/api";

// Компоненты основного интерфейса
import { Header } from "./components/Header";
import { ProductInfoCard } from "./components/ProductInfoCard";
import { CuttingParamsCard } from "./components/CuttingParamsCard";
import { ResultsCard } from "./components/ResultsCard";
import { Footer } from "./components/Footer";

// Модальные окна и экраны
import { LoginPage } from "./components/LoginPage";
import { KPModal } from "./components/KPModal";
import { AdminTechModal } from "./components/AdminTechModal";
import { HistoryModal } from "./components/HistoryModal";
import { AdminUsersModal } from "./components/AdminUsersModal";

export default function App() {
  // ==========================================================================
  // 1. АВТОРИЗАЦИЯ И СЕССИЯ ПОЛЬЗОВАТЕЛЯ (Модуль 1 ТЗ)
  // ==========================================================================
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("sew_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("sew_auth_user");
    localStorage.removeItem("sew_auth_token");
    setCurrentUser(null);
  };

  // ==========================================================================
  // 2. СПРАВОЧНИКИ И НАСТРОЙКИ ЦЕХА (Модули 1 и 6 ТЗ)
  // ==========================================================================
  const [techSettings, setTechSettings] = useState(() => {
    const saved = localStorage.getItem("sew_tech_settings");
    return saved ? JSON.parse(saved) : INITIAL_TECH_SETTINGS;
  });

  const [fabrics, setFabrics] = useState(() => {
    const saved = localStorage.getItem("sew_fabrics");
    return saved ? JSON.parse(saved) : INITIAL_FABRICS;
  });

  const [contractors, setContractors] = useState(INITIAL_CONTRACTORS);

  // ==========================================================================
  // 3. ИСТОРИЯ РАСЧЁТОВ (Модуль 7 ТЗ)
  // ==========================================================================
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("sew_calc_history");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "init-1",
            date: new Date().toLocaleString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            contractor: "ООО «СеверМерч»",
            productType: "Футболка",
            quantity: 100,
            difficulty: "Средняя",
            total: 69800,
            unit: 698,
            createdByName: "Сидоров Максим Игоревич",
            createdByRole: "manager",
            formValues: { ...DEFAULT_FORM_VALUES },
          },
        ];
  });

  // Идентификатор активного расчёта для привязки коммерческого предложения
  const [currentCalcId, setCurrentCalcId] = useState(null);

  // ==========================================================================
  // 4. СОСТОЯНИЕ ФОРМЫ КАЛЬКУЛЯТОРА (Модули 2 и 3 ТЗ)
  // ==========================================================================
  const [contractor, setContractor] = useState(DEFAULT_FORM_VALUES.contractor);
  const [productType, setProductType] = useState(DEFAULT_FORM_VALUES.productType);
  const [quantity, setQuantity] = useState(DEFAULT_FORM_VALUES.quantity);
  const [difficulty, setDifficulty] = useState(DEFAULT_FORM_VALUES.difficulty);
  const [partsCount, setPartsCount] = useState(DEFAULT_FORM_VALUES.partsCount);
  const [fabric, setFabric] = useState(DEFAULT_FORM_VALUES.fabric);
  const [fabricPrice, setFabricPrice] = useState(DEFAULT_FORM_VALUES.fabricPrice);
  const [rollWidth, setRollWidth] = useState(DEFAULT_FORM_VALUES.rollWidth);
  const [seam, setSeam] = useState(DEFAULT_FORM_VALUES.seam);
  const [length, setLength] = useState(DEFAULT_FORM_VALUES.length);
  const [chest, setChest] = useState(DEFAULT_FORM_VALUES.chest);
  const [sleeve, setSleeve] = useState(DEFAULT_FORM_VALUES.sleeve);
  const [waste, setWaste] = useState(DEFAULT_FORM_VALUES.waste);
  const [brandingType, setBrandingType] = useState(DEFAULT_FORM_VALUES.brandingType);
  const [extras, setExtras] = useState(DEFAULT_FORM_VALUES.extras);

  // ==========================================================================
  // 5. УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ
  // ==========================================================================
  const [isKPModalOpen, setIsKPModalOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAdminUsersModalOpen, setIsAdminUsersModalOpen] = useState(false);
  const [adminModalTab, setAdminModalTab] = useState("users");

  // ==========================================================================
  // 6. СИНХРОНИЗАЦИЯ С СЕРВЕРОМ И ХРАНИЛИЩЕМ (Отказоустойчивость)
  // ==========================================================================
  useEffect(() => {
    // 1. Нормативы технолога
    api.getTechSettings()
      .then((data) => {
        if (data && data.sewingHourRate) setTechSettings(data);
      })
      .catch((e) => console.log("Using cached tech settings:", e.message));

    // 2. Справочник тканей
    api.getFabrics()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setFabrics(data);
      })
      .catch((e) => console.log("Using cached fabrics:", e.message));

    // 3. Подрядчики цеха
    api.getContractors()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setContractors(data);
      })
      .catch((e) => console.log("Using cached contractors:", e.message));

    // 4. Реестр истории расчётов
    api.getCalculations()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setHistory(data);
      })
      .catch((e) => console.log("Using cached history:", e.message));
  }, []);

  // Персистентность в LocalStorage при обрыве связи
  useEffect(() => {
    localStorage.setItem("sew_tech_settings", JSON.stringify(techSettings));
  }, [techSettings]);

  useEffect(() => {
    localStorage.setItem("sew_fabrics", JSON.stringify(fabrics));
  }, [fabrics]);

  useEffect(() => {
    localStorage.setItem("sew_calc_history", JSON.stringify(history));
  }, [history]);

  // ==========================================================================
  // 7. ВЫЧИСЛЯЕМЫЕ ДАННЫЕ И МЕМОИЗАЦИЯ СМЕТЫ
  // ==========================================================================
  const calculation = useMemo(
    () =>
      calculateCosts(
        {
          quantity,
          difficulty,
          partsCount,
          fabricPrice,
          length,
          sleeve,
          seam,
          waste,
          brandingType,
          extras,
        },
        techSettings
      ),
    [
      quantity,
      difficulty,
      partsCount,
      fabricPrice,
      length,
      sleeve,
      seam,
      waste,
      brandingType,
      extras,
      techSettings,
    ]
  );

  const contractorInfo = useMemo(() => {
    return (
      contractors.find((c) => c.name === contractor) ||
      INITIAL_CONTRACTORS.find((c) => c.name === contractor) || {
        name: contractor,
        contact: "Представитель подрядчика",
        email: "contractor@mail.ru",
        phone: "+7 (999) 000-00-00",
      }
    );
  }, [contractor, contractors]);

  const currentFormValues = {
    contractor,
    productType,
    quantity,
    difficulty,
    partsCount,
    fabric,
    fabricPrice,
    rollWidth,
    seam,
    length,
    chest,
    sleeve,
    waste,
    brandingType,
    extras,
  };

  // ==========================================================================
  // 8. ОБРАБОТЧИКИ СОБЫТИЙ И ФОРМЫ
  // ==========================================================================
  const handleProductTypeSelect = (selectedName) => {
    setProductType(selectedName);
    const item = PRODUCT_TYPES.find((p) => p.name === selectedName);
    if (item) {
      setPartsCount(item.defaultParts);
    }
  };

  const toggleExtra = (id) =>
    setExtras((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleNumberChange = (setter) => (event) => {
    const val = parseFloat(event.target.value);
    setter(isNaN(val) ? 0 : val);
  };

  const handleAddContractor = (newContractor) => {
    setContractors((prev) => [newContractor, ...prev]);
    if (newContractor.name) {
      setContractor(newContractor.name);
    }
  };

  // Сохранение расчёта в реестр истории
  const handleSaveToHistory = async () => {
    const authorName = currentUser?.fullName || currentUser?.username || "Сидоров Максим Игоревич";
    const authorRole = currentUser?.role || "manager";

    try {
      const saved = await api.saveCalculation({
        formValues: currentFormValues,
        createdByName: authorName,
        createdByRole: authorRole,
      });
      if (saved && saved.id) {
        setCurrentCalcId(saved.id);
        const list = await api.getCalculations();
        if (Array.isArray(list)) {
          setHistory(list);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend save failed, saving to local state:", err);
    }

    const newEntry = {
      id: `calc-${Date.now()}`,
      calculationNumber: `СМЕТА-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      contractor,
      productType,
      quantity,
      difficulty,
      total: calculation.total,
      unit: calculation.unit,
      createdByName: authorName,
      createdByRole: authorRole,
      formValues: { ...currentFormValues },
    };
    setCurrentCalcId(newEntry.id);
    setHistory([newEntry, ...history]);
  };

  // Загрузка сохранённого расчёта обратно в калькулятор
  const handleLoadCalculation = (entry) => {
    if (!entry.formValues) return;
    const v = entry.formValues;
    setCurrentCalcId(entry.id);
    setContractor(v.contractor || DEFAULT_FORM_VALUES.contractor);
    setProductType(v.productType || DEFAULT_FORM_VALUES.productType);
    setQuantity(v.quantity || DEFAULT_FORM_VALUES.quantity);
    setDifficulty(v.difficulty || DEFAULT_FORM_VALUES.difficulty);
    setPartsCount(v.partsCount || DEFAULT_FORM_VALUES.partsCount);
    setFabric(v.fabric || DEFAULT_FORM_VALUES.fabric);
    setFabricPrice(v.fabricPrice || DEFAULT_FORM_VALUES.fabricPrice);
    setRollWidth(v.rollWidth || DEFAULT_FORM_VALUES.rollWidth);
    setSeam(v.seam || DEFAULT_FORM_VALUES.seam);
    setLength(v.length || DEFAULT_FORM_VALUES.length);
    setChest(v.chest || DEFAULT_FORM_VALUES.chest);
    setSleeve(v.sleeve || DEFAULT_FORM_VALUES.sleeve);
    setWaste(v.waste || DEFAULT_FORM_VALUES.waste);
    setBrandingType(v.brandingType || DEFAULT_FORM_VALUES.brandingType);
    setExtras(v.extras || DEFAULT_FORM_VALUES.extras);
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateHistoryItem = (id, updatedFields) => {
    setHistory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newTotal = updatedFields.total !== undefined ? Number(updatedFields.total) : item.total;
          const newQty = updatedFields.quantity !== undefined ? Number(updatedFields.quantity) : item.quantity;
          const newUnit =
            updatedFields.unit !== undefined
              ? Number(updatedFields.unit)
              : newQty > 0
              ? Math.round(newTotal / newQty)
              : item.unit;

          return {
            ...item,
            contractor: updatedFields.contractor || item.contractor,
            productType: updatedFields.productType || item.productType,
            quantity: newQty,
            difficulty: updatedFields.difficulty || item.difficulty,
            total: newTotal,
            unit: newUnit,
            formValues: {
              ...item.formValues,
              contractor: updatedFields.contractor || item.formValues?.contractor,
              productType: updatedFields.productType || item.formValues?.productType,
              quantity: newQty,
              difficulty: updatedFields.difficulty || item.formValues?.difficulty,
              fabric: updatedFields.fabric || item.formValues?.fabric,
            },
            calculation: {
              ...item.calculation,
              total: newTotal,
              unit: newUnit,
              productionDays: updatedFields.productionDays || item.calculation?.productionDays || 5,
            },
          };
        }
        return item;
      })
    );
  };

  // ==========================================================================
  // 9. ОСНОВНОЙ РЕНДЕР ПРИЛОЖЕНИЯ
  // ==========================================================================
  if (!currentUser) {
    return <LoginPage onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="app-shell">
      {/* 1. Шапка интерфейса: авторизация, статус цеха, доступ к модулям */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenTechModal={() => setIsTechModalOpen(true)}
        onOpenAdminUsersModal={() => {
          setAdminModalTab("users");
          setIsAdminUsersModalOpen(true);
        }}
      />

      {/* 2. Рабочее пространство калькулятора (2 колонки) */}
      <main className="dashboard">
        <div className="left-column">
          {/* Модуль 2: Параметры изделия и подрядчик */}
          <ProductInfoCard
            contractor={contractor}
            setContractor={setContractor}
            contractorsList={contractors}
            productType={productType}
            setProductType={setProductType}
            quantity={quantity}
            setQuantity={setQuantity}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            brandingType={brandingType}
            setBrandingType={setBrandingType}
            extras={extras}
            toggleExtra={toggleExtra}
            onProductTypeSelect={handleProductTypeSelect}
          />

          {/* Модуль 3: Параметры раскроя и ткани */}
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
            partsCount={partsCount}
            setPartsCount={setPartsCount}
            fabricsList={fabrics}
            onNumberChange={handleNumberChange}
          />
        </div>

        {/* Модуль 4: Сводная смета себестоимости и сроки */}
        <ResultsCard
          calculation={calculation}
          quantity={quantity}
          onOpenKP={() => setIsKPModalOpen(true)}
          onSaveToHistory={handleSaveToHistory}
        />
      </main>

      {/* 3. Подвал приложения с регламентом безопасности */}
      <Footer currentRole={currentUser.role} />

      {/* 4. Модальное окно Коммерческого предложения (Модуль 5) */}
      <KPModal
        isOpen={isKPModalOpen}
        onClose={() => setIsKPModalOpen(false)}
        calculation={calculation}
        formValues={currentFormValues}
        contractorInfo={contractorInfo}
        calculationId={currentCalcId}
      />

      {/* 5. Модальное окно Справочников технолога (Модуль 6) */}
      <AdminTechModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
        techSettings={techSettings}
        setTechSettings={setTechSettings}
        fabrics={fabrics}
        setFabrics={setFabrics}
      />

      {/* 6. Модальное окно Истории расчётов (Модуль 7) */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onLoadCalculation={handleLoadCalculation}
        currentUser={currentUser}
        onUpdateHistoryItem={handleUpdateHistoryItem}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        contractorsList={contractors}
      />

      {/* 7. Модальное окно Панели администратора: Пользователи и Подрядчики (Модуль 1) */}
      <AdminUsersModal
        isOpen={isAdminUsersModalOpen}
        onClose={() => setIsAdminUsersModalOpen(false)}
        currentUser={currentUser}
        contractorsList={contractors}
        onAddContractor={handleAddContractor}
        initialTab={adminModalTab}
      />
    </div>
  );
}
