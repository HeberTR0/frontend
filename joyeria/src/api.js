const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const fetchWithAuth = async (url, options = {}) => {
    const headers = {
        ...getAuthHeaders(),
        ...options.headers, 
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
    }

    return response;
};

export default fetchWithAuth;