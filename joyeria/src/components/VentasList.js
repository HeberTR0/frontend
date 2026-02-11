import React, { useEffect, useState } from "react";

import fetchWithAuth from "../api";
const VentasList = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithAuth("/api/ventas")
            .then(r => r.json())
            .then(data => {
                setVentas(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Cargando ventas...</div>;
    }

    return (
        <div className="card" style={{ padding: 20 }}>
            <h2 className="section-title" style={{ marginTop: 0 }}>
                Ventas Realizadas
            </h2>

            <table className="data-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>N° Venta</th>
                    <th>Documento</th>
                    <th>Pago</th>
                    <th>Total</th>
                </tr>
                </thead>

                <tbody>
                {ventas.map(v => (
                    <tr key={v.id}>
                        <td>{v.id}</td>
                        <td>
                            {v.fechaVenta
                                ? new Date(v.fechaVenta).toLocaleString()
                                : ""}
                        </td>
                        <td>{v.numeroVenta}</td>
                        <td>{v.tipoDocumento}</td>
                        <td>{v.tipoPago}</td>
                        <td>
                            {v.total != null && typeof v.total.toFixed === "function"
                                ? v.total.toFixed(2)
                                : v.total}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VentasList;
