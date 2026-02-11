import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import GananciasDia from "./GananciasDia";
import "../styles.css";

const Layout = () => {
    const [ventasOpen, setVentasOpen] = useState(true);
    const [ordenesOpen, setOrdenesOpen] = useState(true);
    const navigate = useNavigate();

    const rol = localStorage.getItem("rol");
    const nombre = localStorage.getItem("nombre");
    const isAdmin = rol === "ADMINISTRADOR";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
        <header className="topbar">
            <span className="brand">Joyería Santillán</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ color: "#fff", fontSize: "14px" }}>
                        Hola, {nombre} ({rol})
                    </span>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: "6px 12px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>

        <div className="layout">
            <aside className="sidebar" aria-label="Menú de navegación">
                <nav className="sidebar-nav">
                    <Link
                        to="/"
                        className="menu-item"
                        style={{ fontWeight: 700, textDecoration: "none" }}
                    >
                        Inicio
                    </Link>

                    {/* VENTAS */}
                    <div>
                        <button
                            className="menu-item"
                            type="button"
                            onClick={() => setVentasOpen(v => !v)}
                            aria-expanded={ventasOpen}
                        >
                            Venta
                        </button>
                        {ventasOpen && (
                            <div style={{ paddingLeft: 12 }}>
                                <Link
                                    to="/venta"
                                    className="menu-item"
                                    style={{ display: "block" }}
                                >
                                    Registrar Venta
                                </Link>
                                <Link
                                    to="/venta/lista"
                                    className="menu-item"
                                    style={{ display: "block" }}
                                >
                                    Lista de Ventas
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* INVENTARIO - Solo Admin */}
                    {isAdmin && (
                        <Link
                            to="/inventario"
                            className="menu-item"
                            style={{ display: "block" }}
                        >
                            Inventario
                        </Link>
                    )}

                    {/* PROVEEDORES - Solo Admin */}
                    {isAdmin && (
                        <Link
                            to="/proveedores"
                            className="menu-item"
                            style={{ display: "block" }}
                        >
                            Proveedores
                        </Link>
                    )}

                    <Link
                        to="/clientes"
                        className="menu-item"
                        style={{ display: "block" }}
                    >
                        Clientes
                    </Link>

                    {/* ÓRDENES DE COMPRA - Solo Admin */}
                    {isAdmin && (
                        <div>
                            <button
                                className="menu-item"
                                type="button"
                                onClick={() => setOrdenesOpen(o => !o)}
                                aria-expanded={ordenesOpen}
                            >
                                Orden de compra
                            </button>
                            {ordenesOpen && (
                                <div style={{ paddingLeft: 12 }}>
                                    <Link
                                        to="/ordenes"
                                        className="menu-item"
                                        style={{ display: "block" }}
                                    >
                                        Registrar Órdenes
                                    </Link>
                                    <Link
                                        to="/ordenes/lista"
                                        className="menu-item"
                                        style={{ display: "block" }}
                                    >
                                        Listar Órdenes de Compra
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CONTADOR DE GANANCIAS DEL DÍA */}
                    <GananciasDia />

                    {/* RESUMEN DE VENTAS - Solo Admin */}
                    {isAdmin && (
                        <Link
                            to="/resumen-ventas"
                            className="menu-item"
                            style={{ display: "block" }}
                        >
                            Resumen de Ventas
                        </Link>
                    )}

                    <Link
                        to="/catalogo"
                        className="menu-item"
                        style={{ display: "block" }}
                    >
                        Catálogo
                    </Link>
                    <Link
                        to="/cotizacion"
                        className="menu-item"
                        style={{ display: "block" }}
                    >
                        Cotización Estimada
                    </Link>
                </nav>
            </aside>

            <main className="content-area" aria-label="Contenido principal">
                <Outlet />
            </main>
        </div>

            {/* <footer
    className="footer"
    role="contentinfo"
    aria-label="Pie de página"
>
    <div className="footer-left">
        Derechos reservados © {new Date().getFullYear()}
    </div>

    <div className="footer-right" aria-label="Redes sociales">

            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="social-icon"
        >
            F
        </a>


            href="https://wa.me/whatsapp"
            target="_blank"
            rel="noreferrer"
            className="social-icon"
        >
            W
        </a>
    </div>
</footer> */}
</>
);
};

export default Layout;