'use client';

import React from 'react';
import TurkeyDissection from '@/components/TurkeyDissection';
import TurkeyGeneralization from '@/components/TurkeyGeneralization';
import { CheckCircle2, Ruler, Scissors, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] max-w-7xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
          ปัญหาไก่งวง (The Turkey Stuffer Problem)
        </h1>
      </section>

      {/* Problem Visualization */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 text-orange-500">
            <Scissors className="w-8 h-8" />
            <h2 className="text-3xl font-bold text-white">โจทย์ปัญหา</h2>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg">
            ชายคนหนึ่งต้องการนำไก่งวงทั้งตัวมายัดไส้และนำไปอบ โดยเขามีเครื่องที่จะใช้ยัดไส้ไก่แบบสำเร็จรูปแบบลูกบาศก์ขนาด <strong>12 ซม. x 12 ซม. x 12 ซม.</strong> เขาสังเกตว่าในส่วนช่องท้องของไก่งวงตัวนี้เป็นรูปทรงสี่เหลี่ยมมุมฉากขนาด <strong>8 ซม. x 8 ซม. x 27 ซม.</strong> พอดี เนื่องจากเขามีเวลาในการเตรียมอาหารไม่มาก ชายคนนี้จึงต้องการตัดเครื่องที่ใช้ยัดไส้ออกเป็น <strong>4 ชิ้น</strong>
          </p>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3 text-gray-400">
              <Ruler className="w-5 h-5 text-blue-500" />
              <span>เช็คปริมาตร: 12³ = 1728 ซม.³ กับ 8x8x27 = 1728 ซม.³</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-400">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>มีปริมาตรเท่ากัน</span>
            </li>
          </ul>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 relative group flex justify-center items-center">
          {/* Diagram SVG */}
          <svg width="100%" height="auto" viewBox="0 0 400 200" className="max-w-md text-white drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            {/* Cube 12x12x12 */}
            <g transform="translate(50, 50)">
              <path d="M0 40 L60 40 L60 100 L0 100 Z" fill="#fb923c" stroke="white" strokeWidth="2" />
              <path d="M0 40 L30 10 L90 10 L60 40 Z" fill="#fdba74" stroke="white" strokeWidth="2" />
              <path d="M60 40 L90 10 L90 70 L60 100 Z" fill="#f97316" stroke="white" strokeWidth="2" />
              <text x="45" y="130" textAnchor="middle" fill="white" fontSize="14">12x12x12 ซม.</text>
            </g>

            {/* Arrow */}
            <g transform="translate(170, 90)">
              <path d="M0 0 L40 0 M30 -10 L40 0 L30 10" stroke="#a78bfa" strokeWidth="3" fill="none" />
              <text x="20" y="25" textAnchor="middle" fill="#a78bfa" fontSize="12">ตัดเป็น 4 ชิ้น</text>
            </g>

            {/* Prism 8x8x27 (represented visually) */}
            <g transform="translate(250, 20)">
              <path d="M0 40 L40 40 L40 150 L0 150 Z" fill="#22c55e" stroke="white" strokeWidth="2" />
              <path d="M0 40 L20 20 L60 20 L40 40 Z" fill="#4ade80" stroke="white" strokeWidth="2" />
              <path d="M40 40 L60 20 L60 130 L40 150 Z" fill="#16a34a" stroke="white" strokeWidth="2" />
              <text x="30" y="170" textAnchor="middle" fill="white" fontSize="14">8x8x27 ซม.</text>
            </g>
          </svg>
        </div>
      </section>

      {/* 3D Solution */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">โมเดล 3D จำลองวิธีการตัด</h2>
          <p className="text-gray-400">หมุนดูเพื่อศึกษารูปทรง และกดปุ่ม "ขั้นตอนถัดไป" เพื่อดูวิธีการประกอบ</p>
        </div>
        <TurkeyDissection />
      </section>

      {/* Question 2 / Extension */}
      <section className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ArrowRight className="text-purple-500" />
          คำถามที่ 2: ครื่องยัดไส้ไก่และพื้นที่ส่วนช่องท้องของไก่มีขนาดเป็นเท่าไรได้อีกบ้าง ที่จะทำให้ชายคนนี้สามารถทำเหตุการณ์ในลักษณะนี้ได้
        </h2>
        <div className="text-gray-300 space-y-4">
          <p>
            เงื่อนไขสำคัญคือ <strong>ด้านของลูกบาศก์ (L) ต่อ ด้านฐานของทรงสี่เหลี่ยม (A) ต้องเป็นอัตราส่วน 3 ต่อ 2 (3 : 2)</strong>
          </p>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <p className="font-mono text-orange-400 mb-2">สูตรความสัมพันธ์:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>ด้านลูกบาศก์ <strong>L = 3x</strong></li>
              <li>ด้านฐานทรงสี่เหลี่ยม <strong>A = 2x</strong></li>
              <li>ความยาวทรงสี่เหลี่ยม <strong>B = 6.75x</strong> (หรือ 27/4 เท่าของ x)</li>
            </ul>
          </div>
          <p>
            <strong>ตัวอย่างอื่นที่ทำได้:</strong>
            <br />
            ถ้า x = 4 (กรณีในโจทย์): L=12, A=8, B=27
            <br />
            ถ้า x = 8: L=24, A=16, B=54
          </p>
          <p className="text-sm text-gray-500 italic">
            *เหตุผลคือการตัดแบ่งแบบขั้นบันไดนี้ อาศัยการเลื่อนรูปทรงตามสัดส่วนจำนวนเต็ม 3 ส่วนไปเป็น 2 ส่วน
          </p>

          <div className="pt-8 border-t border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 text-center">ทดลองปรับขนาด (Interactive Slide)</h3>
            <TurkeyGeneralization />
          </div>
        </div>
      </section>

      {/* Further Exploration */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl border border-gray-700 space-y-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <CheckCircle2 className="text-green-500" />
          แนวทางการศึกษาต่อ (Further Exploration)
        </h2>
        <div className="text-gray-300 space-y-4 leading-relaxed">
          <p>
            ปัญหาการตัดแบ่งรูปทรง (Dissection Problems) เป็นหัวข้อที่น่าสนใจในคณิตศาสตร์ นี่คือแนวทางที่คุณสามารถศึกษาต่อได้:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="bg-gray-800/50 p-4 rounded-xl border border-white/5 hover:border-orange-500/30 transition-colors">
              <h3 className="font-bold text-orange-400 mb-2">Hilbert's Third Problem</h3>
              <p className="text-sm">
                เป็นคำถามว่า "รูปทรงหลายเหลี่ยมสองรูปที่มีปริมาตรเท่ากัน จะสามารถตัดแบ่งให้เป็นชิ้นส่วนที่เหมือนกันได้เสมอหรือไม่?"
                (คำตอบคือ <strong>ไม่เสมอไป</strong> ขึ้นอยู่กับค่า Dehn Invariant)
              </p>
            </li>
            <li className="bg-gray-800/50 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <h3 className="font-bold text-blue-400 mb-2">Haberdasher's Puzzle</h3>
              <p className="text-sm">
                ปริศนาคลาสสิกโดย Henry Dudeney: การตัดรูปสามเหลี่ยมด้านเท่าออกเป็น 4 ชิ้น แล้วนำมาประกอบใหม่เป็นรูปสี่เหลี่ยมจัตุรัส
              </p>
            </li>
            <li className="bg-gray-800/50 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
              <h3 className="font-bold text-purple-400 mb-2">Minimal Cuts</h3>
              <p className="text-sm">
                การค้นหาจำนวนครั้งในการตัดที่ "น้อยที่สุด" สำหรับรูปทรงต่างๆ เช่น การตัดลูกบาศก์เป็น Tetrahedron
              </p>
            </li>
            <li className="bg-gray-800/50 p-4 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors">
              <h3 className="font-bold text-green-400 mb-2">Hinged Dissections</h3>
              <p className="text-sm">
                การตัดแบ่งโดยที่ชิ้นส่วนต่างๆ ยังคงเชื่อมต่อกันด้วยจุดหมุน (Hinges) และสามารถพับเปลี่ยนรูปทรงได้
              </p>
            </li>
          </ul>
        </div>
      </section>

      <footer className="text-center text-gray-600 py-12">
        <p>สร้างสรรค์เพื่อการศึกษาปัญหาคณิตศาสตร์ (Turkey Problem Challenge)</p>
      </footer>
    </div>
  );
}
