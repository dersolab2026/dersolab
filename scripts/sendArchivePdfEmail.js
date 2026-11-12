const fs = require('fs')
const path = require('path')
const { Resend } = require('resend')

// 1. Read .env.local
const envPath = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
let apiKey = ''
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (trimmed.startsWith('RESEND_API_KEY=')) {
    apiKey = trimmed.split('=')[1].trim().replace(/['"]/g, '')
  }
}

if (!apiKey) {
  console.error('RESEND_API_KEY not found in .env.local')
  process.exit(1)
}

const resend = new Resend(apiKey)
const pdfPath = path.join(__dirname, '../public/downloads/DersoLab_Arsiv_Katalogu_2026.pdf')
if (!fs.existsSync(pdfPath)) {
  console.error('PDF file not found:', pdfPath)
  process.exit(1)
}

const pdfBuffer = fs.readFileSync(pdfPath)
const recipientEmail = 'dersolab2026@gmail.com'

console.log(`Sending email with attachment to: ${recipientEmail}...`)
console.log(`PDF Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`)

const emailHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>DersoLab Arşiv Kataloğu 2026</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; margin: 0; padding: 30px; color: #f1f5f9;">
  <div style="max-width: 640px; margin: 0 auto; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%); padding: 36px 32px; text-align: center;">
      <div style="font-size: 13px; font-weight: 700; letter-spacing: 2px; color: #bfdbfe; text-transform: uppercase; margin-bottom: 8px;">DersoLab Akademi & Rehberlik</div>
      <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.2;">Resmi Arşiv Kataloğu (2026)</h1>
      <p style="margin: 10px 0 0; font-size: 14px; color: #e0e7ff;">Kitap Kulübü • Sinema Kulübü • Bilim Dehaları ve Düşünürler</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-top: 0;">
        Merhaba Sayın <strong>Egemen Işık</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
        Talebiniz doğrultusunda güncellenen ve genişletilen <strong>DersoLab Kültür, Sanat ve Düşünce Arşivi</strong>'nin 41 sayfalık tam kataloğu oluşturulmuş olup ekte PDF dosyası olarak bilgilerinize sunulmuştur.
      </p>

      <!-- Stats Grid -->
      <div style="display: table; width: 100%; margin: 24px 0;">
        <div style="display: table-row;">
          <!-- Card 1 -->
          <div style="display: table-cell; width: 33.33%; padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; color: #10b981;">1.931</div>
            <div style="font-size: 11px; font-weight: 700; color: #f8fafc; margin-top: 4px;">Kitap Kulübü</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">932 Ortaokul + 999 Lise</div>
          </div>
          <!-- Spacer -->
          <div style="display: table-cell; width: 8px;"></div>
          <!-- Card 2 -->
          <div style="display: table-cell; width: 33.33%; padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; color: #3b82f6;">100</div>
            <div style="font-size: 11px; font-weight: 700; color: #f8fafc; margin-top: 4px;">Kült Sinema Filmi</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">35 Ortaokul + 65 Lise</div>
          </div>
          <!-- Spacer -->
          <div style="display: table-cell; width: 8px;"></div>
          <!-- Card 3 -->
          <div style="display: table-cell; width: 33.33%; padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; text-align: center;">
            <div style="font-size: 24px; font-weight: 800; color: #a855f7;">100</div>
            <div style="font-size: 11px; font-weight: 700; color: #f8fafc; margin-top: 4px;">Bilim & Düşünür</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">7 Disiplinde İlham Dehası</div>
          </div>
        </div>
      </div>

      <!-- Highlights Box -->
      <div style="background: rgba(30, 41, 59, 0.6); border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; color: #60a5fa; margin-bottom: 6px;">Katalog Düzenleme Özeti:</div>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
          <li><strong>Motivasyon Dehaları:</strong> 100 seçkin isme çıkarıldı; tüm pedagojik rehberlik tavsiyeleri ve sözleriyle listelendi. (Kara listedeki Einstein, Tesla, Curie, Arf, Feynman hariç tutulmuştur.)</li>
          <li><strong>Sinema Arşivi:</strong> 100 filme tamamlandı; IMDb puanı, yönetmen, pedagojik kazanım ve replikleriyle arşivlendi. (Kara listedeki Yukarı Bak, Yıldızlararası, Can Dostum, Ölü Ozanlar Derneği, Ekim Düşü hariç tutulmuştur.)</li>
          <li><strong>Kitap Kulübü:</strong> 1.931 eserlik devasa havuz Ortaokul/LGS ve Lise/YKS olarak iki büyük bölümde eksiksiz indekslendi. (Ömer Seyfettin ve daha önce paylaşılan eserler elenmiştir.)</li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 28px;">
        Ekli <strong>DersoLab_Arsiv_Katalogu_2026.pdf</strong> dosyasını cihazınıza indirebilir veya arşivinizde saklayabilirsiniz.
      </p>

      <!-- Signature -->
      <div style="border-top: 1px solid #334155; padding-top: 20px; font-size: 12px; color: #64748b;">
        <strong style="color: #cbd5e1;">DersoLab Eğitim Teknolojileri</strong><br>
        Web: <a href="https://www.dersolab.com" style="color: #60a5fa; text-decoration: none;">www.dersolab.com</a> • E-posta: bildirim@dersolab.com
      </div>
    </div>

  </div>
</body>
</html>
`

async function main() {
  try {
    const res = await resend.emails.send({
      from: 'DersoLab <bildirim@dersolab.com>',
      to: recipientEmail,
      subject: 'DersoLab Resmi Arşiv Kataloğu (1.931 Kitap, 100 Film, 100 Deha) - PDF',
      html: emailHtml,
      attachments: [
        {
          filename: 'DersoLab_Arsiv_Katalogu_2026.pdf',
          content: pdfBuffer,
        },
      ],
    })

    console.log('Email sent successfully!', res)
  } catch (error) {
    console.error('Failed to send email:', error)
    process.exit(1)
  }
}

main()
