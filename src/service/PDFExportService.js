import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import get from "lodash.get";

export function generatePdf(columnOrder, rows, tableName) {
  const columnsHead = columnOrder.map(({ key, label }) => ({
    header: label,
    dataKey: key,
  }));

  const keys = columnOrder.map((col) => col.key);

  const rowsBody = rows.map((row) =>
    keys.map((key) => String(get(row, key, "")))
  );
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(tableName, 105, 20, { align: "center" });
  autoTable(doc, {
    columns: columnsHead,
    body: rowsBody,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] },
    margin: { top: 25 },
  });
  doc.save("report.pdf");
}
