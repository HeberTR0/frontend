import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* ===== Utilidades de color ===== */
const colorFromMaterial = (material) => {
    const m = (material || "").toLowerCase();
    if (m.includes("oro")) return 0xd4af37;     // dorado
    if (m.includes("plata")) return 0xc0c0c0;
    if (m.includes("acero")) return 0x9e9e9e;
    return 0xc3773a; // default
};

const colorFromPiedra = (tipo) => {
    switch ((tipo || "").toLowerCase()) {
        case "diamante":
            return 0xffffff;
        case "zafiro":
            return 0x1e90ff;
        case "rubí":
            return 0xff0000;
        case "esmeralda":
            return 0x00b050;
        default:
            return 0xdddddd;
    }
};

/* ===== Componente ===== */
const ThreeDJewelViewer = ({ cotizacion }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!cotizacion || !mountRef.current) return;

        // Limpiar contenedor
        while (mountRef.current.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild);
        }

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        /* ===== Escena ===== */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 2, 6);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        /* ===== Luces ===== */
        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        hemi.position.set(0, 5, 0);
        scene.add(hemi);

        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(5, 6, 5);
        scene.add(dir);

        /* ===== Anillo ===== */
        const bandaColor = colorFromMaterial(cotizacion.material);
        const bandaMat = new THREE.MeshStandardMaterial({
            color: bandaColor,
            metalness: 0.8,
            roughness: 0.25,
        });

        const kilataje = cotizacion.kilataje ?? 18;
        const peso = cotizacion.pesoEstimado ?? 1;

        const ringRadius = THREE.MathUtils.clamp(
            1.2 + (kilataje - 18) * 0.03 + peso * 0.02,
            0.8,
            3
        );
        const ringTube = THREE.MathUtils.clamp(
            0.18 + (kilataje - 18) * 0.002,
            0.1,
            0.4
        );

        const ringGeom = new THREE.TorusGeometry(ringRadius, ringTube, 16, 100);
        const ring = new THREE.Mesh(ringGeom, bandaMat);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        /* ===== Piedras ===== */
        const quilataje = cotizacion.quilataje ?? 0;
        const tipoPiedra = cotizacion.tipoPiedra ?? "";

        const stonesCount = Math.max(
            6,
            Math.min(24, Math.floor((quilataje || 0) * 2))
        );

        const stoneColor = colorFromPiedra(tipoPiedra);
        const stoneMat = new THREE.MeshStandardMaterial({
            color: stoneColor,
            metalness: 0.3,
            roughness: 0.5,
            emissive: 0x111111,
        });

        for (let i = 0; i < stonesCount; i++) {
            const theta = (i / stonesCount) * Math.PI * 2;
            const x = (ringRadius + ringTube) * Math.cos(theta);
            const z = (ringRadius + ringTube) * Math.sin(theta);

            const stoneGeom = new THREE.SphereGeometry(0.08, 16, 16);
            const stone = new THREE.Mesh(stoneGeom, stoneMat);
            stone.position.set(x, 0.25, z);
            stone.scale.setScalar(1 + (i % 3) * 0.03);
            scene.add(stone);
        }

        /* ===== Animación ===== */
        let reqId;
        const animate = () => {
            reqId = requestAnimationFrame(animate);
            ring.rotation.y += 0.005;
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        /* ===== Resize ===== */
        const onResize = () => {
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        /* ===== Cleanup ===== */
        return () => {
            cancelAnimationFrame(reqId);
            window.removeEventListener("resize", onResize);
            controls.dispose();
            renderer.dispose();
            scene.traverse((obj) => {
                if (obj.isMesh) {
                    obj.geometry.dispose();
                    obj.material.dispose();
                }
            });
        };
    }, [cotizacion]);

    /* ===== JSX ===== */
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div ref={mountRef} style={{ width: "100%", height: "60vh" }} />
            <div style={{ textAlign: "center", marginTop: 8 }}>
                Modelo 3D: cotización #{cotizacion?.id ?? ""}
            </div>
        </div>
    );
};

export default ThreeDJewelViewer;
