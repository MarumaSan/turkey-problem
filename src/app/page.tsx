'use client';

import React from 'react';
import TurkeyDissection from '@/components/TurkeyDissection';
import TurkeyGeneralization from '@/components/TurkeyGeneralization';
import { CheckCircle2, Ruler, Scissors, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-white text-gray-900">
      {/* KFC Brand Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="h-4 w-full kfc-stripes shadow-sm"></div>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--kfc-red)] rounded-sm flex items-center justify-center text-white font-black text-xl shadow-sm">
              T
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic text-black">
              Turkey <span className="text-[var(--kfc-red)]">Problem</span>
            </span>
          </div>
          <div className="hidden md:flex gap-6 font-bold text-sm tracking-wide uppercase">
            <a href="#intro" className="hover:text-[var(--kfc-red)] transition-colors">Problem</a>
            <a href="#simulation" className="hover:text-[var(--kfc-red)] transition-colors">Simulation</a>
            <a href="#generalization" className="hover:text-[var(--kfc-red)] transition-colors">Formula</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <section id="intro" className="min-h-[60vh] flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden bg-white">
          <div className="absolute inset-0 kfc-diagonals opacity-50 pointer-events-none"></div>

          <div className="max-w-4xl w-full text-center relative z-10 space-y-6">
            <div className="inline-block px-4 py-1 bg-red-100 text-[var(--kfc-red)] font-bold text-sm rounded-full mb-4 border border-red-200">
              MATHEMATICS SPECIAL
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-black leading-tight uppercase tracking-tight italic">
              The <span className="text-[var(--kfc-red)]">Turkey</span><br />Stuffer Problem
            </h1>

            {/* Original Context Restored */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm max-w-3xl mx-auto text-left space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-[var(--kfc-red)] rounded-full flex items-center justify-center text-white font-bold">
                  <Scissors className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-black uppercase italic">The Situation</h2>
              </div>
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                ชายคนหนึ่งต้องการนำไก่งวงทั้งตัวมายัดไส้และนำไปอบ โดยเขามีเครื่องที่จะใช้ยัดไส้ไก่แบบสำเร็จรูปแบบลูกบาศก์ขนาด <span className="text-[var(--kfc-red)] font-bold">12 ซม. x 12 ซม. x 12 ซม.</span> เขาสังเกตว่าในส่วนช่องท้องของไก่งวงตัวนี้เป็นรูปทรงสี่เหลี่ยมมุมฉากขนาด <span className="text-[var(--kfc-red)] font-bold">8 ซม. x 8 ซม. x 27 ซม.</span> พอดี
              </p>
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                เนื่องจากเขามีเวลาในการเตรียมอาหารไม่มาก ชายคนนี้จึงต้องการตัดเครื่องที่ใช้ยัดไส้ออกเป็น <span className="bg-red-100 px-2 py-0.5 rounded text-[var(--kfc-red)] font-bold">4 ชิ้น</span> เพื่อให้ประกอบเข้าช่องท้องไก่ได้พอดี
              </p>

              <div className="bg-red-50 p-6 rounded-xl border border-red-100 space-y-4">
                <h3 className="font-bold text-[var(--kfc-red)] text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--kfc-red)] text-white flex items-center justify-center text-sm">?</span>
                  คำถาม (Questions)
                </h3>
                <ul className="space-y-3 font-medium text-gray-900">
                  <li className="flex gap-3">
                    <span className="font-bold whitespace-nowrap">คำถาม 1:</span>
                    <span>ชายคนนี้ควรตัดเครื่องยัดไส้ไก่อย่างไร</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold whitespace-nowrap">คำถาม 2:</span>
                    <span>เครื่องยัดไส้ไก่และพื้นที่ส่วนช่องท้องของไก่มีขนาดเป็นเท่าไรได้อีกบ้าง ที่จะทำให้ชายคนนี้สามารถทำเหตุการณ์ในลักษณะนี้ได้</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  <span>ปริมาตรเดิม: 12³ = 1728 ซม.³</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--kfc-red)]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ปริมาตรใหม่: 8x8x27 = 1728 ซม.³ (เท่ากันเป๊ะ!)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section (Diagram) */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-black uppercase italic mb-8">The Challenge Diagram</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {/* Visual Diagram */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-[var(--kfc-red)] transition-all flex items-center justify-center">
                <svg width="100%" height="auto" viewBox="0 0 400 200" className="max-w-md text-black drop-shadow-md">
                  <g transform="translate(50, 50)">
                    <path d="M0 40 L60 40 L60 100 L0 100 Z" fill="#fb923c" stroke="black" strokeWidth="2" />
                    <path d="M0 40 L30 10 L90 10 L60 40 Z" fill="#fdba74" stroke="black" strokeWidth="2" />
                    <path d="M60 40 L90 10 L90 70 L60 100 Z" fill="#f97316" stroke="black" strokeWidth="2" />
                    <text x="45" y="130" textAnchor="middle" fill="black" fontSize="14" fontWeight="bold">12x12x12</text>
                  </g>
                  <g transform="translate(170, 90)">
                    <path d="M0 0 L40 0 M30 -10 L40 0 L30 10" stroke="#E4002B" strokeWidth="3" fill="none" />
                    <text x="20" y="-15" textAnchor="middle" fill="#E4002B" fontSize="12" fontWeight="bold">4 ชิ้น</text>
                  </g>
                  <g transform="translate(250, 20)">
                    <path d="M0 40 L40 40 L40 150 L0 150 Z" fill="#E4002B" stroke="black" strokeWidth="2" />
                    <path d="M0 40 L20 20 L60 20 L40 40 Z" fill="#ff4d4d" stroke="black" strokeWidth="2" />
                    <path d="M40 40 L60 20 L60 130 L40 150 Z" fill="#b91c1c" stroke="black" strokeWidth="2" />
                    <text x="30" y="170" textAnchor="middle" fill="black" fontSize="14" fontWeight="bold">8x8x27</text>
                  </g>
                </svg>
              </div>

              {/* Text Explanation */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-2">เป้าหมาย</h3>
                  <p className="text-gray-600">
                    เปลี่ยนรูปทรงจากลูกบาศก์ <span className="font-bold">12x12x12</span>
                    <br />ให้กลายเป็นแท่งยาว <span className="font-bold">8x8x27</span>
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[var(--kfc-red)]">
                  <h3 className="font-bold text-lg mb-2 text-[var(--kfc-red)]">คำใบ้?</h3>
                  <p className="text-gray-600">
                    ต้องใช้การตัดแบบ "ขั้นบันได" เพื่อให้สามารถเลื่อนชิ้นส่วนไปประกอบเป็นทรงยาวได้พอดี
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simulation Section */}
        <section id="simulation" className="scroll-mt-24 py-16 container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-2 flex-1 kfc-stripes rounded-full opacity-80"></div>
            <h2 className="text-4xl font-black text-black uppercase italic tracking-tighter text-center px-4">
              The <span className="text-[var(--kfc-red)]">Simulation</span>
            </h2>
            <div className="h-2 flex-1 kfc-stripes rounded-full opacity-80"></div>
          </div>

          <div className="space-y-24">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-[var(--kfc-red)] text-white flex items-center justify-center rounded-sm font-black text-lg">1</span>
                Dissection (ส่วนจำลองการตัด)
              </h3>
              <TurkeyDissection />
            </div>

            <div id="generalization" className="scroll-mt-24 bg-gray-50 rounded-3xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-[var(--kfc-red)] text-white flex items-center justify-center rounded-sm font-black text-lg">2</span>
                Generalization (ส่วนสูตรคำนวณ)
              </h3>
              <TurkeyGeneralization />
            </div>
          </div>
        </section>

      </main>

      {/* KFC Footer */}
      <footer className="bg-[#1c1c1c] text-white py-16 relative overflow-hidden mt-12">
        <div className="absolute top-0 left-0 right-0 h-4 kfc-stripes"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-[var(--kfc-red)] rounded-md flex items-center justify-center text-white font-black text-3xl shadow-lg mx-auto mb-6 rotate-3">
            T
          </div>
          <h2 className="text-4xl font-black italic mb-6 tracking-tight uppercase">Turkey Problem</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto font-medium text-lg italic">
            "เพราะคณิตศาสตร์... อร่อยจนต้องเลียนิ้ว"
          </p>
          <div className="text-sm text-gray-600 font-mono border-t border-gray-800 pt-8">
            Create by Group 6 For Math Model Reasoning
          </div>
        </div>
      </footer>
    </div>
  );
}
