import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchWithAuth from "../api";
const InventarioCRUD = () => {
    const [productos, setProductos] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        nombre: "",
        precioUnitario: ""
    });

    const [status, setStatus] = useState(null);

    useEffect(() => {
        loadPage(page);
    }, [page]);

    const loadPage = (p) => {
        setLoading(true);
        fetchWithAuth(`/api/productos?page=${p}&size=${size}`)
            .then((r) => r.json())
            .then((data) => {
                let content = [];
                let totalElements = 0;

                if (Array.isArray(data)) {
                    content = data;
                    totalElements = data.length;
                } else if (data?.content) {
                    content = data.content;
                    totalElements = data.totalElements ?? 0;
                }

                setProductos(content.slice(0, size));
                setTotal(totalElements);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Suspender producto seleccionado?")) return;

        try {
            const res = await fetchWithAuth(`/api/productos/${id}`, { method: "DELETE" });
            if (res.ok) {
                setStatus({ type: "success", text: "Producto eliminado" });
                loadPage(page);
            } else {
                setStatus({
                    type: "error",
                    text: `Error al suspender (status: ${res.status})`
                });
            }
        } catch {
            setStatus({ type: "error", text: "Error de red al eliminar" });
        }

        setTimeout(() => setStatus(null), 2000);
    };

    const startEditing = (p) => {
        setEditingId(p.id);
        setEditForm({
            nombre: p.nombre,
            precioUnitario: p.precioUnitario
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ nombre: "", precioUnitario: "" });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((f) => ({ ...f, [name]: value }));
    };

    const saveEdit = async (id) => {
        const payload = {
            nombre: editForm.nombre,
            precioUnitario: parseFloat(editForm.precioUnitario)
        };

        try {
            const res = await fetchWithAuth(`/api/productos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setProductos((arr) =>
                    arr.map((p) =>
                        p.id === id
                            ? { ...p, nombre: payload.nombre, precioUnitario: payload.precioUnitario }
                            : p
                    )
                );
                setEditingId(null);
                setStatus({ type: "success", text: "Producto actualizado" });
            } else {
                setStatus({ type: "error", text: "Error al actualizar" });
            }
        } catch {
            setStatus({ type: "error", text: "Error de red al actualizar" });
        }

        setTimeout(() => setStatus(null), 2000);
    };

    const totalPages = Math.max(1, Math.ceil(total / size));

    return (
        <div className="card" style={{ padding: 20 }}>
            <h2>Inventario de Productos</h2>

            <div style={{ marginBottom: 12 }}>
                <Link to="/productos/nuevo" className="btn-primary">
                    Registrar Producto
                </Link>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="data-table" aria-label="Tabla de productos">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio Unitario</th>
                        <th>Stock</th>
                        <th>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productos.map((p) =>
                        editingId === p.id ? (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>
                                    <input
                                        name="nombre"
                                        value={editForm.nombre}
                                        onChange={handleEditChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        name="precioUnitario"
                                        type="number"
                                        step="0.01"
                                        value={editForm.precioUnitario}
                                        onChange={handleEditChange}
                                    />
                                </td>
                                <td style={{ color: "#666" }}>{p.stock}</td>
                                <td>
                                    <button onClick={() => saveEdit(p.id)}>Guardar</button>
                                    <button
                                        onClick={cancelEditing}
                                        style={{ marginLeft: 6 }}
                                    >
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>{p.precioUnitario}</td>
                                <td style={{ color: "#666" }}>{p.stock}</td>
                                <td>
                                    <button
                                        onClick={() => startEditing(p)}
                                        style={{ marginRight: 6 }}
                                    >
                                        Editar
                                    </button>
                                    <button onClick={() => eliminar(p.id)}>Suspender</button>
                                </td>
                            </tr>
                        )
                    )}
                    </tbody>
                </table>
            )}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 12
                }}
            >
                <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                >
                    Anterior
                </button>

                <span>
          Página {page + 1} de {totalPages}
        </span>

                <button
                    onClick={() =>
                        setPage((p) => (p + 1 < totalPages ? p + 1 : p))
                    }
                    disabled={page + 1 >= totalPages}
                >
                    Siguiente
                </button>
            </div>

            {status && (
                <div
                    style={{
                        marginTop: 10,
                        color: status.type === "success" ? "green" : "red"
                    }}
                >
                    {status.text}
                </div>
            )}
        </div>
    );
};

export default InventarioCRUD;
