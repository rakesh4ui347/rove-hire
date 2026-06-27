import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatCurrency, formatDate } from "./utils";

interface OfferLetterInput {
  candidateName: string;
  roleTitle: string;
  salaryAmount: number;
  salaryCurrency: string;
  startDate: Date;
  reportingManager: string;
  location: string;
}

interface NDAInput {
  candidateName: string;
}

async function drawHeader(page: ReturnType<PDFDocument["addPage"]>, title: string) {
  const { width, height } = page.getSize();
  page.drawRectangle({
    x: 0,
    y: height - 72,
    width,
    height: 72,
    color: rgb(0.08, 0.09, 0.11),
  });
  page.drawText("ROVE", {
    x: 50,
    y: height - 46,
    size: 22,
    color: rgb(1, 1, 1),
  });
  page.drawText(title, {
    x: 50,
    y: height - 62,
    size: 10,
    color: rgb(0.75, 0.75, 0.78),
  });
}

export async function generateOfferLetterPdf(input: OfferLetterInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  const { height } = page.getSize();
  let y = height - 110;

  drawHeader(page, "Employment Offer Letter");

  const lines = [
    formatDate(new Date()),
    "",
    `Dear ${input.candidateName},`,
    "",
    "We are pleased to offer you a position at ROVE Dashcam. After reviewing your qualifications and interview performance, we believe you will be a valuable addition to our team.",
    "",
    "Position Details",
    `Role: ${input.roleTitle}`,
    `Compensation: ${formatCurrency(input.salaryAmount, input.salaryCurrency)} per year`,
    `Start Date: ${formatDate(input.startDate)}`,
    `Reporting Manager: ${input.reportingManager}`,
    `Work Location: ${input.location}`,
    "",
    "This offer is contingent upon successful completion of background checks and verification of your right to work. Your employment will be at-will, meaning either party may terminate the relationship at any time, with or without cause.",
    "",
    "Benefits include health insurance, paid time off, equity participation, and a hardware stipend for your home office setup. Full details will be provided during onboarding.",
    "",
    "Please sign and return this letter within five business days to confirm your acceptance. We look forward to welcoming you to ROVE.",
    "",
    "Sincerely,",
    "",
    "Sarah Chen",
    "Head of People, ROVE",
  ];

  for (const line of lines) {
    const isHeading = line === "Position Details";
    page.drawText(line, {
      x: 50,
      y,
      size: isHeading ? 12 : 11,
      font: isHeading ? fontBold : font,
      color: rgb(0.12, 0.13, 0.15),
      maxWidth: 512,
      lineHeight: 14,
    });
    y -= isHeading ? 22 : line === "" ? 10 : line.length > 80 ? 28 : 16;
  }

  page.drawLine({
    start: { x: 50, y: 120 },
    end: { x: 250, y: 120 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText("Candidate Signature", {
    x: 50,
    y: 105,
    size: 9,
    font,
    color: rgb(0.45, 0.45, 0.48),
  });

  return doc.save();
}

export async function generateNDAPdf(input: NDAInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  const { height } = page.getSize();
  let y = height - 110;

  drawHeader(page, "Mutual Non-Disclosure Agreement");

  const paragraphs = [
    `This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of ${formatDate(new Date())} by and between ROVE Dashcam, Inc. ("ROVE") and ${input.candidateName} ("Recipient").`,
    "",
    "1. Confidential Information",
    'Either party may disclose non-public information including product roadmaps, hardware designs, software architecture, customer data, financial information, and business strategies ("Confidential Information").',
    "",
    "2. Obligations",
    "Recipient agrees to hold Confidential Information in strict confidence, use it solely for evaluating a potential employment relationship with ROVE, and not disclose it to any third party without prior written consent.",
    "",
    "3. Exclusions",
    "Confidential Information does not include information that is publicly available, already known to Recipient, independently developed, or rightfully received from a third party without restriction.",
    "",
    "4. Term",
    "This Agreement remains in effect for two (2) years from the date above. Obligations regarding trade secrets survive indefinitely.",
    "",
    "5. Return of Materials",
    "Upon request, Recipient will promptly return or destroy all Confidential Information and certify destruction in writing.",
    "",
    "IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.",
  ];

  for (const paragraph of paragraphs) {
    const isSection = /^\d+\./.test(paragraph);
    page.drawText(paragraph, {
      x: 50,
      y,
      size: isSection ? 11 : 10,
      font: isSection ? fontBold : font,
      color: rgb(0.12, 0.13, 0.15),
      maxWidth: 512,
      lineHeight: 13,
    });
    y -= paragraph === "" ? 8 : paragraph.length > 90 ? 36 : isSection ? 20 : 16;
  }

  page.drawText("ROVE Dashcam, Inc.", { x: 50, y: 140, size: 10, font: fontBold });
  page.drawLine({
    start: { x: 50, y: 125 },
    end: { x: 220, y: 125 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText("Authorized Signatory", { x: 50, y: 110, size: 9, font, color: rgb(0.45, 0.45, 0.48) });

  page.drawText(input.candidateName, { x: 320, y: 140, size: 10, font: fontBold });
  page.drawLine({
    start: { x: 320, y: 125 },
    end: { x: 490, y: 125 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText("Recipient", { x: 320, y: 110, size: 9, font, color: rgb(0.45, 0.45, 0.48) });

  return doc.save();
}

export async function generateSampleResumePdf(name: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  let y = 720;

  page.drawText(name, { x: 50, y, size: 24, font: fontBold });
  y -= 30;
  page.drawText("Software Engineer · sample resume for ROVE Hire demo", {
    x: 50,
    y,
    size: 11,
    font,
    color: rgb(0.4, 0.4, 0.42),
  });
  y -= 40;
  page.drawText("Experience", { x: 50, y, size: 14, font: fontBold });
  y -= 20;
  page.drawText("Senior Engineer — Example Corp (2021–Present)", {
    x: 50,
    y,
    size: 11,
    font: fontBold,
  });
  y -= 16;
  page.drawText("Built scalable web applications with React, Node.js, and PostgreSQL.", {
    x: 50,
    y,
    size: 10,
    font,
    maxWidth: 500,
  });

  return doc.save();
}
