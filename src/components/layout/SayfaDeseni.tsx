import { LESSON_SUBJECTS, GUIDANCE_SUBJECT } from '@/lib/constants'
import { TEMA_ACIK } from '@/lib/tema'

/**
 * Sayfa zemini.
 *
 * Varsayilan dilde capraz dama deseni. Ogrenci temasinda dama Matrix'e
 * ait degil; onun yerine ders adlari asagi akiyor.
 *
 * Akan kelimeler UYDURULMUYOR: `SUBJECT_CATEGORIES` icindeki, yani
 * sitede gercekten ders verilen branslar. Vitrinde olmayan bir ders
 * adinin akmasi, olmayan bir hizmeti reklam etmek olurdu.
 *
 * Sutunlar her temada DOM'a giriyor ama yalnizca ogrenci temasinda
 * gorunuyor (CSS). Boylece desen tek bir bilesende kaliyor; kullanan
 * yedi sayfanin hicbirinin temayi bilmesi gerekmiyor.
 */

const BRANSLAR = [...LESSON_SUBJECTS, GUIDANCE_SUBJECT]

const SUTUN_SAYISI = 9
const SUTUN_UZUNLUGU = 6

// Her sutun listenin farkli bir yerinden basliyor, sureleri de farkli:
// ayni anda ayni kelimeler akmasin diye. Icerik iki kez yaziliyor;
// animasyon -%50'den 0'a gidince dikis yeri gorunmeden basa donuyor.
const SUTUNLAR = Array.from({ length: SUTUN_SAYISI }, (_, i) => {
  const bas = (i * 5) % BRANSLAR.length
  const metin = Array.from({ length: SUTUN_UZUNLUGU }, (_, k) => BRANSLAR[(bas + k) % BRANSLAR.length]).join(' · ')
  return {
    sol: 4 + i * 11,
    sure: 17 + ((i * 7) % 13),
    gecikme: -((i * 5) % 17),
    metin: `${metin} · ${metin} · `,
  }
})

/**
 * @param kelimeAkisi Akan ders adlari cizilsin mi.
 *
 * VARSAYILAN KAPALI ve bunu YALNIZCA ana sayfa aciyor. Onceden desen
 * kullanan yedi yuzeyin hepsinde akiyordu; vitrinde etkileyici olan sey
 * panelde ve pazar yerinde metnin arkasinda surekli kipirdayan bir
 * gurultuye donusuyordu. Ana sayfada kaliyor cunku orada isi tanitim
 * yapmak — hangi derslerin verildigini gosteriyor.
 *
 * Ogrenci temasi disinda zaten hicbir yerde gorunmuyordu (CSS kapatiyor);
 * bu bayrak onun ustune "ogrenci temasinda bile yalnizca ana sayfada"
 * kosulunu ekliyor.
 */
export function SayfaDeseni({ kelimeAkisi = false }: { kelimeAkisi?: boolean }) {
  // TEMA_ACIK sarti YALNIZCA performans/dayaniklilik icin degil:
  // sutunlar GERCEK METIN. Stil gelmeden once (ya da hic gelmezse)
  // sayfanin en ustunde dokuz satirlik bir ders adi duvari olarak
  // akiyorlar — canli onizlemede tam olarak bu goruldu. Tema kapaliyken
  // zaten hicbir kosulda gorunemiyorlar, o yuzden DOM'a hic girmiyorlar.
  const yagmurVar = kelimeAkisi && TEMA_ACIK

  return (
    <div className="sayfa-deseni" aria-hidden>
      {yagmurVar && (
      <div className="kod-yagmuru" hidden>
        {SUTUNLAR.map((s, i) => (
          <span
            key={i}
            className="kod-sutun"
            style={{
              left: `${s.sol}%`,
              animationDuration: `${s.sure}s`,
              animationDelay: `${s.gecikme}s`,
            }}
          >
            {s.metin}
          </span>
        ))}
      </div>
      )}
    </div>
  )
}
