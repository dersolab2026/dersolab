'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  ChevronRight
} from 'lucide-react'

// 3 Gerçek Zümre Hocası ve Gerçek Sınav Diyalogları
const CASSETTES = [
  {
    id: 'gokce',
    name: 'Gökçe Lale',
    role: 'Fizik Zümre Bşk.',
    exp: '19 Yıl Deneyim',
    tag: 'AYT Sayısal • 11-12. Sınıf',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/9397685d-4845-4557-aefe-652b86827117/avatar.jpg',
    subject: 'AYT Fizik',
    topic: 'Momentum & İtme Sorularında 15 Saniye Kuralı',
    quote: 'ÖSYM son 5 yıldır ezber formül sormuyor. Şekle bakıp olay anını kafasında canlandıramayan çocuk 14 sorunun yarısını boş bırakıyor. Biz burada formül ezberletmiyoruz; sorunun resmini zihninde çizdiriyoruz.',
    audioTitle: 'Gökçe Hoca anlatıyor • "ÖSYM formülü nereye saklar?"',
    studentDoubt: 'Öğrencinin Takıldığı Yer: "Hocam formülü yazıyorum ama cevabım şıklarda çıkmıyor, iç patlama sorularında hep işaret hatası yapıyorum..."',
    annotation: '✎ Gökçe Hoca: Çünkü soruyu çözerken patlamanın tek boyutta olduğunu varsaydın. Dış kuvvet sıfırsa momentum x ve y ekseninde ayrı ayrı korunur. Formül arama, iki tane ok çiz; soru 15 saniyede bitiyor.',
    accent: '#F59E0B'
  },
  {
    id: 'selva',
    name: 'Selva Şahin',
    role: 'Türk Dili & YKS Koçu',
    exp: '12 Yıl Deneyim',
    tag: 'TYT Türkçe • Derece Koçluğu',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/d96a9da2-0057-4c2e-9d74-91c07a5ea9ee/avatar.jpeg',
    subject: 'TYT Türkçe & Paragraf',
    topic: 'İki Şık Arasında Kalıp Yanlışı İşaretlemeye Son',
    quote: 'Türkçede 40 soruyu 45 dakikada çözüyorsan zaten maça 1-0 mağlup başlıyorsun. Paragrafta şablon okuma taktiğiyle 32 dakikada bitirip matematiğe ekstra süre artırıyoruz.',
    audioTitle: 'Selva Hoca anlatıyor • "Paragrafı iki kez okumayı bırakın"',
    studentDoubt: 'Öğrencinin Takıldığı Yer: "Ana düşünce sorularında B ile D arasında kalıyorum, ne zaman birini seçsem hep diğeri doğru çıkıyor..."',
    annotation: '✎ Selva Hoca: Çünkü metni baştan sona roman gibi okuyorsun. Paragraftaki "oysa, ne var ki, asıl mesele" gibi yön değiştiren bağlaçları ara. Yazarın asıl derdi o bağlaçtan sonraki ilk cümledir.',
    accent: '#38BDF8'
  },
  {
    id: 'nurcan',
    name: 'Nurcan Karaağaç',
    role: 'LGS Türkçe & Mantık',
    exp: '10 Yıl Deneyim',
    tag: 'LGS 8. Sınıf • Mantık Muhakeme',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/14082db7-203e-48a2-9911-986f3059aff1/avatar.jpeg',
    subject: 'LGS Türkçe & Mantık',
    topic: 'Yeni Nesil Grafik ve Tablo Sorularında Panik Yönetimi',
    quote: 'LGS mantık soruları bilgi değil, sakinlik ölçer. Masaya şemayı doğru kuran çocuk ilk yüzde 1’lik dilime girer.',
    audioTitle: 'Nurcan Hoca anlatıyor • "Tabloyu kur, 50 saniyede çöz"',
    studentDoubt: 'Öğrencinin Takıldığı Yer: "Öncülleri okurken kafam karışıyor, tablo çizmeye kalkınca 4 dakikam gidiyor..."',
    annotation: '✎ Nurcan Hoca: Panik yok. Önce kesin bilgiyi (Örn: "Ahmet daima Ayşe’nin karşısındadır") yerleştir. İhtimalleri kenara tireyle yaz. 3 dakikalık soruyu 50 saniyede bitiririz.',
    accent: '#10B981'
  }
]

