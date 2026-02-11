import React, { useEffect, useState } from "react";
import fetchWithAuth from "../api";

const ResumenVentas = () => {
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarResumen();
    }, []);

    const cargarResumen = async () => {
        try {
            const res = await fetchWithAuth("/api/ventas/resumen-mensual");
            if (res.ok) {
                const data = await res.json();
                setResumen(data);
            }
        } catch (error) {
            console.error("Error al cargar resumen:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card" style={{ padding: 20 }}>
                <h2>Resumen de Ventas - Mes Actual</h2>
                <p>Cargando...</p>
            </div>
        );
    }

    if (!resumen) {
        return (
            <div className="card" style={{ padding: 20 }}>
                <h2>Resumen de Ventas - Mes Actual</h2>
                <p>No se pudo cargar el resumen</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Resumen de Ventas - Mes Actual</h2>

            {/* Resumen General */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "24px"
            }}>
                <div style={{
                    background: "#e3f2fd",
                    border: "1px solid #90caf9",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
                        Total de Ventas
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#1976d2" }}>
                        S/ {Number(resumen.totalVentasMes).toFixed(2)}
                    </div>
                </div>

                <div style={{
                    background: "#fff3e0",
                    border: "1px solid #ffb74d",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
                        Total de Costos
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#f57c00" }}>
                        S/ {Number(resumen.totalCostosMes).toFixed(2)}
                    </div>
                </div>

                <div style={{
                    background: "#e8f5e9",
                    border: "1px solid #81c784",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
                        Ganancia Neta
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#2e7d32" }}>
                        S/ {Number(resumen.gananciaBruta).toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Tablas */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Productos Más Rentables */}
                <div>
                    <h3 style={{ marginBottom: "12px" }}>Productos Más Rentables</h3>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cant. Vendida</th>
                            <th>Ganancia</th>
                        </tr>
                        </thead>
                        <tbody>
                        {resumen.productosRentables && resumen.productosRentables.length > 0 ? (
                            resumen.productosRentables.map((prod, idx) => (
                                <tr key={idx}>
                                    <td>{prod.nombreProducto}</td>
                                    <td style={{ textAlign: "center" }}>{prod.cantidadVendida}</td>
                                    <td style={{ textAlign: "right" }}>
                                        S/ {Number(prod.gananciaTotal).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center" }}>
                                    Sin datos
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Productos Más Vendidos */}
                <div>
                    <h3 style={{ marginBottom: "12px" }}>Productos Más Vendidos</h3>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Total Ventas</th>
                        </tr>
                        </thead>
                        <tbody>
                        {resumen.productosVendidos && resumen.productosVendidos.length > 0 ? (
                            resumen.productosVendidos.map((prod, idx) => (
                                <tr key={idx}>
                                    <td>{prod.nombreProducto}</td>
                                    <td style={{ textAlign: "center" }}>{prod.cantidadVendida}</td>
                                    <td style={{ textAlign: "right" }}>
                                        S/ {Number(prod.totalVentas).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center" }}>
                                    Sin datos
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResumenVentas;