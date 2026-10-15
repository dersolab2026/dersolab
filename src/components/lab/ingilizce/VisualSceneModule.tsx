'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Volume2,
  Camera,
  Coffee,
  Plane,
  Laptop,
  HeartPulse,
  Eye,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { playSpeech, EnglishAccent } from './speechHelper'

interface SceneObject {
  id: string
  name: string
  phonetic: string
  icon: string
  turkish: string
  sentence: string
  dialogueUse: string
}

interface Scene {
  id: string
  title: string
  turkishTitle: string
  icon: React.ElementType
  badge: string
  description: string
  objects: SceneObject[]
}

const SCENES: Scene[] = [
  {
    id: 'cafe-counter',
    title: 'Artisan Café Counter',
    turkishTitle: 'Kahve Barı & Sipariş Tezgahı',
    icon: Coffee,
    badge: 'Günlük Hayat',
    description: 'Kahve dükkanında karşılaştığınız ekipmanlar, ürünler ve sipariş ifadeleri.',
    objects: [
      {
        id: 'espresso-machine',
        name: 'Espresso machine',
        phonetic: '/esˈpres.oʊ məˈʃiːn/',
        icon: '☕',
        turkish: 'Espresso makinesi',
        sentence: 'The barista pulled a double shot of espresso from the machine.',
        dialogueUse: '“Could I get an extra shot in my latte, please?”',
      },
      {
        id: 'pastry-display',
        name: 'Pastry display case',
        phonetic: '/ˈpeɪ.stri dɪˈspleɪ keɪs/',
        icon: '🥐',
        turkish: 'Pasta / unlu mamuller vitrini',
        sentence: 'Freshly baked almond croissants were arranged in the pastry display.',
        dialogueUse: '“Is that cinnamon roll warm, or can you heat it up?”',
      },
      {
        id: 'grinder',
        name: 'Coffee grinder',
        phonetic: '/ˈkɒf.i ˌɡraɪn.dər/',
        icon: '⚙️',
        turkish: 'Kahve öğütücüsü',
        sentence: 'The aroma filled the room as the beans went through the grinder.',
        dialogueUse: '“Do you grind whole beans for French press?”',
      },
      {
        id: 'takeout-cup',
        name: 'Disposable takeaway cup',
        phonetic: '/dɪˈspoʊ.zə.bəl ˈteɪk.əˌweɪ kʌp/',
        icon: '🥤',
        turkish: 'Kullan-at karton bardak',
        sentence: 'She grabbed her hot mocha in a recyclable takeaway cup.',
        dialogueUse: '“I brought my reusable thermos, do you offer a discount?”',
      },
      {
        id: 'syrup-pumps',
        name: 'Syrup pump dispenser',
        phonetic: '/ˈsɪr.əp pʌmp/',
        icon: '🍯',
        turkish: 'Şurup pompası (aroma)',
        sentence: 'The barista added two pumps of sugar-free hazelnut syrup.',
        dialogueUse: '“Just one pump of caramel syrup is enough, thanks!”',
      },
    ],
  },
  {
    id: 'airport-gate',
    title: 'Airport Departure Gate',
    turkishTitle: 'Havalimanı Biniş Kapısı',
    icon: Plane,
    badge: 'Seyahat',
    description: 'Uçağa biniş, kapı anonsları ve kabin eşyaları.',
    objects: [
      {
        id: 'boarding-scanner',
        name: 'Boarding gate scanner',
        phonetic: '/ˈbɔːr.dɪŋ ɡeɪt ˈskæn.ər/',
        icon: '📱',
        turkish: 'Biniş kartı okuyucu turnike',
        sentence: 'Hold the QR code on your phone against the boarding scanner.',
        dialogueUse: '“Do I need to show my passport again at the scanner?”',
      },
      {
        id: 'carry-on-sizer',
        name: 'Luggage sizer box',
        phonetic: '/ˈlʌɡ.ɪdʒ ˈsaɪ.zər/',
        icon: '🧳',
        turkish: 'El bagajı ebat ölçüm kutusu',
        sentence: 'Make sure your backpack fits inside the metal luggage sizer.',
        dialogueUse: '“Does this duffle bag count as a personal item?”',
      },
      {
        id: 'overhead-compartment',
        name: 'Overhead locker',
        phonetic: '/ˈoʊ.vɚ.hed ˈlɑː.kɚ/',
        icon: '💺',
        turkish: 'Başüstü bagaj dolabı',
        sentence: 'Please close the overhead lockers before taxi and takeoff.',
        dialogueUse: '“Excuse me, is there any room left in the overhead bin?”',
      },
      {
        id: 'flight-info-display',
        name: 'Flight information display (FIDS)',
        phonetic: '/flaɪt ˌɪn.fɚˈmeɪ.ʃən/',
        icon: '🖥️',
        turkish: 'Uçuş bilgi ekranı',
        sentence: 'The display screen shows our flight is boarding at Gate B14.',
        dialogueUse: '“Has our flight status changed to final call?”',
      },
    ],
  },
  {
    id: 'tech-office',
    title: 'Modern Digital Workplace',
    turkishTitle: 'Dijital Ofis & Çalışma Alanı',
    icon: Laptop,
    badge: 'Kariyer & Teknoloji',
    description: 'Modern çalışma ortamındaki nesneler ve profesyonel ifadeler.',
    objects: [
      {
        id: 'noise-canceling-headphones',
        name: 'Noise-canceling headphones',
        phonetic: '/nɔɪz ˈkæn.səl.ɪŋ ˈhed.foʊnz/',
        icon: '🎧',
        turkish: 'Gürültü engelleyici kulaklık',
        sentence: 'Noise-canceling headphones help maintain deep focus in an open office.',
        dialogueUse: '“Can you hear me clearly, or is there background static?”',
      },
      {
        id: 'dual-monitor',
        name: 'Dual monitor stand',
        phonetic: '/ˈduː.əl ˈmɑː.nə.t̬ɚ/',
        icon: '🖥️',
        turkish: 'Çift monitör standı',
        sentence: 'Working with a dual monitor setup greatly boosts coding productivity.',
        dialogueUse: '“Let me drag the dashboard over to my secondary screen.”',
      },
      {
        id: 'whiteboard',
        name: 'Brainstorming whiteboard',
        phonetic: '/ˈwaɪt.bɔːrd/',
        icon: '📋',
        turkish: 'Fikir / beyin fırtınası tahtası',
        sentence: 'We mapped out the entire user journey on the whiteboard.',
        dialogueUse: '“Could you sketch out that architecture on the board?”',
      },
      {
        id: 'standing-desk',
        name: 'Height-adjustable standing desk',
        phonetic: '/ˈstæn.dɪŋ desk/',
        icon: '🪑',
        turkish: 'Yüksekliği ayarlanabilir ayakta çalışma masası',
        sentence: 'Alternating between sitting and standing at a desk prevents back pain.',
        dialogueUse: '“How high does this standing desk elevate?”',
      },
    ],
  },
  {
    id: 'pharmacy-corner',
    title: 'Pharmacy Health Counter',
    turkishTitle: 'Eczane Sağlık Standı',
    icon: HeartPulse,
    badge: 'Sağlık',
    description: 'İlaçlar, termometre ve sağlık bakım ürünleri.',
    objects: [
      {
        id: 'digital-thermometer',
        name: 'Digital thermometer',
        phonetic: '/ˈdɪdʒ.ə.t̬əl θɚˈmɑː.mə.t̬ɚ/',
        icon: '🌡️',
        turkish: 'Dijital ateş ölçer',
        sentence: 'The thermometer indicated a mild fever of 38.2 degrees Celsius.',
        dialogueUse: '“Do you sell forehead thermometers suitable for infants?”',
      },
      {
        id: 'throat-lozenges',
        name: 'Throat lozenges',
        phonetic: '/θroʊt ˈlɑː.zən.dʒɪz/',
        icon: '🍬',
        turkish: 'Boğaz pastili',
        sentence: 'Honey and lemon throat lozenges soothe an irritated throat.',
        dialogueUse: '“Which lozenges are best for a dry, scratchy cough?”',
      },
      {
        id: 'prescription-label',
        name: 'Prescription label',
        phonetic: '/prɪˈskrɪp.ʃən ˈleɪ.bəl/',
        icon: '🏷️',
        turkish: 'Reçete kullanım etiketi',
        sentence: 'Always read the warning instructions on the prescription label.',
        dialogueUse: '“How many times a day should I take this antibiotic?”',
      },
      {
        id: 'first-aid-kit',
        name: 'First-aid kit',
        phonetic: '/ˌfɝːst ˈeɪd ˌkɪt/',
        icon: '🩹',
        turkish: 'İlk yardım çantası',
        sentence: 'Every household should keep a fully stocked first-aid kit.',
        dialogueUse: '“Does this travel kit contain antiseptic wipes and bandages?”',
      },
    ],
  },
]

