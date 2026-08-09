import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { YokAtlasProgramRow } from '@/lib/yok-atlas/search-programs'

export function generateTercihListesiPdf(programs: YokAtlasProgramRow[], hazirlayan: string): Buffer {
  const doc = new jsPDF({ orientation: 'landscape' })

  doc.setFontSize(16)
  doc.text('Tercih Listesi', 14, 15)
  doc.setFontSize(10)
  doc.text(`Hazırlayan: ${hazirlayan}`, 14, 22)
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 27)

  autoTable(doc, {
    startY: 33,
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
    styles: { fontSize: 8 },
    headStyles: { fillColor: [221, 123, 58] },
  })

  return Buffer.from(doc.output('arraybuffer'))
}
