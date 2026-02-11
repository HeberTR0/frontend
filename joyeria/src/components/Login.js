import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../api";
const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetchWithAuth("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("nombre", data.nombre);
                localStorage.setItem("rol", data.rol);
                onLogin(data);
                navigate("/");
            } else {
                const errorText = await res.text();
                setError(errorText || "Credenciales incorrectas");
            }
        } catch (err) {
            setError("Error de conexión. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}>
            <div style={{
                background: "#fff",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                width: "100%",
                maxWidth: "400px"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
                    Joyería Santillán
                </h2>
                <h3 style={{ textAlign: "center", marginBottom: "30px", color: "#666", fontWeight: 400 }}>
                    Iniciar Sesión
                </h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: 500 }}>
                            Usuario
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                fontSize: "14px"
                            }}
                            placeholder="Ingrese su usuario"
                        />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "#555", fontWeight: 500 }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                fontSize: "14px"
                            }}
                            placeholder="Ingrese su contraseña"
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: "#fee",
                            color: "#c33",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "20px",
                            textAlign: "center",
                            fontSize: "14px"
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: loading ? "#999" : "#667eea",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background 0.3s"
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.background = "#5568d3")}
                        onMouseOut={(e) => !loading && (e.target.style.background = "#667eea")}
                    >
                        {loading ? "Iniciando sesión..." : "Ingresar"}
                    </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", color: "#888", fontSize: "13px" }}>
                    <p>Credenciales de prueba:</p>
                    <p><strong>Admin:</strong> admin / admin123</p>
                    <p><strong>Empleado:</strong> empleado / empleado123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;