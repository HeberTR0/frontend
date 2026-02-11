import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../api";
const ProvidersList = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        nombre: "",
        ruc: "",
        telefono: "",
        direccion: "",
        email: ""
    });

    const [page, setPage] = useState(0);
    const size = 10;
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadPage(page);
    }, [page]);

    const loadPage = (p) => {
        setLoading(true);

        fetchWithAuth(`/api/proveedores?page=${p}&size=${size}`)
            .then((r) => r.json())
            .then((data) => {
                const content = Array.isArray(data)
                    ? data
                    : data?.content ?? [];

                const totalElements =
                    data?.totalElements ??
                    data?.total ??
                    content.length;

                setProviders(content);
                setTotal(totalElements);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const startEditing = (pr) => {
        setEditingId(pr.id);
        setEditForm({
            nombre: pr.nombre,
            ruc: pr.ruc,
            telefono: pr.telefono,
            direccion: pr.direccion,
            email: pr.email
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ nombre: "", ruc: "", telefono: "", direccion: "", email: "" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm((f) => ({ ...f, [name]: value }));
    };

    const saveEdit = async (id) => {
        try {
            const res = await fetchWithAuth(`/api/proveedores/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                setProviders((arr) =>
                    arr.map((p) => (p.id === id ? { ...p, ...editForm } : p))
                );
                setEditingId(null);
                setStatus({ type: "success", text: "Proveedor actualizado" });
            } else {
                setStatus({ type: "error", text: "Error al actualizar proveedor" });
            }
        } catch {
            setStatus({ type: "error", text: "Error de red al actualizar" });
        }

        setTimeout(() => setStatus(null), 2000);
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar proveedor seleccionado?")) return;

        try {
            const res = await fetchWithAuth(`/api/proveedores/${id}`, { method: "DELETE" });

            if (res.ok) {
                loadPage(page);
                setStatus({ type: "success", text: "Proveedor eliminado" });
            } else {
                setStatus({ type: "error", text: "Error al eliminar proveedor" });
            }
        } catch {
            setStatus({ type: "error", text: "Error de red al eliminar" });
        }

        setTimeout(() => setStatus(null), 2000);
    };

    const totalPages = Math.max(1, Math.ceil(total / size));
    const mostradoTexto = `Mostrando ${providers.length} de ${total}`;

    if (loading) return <div>Cargando proveedores...</div>;

    return (
        <div className="card" style={{ padding: 20 }}>
            <h2 className="section-title">Proveedores</h2>

            <div style={{ marginBottom: 12 }}>
                <button onClick={() => navigate("/proveedores/nuevo")}
                className="btn-primary">
                    Registrar Proveedor
                </button>
            </div>

            <table className="data-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>RUC</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Email</th>
                    <th>Acción</th>
                </tr>
                </thead>
                <tbody>
                {providers.map((p) =>
                    editingId === p.id ? (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td><input name="nombre" value={editForm.nombre} onChange={handleChange} /></td>
                            <td><input name="ruc" value={editForm.ruc} onChange={handleChange} /></td>
                            <td><input name="telefono" value={editForm.telefono} onChange={handleChange} /></td>
                            <td><input name="direccion" value={editForm.direccion} onChange={handleChange} /></td>
                            <td><input name="email" value={editForm.email} onChange={handleChange} /></td>
                            <td>
                                <button onClick={() => saveEdit(p.id)}>Guardar</button>
                                <button onClick={cancelEditing} style={{ marginLeft: 6 }}>Cancelar</button>
                            </td>
                        </tr>
                    ) : (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>{p.ruc}</td>
                            <td>{p.telefono}</td>
                            <td>{p.direccion}</td>
                            <td>{p.email}</td>
                            <td>
                                <button onClick={() => startEditing(p)}>Editar</button>
                                <button onClick={() => eliminar(p.id)} style={{ marginLeft: 6 }}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    )
                )}
                </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <div>{mostradoTexto}</div>
                <div>
                    <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                        Anterior
                    </button>
                    <span style={{ margin: "0 8px" }}>
            Página {page + 1} de {totalPages}
          </span>
                    <button
                        onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                        disabled={page + 1 >= totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {status && (
                <div style={{ marginTop: 10, color: status.type === "success" ? "green" : "red" }}>
                    {status.text}
                </div>
            )}
        </div>
    );
};

export default ProvidersList;
