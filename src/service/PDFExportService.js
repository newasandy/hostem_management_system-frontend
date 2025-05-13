import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import get from "lodash.get";

// export function generatePdf(columnOrder, rows, tableName) {
//   const columnsHead = columnOrder.map(({ key, label }) => ({
//     header: label,
//     dataKey: key,
//   }));

//   const keys = columnOrder.map((col) => col.key);

//   const rowsBody = rows.map((row) =>
//     keys.map((key) => String(get(row, key, "")))
//   );
//   const doc = new jsPDF();
//   doc.setFontSize(18);
//   doc.text(tableName, 105, 20, { align: "center" });
//   autoTable(doc, {
//     columns: columnsHead,
//     body: rowsBody,
//     styles: { fontSize: 10 },
//     headStyles: { fillColor: [22, 160, 133] },
//     margin: { top: 25 },
//   });
//   doc.save("report.pdf");
// }

export const exportPDFs = async (userData, paperFormat, paperOrientation) => {
  try {
    const response = await fetch("/userTemplate.xml");
    if (!response.ok) throw new Error("Failed to load XML template");
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // Get logo URL
    const logoUrl = xmlDoc.querySelector("header > logo")?.textContent || "";

    const logoBase64 = logoUrl ? await getImageBase64(logoUrl) : null;

    // Extract multiple headers
    // const pageConfig = xmlDoc.querySelector("page");
    // const format = pageConfig?.getAttribute("size") || "a4";
    // const orientation = pageConfig?.getAttribute("orientation") || "portrait";
    const format = paperFormat;
    const orientation = paperOrientation;
    // Supported formats
    const paperSizes = {
      a0: [841, 1189],
      a1: [594, 841],
      a2: [420, 594],
      a3: [297, 420],
      a4: [210, 297],
      a5: [148, 210],
      a6: [105, 148],
      atm: [80, 297],
    };
    const headerEl = xmlDoc.querySelector("header");
    const headerChildren = Array.from(headerEl?.children || []);

    const colsParent = xmlDoc.getElementsByTagName("columns")[0];
    const columnNodes = colsParent
      ? colsParent.getElementsByTagName("column")
      : [];

    const columns = Array.from(columnNodes).map((col) => {
      const headerEl = col.querySelector("header");
      const dataKeyEl = col.querySelector("dataKey");

      return {
        header: headerEl ? headerEl.textContent.trim() : "",
        dataKey: dataKeyEl ? dataKeyEl.textContent.trim() : "",
      };
    });

    const rowsData = userData.map((row) =>
      columns.map((key) => String(get(row, key.dataKey, "")))
    );

    const baseFontSize =
      format === "a4" ? 10 : format === "a5" ? 8 : format === "atm" ? 8 : 10;

    const doc = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: paperSizes[format] || format,
      hotfixes: ["px_scaling"],
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 5;
    const marginRight = 5;
    const cellPadding = 1;

    // Header rendering
    // let headerY = 5; // Start below logo

    // Table configuration
    const availableWidth = pageWidth - marginLeft - marginRight;
    const columnCount = columns.length;
    const cellWidth = availableWidth / columnCount;

    const columnStyles = columns.reduce(
      (acc, _, index) => ({
        ...acc,
        [index]: {
          cellWidth: cellWidth,
          minCellWidth: 15,
          overflow: "linebreak",
        },
      }),
      {}
    );
    let headerHeight = 0;
    if (format === "atm") {
      headerHeight = 28;
    } else {
      headerHeight = 35;
    }
    autoTable(doc, {
      margin: { top: headerHeight, left: 5, right: 5 },
      tableWidth: availableWidth,
      theme: "plain",
      headStyles: {
        fontSize: baseFontSize,

        fontStyle: "bold",
        halign: "center",
        fillColor: "#ffffff",
        textColor: "#000000",
        lineWidth: 0.5,
        lineColor: "#000000",
      },
      bodyStyles: {
        fontSize: baseFontSize,
        fillColor: "#FFFFFF",
        textColor: "#000000",
        fontStyle: "normal",
        cellPadding: cellPadding,
        halign: "left",
        valign: "middle",
        // lineWidth: 0.2,
        // lineColor: "#000000",
      },
      tableLineColor: [255, 255, 255],
      tableLineWidth: 1,
      styles: {
        cellPadding: cellPadding,
        fontSize: 10,
        overflow: "linebreak",
      },
      columnStyles: columnStyles,
      columns: columns,
      body: rowsData,
      didDrawPage: (data) => {
        let headerY = 5; // Fixed starting position

        if (logoBase64) {
          if (format === "atm") {
            doc.addImage(logoBase64, "PNG", marginLeft, headerY, 10, 10);
            headerY += 8;
          } else {
            doc.addImage(logoBase64, "PNG", marginLeft, headerY, 20, 20);
            headerY += 15;
          }
        }

        headerChildren.forEach((el) => {
          const tag = el.tagName.toLowerCase();
          if (tag === "logo") return;

          const text = el.textContent
            .replace("{{DATE}}", new Date().toLocaleDateString())
            .replace("Company Report", "My Demo Company")
            .replace("Confidential", "Sandy");

          const style = {
            fontSize: parseInt(el.getAttribute("font-size")) || baseFontSize,
            color: el.getAttribute("color") || "#000000",
            align: el.getAttribute("align") || "left",
            fontStyle: el.getAttribute("font-style") || "normal",
          };

          doc.setFontSize(style.fontSize);
          doc.setTextColor(style.color);
          doc.setFont(undefined, style.fontStyle);

          const xPositions = {
            left: marginLeft,
            center: pageWidth / 2,
            right: pageWidth - marginRight,
          };

          const maxWidth =
            style.align === "center"
              ? pageWidth - marginLeft * 2
              : pageWidth - marginLeft - marginRight;
          const lines = doc.splitTextToSize(text, maxWidth);

          lines.forEach((line) => {
            doc.text(line, xPositions[style.align], headerY, {
              align: style.align,
              maxWidth: maxWidth,
            });
            headerY += style.fontSize * 0.4;
          });
        });

        if (headerY > 40) {
          console.warn("Header exceeds 30 units; adjust headerHeight");
        }
      },
    });
    // Set total page count
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const finalFooter = (xmlDoc.querySelector("footer p")?.textContent || "")
        .replace("{{PAGE_NUM}}", i)
        .replace("{{TOTAL_PAGES}}", totalPages)
        .replace("{{contact}}", "demo@gamil.com");
      doc.setFontSize(10);
      doc.text(finalFooter, marginLeft, doc.internal.pageSize.height - 10);
    }
    doc.save(`userData_${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};
// Helper to fetch and convert image to base64
const getImageBase64 = async (imageUrl) => {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Failed to load logo image:", err);
    return null;
  }
};
