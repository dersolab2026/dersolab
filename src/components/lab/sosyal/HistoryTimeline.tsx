'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Target,
  ShieldAlert,
  Award,
  Scroll,
  Search,
  CheckCircle2,
  Bookmark,
  ChevronRight,
} from 'lucide-react'

interface HistoryEvent {
  year: string
  title: string
  era: 'İlk Türkler' | 'Selçuklu' | 'Osmanlı' | 'Kurtuluş Savaşı' | 'Cumhuriyet'
  summary: string
  examTip: string
  tag: string
  color: string
}

const HISTORY_EVENTS: HistoryEvent[] = [
  {
    year: 'MÖ 209',
    title: 'Mete Han ve Onlu Teşkilat',
    era: 'İlk Türkler',
    summary: 'Mete Han tahta çıktı, Türk kara kuvvetlerinin temeli sayılan ilk düzenli ordu ve onlu teşkilatlanma kuruldu.',
    examTip: 'ÖSYM & LGS: Türk ordusunun kuruluş yılı MÖ 209 kabul edilir. Islıklı ok ve hilal taktiği Mete Han ile başlamıştır.',
    tag: 'Teşkilatlanma',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    year: '732',
    title: 'Orhun (Göktürk) Yazıtları',
    era: 'İlk Türkler',
    summary: 'Kutluk (II. Göktürk) Devleti döneminde Bilge Kağan, Kül Tigin ve Vezir Tonyukuk adına dikilen ilk Türkçe yazılı anıtlar.',
    examTip: 'ÖSYM Soru Klasiği: Türk adının geçtiği ilk Türkçe yazılı belgelerdir. İlk siyasetname ve sosyal devlet anlayışının belgesidir.',
    tag: 'İlk Yazılı Belge',
    color: 'from-amber-600 to-orange-600',
  },
  {
    year: '751',
    title: 'Talas Savaşı',
    era: 'İlk Türkler',
    summary: 'Abbasiler ile Çinliler arasındaki savaşta Karluk Türkleri Abbasileri destekledi. Türk-İslam ilişkileri resmen başladı.',
    examTip: 'ÖSYM: Türklerin kitleler halinde İslamiyet\'e geçişinin başlangıcıdır. Kâğıt ilk kez Çin dışına Semerkant\'a taşınmıştır.',
    tag: 'Kültür & Din',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    year: '1071',
    title: 'Malazgirt Zaferi',
    era: 'Selçuklu',
    summary: 'Sultan Alparslan Bizans İmparatoru Romen Diyojen\'i mağlup etti. Anadolu\'nun kapıları Türklere sonuna kadar açıldı.',
    examTip: 'ÖSYM: Anadolu\'da 1. Beylikler Dönemi (Danişmentliler, Saltuklular, Mengücekliler, Artuklular, Çaka Beyliği) bu zafer sonrası kuruldu.',
    tag: 'Dönüm Noktası',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    year: '1176',
    title: 'Miryokefalon Zaferi',
    era: 'Selçuklu',
    summary: 'II. Kılıçarslan Bizans ordusunu pusuya düşürerek imha etti. Bizans\'ın Türkleri Anadolu\'dan atma ümidi tamamen tükendi.',
    examTip: 'ÖSYM Formülü: Pasinler = Keşif, Malazgirt = Yurt Açan, Miryokefalon = Yurt Tutan (Anadolu kesin Türk yurdu oldu).',
    tag: 'Kesinleşme',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    year: '1299',
    title: 'Osmanlı Devleti\'nin Kuruluşu',
    era: 'Osmanlı',
    summary: 'Osman Gazi önderliğinde Söğüt ve Domaniç merkezli kurulan beylik, kısa sürede üç kıtaya yayılan bir cihan devletine dönüştü.',
    examTip: 'ÖSYM: Halil İnalcık\'a göre Osmanlı\'nın hanedan hüviyeti kazanması 1302 Koyunhisar (Bapheus) Savaşı ile tescillenmiştir.',
    tag: 'Devletleşme',
    color: 'from-rose-500 to-pink-600',
  },
  {
    year: '1453',
    title: 'İstanbul\'un Fethi',
    era: 'Osmanlı',
    summary: 'Fatih Sultan Mehmed, 53 günlük kuşatmanın ardından 1000 yıllık Doğu Roma (Bizans) İmparatorluğu\'na son verdi.',
    examTip: 'ÖSYM & LGS: Orta Çağ kapandı, Yeni Çağ başladı. İpek Yolu Osmanlı\'ya geçti; bu durum Avrupalıları Coğrafi Keşiflere zorladı.',
    tag: 'Çağ Açan Zafer',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    year: '1526',
    title: 'Mohaç Meydan Muharebesi',
    era: 'Osmanlı',
    summary: 'Kanuni Sultan Süleyman önderliğindeki Osmanlı ordusu, Macaristan Krallığı ordusunu 2 saat gibi kısa bir sürede imha etti.',
    examTip: 'ÖSYM: Dünyanın en kısa süren meydan savaşıdır. Macaristan Osmanlı hâkimiyetine girmiş, Orta Avrupa kapıları açılmıştır.',
    tag: 'Askerî Deha',
    color: 'from-violet-500 to-fuchsia-600',
  },
  {
    year: '1533',
    title: 'İstanbul (İbrahim Paşa) Antlaşması',
    era: 'Osmanlı',
    summary: 'Avusturya Arşidükü Ferdinand ile imzalandı. Avusturya Arşidükü protokolde Osmanlı Sadrazamına denk sayıldı.',
    examTip: 'ÖSYM Soru Klasiği: Osmanlı Devleti Avrupa karşısında siyasi ve protokol üstünlüğünü (mütekabiliyet ilkesini aşarak) kabul ettirmiştir!',
    tag: 'Diplomasi',
    color: 'from-purple-500 to-pink-600',
  },
  {
    year: '1699',
    title: 'Karlofça Antlaşması',
    era: 'Osmanlı',
    summary: 'Kutsal İttifak devletlerine karşı 16 yıllık savaş sonunda imzalandı. Osmanlı batıda ilk kez devasa topraklar kaybetti.',
    examTip: 'ÖSYM: Osmanlı\'da Duraklama bitti, Gerileme Dönemi başladı. 1921 Sakarya Savaşı\'na kadar sürecek olan 238 yıllık geri çekilme başladı.',
    tag: 'Kritik Antlaşma',
    color: 'from-rose-500 to-red-600',
  },
  {
    year: '1839',
    title: 'Tanzimat Fermanı (Gülhane Hatt-ı Hümayunu)',
    era: 'Osmanlı',
    summary: 'Sultan Abdülmecid döneminde Hariciye Nazırı Mustafa Reşit Paşa tarafından ilan edildi. Padişah kendi gücünün üstünde kanun gücü tanıdı.',
    examTip: 'ÖSYM & AYT: Osmanlı anayasacılığının ve hukukun üstünlüğünün ilk belgesidir. Tüm tebaaya (Müslim-Gayrimüslim) eşit can ve mal güvenliği sağlandı.',
    tag: 'Hukuk Devleti',
    color: 'from-amber-500 to-red-500',
  },
  {
    year: '1915',
    title: 'Çanakkale Deniz & Kara Zaferleri',
    era: 'Kurtuluş Savaşı',
    summary: 'İtilaf donanmasının boğazı geçişi 18 Mart\'ta durduruldu. Anafartalar Kahramanı Mustafa Kemal Paşa kara savaşlarında destan yazdı.',
    examTip: 'ÖSYM: Çanakkale Geçilmez! I. Dünya Savaşı en az 2 yıl uzadı, Rusya\'ya yardım gidemeyince Çarlık çöktü ve Mustafa Kemal Millî Mücadele lideri oldu.',
    tag: 'Destan',
    color: 'from-red-600 to-amber-600',
  },
  {
    year: '1919',
    title: 'Amasya Genelgesi',
    era: 'Kurtuluş Savaşı',
    summary: '"Milletin bağımsızlığını, yine milletin azim ve kararı kurtaracaktır." ilkesiyle Kurtuluş Savaşı\'nın rotası çizildi.',
    examTip: 'ÖSYM & LGS: Millî Mücadele\'nin amacı, gerekçesi ve yöntemi ilk kez burada belirlenmiştir. Üstü kapalı millî egemenlik ihtilali çağrısıdır.',
    tag: 'İhtilal Beyannamesi',
    color: 'from-sky-500 to-blue-600',
  },
  {
    year: '23 Nisan 1920',
    title: 'TBMM\'nin Açılışı',
    era: 'Kurtuluş Savaşı',
    summary: 'Ankara\'da toplanan Birinci Meclis; millet iradesine dayalı bağımsız yeni Türk Devleti\'nin temellerini attı.',
    examTip: 'ÖSYM: Kurucu, ihtilalci ve savaşçı bir meclistir. Meclis Hükümeti sistemi uygulanmış, güçler birliği (yasama-yürütme) ilkesi benimsenmiştir.',
    tag: 'Millî İrade',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    year: '10 Ağustos 1920',
    title: 'Sevr Antlaşması',
    era: 'Kurtuluş Savaşı',
    summary: 'İtilaf devletlerince Osmanlı hükümetine dayatılan ölüm fermanı. Mebusan Meclisi onaylamadığı için hukuken geçersizdir.',
    examTip: 'ÖSYM: Hukuken geçersizdir (ölü doğmuş antlaşmadır) çünkü meclis onayı yoktur. Türk milleti bu antlaşmayı Kurtuluş Savaşı ile yırtıp atmıştır.',
    tag: 'Millî Mücadele',
    color: 'from-red-500 to-orange-600',
  },
  {
    year: '1921',
    title: 'Sakarya Meydan Muharebesi',
    era: 'Kurtuluş Savaşı',
    summary: '"Hattı müdafaa yoktur, sathı müdafaa vardır. O satıh bütün vatandır." 22 gün 22 gece süren savaşla Yunan taarruzu kırıldı.',
    examTip: 'ÖSYM Soru Bankası: 1683 II. Viyana Kuşatması\'ndan beri süren geri çekilme sona erdi. Mustafa Kemal\'e "Mareşallik" ve "Gazilik" unvanı verildi.',
    tag: 'Son Savunma',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    year: '30 Ağustos 1922',
    title: 'Büyük Taarruz & Başkomutanlık',
    era: 'Kurtuluş Savaşı',
    summary: '"Ordular, ilk hedefiniz Akdeniz\'dir, ileri!" emriyle Dumlupınar\'da düşman ordusu kuşatılıp yok edildi; 9 Eylül\'de İzmir kurtarıldı.',
    examTip: 'ÖSYM: Kurtuluş Savaşı\'nın silahlı mücadele safhası sona erdi, diplomasi safhası (Mudanya Mütarekesi) başladı.',
    tag: 'Büyük Zafer',
    color: 'from-red-600 to-rose-600',
  },
  {
    year: '24 Temmuz 1923',
    title: 'Lozan Barış Antlaşması',
    era: 'Cumhuriyet',
    summary: 'İsmet İnönü başkanlığındaki TBMM heyeti bağımsızlığı tüm dünyaya onaylattı. Kapitülasyonlar kaldırıldı, Misakımillî büyük oranda gerçekleşti.',
    examTip: 'ÖSYM Soru Bankası: Yeni Türk Devleti\'nin kurucu ve tapu senedidir. Kapitülasyonlar koşulsuz kaldırılmış, Düyun-u Umumiye son bulmuştur.',
    tag: 'Tapu Senedi',
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    year: '29 Ekim 1923',
    title: 'Cumhuriyetin İlanı',
    era: 'Cumhuriyet',
    summary: 'Yeni Türk devletinin yönetim biçimi belirlendi, Mustafa Kemal Atatürk ilk Cumhurbaşkanı seçildi. Kabine sistemine geçildi.',
    examTip: 'ÖSYM & LGS: Devletin adı ve rejimi netleşti. Meclis Hükümeti sisteminden Kabine sistemine geçilerek hükümet bunalımları çözüldü.',
    tag: 'Yeni Çağ',
    color: 'from-rose-500 to-red-600',
  },
]

