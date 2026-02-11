import React, { useEffect, useMemo, useState } from "react";
import fetchWithAuth from "../api";

const VentaPanel = () => {
    const [productos, setProductos] = useState([]);
    const [items, setItems] = useState([{ productoId: "", cantidad: 1 }]);
    const [docTipo, setDocTipo] = useState("BOLETA");
    const [pagoTipo, setPagoTipo] = useState("EFECTIVO");
    const [ruc, setRuc] = useState("");
    const [efectivoRecibido, setEfectivoRecibido] = useState(0);
    const [exacto, setExacto] = useState(false);
    //ventasGuardadas
    const [, setVentasGuardadas] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        fetchWithAuth("/api/productos")
            .then((r) => r.json())
            .then((data) => setProductos(data))
            .catch(() => {});
    }, []);

    const agregarProducto = () => {
        setItems((it) => [...it, { productoId: "", cantidad: 1 }]);
    };

    const actualizarItem = (idx, key, value) => {
        const next = [...items];
        next[idx][key] = value;
        setItems(next);
    };

    const eliminarItem = (idx) => {
        const next = [...items];
        next.splice(idx, 1);
        setItems(next);
    };

    const calcularSubtotal = useMemo(() => {
        let sum = 0;
        items.forEach((it) => {
            const p = productos.find(
                (pp) => String(pp.id) === String(it.productoId)
            );
            const precio = p?.precioUnitario ?? 0;
            const cantidad = Number(it.cantidad) || 0;
            sum += precio * cantidad;
        });
        return sum;
    }, [items, productos]);

    const IGV = calcularSubtotal * 0.18;
    const totalVenta = calcularSubtotal + IGV;

    const registrarVenta = async () => {
        const itemsPayload = items
            .filter(
                (it) =>
                    it.productoId &&
                    Number(it.productoId) &&
                    Number(it.cantidad) > 0
            )
            .map((it) => ({
                productoId: Number(it.productoId),
                cantidad: Number(it.cantidad),
            }));

        if (itemsPayload.length === 0) {
            setMensaje({
                type: "error",
                text: "Debe agregar al menos un producto",
            });
            return;
        }

        // Validar RUC si es factura
        if (docTipo === "FACTURA" && (!ruc || ruc.trim() === "")) {
            setMensaje({
                type: "error",
                text: "Debe ingresar un RUC para factura",
            });
            return;
        }

        const payload = {
            numeroVenta: docTipo === "FACTURA" ? ruc : "",
            tipoDocumento: docTipo,
            tipoPago: pagoTipo,
            efectivoRecibido: Number(efectivoRecibido) || 0,
            exacto,
            descuentoIGV: 0,
            items: itemsPayload,
        };

        try {
            const res = await fetchWithAuth("/api/ventas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                setVentasGuardadas(data);
                setMensaje({
                    type: "success",
                    text: "Venta realizada con éxito",
                });

                setItems([{ productoId: "", cantidad: 1 }]);
                setDocTipo("BOLETA");
                setPagoTipo("EFECTIVO");
                setRuc("");
                setEfectivoRecibido(0);
                setExacto(false);
            } else {
                setMensaje({
                    type: "error",
                    text: "Error al registrar la venta",
                });
            }
        } catch (e) {
            setMensaje({
                type: "error",
                text: "Error de red al registrar la venta",
            });
        }
    };

    return (
        <div className="card" style={{ padding: 20, display: "flex", gap: 20 }}>
            {/* PANEL IZQUIERDO */}
            <div style={{ flex: 2 }}>
                <h2 style={{ marginTop: 0, color: "black" }}>
                    Registrar Venta
                </h2>

                <div style={{ width: "100%", overflowX: "auto" }}>
                    <table className="data-table" style={{ width: "100%" }}>
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Código</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Subtotal</th>
                            <th>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((it, idx) => {
                            const prod = productos.find(
                                (p) => String(p.id) === String(it.productoId)
                            );
                            const price = prod?.precioUnitario ?? 0;
                            const lineTotal = price * Number(it.cantidad || 0);

                            return (
                                <tr key={idx}>
                                    <td>
                                        <select
                                            value={it.productoId}
                                            onChange={(e) =>
                                                actualizarItem(
                                                    idx,
                                                    "productoId",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: "100%" }}
                                        >
                                            <option value="">Producto</option>
                                            {productos.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>{it.productoId || ""}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min={1}
                                            value={it.cantidad}
                                            onChange={(e) =>
                                                actualizarItem(
                                                    idx,
                                                    "cantidad",
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: "100%" }}
                                        />
                                    </td>
                                    <td>{price.toFixed(2)}</td>
                                    <td>{lineTotal.toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => eliminarItem(idx)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <button
                    type="button"
                    onClick={agregarProducto}
                    style={{ marginTop: 10 }}
                >
                    Agregar producto
                </button>

                <div style={{ marginTop: 12 }}>
                    <strong>Total Venta:</strong>{" "}
                    {totalVenta.toFixed(2)}
                </div>
            </div>

            {/* PANEL DERECHO */}
            <div style={{ flex: 1, minWidth: 320 }}>
                <h3 style={{ color: "black" }}>Datos de venta</h3>

                <label>Tipo de documento</label>
                <select
                    value={docTipo}
                    onChange={(e) => {
                        setDocTipo(e.target.value);
                        if (e.target.value === "BOLETA") {
                            setRuc("");
                        }
                    }}
                    style={{ width: "100%", marginBottom: 8 }}
                >
                    <option value="BOLETA">Boleta</option>
                    <option value="FACTURA">Factura</option>
                </select>

                <label>R.U.C.</label>
                <input
                    type="text"
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value)}
                    disabled={docTipo === "BOLETA"}
                    placeholder={docTipo === "FACTURA" ? "Ingrese RUC" : "Solo para facturas"}
                    style={{
                        width: "100%",
                        marginBottom: 8,
                        backgroundColor: docTipo === "BOLETA" ? "#f3f4f6" : "#fff",
                        cursor: docTipo === "BOLETA" ? "not-allowed" : "text"
                    }}
                />

                <label>Tipo de pago</label>
                <select
                    value={pagoTipo}
                    onChange={(e) => setPagoTipo(e.target.value)}
                    style={{ width: "100%", marginBottom: 8 }}
                >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TARJETA">Tarjeta</option>
                </select>

                <label>Efectivo recibido</label>
                <input
                    type="number"
                    step="0.01"
                    value={efectivoRecibido}
                    onChange={(e) =>
                        setEfectivoRecibido(parseFloat(e.target.value) || 0)
                    }
                    style={{ width: "100%", marginBottom: 8 }}
                />

                <label>
                    <input
                        type="checkbox"
                        checked={exacto}
                        onChange={(e) => setExacto(e.target.checked)}
                    />{" "}
                    Efectivo exacto
                </label>

                <div style={{ marginTop: 12 }}>
                    <strong>Subtotal:</strong>{" "}
                    {calcularSubtotal.toFixed(2)}
                </div>
                <div>
                    <strong>IGV 18%:</strong> {IGV.toFixed(2)}
                </div>
                <div>
                    <strong>Total a pagar:</strong>{" "}
                    {totalVenta.toFixed(2)}
                </div>

                <button
                    onClick={registrarVenta}
                    style={{ marginTop: 12, width: "100%" }}
                >
                    Realizar venta
                </button>

                {mensaje && (
                    <div
                        style={{
                            marginTop: 10,
                            color:
                                mensaje.type === "success"
                                    ? "green"
                                    : "red",
                        }}
                    >
                        {mensaje.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VentaPanel;