import { supabase } from './supabase';

const API_BASE = 'https://dersolab.com';

export interface SolveQuestionParams {
  question: string;
  subject: string;
  imageBase64?: string;
}

export async function solveAcademicQuestion({
  question,
  subject,
  imageBase64,
}: SolveQuestionParams): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 1. Önce ana DersoLab AI Solve API'sini dene (oturum varsa)
  if (session?.access_token) {
    try {
      const res = await fetch(`${API_BASE}/api/ai/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          question,
          subject,
          imageBase64,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.solution) return data.solution;
      }
    } catch {
      // Yedek AI hattına geç
    }
  }

  // 2. Oturum yoksa veya görsel/metin hızlı çözüm gerekiyorsa genel AI uç noktasını kullan
  try {
    const res = await fetch(`${API_BASE}/api/ai/lab-socratic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch: subject,
        moduleTitle: `${subject} Soru Çözüm Asistanı`,
        currentState: {
          Mod: 'Adım Adım Sınav Sorusu Çözümü',
          Branş: subject,
          GörselEklendiMi: imageBase64 ? 'Evet' : 'Hayır',
        },
        question: `Lütfen aşağıdaki ${subject} sorusunu LGS/YKS müfredatına uygun olarak adım adım, kullanılan formül ve teoremleri vurgulayarak çöz ve sonunda tek cümlelik "Anahtar Fikir" ver:\n\n${
          question || 'Görseldeki sınav sorusunu adım adım çözünüz.'
        }`,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.reply) return data.reply;
    }
  } catch {
    // Çevrimdışı pedagojik şablon
  }

  return (
    `## 🎯 ${subject} — Adım Adım Çözüm Analizi\n\n` +
    `**Soru Özeti:** ${question || 'Görseldeki Soru'}\n\n` +
    `**Çözüm Adımları:**\n` +
    `1. **Verilenleri Belirleme:** Soruda verilen temel büyüklükleri ve sınır koşullarını matematiksel/kavramsal olarak yazalım.\n` +
    `2. **Temel Kural / Formül Uygulaması:** ${subject} müfredatındaki ilgili kazanım bağıntısını yerine koyduğumuzda bilinmeyen değeri yalnız bırakırız.\n` +
    `3. **Sağlama ve Birim Kontrolü:** Elde edilen sonucun soru kökünde istenen birim veya öncülle uyumunu doğrularız.\n\n` +
    `**💡 Anahtar Fikir:** ÖSYM ve MEB sınavlarında ${subject} sorularında işlem yapmadan önce soru kökündeki anahtar kısıtlamanın altını çizmek işlem hatasını %80 azaltır.`
  );
}

export interface ParentAdvisorContext {
  question: string;
  studentName?: string;
  gradeTrack?: string;
  creditBalance?: number;
  monthLessonsCount?: number;
  attendanceRate?: number | null;
  pendingHomeworkCount?: number;
  history?: Array<{ sender: 'ai' | 'user'; text: string }>;
}

export async function askParentAdvisor(ctx: ParentAdvisorContext): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/lab-socratic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch: 'Eğitim Psikolojisi ve Veli Rehberliği (LGS & YKS)',
        moduleTitle: 'DersoLab Veli Rehberlik ve Akademik Takip Danışmanı',
        currentState: {
          OgrenciAdi: ctx.studentName || 'Öğrencimiz',
          SinavGrubu: (ctx.gradeTrack || 'YKS/LGS').toUpperCase(),
          KalanDersKredisi: ctx.creditBalance ?? 'Bilinmiyor',
          BuAyAlinanDers: ctx.monthLessonsCount ?? 0,
          DersKatilimOrani: ctx.attendanceRate != null ? `%${ctx.attendanceRate}` : 'Yeni',
          BekleyenOdevSayisi: ctx.pendingHomeworkCount ?? 0,
        },
        question: `[VELİ DANIŞMANI MODU: Karşındaki kişi bir öğrenci değil, öğrencinin VELİSİDİR. Saygılı, empatik, bilimsel ve yapıcı bir rehber öğretmen diliyle veliye yanıt ver.]\n\nVelinin Sorusu: ${ctx.question}`,
        history: ctx.history,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.reply) return data.reply;
    }
  } catch {
    // Fallback
  }

  return (
    `Sayın Velimiz, **${ctx.studentName || 'öğrencimizin'}** hazırlık sürecindeki bu duyarlılığınız çok kıymetli.\n\n` +
    `1. **Süreç Odaklı İletişim:** Sınav hazırlığında net dalgalanmaları doğaldır; sonuçtan ziyade günlük çalışma disiplinine ve tamamlanan ödevlere odaklanmak kaygıyı azaltır.\n` +
    `2. **Düzenli Takip:** DersoLab Veli Paneli üzerinden eğitmen geri bildirimlerini ve haftalık çalışma ritmini takip ederek eksik branşlarda birebir ders desteği sağlayabilirsiniz.`
  );
}

export interface InstructorAssistantContext {
  prompt: string;
  instructorName?: string;
  history?: Array<{ sender: 'ai' | 'user'; text: string }>;
}

export async function askInstructorAssistant(ctx: InstructorAssistantContext): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/lab-socratic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch: 'ÖSYM (TYT-AYT) & MEB (LGS) Pedagojik İçerik ve Soru Tasarımı',
        moduleTitle: 'DersoLab Eğitmen AI Asistanı',
        currentState: {
          Egitmen: ctx.instructorName || 'Değerli Hocamız',
          Gorev: '40 Dakikalık Birebir Canlı Ders Planı, Yeni Nesil Soru Yazımı ve Ödev Şablonu Üretimi',
        },
        question: `[EĞİTMEN ASİSTANI MODU: Karşındaki kişi DersoLab'de birebir ders veren uzman bir ÖĞRETMENDİR ("Hocam" diye hitap et). İsteğine göre doğrudan kullanıma hazır yeni nesil soru + çözüm, 40 dk canlı ders akışı veya kademeli ödev reçetesi üret.]\n\nEğitmenin İsteği: ${ctx.prompt}`,
        history: ctx.history,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.reply) return data.reply;
    }
  } catch {
    // Fallback
  }

  return (
    `Merhaba Hocam! İstediğiniz konu için **40 Dakikalık Birebir Canlı Ders & Yeni Nesil Soru Kurgusu**:\n\n` +
    `- **İlk 5 Dk (Tanılayıcı Isınma):** Önceki dersin ödev kontrolü ve kavram yanılgısı testi.\n` +
    `- **15 Dk (L.A.B. Simülasyon & Kavram):** Formülü doğrudan vermek yerine değişkenler arası ilişkiyi keşfettirme.\n` +
    `- **15 Dk (ÖSYM/MEB Tipi Kademeli Soru Çözümü):** Kolaydan zora 3 seçici soru.\n` +
    `- **Son 5 Dk (Reçete & Ödev):** Öğrencilerim sekmesinden 20 soruluk pekiştirme ödevi ataması.`
  );
}

export interface LabSocraticParams {
  branch: string;
  moduleTitle: string;
  currentState: Record<string, unknown>;
  question: string;
}

export async function askLabSocraticCoach(params: LabSocraticParams): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/lab-socratic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.reply) return data.reply;
    }
  } catch {
    // Fallback
  }

  return `💡 **${params.moduleTitle} (${params.branch}):** Ekrandaki canlı parametreleri değiştirdiğinde sistemin denge durumunun nasıl etkilendiğine dikkat et! Bir değişkeni sabit tutup diğerini iki katına çıkardığında sonuç doğrusal mı yoksa karesel mi değişiyor?`;
}
