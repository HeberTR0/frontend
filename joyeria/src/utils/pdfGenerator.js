import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateOrderPdf = (order) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let cursorY = 10;


    doc.setFontSize(16);
    doc.text("Orden de compra", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 8;


    doc.setFontSize(11);
    const fecha = order.fechaCreacion
        ? new Date(order.fechaCreacion).toLocaleDateString()
        : "";
    const id = order.id ?? "";

    doc.text(`Fecha: ${fecha}    ID: ${id}`, pageWidth - margin, cursorY, {
        align: "right",
    });
    cursorY += 6;


    doc.setFontSize(12);
    doc.text("Datos del proveedor", margin, cursorY);
    cursorY += 6;

    const prov = order.proveedor ?? {};

    const lines = [
        `Nombre: ${prov.nombre ?? ""}`,
        `RUC: ${prov.ruc ?? ""}`,
        `Teléfono: ${prov.telefono ?? ""}`,
        `Dirección: ${prov.direccion ?? ""}`,
        `Email: ${prov.email ?? ""}`,
    ];

    doc.setFontSize(11);
    lines.forEach((line, idx) => {
        doc.text(line, margin, cursorY + idx * 6);
    });

    cursorY += lines.length * 6 + 4;


    const cols = ["Id", "Producto", "Cantidad", "Precio Unitario", "Subtotal"];
    const items = order.detalles ?? order.items ?? [];

    const rows = items.map((d) => {
        const pid = d.producto?.id ?? d.productoId;
        const nombre = d.producto?.nombre ?? "";
        const cantidad = d.cantidad ?? 0;
        const pu = d.precioUnitario ?? 0;
        const subt = d.subtotal ?? pu * cantidad;
        return [pid, nombre, cantidad, pu, subt];
    });

    doc.autoTable({
        head: [cols],
        body: rows,
        startY: cursorY,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [230, 230, 230] },
        margin: { left: margin, right: margin },
    });


    const tableEndY = doc.lastAutoTable?.finalY ?? cursorY;


    const totalPedido =
        order.total ?? rows.reduce((acc, row) => acc + (row[4] ?? 0), 0);
    const totalPagar = order.total ?? totalPedido;

    doc.autoTable({
        head: [["Total pedido", "Total a pagar"]],
        body: [[totalPedido, totalPagar]],
        startY: tableEndY + 6,
        theme: "grid",
        margin: { left: margin, right: margin },
        styles: { fontSize: 11 },
        columnStyles: {
            0: {
                cellWidth: (pageWidth - 2 * margin) / 2,
                halign: "left",
            },
            1: {
                cellWidth: (pageWidth - 2 * margin) / 2,
                halign: "right",
            },
        },
    });

    // Firma
    const firmaY = doc.internal.pageSize.getHeight() - 20;
    doc.line(pageWidth - 60, firmaY, pageWidth - 20, firmaY);
    doc.text("Firma del Receptor", pageWidth - 20, firmaY + 6, {
        align: "right",
    });


    doc.save(`orden_${order.id ?? "pdf"}.pdf`);
};
