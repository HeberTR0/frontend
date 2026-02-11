import React, { useEffect, useMemo, useState } from "react";
import fetchWithAuth from "../api";
const OrdersForm = () => {
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [providerId, setProviderId] = useState("");
    const [items, setItems] = useState([{ productoId: "", cantidad: 1 }]);
    const [orderId, setOrderId] = useState(null);
    const [fechaActual, setFechaActual] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetchWithAuth("/api/proveedores")
            .then((r) => r.json())
            .then(setProveedores)
            .catch(() => {});

        fetchWithAuth("/api/productos")
            .then((r) => r.json())
            .then(setProductos)
            .catch(() => {});
    }, []);

    const addItem = () => {
        setItems([...items, { productoId: "", cantidad: 1 }]);
    };

    const updateItem = (index, key, value) => {
        const next = [...items];
        next[index][key] = value;
        setItems(next);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const computedTotal = useMemo(() => {
        return items.reduce((total, it) => {
            const prod = productos.find((p) => String(p.id) === String(it.productoId));
            const price = prod?.precioUnitario ?? 0;
            return total + price * (Number(it.cantidad) || 0);
        }, 0);
    }, [items, productos]);

    const submit = async (e) => {
        e.preventDefault();

        const payloadItems = items
            .filter((it) => it.productoId && Number(it.cantidad) > 0)
            .map((it) => ({
                productoId: Number(it.productoId),
                cantidad: Number(it.cantidad),
            }));

        if (!providerId || payloadItems.length === 0) {
            setStatus({
                type: "error",
                text: "Debe seleccionar un proveedor y al menos un producto",
            });
            return;
        }

        const payload = {
            proveedorId: Number(providerId),
            fecha: new Date().toISOString(),
            items: payloadItems,
        };

        try {
            const res = await fetchWithAuth("/api/ordenes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const created = await res.json();
                setOrderId(created?.id ?? created?.ordenId ?? null);
                setFechaActual(
                    created?.fecha
                        ? new Date(created.fecha).toLocaleDateString()
                        : new Date().toLocaleDateString()
                );

                setStatus({ type: "success", text: "Orden registrada correctamente" });
                setProviderId("");
                setItems([{ productoId: "", cantidad: 1 }]);
            } else {
                setStatus({ type: "error", text: "Error al registrar la orden" });
            }
        } catch {
            setStatus({ type: "error", text: "Error de red al registrar la orden" });
        }
    };

    return (
        <div className="card" style={{ padding: 20 }}>
            <form onSubmit={submit}>
                <h2 style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    Registrar Orden de Compra
                    <span style={{ fontSize: 14, color: "#555" }}>
            Fecha: {fechaActual ?? new Date().toLocaleDateString()}
          </span>
                    <span
                        style={{
                            marginLeft: "auto",
                            fontWeight: 600,
                            background: "#e5e7eb",
                            padding: "4px 8px",
                            borderRadius: 6,
                        }}
                    >
            Nº: {orderId ?? "Pendiente"}
          </span>
                </h2>

                <div style={{ marginTop: 12 }}>
                    <label>Proveedor</label>
                    <select
                        value={providerId}
                        onChange={(e) => setProviderId(e.target.value)}
                        style={{ width: "100%" }}
                    >
                        <option value="">Seleccione proveedor</option>
                        {proveedores.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} - {p.ruc}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginTop: 16, overflowX: "auto" }}>
                    <table style={{ width: "100%" }}>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((it, idx) => {
                            const prod = productos.find((p) => String(p.id) === String(it.productoId));
                            const price = prod?.precioUnitario ?? 0;

                            return (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <select
                                            value={it.productoId}
                                            onChange={(e) => updateItem(idx, "productoId", e.target.value)}
                                        >
                                            <option value="">Producto</option>
                                            {productos.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min={1}
                                            value={it.cantidad}
                                            onChange={(e) => updateItem(idx, "cantidad", e.target.value)}
                                        />
                                    </td>
                                    <td>{price}</td>
                                    <td>{(price * it.cantidad).toFixed(2)}</td>
                                    <td>
                                        <button type="button" onClick={() => removeItem(idx)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <button type="button" onClick={addItem} style={{ marginTop: 10 }}>
                    Agregar producto
                </button>

                <div style={{ marginTop: 12 }}>
                    <strong>Total:</strong> {computedTotal.toFixed(2)}
                </div>

                <button type="submit" style={{ marginTop: 12 }}>
                    Registrar Orden
                </button>

                {status && (
                    <div style={{ marginTop: 10, color: status.type === "success" ? "green" : "red" }}>
                        {status.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default OrdersForm;
