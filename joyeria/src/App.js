import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./components/Home";

// CRUD Proveedores
import ProvidersList from "./components/ProvidersList";
import ProvidersForm from "./components/ProvidersForm";

// CRUD Productos
import ProductsList from "./components/ProductsList";
import ProductsForm from "./components/ProductsForm";

// Inventario
import InventarioCRUD from "./components/InventarioCRUD";

// Órdenes
import OrdersForm from "./components/OrdersForm";
import OrdersList from "./components/OrdersList";
import RecepcionOrden from "./components/RecepcionOrden";

// Ventas
import VentaPanel from "./components/VentaPanel";
import VentasList from "./components/VentasList";
import ResumenVentas from "./components/ResumenVentas";

import "./styles.css";

import CotizacionEstimada from "./components/CotizacionEstimada";
import Catalogo from "./components/Catalogo";

function App() {
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({
                username: localStorage.getItem("username"),
                nombre: localStorage.getItem("nombre"),
                rol: localStorage.getItem("rol"),
            });
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    {/* Inicio */}
                    <Route index element={<Home />} />

                    {/* --- PROVEEDORES (Solo Admin) --- */}
                    <Route
                        path="proveedores"
                        element={
                            <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                                <ProvidersList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="proveedores/nuevo"
                        element={
                            <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                                <ProvidersForm />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- PRODUCTOS --- */}
                    <Route path="productos" element={<ProductsList />} />
                    <Route path="productos/nuevo" element={<ProductsForm />} />

                    {/* --- INVENTARIO (Solo Admin) --- */}
                    <Route
                        path="inventario"
                        element={
                            <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                                <InventarioCRUD />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- ÓRDENES (Solo Admin) --- */}
                    <Route
                        path="ordenes"
                        element={
                            <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                                <OrdersForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="ordenes/lista"
                        element={
                            <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                                <OrdersList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="ordenes/:id/recepcion"
                        element={
                            <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                                <RecepcionOrden />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- VENTAS --- */}
                    <Route path="venta" element={<VentaPanel />} />
                    <Route path="venta/lista" element={<VentasList />} />

                    {/* --- RESUMEN DE VENTAS (Solo Admin) --- */}
                    <Route
                        path="resumen-ventas"
                        element={
                            <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
                                <ResumenVentas />
                            </ProtectedRoute>
                        }
                    />

                    {/* --- CATALOGO --- */}
                    <Route path="catalogo" element={<Catalogo />} />

                    {/* --- COTIZACIÓN --- */}
                    <Route path="cotizacion" element={<CotizacionEstimada />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;