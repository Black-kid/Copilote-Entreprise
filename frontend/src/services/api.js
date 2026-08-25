// CoPilote Entreprise API Client

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('copilote_token') || localStorage.getItem('opsflow_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('copilote_token', token);
    } else {
      localStorage.removeItem('copilote_token');
      localStorage.removeItem('opsflow_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('copilote_token') || localStorage.getItem('opsflow_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.getToken() ? { Authorization: `Bearer ${this.getToken()}` } : {}),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // If unauthorized token, handle logout if necessary
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          this.setToken(null);
        }
        throw new Error(data.message || 'Une erreur est survenue.');
      }

      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async register(userData) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res.data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Requests endpoints
  async getRequests(params = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return this.request(`/requests${queryString ? `?${queryString}` : ''}`);
  }

  async getRequestById(id) {
    return this.request(`/requests/${id}`);
  }

  async createRequest(requestData) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  }

  async updateRequest(id, requestData) {
    return this.request(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData)
    });
  }

  async updateRequestStatus(id, { targetStatus, resolutionNotes, actualHours, assignedTo }) {
    return this.request(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ targetStatus, resolutionNotes, actualHours, assignedTo })
    });
  }

  async assignRequest(id, technicianId) {
    return this.request(`/requests/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ technicianId })
    });
  }

  async deleteRequest(id) {
    return this.request(`/requests/${id}`, {
      method: 'DELETE'
    });
  }

  async getComments(requestId) {
    return this.request(`/requests/${requestId}/comments`);
  }

  async addComment(requestId, { content, isInternal }) {
    return this.request(`/requests/${requestId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, isInternal })
    });
  }

  async getActivityHistory(requestId) {
    return this.request(`/requests/${requestId}/history`);
  }

  // Users endpoints
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getTechnicians() {
    return this.request('/users/technicians');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async toggleUserStatus(id) {
    return this.request(`/users/${id}/toggle-status`, {
      method: 'PATCH'
    });
  }

  // Notifications endpoints
  async getNotifications(unreadOnly = false) {
    return this.request(`/notifications${unreadOnly ? '?unreadOnly=true' : ''}`);
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH'
    });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE'
    });
  }
}

export const api = new ApiService();
