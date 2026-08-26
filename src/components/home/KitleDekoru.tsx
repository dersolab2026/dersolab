/**
 * Kitleye özel hero motifi.
 *
 * Üç panel aynı iskeleti kullanıyor; ayrımı yalnızca renkten değil
 * HAREKETTEN de alsın diye her kitlenin kendi motifi var:
 *
 *   veli    -> sakin süzülen baloncuklar (yumuşak, güven veren)
 *   eğitmen -> haftalık takvim ızgarası, hücreler sırayla doluyor
 *              (metin zaten "müsait saatlerinizi girin" diyor)
 *   öğrenci -> burada bir şey yok; onun motifi sayfa zemininde akan
 *              ders adları (SayfaDeseni)
 *
 * Hangi motifin görüneceğini CSS seçiyor, bu bileşen değil. Böylece
 * temayı bilmesi gerekmiyor ve hem ana sayfada hem panel kabuğunda
 * aynı şekilde kullanılabiliyor — panel kabuğu bir sunucu bileşeni ve
 * oturumun temasını taşımıyor.
 *
 * Hepsi `aria-hidden`: süs, içerik değil. `prefers-reduced-motion`
 * açıkken globals.css hareketi durduruyor.
 */

// Takvim izgarasinda hangi hucrelerin "dolacagi". Haftalik gorunum gibi
// 7 sutun; secilenler dagitik, desen belli olmasin diye.
const DOLU_HUCRE = [3, 9, 10, 16, 17, 22, 24, 25]

export function KitleDekoru({ koyuZemin = false }: { koyuZemin?: boolean }) {
  // Motif rengi zemine gore: koyu hero uzerinde beyaz, acik kart
  // uzerinde temanin murekkebi. Ayni bilesen iki yerde kullaniliyor.
  const ton = koyuZemin ? 'dl-motif-acik' : 'dl-motif-koyu'
  return (
    <>
      <div className={`dl-baloncuk-kap ${ton}`} aria-hidden>
        <span className="dl-baloncuk dl-baloncuk-1" />
        <span className="dl-baloncuk dl-baloncuk-2" />
      </div>

      <div className={`dl-takvim-kap ${ton}`} aria-hidden>
        <div className="dl-izgara">
          {Array.from({ length: 28 }, (_, i) => {
            const dolu = DOLU_HUCRE.indexOf(i)
            return (
              <span
                key={i}
                className={dolu >= 0 ? 'dl-hucre dolu' : 'dl-hucre'}
                style={dolu >= 0 ? { animationDelay: `${(dolu * 0.62).toFixed(2)}s` } : undefined}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