export function TactileDeskView() {
  const [activeCassetteId, setActiveCassetteId] = useState('gokce')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [currentNet, setCurrentNet] = useState(54)

  const activeCassette = CASSETTES.find((c) => c.id === activeCassetteId) || CASSETTES[0]

  // Gerçekçi Net Analizi (Samimi Türkçe)
  const getTargetAnalysis = (net: number) => {
    if (net < 50) {
      return {
        level: 'Temel Konularda Açıklar Var',
        advice: 'Önce her hafta en çok soru çıkan 2 temel konuyu kapatıyoruz.',
        study: 'Haftada 2-3 saat birebir canlı seans tavsiye edilir.',
        targetSchool: 'Anadolu Liseleri & Temel Üniversite Barajı'
      }
    } else if (net < 70) {
      return {
        level: 'Konular Var Ama Soru Taktikleri Eksik',
        advice: 'Yeni nesil sorularda süre yetmiyor; çeldirici eleme taktikleriyle +15 net rahat gelir.',
        study: 'Haftada 2 saat soru analizi seansı yeterli.',
        targetSchool: 'Nitelikli Anadolu Liseleri • Mühendislik & Hukuk'
      }
    } else if (net < 85) {
      return {
        level: 'İlk Yüzde 1’lik Dilim Eşiği',
        advice: 'Konu eksiğin yok; sadece ÖSYM’nin tuzak kurduğu soru tiplerini ayıklıyoruz.',
        study: 'Haftada 1-2 saat ileri düzey soru seansı.',
        targetSchool: 'Kabataş Erkek • İstanbul Erkek • İTÜ & ODTÜ'
      }
    } else {
      return {
        level: 'Derece Grubu (İlk 500 Hedefi)',
        advice: 'Hata payını sıfıra indirmek için sadece sınav komisyonu mantığıyla deneme tarıyoruz.',
        study: 'Haftada 1 saat rafine koçluk ve zümre analizi.',
        targetSchool: 'Galatasaray Lisesi • Boğaziçi Bilgisayar • Koç Tıp'
      }
    }
  }

  const analysis = getTargetAnalysis(currentNet)

  return (
    <div className="min-h-screen bg-[#111317] text-[#EDEAE5] font-sans selection:bg-[#F59E0B] selection:text-slate-950 pb-20">
      
      {/* ── ÜST BAR ── */}
      <header className="border-b border-white/[0.08] bg-[#0E1014] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#F59E0B] text-slate-950 font-black flex items-center justify-center text-xs">
                D
              </span>
              <span className="text-sm font-bold tracking-tight text-white font-sans">
                Derso<span className="text-[#F59E0B]">Lab</span>
              </span>
            </Link>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Zümre Hocaları Çevrimiçi • 1-e-1 Canlı
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span>LGS: <strong className="text-white">184 Gün</strong></span>
            <span className="text-slate-600">•</span>
            <span>YKS: <strong className="text-white">212 Gün</strong></span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <Link
              href="/hesap-turu"
              className="px-3 py-1 rounded bg-[#F59E0B] text-slate-950 font-bold hover:bg-[#D97706] transition-colors"
            >
              Tanışma Dersi Al
            </Link>
          </div>

        </div>
      </header>

      {/* ── ANA ÇALIŞMA ALANI ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-12">
        
        {/* Samimi Başlık */}
        <div className="space-y-3">
          <div className="font-mono text-xs uppercase tracking-widest text-[#F59E0B] font-bold">
            Boğaziçi ve ODTÜ Mezunu Zümre Hocalarıyla 1-e-1 Canlı Seans
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug [text-wrap:balance]">
            Soru bankasını bitirmek yetmiyor.{' '}
            <span className="text-[#F59E0B]">
              Denemede o soruyu gördüğün an ne yapacağını biliyor musun?
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed [text-wrap:pretty]">
            Dershanede 30 kişilik sınıfta hocaya "Ben burayı anlamadım" demeye çekinirsin. DersoLab’de takıldığın soruyu getirirsin; Türkiye’nin en tecrübeli hocasıyla ekranı ikiye böler, o soruyu adım adım parçalarsın.
          </p>
        </div>

        {/* ── BÖLÜM 1: HOCA SEÇİMİ VE CANLI SORU MASASI ── */}
        <section className="bg-[#181B22] border border-white/[0.1] rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          
          {/* Hoca Seçimi */}
          <div className="border-b border-white/[0.08] pb-5 mb-6">
            <div className="text-xs font-mono text-slate-400 mb-2 font-bold uppercase tracking-wider">
              Kiminle çalışmak istersin? Branşını seç:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CASSETTES.map((cas) => {
                const isActive = cas.id === activeCassetteId
                return (
                  <button
                    key={cas.id}
                    onClick={() => {
                      setActiveCassetteId(cas.id)
                      setIsPlayingAudio(false)
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 relative ${
                      isActive
                        ? 'bg-[#222733] border-[#F59E0B] shadow-lg ring-1 ring-[#F59E0B]'
                        : 'bg-[#12141A] border-white/[0.06] hover:border-white/[0.15] text-slate-300'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/[0.1]">
                      <img
                        src={cas.avatar}
                        alt={cas.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{cas.name}</div>
                      <div className="text-[11px] font-mono text-[#F59E0B] font-bold">{cas.role}</div>
                      <div className="text-[10px] text-slate-400 truncate">{cas.exp}</div>
                    </div>
                    {isActive && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F59E0B]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Canlı Seans Detayı */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sol: Hocanın Kendi Sözleri ve Ses Kaydı */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#12141A] border border-white/[0.08] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F59E0B] font-bold">{activeCassette.subject}</span>
                  <span className="text-slate-400">{activeCassette.tag}</span>
                </div>

                <div className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed italic border-l-2 border-[#F59E0B]/60 pl-3">
                  "{activeCassette.quote}"
                </div>

                {/* Ses Oynatıcı */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-9 h-9 rounded-lg bg-[#F59E0B] text-slate-950 flex items-center justify-center font-bold hover:bg-[#D97706] transition-colors shrink-0 shadow-md"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">Hocanın Sesini Dinle</div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">{activeCassette.audioTitle}</div>
                  </div>
                </div>

                {/* Dinamik Ses Dalgası */}
                <div className="flex items-center gap-1 h-5 pt-1">
                  {[30, 60, 90, 45, 80, 50, 100, 70, 40, 85, 60, 95, 35, 75, 50, 90].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${isPlayingAudio ? Math.max(20, Math.round(h * Math.random())) : 30}%` }}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPlayingAudio ? 'bg-[#F59E0B]' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Hızlı Başla Kartı */}
              <div className="bg-[#12141A] border border-white/[0.08] p-4 rounded-xl text-xs space-y-2.5">
                <div className="flex items-center justify-between text-slate-300 font-mono">
                  <span>İlk 20 Dk Tanışma:</span>
                  <strong className="text-emerald-400">Ücretsiz</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-mono">
                  <span>Memnun Kalmazsan:</span>
                  <strong className="text-white">Anında İade</strong>
                </div>
                <Link
                  href="/hesap-turu"
                  className="w-full py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-center block transition-colors"
                >
                  {activeCassette.name} ile 20 Dk Tanış →
                </Link>
              </div>
            </div>

            {/* Sağ: Gerçek Öğrenci Sorusu & Hocanın Müdahalesi */}
            <div className="lg:col-span-7 bg-[#0E1015] border border-white/[0.08] rounded-xl p-5 font-mono text-xs space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white font-bold">{activeCassette.topic}</span>
                </div>
                <span className="text-[11px] text-[#F59E0B]">Ders İçi Canlı Ekran</span>
              </div>

              {/* Öğrencinin Sorunu */}
              <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200 leading-relaxed font-sans text-xs">
                {activeCassette.studentDoubt}
              </div>

              {/* Hocanın Anlık Müdahalesi */}
              <div className="p-3.5 rounded-lg bg-[#182030] border border-[#38BDF8]/30 text-sky-100 font-sans text-xs space-y-1.5">
                <div className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider">
                  Hocanın Canlı Tahta Çözümü:
                </div>
                <p className="leading-relaxed">
                  {activeCassette.annotation}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                <span>Google Meet üzerinden gecikmesiz canlı tahta</span>
                <span className="text-emerald-400 font-bold font-mono">+1 Net Cepte</span>
              </div>

            </div>

          </div>

        </section>

        {/* ── BÖLÜM 2: GERÇEKÇİ NET CETVELİ ── */}
        <section className="bg-[#181B22] border border-white/[0.1] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-[#F59E0B] uppercase tracking-wider font-bold">
                Net Cetveli
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Şu anki deneme netini seç, sana ne gerektiğini söyleyelim:
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400">Şu Anki Netin:</span>
              <div className="text-2xl font-black text-[#F59E0B] font-mono">{currentNet} Net</div>
            </div>
          </div>

          {/* Cetvel Kaydırıcı */}
          <div className="space-y-2">
            <input
              type="range"
              min="30"
              max="95"
              value={currentNet}
              onChange={(e) => setCurrentNet(Number(e.target.value))}
              className="w-full accent-[#F59E0B] bg-white/10 h-3 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>30 Net (Başlangıç)</span>
              <span>55 Net (Orta Düzey)</span>
              <span>75 Net (İyi Liseler)</span>
              <span>95 Net (İlk 500)</span>
            </div>
          </div>

          {/* Cetvel Sonuç Analizi (Samimi, Gerçekçi) */}
          <div className="p-4 rounded-xl bg-[#0E1015] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">Mevcut Durum:</span>
              <span className="text-white font-bold text-sm text-[#F59E0B]">
                {analysis.level}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Hedef Okul Seviyesi:</span>
              <span className="text-slate-200 font-medium">
                {analysis.targetSchool}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Öğretmenin Tavsiyesi:</span>
              <span className="text-emerald-400 font-bold">
                {analysis.study}
              </span>
            </div>
          </div>
        </section>

        {/* ── BÖLÜM 3: AYLIK ABONELİK YOK • PARAN ASLA YANMAZ ── */}
        <section className="bg-gradient-to-r from-[#201C16] to-[#161B24] border border-[#F59E0B]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-mono font-bold border border-[#F59E0B]/30">
                <span>AYLIK ABONELİK YOK • KREDİLER ASLA SİLİNMEZ</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Paran yanmaz. İhtiyacın kadar ders alırsın.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl [text-wrap:pretty]">
                Diyelim ki 5 ders aldın. Bu hafta 2 ders yaptın, kalan 3 dersi ister 2 ay sonra sınav haftası, ister seneye kullan. "Bu ay kullanmadınız, hakkınız yandı" diyen sistemleri biz de sevmiyoruz.
              </p>
            </div>

            <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/[0.1] pt-4 md:pt-0 md:pl-6 text-center md:text-left space-y-2.5">
              <div className="text-xs font-mono text-emerald-400 font-bold">
                ✓ İlk 20 Dk Kimyan Tutmazsa %100 İade
              </div>
              <div className="text-xs font-mono text-slate-300">
                ✓ Google Meet Doğrudan Takvim Entegrasyonu
              </div>
              <div className="text-xs font-mono text-slate-300">
                ✓ Her Ders Sonu Veliye 3 Cümlelik Şeffaf Rapor
              </div>
              <Link
                href="/hesap-turu"
                className="w-full py-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs uppercase tracking-wider block text-center transition-colors shadow-md mt-2"
              >
                Tanışma Görüşmesi Planla →
              </Link>
            </div>

          </div>

        </section>

      </main>

    </div>
  )
}
