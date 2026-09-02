export function buildEmailHtml(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #080B11;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f1f5f9;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .logo {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }
    .title {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .content {
      font-size: 16px;
      line-height: 1.6;
      color: #cbd5e1;
    }
    .content h2, .content h3 {
      color: #ffffff;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .content a {
      color: #f59e0b;
      text-decoration: none;
      font-weight: 600;
    }
    .content a:hover {
      text-decoration: underline;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      font-size: 13px;
      color: #64748b;
    }
    .accent-text {
      color: #f59e0b;
    }
    .button {
      display: inline-block;
      background-color: #f59e0b;
      color: #0f172a !important;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none !important;
      font-weight: bold;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="https://dersolab.com/icon.png" alt="DersoLab Logo" class="logo" />
        <h1 class="title">${title}</h1>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} DersoLab. Tüm hakları saklıdır.</p>
      <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
    </div>
  </div>
</body>
</html>
  `
}
