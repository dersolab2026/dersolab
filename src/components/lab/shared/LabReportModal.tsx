'use client'

import React, { useState } from 'react'
import { FileText, Printer, X, Check, School, User, Calendar } from 'lucide-react'
import { playClickSound } from '@/lib/soundFx'

export interface MeasurementRow {
  parameter: string
  value: string | number
  unit: string
  description?: string
}

interface LabReportModalProps {
  isOpen: boolean
  onClose: () => void
  experimentTitle: string
  branch: string
  measurements: MeasurementRow[]
  defaultHypothesis?: string
  independentVar?: string
  dependentVar?: string
  controlledVars?: string
}

export function LabReportModal({
  isOpen,
  onClose,
  experimentTitle,
  branch,
  measurements,
  defaultHypothesis = 'Bağımsız değişken artırıldığında bağımlı değişken doğru orantılı olarak artar.',
  independentVar = 'Uygulanan Kuvvet / Sıcaklık / Derişim',
  dependentVar = 'İvme / Hacim / Reaksiyon Hızı',
  controlledVars = 'Kütle, Sürtünme Katsayısı, Madde Miktarı',
}: LabReportModalProps) {
  const [studentName, setStudentName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [gradeClass, setGradeClass] = useState('')
  const [hypothesis, setHypothesis] = useState(defaultHypothesis)
  const [conclusion, setConclusion] = useState(
    'Yapılan deneyde elde edilen veriler başlangıçtaki hipotezi doğrulamıştır. Değişkenler arasındaki matematiksel bağıntı formülle uyumludur.'
  )
  const today = new Date().toLocaleDateString('tr-TR')

  if (!isOpen) return null

  const handlePrint = () => {
    playClickSound()
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Toolbar (hidden in print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white">
              MEB Formatında Deney & Performans Raporu
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF Olarak Kaydet</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound()
                onClose()
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Paper Content (Styled for both dark UI preview & clean print) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 print:text-black print:bg-white print:p-0 print:m-0 print:space-y-4 print:text-xs">
          {/* Printable Official Header */}
          <div className="border-b-2 border-slate-700 print:border-black pb-4 text-center">
            <div className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-slate-400 print:text-gray-600">
              T.C. MİLLÎ EĞİTİM BAKANLIĞI · DERSOLAB AKADEMİ
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white print:text-black mt-1">
              BİLİMSEL ARAŞTIRMA VE DENEY PERFORMANS RAPORU
            </h1>
            <div className="text-xs text-amber-400 print:text-gray-700 font-semibold mt-0.5">
              Branş: {branch} · Deney: {experimentTitle}
            </div>
          </div>

          {/* Student Meta Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 print:bg-gray-100 p-4 rounded-xl border border-slate-800 print:border-gray-400 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 print:text-gray-700">
                Öğrenci Adı Soyadı:
              </label>
              <input
                type="text"
                placeholder="Ad Soyad giriniz..."
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1 w-full bg-slate-900 print:bg-white border border-slate-700 print:border-gray-400 rounded-lg px-2.5 py-1 text-slate-100 print:text-black font-semibold text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 print:text-gray-700">
                Okul & Sınıf / Şube:
              </label>
              <input
                type="text"
                placeholder="Örn: Fen Lisesi / 11-A"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="mt-1 w-full bg-slate-900 print:bg-white border border-slate-700 print:border-gray-400 rounded-lg px-2.5 py-1 text-slate-100 print:text-black font-semibold text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 print:text-gray-700">
                Rapor Tarihi:
              </label>
              <div className="mt-1 px-2.5 py-1.5 bg-slate-900/80 print:bg-white border border-slate-700 print:border-gray-400 rounded-lg font-semibold text-xs text-slate-300 print:text-black">
                {today}
              </div>
            </div>
          </div>

          {/* Scientific Variables Grid */}
          <div className="border border-slate-800 print:border-gray-400 rounded-xl p-4 bg-slate-950/40 print:bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-1.5">
              <span>1. Bilimsel Değişkenler & Hipotez</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300">
                <span className="font-bold text-slate-400 print:text-gray-700 block text-[11px]">
                  Bağımsız Değişken:
                </span>
                <span className="text-slate-200 print:text-black font-medium">{independentVar}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300">
                <span className="font-bold text-slate-400 print:text-gray-700 block text-[11px]">
                  Bağımlı Değişken:
                </span>
                <span className="text-slate-200 print:text-black font-medium">{dependentVar}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300">
                <span className="font-bold text-slate-400 print:text-gray-700 block text-[11px]">
                  Kontrol Edilen (Sabit) Değişkenler:
                </span>
                <span className="text-slate-200 print:text-black font-medium">{controlledVars}</span>
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-[11px] font-bold text-slate-400 print:text-gray-700 mb-1">
                Hipotez Cümlesi:
              </label>
              <textarea
                rows={2}
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                className="w-full bg-slate-900 print:bg-white border border-slate-700 print:border-gray-400 rounded-lg p-2 text-xs text-slate-100 print:text-black focus:outline-none focus:border-amber-400 resize-none font-medium"
              />
            </div>
          </div>

          {/* Measurements Table */}
          <div className="border border-slate-800 print:border-gray-400 rounded-xl overflow-hidden">
            <div className="bg-slate-950 print:bg-gray-200 px-4 py-2 border-b border-slate-800 print:border-gray-400 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black">
                2. Canlı Simülasyon Ölçüm Tablosu
              </h3>
              <span className="text-[10px] text-slate-500 print:text-gray-600">
                DersoLab Gerçek Zamanlı Verileri
              </span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 print:bg-gray-100 border-b border-slate-800 print:border-gray-300 text-slate-400 print:text-gray-700">
                  <th className="p-2.5 font-bold">Ölçülen Parametre</th>
                  <th className="p-2.5 font-bold">Değer</th>
                  <th className="p-2.5 font-bold">Birim</th>
                  <th className="p-2.5 font-bold hidden sm:table-cell">Açıklama / Formül</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                {measurements.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                    <td className="p-2.5 font-semibold text-slate-200 print:text-black">
                      {row.parameter}
                    </td>
                    <td className="p-2.5 font-bold text-amber-400 print:text-black">
                      {row.value}
                    </td>
                    <td className="p-2.5 text-slate-400 print:text-gray-700">{row.unit}</td>
                    <td className="p-2.5 text-slate-400 print:text-gray-600 text-[11px] hidden sm:table-cell">
                      {row.description || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Conclusion Textarea */}
          <div className="border border-slate-800 print:border-gray-400 rounded-xl p-4 bg-slate-950/40 print:bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-black mb-1.5">
              3. Bulgular, Analiz ve Sonuç Değerlendirmesi
            </h3>
            <textarea
              rows={3}
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full bg-slate-900 print:bg-white border border-slate-700 print:border-gray-400 rounded-lg p-2.5 text-xs text-slate-100 print:text-black focus:outline-none focus:border-emerald-400 resize-none font-medium"
            />
          </div>

          {/* Teacher Grade & Evaluation Box */}
          <div className="grid grid-cols-2 gap-4 border-t-2 border-slate-800 print:border-black pt-4 text-xs">
            <div>
              <span className="font-bold text-slate-400 print:text-gray-700 block mb-1">
                Öğrenci İmzası:
              </span>
              <div className="h-10 border-b border-dashed border-slate-700 print:border-gray-400" />
            </div>
            <div className="border border-slate-800 print:border-black p-3 rounded-lg text-center bg-slate-950/60 print:bg-transparent">
              <span className="font-bold text-slate-400 print:text-black block text-[11px]">
                Öğretmen Değerlendirme Puanı
              </span>
              <div className="text-lg font-black text-amber-400 print:text-black mt-1">
                ____ / 100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
