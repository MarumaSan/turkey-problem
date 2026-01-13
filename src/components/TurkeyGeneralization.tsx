'use client';

import React, { useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Edges } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];

// Helper to get scaled box props
const getBox = (xMin: number, xMax: number, yMin: number, yMax: number, zMin: number, zMax: number, scale: number) => {
    const s = scale / 4; // Normalized to original k=4 logic
    const w = (xMax - xMin) * s;
    const h = (yMax - yMin) * s;
    const d = (zMax - zMin) * s;
    const x = (xMin * s) + w / 2;
    const y = (yMin * s) + h / 2;
    const z = (zMin * s) + d / 2;
    return { args: [w, h, d] as [number, number, number], position: [x, y, z] as [number, number, number] };
};

export default function TurkeyGeneralization() {
    const [k, setK] = useState(4); // Default k=4 (L=12)

    // Dimensions based on k
    const L = 3 * k;
    const A = 2 * k;
    const B = 6.75 * k;

    // Re-calculate pieces based on current K scale
    const pieces = [
        {
            id: 1,
            boxes: [
                getBox(0, 6, 0, 8, 0, 8, k),
                getBox(6, 9, 0, 4, 0, 8, k),
                getBox(9, 12, 0, 4, 0, 4, k),
            ],
        },
        {
            id: 2,
            boxes: [
                getBox(0, 6, 0, 8, 8, 12, k),
                getBox(6, 9, 0, 4, 8, 12, k),
                getBox(9, 12, 0, 4, 4, 12, k),
            ],
        },
        {
            id: 3,
            boxes: [
                getBox(0, 3, 8, 12, 0, 8, k),
                getBox(3, 6, 8, 12, 0, 4, k),
                getBox(6, 12, 4, 12, 0, 4, k),
            ],
        },
        {
            id: 4,
            boxes: [
                getBox(0, 3, 8, 12, 8, 12, k),
                getBox(3, 6, 8, 12, 4, 12, k),
                getBox(6, 12, 4, 12, 4, 12, k),
            ],
        },
    ];

    // For generalization view, we just show the exploded or assembled cube is fine.
    // Let's show the assembled cube but allow scaling.
    // Center: The cube center at k=4 is (6, 6, 6).
    // At scale k, center is (1.5k, 1.5k, 1.5k).
    // We center the group negatively.
    const centerOffset = [-1.5 * k, -1.5 * k, -1.5 * k] as [number, number, number];

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-4">
                <div className="flex justify-between items-center">
                    <label htmlFor="k-slider" className="text-orange-400 font-bold">ปรับขนาดตัวแปร k: {k}</label>
                    <span className="text-gray-500 text-sm">(ค่าเริ่มต้น: 4)</span>
                </div>
                <input
                    id="k-slider"
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={k}
                    onChange={(e) => setK(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div className="bg-gray-900 p-2 rounded-lg">
                        <div className="text-gray-400">ด้านลูกบาศก์ (L)</div>
                        <div className="text-white font-mono text-lg">{L}</div>
                        <div className="text-xs text-gray-600">3 * {k}</div>
                    </div>
                    <div className="bg-gray-900 p-2 rounded-lg">
                        <div className="text-gray-400">ฐาน (A)</div>
                        <div className="text-white font-mono text-lg">{A}</div>
                        <div className="text-xs text-gray-600">2 * {k}</div>
                    </div>
                    <div className="bg-gray-900 p-2 rounded-lg">
                        <div className="text-gray-400">ความยาว (B)</div>
                        <div className="text-white font-mono text-lg">{B}</div>
                        <div className="text-xs text-gray-600">6.75 * {k}</div>
                    </div>
                </div>
            </div>

            <div className="w-full h-[500px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700 relative">
                <div className="absolute top-4 left-4 z-10 text-white/50 text-sm pointer-events-none">
                    แสดงรูปทรงลูกบาศก์เริ่มต้นที่ขนาด L = {L}
                </div>
                <Canvas camera={{ position: [40, 40, 40], fov: 45 }} shadows>
                    <color attach="background" args={['#111827']} />
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />

                    <ambientLight intensity={0.4} />
                    <pointLight position={[20, 30, 20]} intensity={1} castShadow />
                    <directionalLight position={[-10, 10, -10]} intensity={0.5} />
                    <Environment preset="city" />

                    {/* Dynamic scaling group */}
                    <group position={[0, 0, 0]}>
                        <group position={centerOffset}>
                            {pieces.map((piece, index) => (
                                // @ts-ignore
                                <motion.group key={piece.id}>
                                    {piece.boxes.map((box, i) => (
                                        <mesh key={i} position={box.position} castShadow receiveShadow>
                                            <boxGeometry args={box.args} />
                                            <meshStandardMaterial
                                                color={COLORS[index]}
                                                metalness={0.2}
                                                roughness={0.7}
                                            />
                                            <Edges color="black" threshold={15} />
                                        </mesh>
                                    ))}
                                </motion.group>
                            ))}
                        </group>
                    </group>

                    <ContactShadows position={[0, -L / 2 - 0.1, 0]} opacity={0.5} scale={60} blur={2} far={L + 5} />
                    <gridHelper args={[100, 100, 0x444444, 0x222222]} position={[0, -L / 2, 0]} />
                </Canvas>
            </div>
        </div>
    );
}
