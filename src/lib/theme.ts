/**
 * Ortak arayuz parcalari.
 *
 * Renkler sabit degil, `globals.css` icindeki tasarim jetonlarina bagli.
 * Sayfayi saran bir `data-tema` niteligi butun paleti degistiriyor:
 *   ogrenci -> Matrix terminali (koyu yesil, fosfor)
 *   veli    -> sicak (krem/cam gobegi)
 *   egitmen -> sakin otorite (acik, yesil vurgu)
 * Nitelik yoksa varsayilan marka paleti geciyor.
 *
 * Birincil dugmenin kendi jetonlari var (--dugme-zemin/--dugme-yazi):
 * genel vurgu rengiyle ayni olmak zorunda degil. Terminal temasinda
 * ornegin vurgu yazi rengi parlak fosfor, ama dugme "ters video" gibi
 * dolu fosfor zemin + koyu yazi olarak duruyor.
 */

export const PIXEL_CARD =
  'bg-[var(--yuzey)] rounded-2xl border-4 border-[var(--cizgi)] shadow-[0_6px_0_var(--golge)]'

export const PIXEL_BUTTON_PRIMARY =
  'dl-dugme inline-flex items-center justify-center bg-[var(--dugme-zemin)] text-[var(--dugme-yazi)] font-bold rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60'

export const PIXEL_BUTTON_SECONDARY =
  'dl-dugme inline-flex items-center justify-center bg-[var(--yuzey-ic)] text-[var(--yazi)] font-bold rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60'

export const PIXEL_BUTTON_DANGER =
  'dl-dugme inline-flex items-center justify-center bg-[var(--yuzey-ic)] text-[var(--tehlike)] font-bold rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60'

export const PIXEL_BADGE =
  'dl-rozet inline-block px-2 py-0.5 rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] text-xs font-bold'

export const PIXEL_BADGE_ACTIVE =
  'dl-rozet inline-block px-2 py-0.5 rounded-lg border-2 border-[var(--cizgi)] bg-[var(--vurgu)] text-[var(--yazi-ters)] text-xs font-bold'

export const PIXEL_INPUT =
  'w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all'
