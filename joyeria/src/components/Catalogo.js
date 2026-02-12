import React from "react";
import ModelGLB from "./ModelGLB";


const MODELOS = [
    { name: "Rolex DateJust", url: "/models/rolex_datejust.glb" },
    { name: "Joya especial Croc", url: "/models/jewelry_-_croc.glb" },
    { name: "Luxury Wristwatch", url: "/models/watch__luxury_wristwatch_3d_model.glb" },
    { name: "Ambassador Heritage 1863", url: "/models/ambassador_heritage_1863_watch_-_2048px2.glb" },
    { name: "Sortija Acabado Premium", url: "/models/jewelry_item.glb" },
    { name: "Joya Cat", url: "/models/ring_cat.glb" },
    { name: "Brazalete Turquesa", url: "/models/turquoise_bracelet_3d_scan.glb" },
    { name: "Anillo de diamante", url: "/models/diamond_ring_jewelry.glb" },
    { name: "Anillo Flor", url: "/models/flower_ring.glb" },
    { name: "Anillo de Oro con Rubí", url: "/models/gold_ring_witn_ruby.glb" },
    { name: "Anillo de Plata con Opal", url: "/models/silver_ring_with_opal.glb" },
    { name: "Anillo", url: "/models/ring.glb" }
];

const Catalogo = () => {
    return (
        <div className="card" style={{ padding: 20 }}>
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Catálogo de Modelos 3D</h2>

            <div
                className="catalog-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 columnas
                    gap: 20,
                }}
            >
                {MODELOS.map((m, idx) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {/* Cuadro fijo para el canvas 3D */}
                        <div style={{ width: "100%", height: 240, border: "1px solid #ddd", borderRadius: 6, overflow: "hidden" }}>
                            <ModelGLB url={m.url} name={m.name} />
                        </div>
                        <div style={{ marginTop: 6, textAlign: "center", fontSize: 12, color: "#333" }}>
                            {m.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalogo;