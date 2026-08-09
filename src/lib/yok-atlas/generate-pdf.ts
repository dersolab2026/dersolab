import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { YokAtlasProgramRow } from '@/lib/yok-atlas/search-programs'

const NAVY: [number, number, number] = [27, 36, 48]
const ORANGE: [number, number, number] = [221, 123, 58]
const CREAM: [number, number, number] = [244, 241, 232]
const MINT_BG: [number, number, number] = [213, 234, 227]
const GRAY: [number, number, number] = [110, 118, 128]

const HEADER_HEIGHT = 24
const FOOTER_Y = 200

export function generateTercihListesiPdf(programs: YokAtlasProgramRow[], hazirlayan: string): Buffer {
  const doc = new jsPDF({ orientation: 'landscape' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const tarih = new Date().toLocaleDateString('tr-TR')

  function drawHeader() {
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, pageWidth, HEADER_HEIGHT, 'F')

    doc.setTextColor(...CREAM)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.text('DERSOLAB', 12, 11)

    doc.setTextColor(...ORANGE)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.text('DANIŞMANLIK NOTU', 12, 17)

    doc.setTextColor(...CREAM)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.text('Tercih Listesi', pageWidth - 12, 11, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.text(`Hazırlayan: ${hazirlayan}  ·  Tarih: ${tarih}  ·  ${programs.length} bölüm`, pageWidth - 12, 17, { align: 'right' })
  }

  function drawFooter(pageNumber: number, pageCount: number) {
    doc.setDrawColor(...ORANGE)
    doc.setLineWidth(0.4)
    doc.line(12, FOOTER_Y, pageWidth - 12, FOOTER_Y)

    doc.setTextColor(...GRAY)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.text('dersolab.com', 12, FOOTER_Y + 5)
    doc.text(`Bu liste ${tarih} tarihinde hazırlanmıştır.`, pageWidth / 2, FOOTER_Y + 5, { align: 'center' })
    doc.text(`Sayfa ${pageNumber} / ${pageCount}`, pageWidth - 12, FOOTER_Y + 5, { align: 'right' })
  }

  autoTable(doc, {
    startY: HEADER_HEIGHT + 8,
    margin: { top: HEADER_HEIGHT + 4, bottom: 18 },
    head: [['#', 'Üniversite', 'Bölüm', 'İl', 'Puan Türü', 'Taban Puan', 'Sıralama', 'Kontenjan']],
    body: programs.map((p, i) => [
      String(i + 1),
      p.universiteAdi,
      p.birimAdi,
      p.ilAdi ?? '-',
      p.puanTuru ?? '-',
      p.minPuan?.toFixed(2) ?? '-',
      p.basariSirasi?.toLocaleString('tr-TR') ?? '-',
      p.kontenjan != null ? String(p.kontenjan) : '-',
    ]),
    styles: { fontSize: 8.5, textColor: NAVY, lineColor: [200, 196, 184], lineWidth: 0.2 },
    headStyles: { fillColor: NAVY, textColor: CREAM, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: MINT_BG },
    didDrawPage: () => drawHeader(),
  })

  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    drawFooter(i, pageCount)
  }

  return Buffer.from(doc.output('arraybuffer'))
}
