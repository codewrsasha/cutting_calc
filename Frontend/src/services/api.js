/**
 * @file api.js
 * @description HTTP-клиент для взаимодействия с REST API производственного цеха
 * Адрес сервера: http://localhost:3001/api (г. Сургут, ул. Комплектовочная, 5)
 */

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

/**
 * Базовый метод отправки JSON-запросов к бэкенду
 * @param {string} endpoint Путь API (например, "/auth/login")
 * @param {RequestInit} [options={}] Параметры fetch
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка сервера (HTTP ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API Client] Запрос к ${endpoint} завершился ошибкой:`, error.message);
    throw error;
  }
}

export const api = {
  // ==========================================================================
  // 1. МОНИТОРИНГ И HEALTHCHECK
  // ==========================================================================
  async checkHealth() {
    return request("/health");
  },

  // ==========================================================================
  // 2. АВТОРИЗАЦИЯ И ПОЛЬЗОВАТЕЛИ (Модуль 1 ТЗ)
  // ==========================================================================
  async login(login, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    });
  },

  async getUsers() {
    return request("/auth/users");
  },

  async createUser(userData) {
    return request("/auth/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async updateUser(id, data) {
    return request(`/auth/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteUser(id) {
    return request(`/auth/users/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================================================
  // 3. НОРМАТИВЫ ТЕХНОЛОГА (Модуль 6 ТЗ)
  // ==========================================================================
  async getTechSettings() {
    return request("/tech-settings");
  },

  async updateTechSettings(settings) {
    return request("/tech-settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  async resetTechSettings() {
    return request("/tech-settings/reset", {
      method: "POST",
    });
  },

  // ==========================================================================
  // 4. СПРАВОЧНИК ТКАНЕЙ (Модуль 6 ТЗ)
  // ==========================================================================
  async getFabrics() {
    return request("/fabrics");
  },

  async addFabric(fabric) {
    return request("/fabrics", {
      method: "POST",
      body: JSON.stringify(fabric),
    });
  },

  async deleteFabric(id) {
    return request(`/fabrics/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================================================
  // 5. РЕЕСТР ПОДРЯДЧИКОВ (Модуль 1 ТЗ)
  // ==========================================================================
  async getContractors(query = "") {
    const q = query ? `?q=${encodeURIComponent(query)}` : "";
    return request(`/contractors${q}`);
  },

  async addContractor(contractor) {
    return request("/contractors", {
      method: "POST",
      body: JSON.stringify(contractor),
    });
  },

  // ==========================================================================
  // 6. РАСЧЁТЫ И ИСТОРИЯ СМЕТ (Модули 4 и 7 ТЗ)
  // ==========================================================================
  async previewCalculation(params) {
    return request("/calculations/preview", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async saveCalculation(payload) {
    return request("/calculations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getCalculations(query = "") {
    const q = query ? `?q=${encodeURIComponent(query)}` : "";
    return request(`/calculations${q}`);
  },

  async updateCalculation(id, data) {
    return request(`/calculations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteCalculation(id) {
    return request(`/calculations/${id}`, {
      method: "DELETE",
    });
  },

  async clearCalculations() {
    return request("/calculations", {
      method: "DELETE",
    });
  },

  // ==========================================================================
  // 7. КОММЕРЧЕСКИЕ ПРЕДЛОЖЕНИЯ (Модуль 5 ТЗ)
  // ==========================================================================
  async createProposal(calculationId, recipientEmail = "") {
    return request("/proposals", {
      method: "POST",
      body: JSON.stringify({ calculationId, recipientEmail }),
    });
  },

  async sendProposalEmail(proposalId, email) {
    return request(`/proposals/${proposalId}/send-email`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async getProposalStatus(id) {
    return request(`/proposals/${id}/status`);
  },

  getProposalPublicUrl(token) {
    return `${API_BASE}/proposals/public/${token}`;
  },
};
