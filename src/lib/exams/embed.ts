/**
 * PostgREST gomulu iliskileri bire-bir olsa bile DIZI olarak dondurebiliyor.
 * Dogrudan `.alan` okumak sessizce undefined veriyor ve typecheck bunu
 * `any` zincirinde yakalamiyor. Tek bir yerde normalize ediyoruz.
 */
export function tekil<T>(deger: T | T[] | null | undefined): T | null {
  if (deger == null) return null
  return Array.isArray(deger) ? (deger[0] ?? null) : deger
}
