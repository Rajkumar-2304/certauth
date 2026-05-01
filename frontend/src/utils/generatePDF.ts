export const generateCertificatePDF = (cert: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate - ${cert.certificateId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #fff; font-family: 'Lato', sans-serif; }

    .certificate-page {
      width: 297mm;
      min-height: 210mm;
      margin: 0 auto;
      background: #fff;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20mm;
    }

    /* Outer border */
    .outer-border {
      position: absolute;
      inset: 8mm;
      border: 3px solid #d4af37;
    }
    .inner-border {
      position: absolute;
      inset: 11mm;
      border: 1px solid #d4af37;
    }

    /* Corner ornaments */
    .corner {
      position: absolute;
      width: 20mm;
      height: 20mm;
      border-color: #d4af37;
      border-style: solid;
    }
    .corner-tl { top: 6mm; left: 6mm; border-width: 3px 0 0 3px; }
    .corner-tr { top: 6mm; right: 6mm; border-width: 3px 3px 0 0; }
    .corner-bl { bottom: 6mm; left: 6mm; border-width: 0 0 3px 3px; }
    .corner-br { bottom: 6mm; right: 6mm; border-width: 0 3px 3px 0; }

    /* Background watermark */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Cinzel', serif;
      font-size: 80pt;
      font-weight: 900;
      color: rgba(212,175,55,0.04);
      white-space: nowrap;
      pointer-events: none;
      letter-spacing: 5px;
    }

    /* Content */
    .content {
      position: relative;
      z-index: 1;
      text-align: center;
      width: 100%;
    }

    .logo-area {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 6mm;
    }

    .logo-circle {
      width: 16mm;
      height: 16mm;
      border-radius: 50%;
      border: 2px solid #d4af37;
      background: #0a0a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cinzel', serif;
      font-size: 7pt;
      color: #d4af37;
      letter-spacing: 1px;
    }

    .org-name {
      font-family: 'Cinzel', serif;
      font-size: 22pt;
      color: #0a0a1a;
      letter-spacing: 4px;
      font-weight: 700;
    }

    .org-subtitle {
      font-size: 8pt;
      color: #888;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .divider-gold {
      width: 60mm;
      height: 2px;
      background: linear-gradient(90deg, transparent, #d4af37, transparent);
      margin: 4mm auto;
    }

    .cert-title {
      font-family: 'Cinzel', serif;
      font-size: 11pt;
      color: #888;
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-bottom: 4mm;
    }

    .cert-of {
      font-family: 'Cinzel', serif;
      font-size: 32pt;
      color: #0a0a1a;
      font-weight: 900;
      letter-spacing: 2px;
      line-height: 1;
      margin-bottom: 6mm;
    }

    .presented-to {
      font-size: 10pt;
      color: #888;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 3mm;
    }

    .student-name {
      font-family: 'Cinzel', serif;
      font-size: 28pt;
      color: #d4af37;
      font-weight: 700;
      margin-bottom: 2mm;
      text-transform: capitalize;
    }

    .student-details {
      font-size: 9pt;
      color: #555;
      letter-spacing: 1px;
      margin-bottom: 6mm;
    }

    .completion-text {
      font-size: 11pt;
      color: #444;
      line-height: 1.8;
      max-width: 180mm;
      margin: 0 auto 6mm;
    }

    .course-name {
      font-family: 'Cinzel', serif;
      font-size: 16pt;
      color: #0a0a1a;
      font-weight: 700;
      margin: 2mm 0;
    }

    .grade-badge {
      display: inline-block;
      padding: 3mm 8mm;
      border: 2px solid #d4af37;
      border-radius: 20px;
      font-family: 'Cinzel', serif;
      font-size: 12pt;
      color: #d4af37;
      margin: 4mm 0 6mm;
      letter-spacing: 2px;
    }

    /* Info grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4mm;
      margin: 6mm 0;
      padding: 4mm 8mm;
      background: rgba(212,175,55,0.04);
      border: 1px solid rgba(212,175,55,0.2);
      border-radius: 4px;
    }

    .info-item { text-align: center; }
    .info-label {
      font-size: 7pt;
      color: #d4af37;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 1mm;
      font-weight: 700;
    }
    .info-value {
      font-size: 9pt;
      color: #333;
      font-weight: 700;
    }

    /* Signatures */
    .sig-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8mm;
      margin-top: 8mm;
      padding-top: 4mm;
    }

    .sig-item { text-align: center; }
    .sig-line {
      width: 100%;
      height: 1px;
      background: #333;
      margin-bottom: 2mm;
    }
    .sig-name {
      font-size: 8pt;
      color: #333;
      font-weight: 700;
      font-family: 'Cinzel', serif;
    }
    .sig-title {
      font-size: 7pt;
      color: #888;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* Cert ID */
    .cert-id-bar {
      margin-top: 6mm;
      padding: 2mm 4mm;
      background: #0a0a1a;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cert-id-label { font-size: 7pt; color: #d4af37; letter-spacing: 2px; text-transform: uppercase; }
    .cert-id-value { font-family: 'Cinzel', serif; font-size: 9pt; color: #fff; letter-spacing: 2px; }
    .cert-hash { font-size: 7pt; color: #888; font-family: monospace; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .certificate-page { margin: 0; }
      @page { size: A4 landscape; margin: 0; }
    }
  </style>
</head>
<body>
<div class="certificate-page">
  <!-- Borders -->
  <div class="outer-border"></div>
  <div class="inner-border"></div>
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>

  <!-- Watermark -->
  <div class="watermark">CERTAUTH</div>

  <!-- Main Content -->
  <div class="content">
    <!-- Header -->
    <div class="logo-area">
      <div class="logo-circle">CERT<br/>AUTH</div>
      <div>
        <div class="org-name">CERTAUTH</div>
        <div class="org-subtitle">Academic Authenticity Validator · SIH25029</div>
      </div>
    </div>

    <div class="divider-gold"></div>

    <div class="cert-title">This is to certify that</div>

    <div class="student-name">${cert.studentName}</div>
    <div class="student-details">
      Roll No: ${cert.rollNo || '—'} &nbsp;|&nbsp; ${cert.institution}
    </div>

    <div class="completion-text">
      has successfully completed the requirements for the degree of
    </div>

    <div class="course-name">${cert.course}</div>

    ${cert.grade ? `<div class="grade-badge">Grade: ${cert.grade}</div>` : ''}

    <div class="divider-gold"></div>

    <!-- Info Grid -->
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Issue Date</div>
        <div class="info-value">${cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Issued By</div>
        <div class="info-value">${cert.issuedBy || '—'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value" style="color: #22c55e; text-transform: uppercase;">${cert.status || 'Active'}</div>
      </div>
    </div>

    <!-- Signatures -->
    <div class="sig-row">
      <div class="sig-item">
        <div class="sig-line"></div>
        <div class="sig-name">Head of Department</div>
        <div class="sig-title">${cert.institution}</div>
      </div>
      <div class="sig-item">
        <div class="sig-line"></div>
        <div class="sig-name">${cert.issuedBy || 'Authorized Signatory'}</div>
        <div class="sig-title">Certificate Issuer</div>
      </div>
      <div class="sig-item">
        <div class="sig-line"></div>
        <div class="sig-name">Principal / Director</div>
        <div class="sig-title">${cert.institution}</div>
      </div>
    </div>

    <!-- Certificate ID bar -->
    <div class="cert-id-bar">
      <span class="cert-id-label">Certificate ID</span>
      <span class="cert-id-value">${cert.certificateId}</span>
      <span class="cert-hash">SHA-256: ${cert.documentHash ? cert.documentHash.substring(0, 24) + '...' : '—'}</span>
    </div>
  </div>
</div>

<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 500);
  };
</script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};
