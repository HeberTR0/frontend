import React, { useEffect, useState } from "react";
import fetchWithAuth from "../api";
const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithAuth("/api/productos")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div className="card" style={{ padding: 20 }}>
            <h2>Productos</h2>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio Unitario</th>
                        <th>Stock</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                No hay productos registrados
                            </td>
                        </tr>
                    ) : (
                        products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>{p.precioUnitario}</td>
                                <td>{p.stock}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsList;
