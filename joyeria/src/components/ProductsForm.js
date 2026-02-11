import React, { useState } from "react";
import fetchWithAuth from "../api";
const ProductsForm = () => {
    const [product, setProduct] = useState({
        nombre: "",
        precioUnitario: "",
        stock: "",
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === "number" ? Number(value) : value;
        setProduct((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nombre: product.nombre,
                precioUnitario: product.precioUnitario,
                stock: product.stock,
            };
            const res = await fetchWithAuth("/api/productos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setStatus({ type: "success", message: "Producto creado" });
                setProduct({ nombre: "", precioUnitario: "", stock: "" });
            } else {
                setStatus({ type: "error", message: "Error al crear producto" });
            }
        } catch (err) {
            setStatus({ type: "error", message: "Error de red al crear producto" });
        }
    };

    return (
        <div className="card" style={{ maxWidth: 600, padding: 20, border: "1px solid #ddd", borderRadius: 6 }}>
            <h2>Registrar Producto</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 8 }}>
                    <label>Nombre</label><br />
                    <input type="text" name="nombre" value={product.nombre} onChange={handleChange} required style={{ width: "100%" }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Precio unitario</label><br />
                    <input type="number" step="0.01" name="precioUnitario" value={product.precioUnitario} onChange={handleChange} required style={{ width: "100%" }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Stock inicial</label><br />
                    <input type="number" name="stock" value={product.stock} onChange={handleChange} required style={{ width: "100%" }} />
                </div>
                <button type="submit" style={{ padding: "8px 12px" }}>Guardar Producto</button>
            </form>
            {status && (
                <div style={{ marginTop: 10, color: status.type === "success" ? "green" : "red" }}>
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default ProductsForm;