import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../api";
const ProvidersForm = () => {
    const [provider, setProvider] = useState({
        nombre: "",
        ruc: "",
        telefono: "",
        direccion: "",
        email: "",
    });

    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProvider((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetchWithAuth("/api/proveedores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(provider),
            });

            if (res.ok) {
                setStatus({
                    type: "success",
                    text: "Proveedor registrado correctamente. Regresando a la lista...",
                });
                setProvider({
                    nombre: "",
                    ruc: "",
                    telefono: "",
                    direccion: "",
                    email: "",
                });
                setTimeout(() => navigate("/proveedores"), 2000);
            } else {
                const msg = await res.text().catch(() => "Error al registrar proveedor");
                setStatus({ type: "error", text: msg });
            }
        } catch (err) {
            setStatus({ type: "error", text: "Error de red al registrar proveedor" });
        }
    };

    return (
        <div className="card" style={{ maxWidth: 600, padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Registrar Proveedor</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 8 }}>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={provider.nombre}
                        onChange={handleChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>RUC</label>
                    <input
                        type="text"
                        name="ruc"
                        value={provider.ruc}
                        onChange={handleChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={provider.telefono}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>Dirección</label>
                    <input
                        type="text"
                        name="direccion"
                        value={provider.direccion}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={provider.email}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                </div>

                <button type="submit" className="btn-primary">
                    Guardar Proveedor
                </button>

                {status && (
                    <div
                        style={{
                            marginTop: 10,
                            color: status.type === "success" ? "green" : "red",
                        }}
                    >
                        {status.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProvidersForm;
