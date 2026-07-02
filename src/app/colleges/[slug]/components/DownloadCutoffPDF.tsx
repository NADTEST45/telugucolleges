"use client";
import { useState, useCallback } from "react";

/* ─── Download Cutoff Table as PDF ─── */
export default function DownloadCutoffPDF({ collegeName, tableRef, category, gender }: { collegeName: string; tableRef: React.RefObject<HTMLDivElement | null>; category: string; gender: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!tableRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      // Title
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(collegeName, 10, 15);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100);
      pdf.text(`EAPCET Cutoff Ranks — ${category}, ${gender === "girls" ? "Girls" : "Boys"}`, 10, 22);
      pdf.text(`Downloaded from TeluguColleges.com on ${new Date().toLocaleDateString("en-IN")}`, 10, 28);

      // Table image
      const startY = 34;
      if (imgHeight + startY > 280) {
        // Multi-page handling for large tables
        let yPos = startY;
        const pageHeight = 280;
        const sliceHeight = pageHeight - startY;
        const totalPages = Math.ceil(imgHeight / sliceHeight);
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) { pdf.addPage(); yPos = 10; }
          pdf.addImage(imgData, "PNG", 10, yPos - (page * sliceHeight), imgWidth, imgHeight);
        }
      } else {
        pdf.addImage(imgData, "PNG", 10, startY, imgWidth, imgHeight);
      }

      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text("Source: Official APSCHE/TSCHE Last Rank Statement PDFs · TeluguColleges.com", 10, 290);
      }

      const safeName = collegeName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 40);
      pdf.save(`${safeName}_Cutoffs.pdf`);
    } catch (err) {
      // PDF generation failed — error details omitted for security
    } finally {
      setDownloading(false);
    }
  }, [collegeName, tableRef, category, gender]);

  return (
    <button onClick={handleDownload} disabled={downloading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand/10 text-brand text-xs font-semibold hover:bg-brand/20 transition-colors disabled:opacity-50">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      {downloading ? "Generating..." : "Download PDF"}
    </button>
  );
}
