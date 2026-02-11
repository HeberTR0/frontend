import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetchWithAuth from "../api";


const RecepcionOrden = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [recepcion, setRecepcion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const r = await fetchWithAuth(`/api/ordenes/${id}`);
                if (!r.ok) {
                    setMensaje({ type: "error", text: "No se pudo cargar la orden." });
                    return;
                }

                const data = await r.json();
                setOrder(data);

                const items = data?.detalles ?? data?.items ?? [];
                setRecepcion(items.map(() => 0));
            } catch (err) {
                console.error(err);
                setMensaje({ type: "error", text: "Error de red al cargar la orden." });
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id]);

    const handleRecepcionChange = (index, value) => {
        setRecepcion((prev) => {
            const next = [...prev];
            next[index] = Number(value) || 0;
            return next;
        });
    };

    const confirmarRecepcion = async () => {
        if (!order) return;

        const detalles = order.detalles ?? order.items ?? [];

        const items = detalles
            .map((d, idx) => ({
                productoId: d.producto?.id ?? d.productoId,
                cantidadRecibida: recepcion[idx],
            }))
            .filter((i) => i.cantidadRecibida > 0);

        if (items.length === 0) {
            setMensaje({ type: "error", text: "Ingrese al menos una cantidad recibida." });
            return;
        }

        try {
            const res = await fetchWithAuth("/api/ordenes/recepcion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ordenId: order.id, items }),
            });

            if (res.ok) {
                setMensaje({
                    type: "success",
                    text: "Recepción realizada correctamente. Volviendo a la lista...",
                });
                setTimeout(() => navigate("/ordenes/lista"), 2000);
            } else {
                const t = await res.text();
                setMensaje({ type: "error", text: t || "Error al registrar recepción" });
            }
        } catch {
            setMensaje({ type: "error", text: "Error de red al registrar recepción." });
        }
    };

    if (loading) return <div>Cargando orden...</div>;
    if (!order) return <div>Error al cargar la orden.</div>;

    const itemsParaMostrar = order.detalles ?? order.items ?? [];

    return (
        <div className="card" style={{ padding: 20 }}>
            <h2>Recepción de Orden #{order.id}</h2>

            <div style={{ marginBottom: 12 }}>
                <strong>Proveedor:</strong> {order.proveedor?.nombre ?? ""}
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad ordenada</th>
                        <th>Cantidad recibida</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itemsParaMostrar.map((d, idx) => (
                        <tr key={idx}>
                            <td>{d.producto?.nombre ?? "Producto"}</td>
                            <td style={{ textAlign: "center" }}>{d.cantidad}</td>
                            <td style={{ textAlign: "center" }}>
                                <input
                                    type="number"
                                    min={0}
                                    value={recepcion[idx]}
                                    onChange={(e) => handleRecepcionChange(idx, e.target.value)}
                                    style={{ width: 90 }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button onClick={confirmarRecepcion} style={{ marginTop: 12 }}>
                Confirmar Recepción
            </button>

            {mensaje && (
                <div style={{ marginTop: 10, color: mensaje.type === "success" ? "green" : "red" }}>
                    {mensaje.text}
                </div>
            )}
        </div>
    );
};

export default RecepcionOrden;