export function HistoryTimeline() {
  const [selectedEra, setSelectedEra] = useState<string>('Hepsi')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeEvent, setActiveEvent] = useState<HistoryEvent>(HISTORY_EVENTS[0])

  const ERAS = ['Hepsi', 'İlk Türkler', 'Selçuklu', 'Osmanlı', 'Kurtuluş Savaşı', 'Cumhuriyet']

  const filteredEvents = HISTORY_EVENTS.filter((e) => {
    const matchesEra = selectedEra === 'Hepsi' || e.era === selectedEra
    const matchesQuery =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.year.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesEra && matchesQuery
  })

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900/60 border border-amber-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Maarif Modeli & MEB
            </span>
            <span className="text-xs text-slate-400">5 - 12. Sınıf Tarih & Kronoloji</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Scroll className="w-6 h-6 text-amber-400" />
            İnteraktif Tarih Çizelgesi & Kritik Antlaşmalar
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Tarihi olayları kronolojik akışında inceleyin, her antlaşmanın arka planını ve{' '}
            <strong className="text-amber-300">ÖSYM soru tuzaklarını</strong> tek tıkla öğrenin!
          </p>
        </div>

        {/* Era Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-xl bg-slate-900/80 border border-slate-700/60 self-start md:self-auto">
          {ERAS.map((era) => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedEra === era
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {era}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Timeline View ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Chronological Feed */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              Tarih Şeridi ({filteredEvents.length} Olay)
            </span>

            {/* Search Input */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Olay veya yıl ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-slate-950 rounded-lg border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Timeline Feed Container */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1.5 no-scrollbar">
            {filteredEvents.map((item, index) => {
              const isSelected = activeEvent.title === item.title
              return (
                <div
                  key={index}
                  onClick={() => setActiveEvent(item)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Year badge */}
                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center shrink-0 min-w-[70px]">
                      <span className="font-mono font-bold text-xs text-amber-400 block">
                        {item.year}
                      </span>
                      <span className="text-[9px] text-slate-500 block uppercase font-semibold">
                        {item.era}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-800">
                      {item.tag}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Active Event Deep-Dive & Exam Takeaways */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeEvent.year} — {activeEvent.era}
              </span>
              <span className="text-xs text-slate-400 font-mono">{activeEvent.tag}</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">{activeEvent.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{activeEvent.summary}</p>
            </div>

            {/* Exam Tip Card */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Target className="w-4 h-4" />
                <span>ÖSYM Sınav Sorusu Nasıl Gelir?</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans">{activeEvent.examTip}</p>
            </div>

            {/* Core Historical Rule */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200 block mb-1">Tarih Biliminin Temel Kuralı:</strong>
              Olaylar dönemin siyasi, sosyal ve coğrafi şartlarına göre değerlendirilmelidir. Günümüz ahlak ve hukuk kurallarıyla geçmiş yargılanamaz (Anakronizm hatası).
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
