import React, { useEffect, useState } from "react";
import fetchWithAuth from "../api";

const GananciasDia = () => {
    const [ganancias, setGanancias] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarGanancias();
        const interval = setInterval(cargarGanancias, 30000); // Actualizar cada 30 segundos
        return () => clearInterval(interval);
    }, []);

    const cargarGanancias = async () => {
        try {
            const res = await fetchWithAuth("/api/ventas/ganancias-dia");
            if (res.ok) {
                const data = await res.json();
                setGanancias(data.gananciasDia || 0);
            }
        } catch (error) {
            console.error("Error al cargar ganancias:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: "12px", textAlign: "center" }}>Cargando...</div>;

    const gananciaFormateada = Number(ganancias).toFixed(2);
    const esPositivo = Number(ganancias) >= 0;

    return (
        <div style={{
            background: esPositivo ? "#d4edda" : "#f8d7da",
            border: `1px solid ${esPositivo ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "8px",
            padding: "16px",
            margin: "12px 0",
            textAlign: "center"
        }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                Ganancias del Día
            </div>
            <div style={{
                fontSize: "28px",
                fontWeight: "700",
                color: esPositivo ? "#155724" : "#721c24"
            }}>
                S/ {gananciaFormateada}
            </div>
            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                Se reinicia a medianoche
            </div>
        </div>
    );
};

export default GananciasDia;