import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPdf = ({
    data = [],
    columns = [],
    fileName = "export.pdf",
    title = "Exported Data",
}) => {
    if (!Array.isArray(data) || !data.length) return;

    const doc = new jsPDF();

    const activeColumns = columns.filter((col) => col.exportable !== false);

    const head = [activeColumns.map((col) => col.header || col.key)];

    const body = data.map((row, index) =>
        activeColumns.map((col) => {
            if (typeof col.value === "function") {
                return col.value(row, index) ?? "";
            }
            return row[col.key] ?? "";
        })
    );

    doc.setFontSize(16);
    doc.text(title, 14, 15);

    autoTable(doc, {
        startY: 22,
        head,
        body,
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        headStyles: {
            fontStyle: "bold",
        },
    });

    doc.save(fileName);
};