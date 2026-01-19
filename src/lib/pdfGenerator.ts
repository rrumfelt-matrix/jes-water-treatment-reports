import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormData, ServiceFrequency, Boiler, SupportSystem, ClosedLoop } from '../types';

const frequencyLabels: Record<ServiceFrequency, string> = {
  'weekly': 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  'monthly': 'Monthly',
};
import { loadLogoAsBase64 } from './logoLoader';
import { formatPhoneNumber } from './formatters';

// Jasper Equipment & Supply Constants
const COMPANY_ADDRESS_LINE1 = '2350 Terry Lane';
const COMPANY_ADDRESS_LINE2 = 'Jasper, IN 47546';
const COMPANY_PHONE = '(812) 634-2501';

// Jasper Equipment & Supply Navy Blue Theme
const theme = {
  primary: [30, 58, 95] as [number, number, number],      // #1e3a5f
  primaryLight: [44, 82, 130] as [number, number, number], // #2c5282
  headerBg: [237, 242, 247] as [number, number, number],   // #edf2f7
  headerText: [26, 32, 44] as [number, number, number],    // #1a202c
  altRow: [247, 250, 252] as [number, number, number],     // #f7fafc
  white: [255, 255, 255] as [number, number, number],
  textMuted: [100, 100, 100] as [number, number, number],
};

async function createPDFDocument(data: FormData): Promise<jsPDF> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Try to load logo
  const logoData = await loadLogoAsBase64();

  let y: number;

  // ============ COVER PAGE (optional) ============
  if (data.includeCoverPage) {
    y = 50;

    // Logo centered at top
    if (logoData) {
      try {
        doc.addImage(logoData, 'PNG', pageWidth / 2 - 30, y, 60, 22);
        y += 35;
      } catch (e) {
        console.error('Failed to add logo to PDF:', e);
        y += 10;
      }
    }

    // Company info below logo
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...theme.textMuted);
    doc.text(COMPANY_ADDRESS_LINE1, pageWidth / 2, y, { align: 'center' });
    doc.text(COMPANY_ADDRESS_LINE2, pageWidth / 2, y + 5, { align: 'center' });
    doc.text(COMPANY_PHONE, pageWidth / 2, y + 10, { align: 'center' });

    // Main title
    y += 30;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...theme.primary);
    doc.text('Field Analysis / Service Report', pageWidth / 2, y, { align: 'center' });

    // Decorative line
    y += 8;
    doc.setDrawColor(...theme.primary);
    doc.setLineWidth(1);
    doc.line(50, y, pageWidth - 50, y);

    // Site info box
    y += 15;
    const boxX = 50;
    const boxWidth = pageWidth - 100;
    const boxHeight = 42;

    // Box background
    doc.setFillColor(...theme.headerBg);
    doc.setDrawColor(...theme.primary);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, y, boxWidth, boxHeight, 3, 3, 'FD');

    // Site info content
    y += 10;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...theme.primary);
    doc.text(data.plantName || 'Site Name', pageWidth / 2, y, { align: 'center' });

    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...theme.headerText);
    if (data.address) {
      doc.text(data.address, pageWidth / 2, y, { align: 'center' });
      y += 5;
    }

    doc.setFontSize(9);
    if (data.attention) {
      doc.text(`Contact: ${data.attention}`, pageWidth / 2, y, { align: 'center' });
      y += 5;
    }
    if (data.phone) {
      doc.text(`Phone: ${formatPhoneNumber(data.phone)}`, pageWidth / 2, y, { align: 'center' });
    }

    // Date and frequency at bottom of cover
    y = 220;
    doc.setFontSize(12);
    doc.setTextColor(...theme.headerText);
    const labelX = pageWidth / 2 - 5;
    const valueX = pageWidth / 2;

    doc.setFont('helvetica', 'bold');
    doc.text('Service Date:', labelX, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(formatDateUS(data.date) || '—', valueX, y);

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Service Frequency:', labelX, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(frequencyLabels[data.serviceFrequency] || 'Weekly', valueX, y);

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Technician:', labelX, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(data.technician || '—', valueX, y);

    // Footer on cover page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...theme.textMuted);
    doc.text(
      'Jasper Equipment & Supply | www.jasperequipment.com',
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );

    // Add new page for report content
    doc.addPage();
  }

  // ============ REPORT PAGE ============
  y = 15;

  // Header with logo and company info
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', 20, y, 40, 15);
    } catch (e) {
      console.error('Failed to add logo to PDF:', e);
    }
  }

  // Company info - right side of header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...theme.textMuted);
  doc.text(COMPANY_ADDRESS_LINE1, pageWidth - 20, y + 2, { align: 'right' });
  doc.text(COMPANY_ADDRESS_LINE2, pageWidth - 20, y + 6, { align: 'right' });
  doc.text(COMPANY_PHONE, pageWidth - 20, y + 10, { align: 'right' });

  // Title - centered below logo area
  y = 32;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...theme.primary);
  doc.text('Field Analysis / Service Report', pageWidth / 2, y, { align: 'center' });

  // Horizontal line
  y += 5;
  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.8);
  doc.line(20, y, pageWidth - 20, y);

  // Report info - stacked list with labels
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(...theme.headerText);
  const reportLabelX = 20;
  const reportValueX = 45;

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', reportLabelX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateUS(data.date) || '—', reportValueX, y);

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Site:', reportLabelX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.plantName || '—', reportValueX, y);

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Address:', reportLabelX, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.address || '—', reportValueX, y);

  y += 8;

  // Dynamic Boiler Sections
  for (const boiler of data.boilers) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }
    y = addBoilerSection(doc, y, boiler);
  }

  // Support Systems Section
  if (y > 180) {
    doc.addPage();
    y = 20;
  }
  y = addSupportSystemsSection(doc, y, data.supportSystems);

  // Closed Loops Section
  if (y > 180) {
    doc.addPage();
    y = 20;
  }
  y = addClosedLoopsSection(doc, y, data.closedLoops);

  // General Notes
  if (data.generalNotes) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    y = addSectionHeader(doc, y, 'General Notes');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...theme.headerText);
    const splitNotes = doc.splitTextToSize(data.generalNotes, pageWidth - 50);
    doc.text(splitNotes, 25, y + 5);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...theme.textMuted);
  doc.text(
    'Jasper Equipment & Supply | www.jasperequipment.com',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  return doc;
}

