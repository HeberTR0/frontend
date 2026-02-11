import React from "react";

const Home = () => {
    const inicioImagenUrl = process.env.PUBLIC_URL + "/images/logo.png";

    return (
        <div className="card" style={{ padding: 20, textAlign: "center" }}>
            <div
                className="image-wrap"
                style={{ display: "flex", justifyContent: "center" }}
            >
                <div
                    className="image-card"
                    style={{
                        width: 520,
                        height: 360,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={inicioImagenUrl}
                        alt="Imagen de inicio"
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
