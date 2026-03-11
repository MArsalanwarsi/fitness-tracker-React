import { useMemo } from "react";
import { exportToCsv } from "../utils/exportToCsv";
import { exportToPdf } from "../utils/exportToPdf";

const slugify = (value = "export") =>
    String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

const getDateStamp = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

export const useTableExport = ({
    data = [],
    columns = [],
    fileBaseName = "export",
    pdfTitle = "Export Report",
    pdfSubtitle = "",
    companyName = "My Company",
    logoUrl = "",
}) => {
    const safeBaseName = useMemo(() => slugify(fileBaseName), [fileBaseName]);
    const datedBaseName = `${safeBaseName}-${getDateStamp()}`;

    const handleExportCsv = () => {
        if (!data.length) {
            return {
                ok: false,
                message: "No data available to export",
            };
        }

        exportToCsv({
            data,
            columns,
            fileName: `${datedBaseName}.csv`,
        });

        return {
            ok: true,
            message: "CSV exported successfully",
        };
    };

    const handleExportPdf = async () => {
        if (!data.length) {
            return {
                ok: false,
                message: "No data available to export",
            };
        }

        await exportToPdf({
            data,
            columns,
            fileName: `${datedBaseName}.pdf`,
            title: pdfTitle,
            subtitle: pdfSubtitle,
            companyName,
            logoUrl,
        });

        return {
            ok: true,
            message: "PDF exported successfully",
        };
    };

    return {
        handleExportCsv,
        handleExportPdf,
    };
};