export function VisualSceneModule() {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(SCENES[0].id)
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null)
  const [accent, setAccent] = useState<EnglishAccent>('en-US')

  const currentScene = SCENES.find((s) => s.id === selectedSceneId) || SCENES[0]
  const activeObject =
    currentScene.objects.find((o) => o.id === selectedObjectId) || currentScene.objects[0]

  const handlePlayAudio = (text: string) => {
    playSpeech(text, accent, 0.95)
  }

  return (
    <div className="space-y-8">
      {/* ── Subheader ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Google Labs — Word Cam / Görsel Sahne Modeli
            </span>
            <span className="text-xs text-slate-400">Görsel Nesne & Kelime Eşleştirme</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            Görsel Sahne & Nesne Sözlüğü (Visual Scene Explorer)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Çevrenizdeki nesnelerin İngilizce karşılıklarını, fonetik okunuşlarını ve o nesneyle ilgili en doğal konuşma cümlelerini görsel panolarla keşfedin.
          </p>
        </div>

        {/* Accent Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <span className="text-[11px] font-semibold text-slate-400 pl-2">Ses:</span>
          {(['en-US', 'en-GB'] as EnglishAccent[]).map((acc) => (
            <button
              key={acc}
              onClick={() => setAccent(acc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                accent === acc
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {acc === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scene Selector Tabs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SCENES.map((scene) => {
          const Icon = scene.icon
          const isSelected = scene.id === currentScene.id
          return (
            <button
              key={scene.id}
              onClick={() => {
                setSelectedSceneId(scene.id)
                setSelectedObjectId(null)
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-950/50 to-slate-900 border-cyan-400/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {scene.badge}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{scene.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{scene.turkishTitle}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Scene Objects Grid & Spotlight ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Object Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sahnede Tanımlanan Nesneler ({currentScene.objects.length})
            </h3>
            <span className="text-xs text-slate-500">Nesneye tıklayarak detayını açın</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentScene.objects.map((obj) => {
              const isSelected = obj.id === activeObject.id
              return (
                <button
                  key={obj.id}
                  onClick={() => setSelectedObjectId(obj.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/70 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-2xl shrink-0">
                    {obj.icon}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{obj.name}</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlayAudio(obj.name)
                        }}
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Dinle"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-400">{obj.phonetic}</div>
                    <div className="text-xs font-semibold text-slate-300 truncate">{obj.turkish}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Object Spotlight Drawer (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeObject.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl bg-gradient-to-b from-cyan-950/30 to-slate-900 border border-cyan-500/40 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Nesne Merceği
                </span>
                <button
                  onClick={() => handlePlayAudio(activeObject.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-md shadow-cyan-500/30"
                >
                  <Volume2 className="w-4 h-4" />
                  Seslendir
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-4xl shadow-inner">
                  {activeObject.icon}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{activeObject.name}</h3>
                  <div className="font-mono text-xs text-sky-400 mt-0.5">{activeObject.phonetic}</div>
                  <div className="text-sm font-semibold text-cyan-300 mt-1">{activeObject.turkish}</div>
                </div>
              </div>

              {/* Sample Descriptive Sentence */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Tanımlayıcı Cümle (Descriptive):</span>
                  <button
                    onClick={() => handlePlayAudio(activeObject.sentence)}
                    className="p-0.5 hover:text-white transition-colors cursor-pointer"
                    title="Cümleyi Dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic">
                  “{activeObject.sentence}”
                </p>
              </div>

              {/* Real World Dialogue Prompt */}
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  <span>Pratikte Nasıl Kullanılır? (Dialogue Prompt):</span>
                  <button
                    onClick={() => handlePlayAudio(activeObject.dialogueUse)}
                    className="p-0.5 hover:text-white transition-colors cursor-pointer"
                    title="Diyaloğu Dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-cyan-100 font-medium">
                  {activeObject.dialogueUse}
                </p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
