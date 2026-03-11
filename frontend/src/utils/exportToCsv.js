import Papa from "papaparse";

const ensureExtension = (fileName = "export.csv", ext = ".csv") => {
    return fileName.toLowerCase().endsWith(ext) ? fileName : `${fileName}${ext}`;
};

const downloadFile = (content, fileName, type) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
};

const resolveValue = (row, column, index) => {
    if (typeof column.value === "function") {
        return column.value(row, index);
    }

    return row?.[column.key];
};

export const exportToCsv = ({
    data = [],
    columns = [],
    fileName = "export.csv",
}) => {
    if (!Array.isArray(data) || data.length === 0) return;

    const activeColumns = columns.filter((col) => col.exportable !== false);

    const fields = activeColumns.map((col) => col.header || col.key);
    const rows = data.map((row, index) =>
        activeColumns.map((col) => {
            const value = resolveValue(row, col, index);
            return value ?? "";
        })
    );

    const csv = Papa.unparse({
        fields,
        data: rows,
    });

    const csvWithBom = `\ufeff${csv}`;

    downloadFile(
        csvWithBom,
        ensureExtension(fileName, ".csv"),
        "text/csv;charset=utf-8;"
    );
};