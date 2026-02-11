const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const fetchWithAuth = async (url, options = {}) => {
    const fullUrl = `${API_BASE_URL}${url}`;
    const headers = {
        ...getAuthHeaders(),
        ...options.headers,
    };

    const response = await fetch(fullUrl, { ...options, headers });

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
    }

    return response;
};

export default fetchWithAuth;