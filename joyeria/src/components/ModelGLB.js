import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function fitCameraToObject(camera, controls, object) {
    // Calcula bounding box del objeto
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);

    const fitDistance = maxDim > 0 ? maxDim * 2.2 : 2.5;


    const direction = new THREE.Vector3().subVectors(camera.position, center).normalize();
    camera.near = Math.max(0.01, maxDim / 100);
    camera.far = fitDistance * 10;
    camera.position.copy(center).add(direction.multiplyScalar(fitDistance));
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.update();
}

const ModelGLB = ({ url, name }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!url || !mountRef.current) return;

        // limpiar
        while (mountRef.current.firstChild) mountRef.current.removeChild(mountRef.current.firstChild);

        // tamaño del contenedor
        const width = mountRef.current.clientWidth || 400;
        const height = mountRef.current.clientHeight || 260;

        // escena
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        // camara
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0.8, 2.5);

        // renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        //----new---
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        //----new---
        mountRef.current.appendChild(renderer.domElement);

        // controles
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = true;

        // luces
        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambient);
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(5, 6, 5);
        scene.add(dir);


        //----------------------------------------------------------
        // Cargar GLB
        const loader = new GLTFLoader();
        let model;
        loader.load(
            url,
            (gltf) => {
                model = gltf.scene;
                //-----new---
                model.traverse((child) => {
                    if (child.isMesh) {
                        if (child.material) {
                            child.material.needsUpdate = true;
                            // Aumentar brillo si es muy oscuro
                            if (child.material.color) {
                                child.material.color.multiplyScalar(1.0);
                            }
                        }
                    }
                });
                //-----new---
                // Escalar para que el bounding box tenga un tamaño razonable
                const bbox = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                bbox.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = maxDim > 0 ? 1.0 / maxDim : 1;
                model.scale.multiplyScalar(scale);

                // Centrar
                const newBox = new THREE.Box3().setFromObject(model);
                const center = newBox.getCenter(new THREE.Vector3());
                model.position.sub(center);

                scene.add(model);


                fitCameraToObject(camera, controls, model);
            },
            undefined,
            (error) => {
                console.error("Error cargando GLB:", error);
            }
        );

        // loop
        let reqId;
        const animate = () => {
            reqId = requestAnimationFrame(animate);
            if (model) model.rotation.y += 0.005;
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize
        const onResize = () => {
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        // cleanup
        return () => {
            cancelAnimationFrame(reqId);
            window.removeEventListener("resize", onResize);
            controls.dispose();
            renderer.dispose();
            // dispose del objeto
            if (model) {
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry?.dispose();
                        if (Array.isArray(child.material)) {
                            child.material.forEach((m) => m.dispose());
                        } else {
                            child.material?.dispose();
                        }
                    }
                });
            }
        };
    }, [url]);

    return (
        <div style={{ width: "100%", height: "100%" }} aria-label={name || "Model GLB"}>
            <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
};

export default ModelGLB;