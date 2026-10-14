/**
 * Centralized API Client for Spring Boot Backend
 */

const rawEnvUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').trim().replace(/\/+$/, '');
export const API_HOST = rawEnvUrl.endsWith('/api') ? rawEnvUrl.slice(0, -4) : rawEnvUrl;
export const API_BASE_URL = `${API_HOST}/api`;

const TOKEN_KEY = 'smartlocker_jwt';
const USER_KEY = 'smartlocker_user';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token, user) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: () => {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

function resolveEndpointUrl(endpoint) {
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (clean.startsWith('/api/') || clean === '/api') {
    return `${API_HOST}${clean}`;
  }
  return `${API_BASE_URL}${clean}`;
}

async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = resolveEndpointUrl(cleanEndpoint);
  const headers = { ...options.headers };
  const token = tokenStorage.get();

  // Public authentication endpoints must not send a stale or invalid JWT token
  const isAuthPublic = cleanEndpoint.includes('/auth/register') || cleanEndpoint.includes('/auth/login');
  if (token && !isAuthPublic) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type if uploading FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401 && !isAuthPublic) {
    tokenStorage.clear();
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  if (response.status === 204) {
    return { success: true };
  }

  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || (data && data.error) || data || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.details = data && data.details;
    throw err;
  }

  return data;
}

export const api = {
  auth: {
    register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    me: () => request('/api/auth/me')
  },
  users: {
    getProfile: () => request('/api/users/me'),
    updateProfile: (payload) => request('/api/users/me', { method: 'PUT', body: JSON.stringify(payload) }),
    changePassword: (payload) => request('/api/users/change-password', { method: 'PUT', body: JSON.stringify(payload) })
  },
  documents: {
    list: ({ page = 1, limit = 10, search = '', category = '' } = {}) => {
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      return request(`/api/documents?${params.toString()}`);
    },
    upload: (formData) => request('/api/documents', { method: 'POST', body: formData }),
    get: (id) => request(`/api/documents/${id}`),
    update: (id, payload) => request(`/api/documents/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    download: async (id) => {
      const url = `${API_BASE_URL}/documents/${id}/download`;
      const token = tokenStorage.get();
      const response = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenStorage.clear();
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        throw new Error('Download failed');
      }

      const disposition = response.headers.get('content-disposition');
      let filename = `document_${id}`;
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1].replace(/["']/g, '');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      return { filename, size: blob.size };
    },
    delete: (id) => request(`/api/documents/${id}`, { method: 'DELETE' })
  },
  health: () => request('/api/health')
};
