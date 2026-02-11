import React, { useEffect, useRef, useState } from "react";
import ThreeDJewelViewer from "./ThreeDJewelViewer";
import fetchWithAuth from "../api";


const MATERIAL_OPTS = [
    "Oro amarillo",
    "Oro blanco",
    "Oro rosado",
    "Plata",
    "Acero",
];

const PIEDRA_OPTS = [
    "Diamante",
    "Zafiro",
    "Rubí",
    "Esmeralda",
    "Perla",
];

const CALIDAD_OPTS = ["AAA", "AA", "A", ""];


const CotizacionEstimada = () => {
    const initialForm = {
        tipoProducto: "ANILLO",
        material: "",
        kilataje: 18,
        pesoEstimado: 1.0,
        tipoPiedra: "",
        quilataje: 0.0,
        calidadPiedra: "",
        costoManoObra: 0.0,
        precioEstimado: 0.0,
    };

    const [form, setForm] = useState({ ...initialForm });
    const [cotizaciones, setCotizaciones] = useState([]);
    const [mensaje, setMensaje] = useState(null);

    const [modal3DVisible, setModal3DVisible] = useState(false);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);

    const debounceRef = useRef(null);

    /* ===== Carga inicial ===== */
    useEffect(() => {
        fetchWithAuth("/api/cotizaciones")
            .then((r) => r.json())
            .then((data) => setCotizaciones(data))
            .catch(() => {});
    }, []);

    /* ===== Manejo de cambios ===== */
    const handleChange = (e) => {
        const { name, value } = e.target;

        const next = {
            ...form,
            [name]: ["kilataje", "quilataje"].includes(name)
                ? value === ""
                    ? ""
                    : Number(value)
                : value,
        };

        setForm(next);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => cotizar(next), 400);
    };

    /* ===== Cotizar ===== */
    const cotizar = async (payloadForm = form) => {

        try {
            const res = await fetchWithAuth("/api/cotizaciones/cotizar", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payloadForm),
            });

            if (!res.ok) throw new Error();
            const data = await res.json();
            setForm((f) => ({...f, precioEstimado: data.precioEstimado}));
        } catch {
            setMensaje({ type: "error", text: "Error al cotizar" });
        }
    };

    /* ===== Guardar ===== */
    const guardarCotizacion = async () => {

        try {
            const res = await fetchWithAuth("/api/cotizaciones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error();
            const nuevo = await res.json();
            setCotizaciones((c) => [...c, nuevo]);
            setForm({ ...initialForm });
            setMensaje({ type: "success", text: "Cotización guardada" });
        } catch {
            setMensaje({ type: "error", text: "Error al guardar cotización" });
        }
    };


    const borrarCotizacion = async (id) => {
        if (!window.confirm("¿Eliminar cotización?")) return;

        try {
            const res = await fetchWithAuth(`/api/cotizaciones/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setCotizaciones((c) => c.filter((x) => x.id !== id));
        } catch {
            setMensaje({ type: "error", text: "Error al eliminar" });
        }
    };

    /* ===== Modelo 3D ===== */
    const abrirModelo = (cot) => {
        setSelectedCotizacion(cot);
        setModal3DVisible(true);
    };

    const cerrarModelo = () => {
        setModal3DVisible(false);
        setSelectedCotizacion(null);
    };


    return (
        <div className="card" style={{ padding: 20, display: "flex", gap: 20 }}>
            {/* FORMULARIO */}
            <div style={{ flex: 2 }}>
                <h2 style={{ marginTop: 0 }}>Cotización Estimada</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <label>Tipo de producto</label>
                        <select name="tipoProducto" value={form.tipoProducto} onChange={handleChange} style={{ width: "100%" }}>
                            <option value="ANILLO">Anillo</option>
                            <option value="RELOJ">Reloj</option>
                        </select>
                    </div>
                    <div>
                        <label>Material</label>
                    <select name="material" value={form.material} onChange={handleChange}style={{ width: "100%" }}>
                        <option value="">Seleccionar material</option>
                        {MATERIAL_OPTS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                        <label>Kilataje</label>
                    <input type="number" name="kilataje" value={form.kilataje} onChange={handleChange} style={{ width: "100%" }}/>
                    </div>
                    <div>
                        <label>Peso estimado (g)</label>
                    <input type="number" step="0.01" name="pesoEstimado" value={form.pesoEstimado} onChange={handleChange} style={{ width: "100%" }}/>
                    </div>
                    <div>
                        <label>Tipo de piedra</label>
                    <select name="tipoPiedra" value={form.tipoPiedra} onChange={handleChange}style={{ width: "100%" }}>
                        <option value="">Seleccionar piedra</option>
                        {PIEDRA_OPTS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                        <label> quilataje</label>
                    <input type="number" step="0.01" name="quilataje" value={form.quilataje} onChange={handleChange}style={{ width: "100%" }} />
                    </div>
                    <div>
                        <label>Calidad piedra</label>
                    <select name="calidadPiedra" value={form.calidadPiedra} onChange={handleChange} style={{ width: "100%" }}>
                        <option value="">Seleccionar calidad</option>
                        {CALIDAD_OPTS.map((c) => (
                            <option key={c} value={c}>{c || "Sin definir"}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                        <label>Costo mano de obra</label>
                    <input type="number" step="0.01" name="costoManoObra" value={form.costoManoObra} onChange={handleChange} style={{ width: "100%" }}/>
                    </div>
                    <div>
                        <label>Precio estimado</label>
                    <input readOnly value={Number(form.precioEstimado).toFixed(2)} style={{ width: "100%", background: "#f3f4f6" }}/>
                    </div>
                </div>

                <div style={{ marginTop: 12 }}>
                    <button onClick={() => cotizar()}style={{ padding: "8px 12px", marginRight: 8 }}>Cotizar</button>
                    <button onClick={guardarCotizacion}style={{ padding: "8px 12px" }}>Guardar</button>
                </div>

                {mensaje && <div style={{ marginTop: 10,color: mensaje.type === "success" ? "green" : "red" }}>{mensaje.text}</div>}
            </div>

            {/* LISTADO */}
            <div style={{ flex: 1, minWidth: 420 }}>
                <h3>Cotizaciones registradas</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                {cotizaciones.map((c) => (
                    <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.tipoProducto}</td>
                        <td>{Number(c.precioEstimado).toFixed(2)}</td>
                        <td>{new Date(c.fecha).toLocaleDateString("es-PE")}</td>
                        <td>
                            <span style={{ display: "inline-flex", gap: 6 }}>
                        <button onClick={() => borrarCotizacion(c.id)}style={{ marginRight: 6 }}>Borrar</button>
                        <button onClick={() => abrirModelo(c)}>Generar Modelo</button>
                                </span>
                        </td>
                    </tr>
                ))}
                {cotizaciones.length === 0 && (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                            Sin cotizaciones
                        </td>
                    </tr>
                )}
                    </tbody>
                </table>

            </div>

            {/* MODAL 3D */}
            {modal3DVisible && selectedCotizacion && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <div style={{ width: "80%", height: "80%", background: "#fff", position: "relative" }}>
                        <button onClick={cerrarModelo} style={{ position: "absolute", top: 8, right: 8 }}>
                            Cerrar
                        </button>
                        <ThreeDJewelViewer cotizacion={selectedCotizacion} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CotizacionEstimada;
