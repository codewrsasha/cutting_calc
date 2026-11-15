const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

/**
 * Хэширует пароль с помощью bcrypt и криптографической соли
 * @param {string} password Открытый пароль
 * @returns {Promise<string>} 60-значный bcrypt-хэш
 */
async function hashPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Пароль должен быть непустой строкой");
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Синхронное хэширование пароля (для сидирования и миграций)
 * @param {string} password Открытый пароль
 * @returns {string} 60-значный bcrypt-хэш
 */
function hashPasswordSync(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Пароль должен быть непустой строкой");
  }
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
}

/**
 * Проверяет, является ли строка уже bcrypt-хэшем
 * @param {string} str 
 * @returns {boolean}
 */
function isBcryptHash(str) {
  if (!str || typeof str !== "string") return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str);
}

/**
 * Проверяет соответствие открытого пароля сохранённому хэшу
 * Поддерживает bcrypt-хэши, а также безопасную обратную совместимость с авто-определением
 * @param {string} password Введённый пользователем пароль
 * @param {string} storedHash Сохранённый в БД хэш
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  // Если это полноценный bcrypt хэш
  if (isBcryptHash(storedHash)) {
    try {
      return await bcrypt.compare(password, storedHash);
    } catch (err) {
      console.warn("[Password] Ошибка проверки bcrypt:", err.message);
      return false;
    }
  }

  // Обратная совместимость для устаревших незахэшированных паролей
  return storedHash === password;
}

module.exports = {
  hashPassword,
  hashPasswordSync,
  isBcryptHash,
  verifyPassword,
};