function formatDateUS(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${month}-${day}-${year}`;
}

export const generatePDF = async (data: FormData): Promise<void> => {
  const doc = await createPDFDocument(data);
  const siteName = data.plantName || 'Site';
  const dateUS = formatDateUS(data.date);
  const filename = `${siteName}_Water_Treatment_Report_${dateUS}.pdf`.replace(/\s+/g, '_');
  doc.save(filename);
};

export const getPDFBlobUrl = async (data: FormData): Promise<string> => {
  const doc = await createPDFDocument(data);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
};

export const getFilename = (data: FormData): string => {
  const siteName = data.plantName || 'Site';
  const dateUS = formatDateUS(data.date);
  return `${siteName}_Water_Treatment_Report_${dateUS}.pdf`.replace(/\s+/g, '_');
};

function addSectionHeader(doc: jsPDF, y: number, title: string): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(...theme.primary);
  doc.rect(20, y, pageWidth - 40, 8, 'F');
  doc.setTextColor(...theme.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(title, 25, y + 6);
  doc.setTextColor(...theme.headerText);
  return y + 10;
}

function addBoilerSection(doc: jsPDF, y: number, boiler: Boiler): number {
  y = addSectionHeader(doc, y, boiler.name);

  const values = [
    boiler.ph || '—',
    boiler.so3 || '—',
    boiler.pAlk || '—',
    boiler.mAlk || '—',
    boiler.ohAlk || '—',
    boiler.cond || '—',
    boiler.fluor || '—',
  ];

  autoTable(doc, {
    startY: y,
    head: [['pH', 'SO3', 'P-Alk', 'M-Alk', 'OH-Alk', 'Cond', 'Fluor']],
    body: [
      values,
      ['11.0-12.5', '30-60', '300-600', 'MAX 800', '300-600', '3000-4000', '200-300'],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: theme.headerBg,
      textColor: theme.headerText,
      fontStyle: 'bold',
    },
    bodyStyles: { halign: 'center', fontSize: 9 },
    alternateRowStyles: { fillColor: theme.altRow },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 3;

  if (boiler.notes) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...theme.headerText);
    doc.text(boiler.notes, 25, y);
    y += 8;
  }

  return y + 5;
}

function addSupportSystemsSection(doc: jsPDF, y: number, systems: SupportSystem[]): number {
  y = addSectionHeader(doc, y, 'Support Systems');

  const body = systems.map((system) => [
    system.name,
    system.cond || '—',
    system.ph || '—',
    system.trh || '—',
    system.notes || '—',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['System', 'Cond', 'pH', 'TrH', 'Notes']],
    body,
    theme: 'grid',
    headStyles: {
      fillColor: theme.headerBg,
      textColor: theme.headerText,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: theme.altRow },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 },
      4: { cellWidth: 50 },
    },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (doc as any).lastAutoTable.finalY + 8;
}

function addClosedLoopsSection(doc: jsPDF, y: number, loops: ClosedLoop[]): number {
  y = addSectionHeader(doc, y, 'Closed Loops');

  const body = loops.map((loop) => [
    loop.name,
    loop.ph || '—',
    loop.cond || '—',
    loop.no2Hot || '—',
    loop.no2Cold || '—',
    loop.notes || '—',
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Loop', 'pH', 'Cond', 'NO2 Hot', 'NO2 Cold', 'Notes']],
    body,
    theme: 'grid',
    headStyles: {
      fillColor: theme.headerBg,
      textColor: theme.headerText,
      fontStyle: 'bold',
    },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: theme.altRow },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 25 },
      5: { cellWidth: 45 },
    },
    margin: { left: 20, right: 20 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (doc as any).lastAutoTable.finalY + 8;
}
