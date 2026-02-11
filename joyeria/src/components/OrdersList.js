import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchWithAuth from "../api";
const OrdersList = () => {
    const [statusFilter, setStatusFilter] = useState("PENDIENTE");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                //
                const url =
                    statusFilter === "PENDIENTE"
                        ? "/api/ordenes?estado=PENDIENTE"
                        : "/api/ordenes";

                const res = await fetchWithAuth(url);

                if (res.ok) {
                    const data = await res.json();

                    //
                    setOrders(Array.isArray(data) ? data : []);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error al cargar órdenes:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [statusFilter]);

    if (loading) {
        return <div>Cargando órdenes...</div>;
    }

    return (
        <div
            className="card"
            style={{
                padding: 20,
                border: "1px solid #ddd",
                borderRadius: 6,
            }}
        >
            {/* HEADER */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h2 style={{ margin: 0 }}>Listar Órdenes de Compra</h2>

                <span
                    style={{
                        marginLeft: 8,
                        padding: "4px 8px",
                        borderRadius: 6,
                        background:
                            statusFilter === "PENDIENTE" ? "#f8d7da" : "#d4edda",
                        color:
                            statusFilter === "PENDIENTE" ? "#721c24" : "#155724",
                        fontWeight: 600,
                        fontSize: 12,
                    }}
                >
          {statusFilter === "PENDIENTE"
              ? "Pendientes"
              : "Recibidas"}
        </span>

                <div style={{ marginLeft: "auto" }}>
                    <label style={{ marginRight: 6 }}>Estado:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="RECIBIDA">Recibido</option>
                    </select>
                </div>
            </div>

            {/* TABLA */}
            <div style={{ marginTop: 12, overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                    <tr>
                        <th style={{ padding: 8 }}>Fecha</th>
                        <th style={{ padding: 8 }}>ID Orden</th>
                        <th style={{ padding: 8 }}>Proveedor</th>
                        <th style={{ padding: 8 }}>Estado</th>
                        <th style={{ padding: 8 }}>Acciones</th>
                    </tr>
                    </thead>

                    <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                style={{
                                    padding: 16,
                                    textAlign: "center",
                                    fontStyle: "italic",
                                    color: "#666",
                                }}
                            >
                                {statusFilter === "PENDIENTE"
                                    ? "No hay órdenes pendientes"
                                    : "No hay órdenes recibidas"}
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td style={{ padding: 8 }}>
                                    {order.fechaCreacion
                                        ? new Date(
                                            order.fechaCreacion
                                        ).toLocaleDateString()
                                        : ""}
                                </td>

                                <td style={{ padding: 8 }}>{order.id}</td>

                                <td style={{ padding: 8 }}>
                                    {order.proveedor?.nombre ?? ""}
                                </td>

                                <td style={{ padding: 8 }}>{order.estado}</td>

                                <td style={{ padding: 8 }}>
                                    {order.estado === "PENDIENTE" ? (
                                        <Link
                                            to={`/ordenes/${order.id}/recepcion`}
                                            style={{
                                                padding: "6px 12px",
                                                display: "inline-block",
                                                background: "#007bff",
                                                color: "white",
                                                borderRadius: 5,
                                                textDecoration: "none",
                                            }}
                                        >
                                            Recepción
                                        </Link>
                                    ) : (
                                        <span
                                            style={{
                                                color: "#28a745",
                                                fontWeight: 600,
                                            }}
                                        >
                        Recibido
                      </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersList;
