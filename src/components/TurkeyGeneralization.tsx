import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Edges, Text, Line } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { Box, LayoutTemplate } from 'lucide-react';

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

function Piece({ boxes, color, position }: { boxes: { args: [number, number, number]; position: [number, number, number] }[]; color: string; position: [number, number, number] }) {
    return (
        // @ts-ignore
        <motion.group
            animate={{ x: position[0], y: position[1], z: position[2] }}
            transition={{ type: "spring", stiffness: 40, damping: 12 }}
        >
            {boxes.map((box, i) => (
                <mesh key={i} position={box.position} castShadow receiveShadow>
                    <boxGeometry args={box.args} />
                    <meshStandardMaterial
                        color={color}
                        metalness={0.2}
                        roughness={0.7}
                        emissive={color}
                        emissiveIntensity={0.1}
                    />
                    <Edges color="black" threshold={15} />
                </mesh>
            ))}
        </motion.group>
    );
}

function DimensionLine({ start, end, label, color = "white", offset = [0, 0, 0] }: { start: [number, number, number], end: [number, number, number], label: string, color?: string, offset?: [number, number, number] }) {
    const p1 = new THREE.Vector3(...start).add(new THREE.Vector3(...offset));
    const p2 = new THREE.Vector3(...end).add(new THREE.Vector3(...offset));
    const mid = p1.clone().add(p2).multiplyScalar(0.5);

    return (
        <group>
            {/* Main Line */}
            <Line points={[p1, p2]} color={color} opacity={0.5} transparent lineWidth={1} dashed dashScale={2} />

            {/* Ticks (endpoints) */}
            <mesh position={p1}><sphereGeometry args={[0.2]} /><meshBasicMaterial color={color} /></mesh>
            <mesh position={p2}><sphereGeometry args={[0.2]} /><meshBasicMaterial color={color} /></mesh>

            <Text
                position={[mid.x, mid.y + 0.5, mid.z]}
                color={color}
                fontSize={1.5}
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.1}
                outlineColor="#000000"
            >
                {label}
            </Text>
        </group>
    );
}

export default function TurkeyGeneralization() {
    const [k, setK] = useState(4); // Default k=4 (L=12)
    const [isPrism, setIsPrism] = useState(false); // Shape toggle

    // Dimensions based on k
    const L = 3 * k;
    const A = 2 * k;
    const B = 6.75 * k;

    // Scale factor relative to base model (k=4)
    const s = k / 4;

    // Re-calculate pieces based on current K scale
    const pieces = useMemo(() => [
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
    ], [k]);

    // Offsets for Prism State (scaled)
    // Base offsets for k=4 (Step 2 in Dissection):
    // P1: 0,0,0
    // P2: 9, 0, -4
    // P3: 6, -4, 0
    // P4: 15, -4, -4
    const offsets = useMemo(() => {
        if (!isPrism) return [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        return [
            [0, 0, 0],
            [9 * s, 0, -4 * s],
            [6 * s, -4 * s, 0],
            [15 * s, -4 * s, -4 * s]
        ];
    }, [isPrism, s]);

    // Auto-centering and floor calculation
    const { centerOffset, floorY, bounds } = useMemo(() => {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        pieces.forEach((piece, i) => {
            const pos = offsets[i] as [number, number, number];

            piece.boxes.forEach(box => {
                const absoluteCenter = [
                    pos[0] + box.position[0],
                    pos[1] + box.position[1],
                    pos[2] + box.position[2]
                ];
                const halfSize = [box.args[0] / 2, box.args[1] / 2, box.args[2] / 2];

                minX = Math.min(minX, absoluteCenter[0] - halfSize[0]);
                maxX = Math.max(maxX, absoluteCenter[0] + halfSize[0]);

                minY = Math.min(minY, absoluteCenter[1] - halfSize[1]);
                maxY = Math.max(maxY, absoluteCenter[1] + halfSize[1]);

                minZ = Math.min(minZ, absoluteCenter[2] - halfSize[2]);
                maxZ = Math.max(maxZ, absoluteCenter[2] + halfSize[2]);
            });
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;

        const height = maxY - minY;
        const FLOAT_OFFSET = 3 * (s / 1); // Scale float offset slightly with size? Or keep constant. Keep constant for consistency.
        const calculatedFloorY = (-height / 2) - 3; // Float by 3 units

        return {
            centerOffset: [-centerX, -centerY, -centerZ] as [number, number, number],
            floorY: calculatedFloorY,
            bounds: { minX, maxX, minY, maxY, minZ, maxZ }
        };
    }, [pieces, offsets, s]);

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

                <div className="flex justify-center pt-2">
                    <button
                        onClick={() => setIsPrism(!isPrism)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all border ${isPrism
                            ? 'bg-blue-600 border-blue-400 hover:bg-blue-500 text-white'
                            : 'bg-gray-700 border-gray-500 hover:bg-gray-600 text-gray-200'
                            }`}
                    >
                        {isPrism ? <LayoutTemplate size={18} /> : <Box size={18} />}
                        {isPrism ? 'แสดงรูปทรงลูกบาศก์ (Cube)' : 'แสดงผลลัพธ์ (Prism)'}
                    </button>
                </div>

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
                    {isPrism
                        ? `รูปทรงสี่เหลี่ยมผืนผ้า (${A} x ${A} x ${B})`
                        : `รูปทรงลูกบาศก์เริ่มต้น (${L} x ${L} x ${L})`
                    }
                </div>
                <Canvas camera={{ position: [40, 40, 40], fov: 45 }} shadows>
                    <color attach="background" args={['#111827']} />
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />

                    <ambientLight intensity={0.4} />
                    <pointLight position={[20, 30, 20]} intensity={1} castShadow />
                    <directionalLight position={[-10, 10, -10]} intensity={0.5} />
                    <Environment preset="city" />

                    {/* Dynamic scaling group */}
                    <motion.group
                        animate={{ x: centerOffset[0], y: centerOffset[1], z: centerOffset[2] }}
                        transition={{ type: "spring", stiffness: 30, damping: 15 }}
                    >
                        {pieces.map((piece, index) => (
                            <Piece
                                key={piece.id}
                                boxes={piece.boxes}
                                color={COLORS[index]}
                                position={offsets[index] as [number, number, number]}
                            />
                        ))}
                    </motion.group>

                    {/* Dimension Lines */}
                    <motion.group
                        animate={{ x: centerOffset[0], y: centerOffset[1], z: centerOffset[2] }}
                        transition={{ type: "spring", stiffness: 30, damping: 15 }}
                    >
                        {/* Width (X) */}
                        <DimensionLine
                            start={[bounds.minX, bounds.minY - 2, bounds.maxZ + 2]}
                            end={[bounds.maxX, bounds.minY - 2, bounds.maxZ + 2]}
                            label={`${(bounds.maxX - bounds.minX).toFixed(1)}`}
                            color="#FAA300"
                        />

                        {/* Height (Y) */}
                        <DimensionLine
                            start={[bounds.minX - 2, bounds.minY, bounds.maxZ + 2]}
                            end={[bounds.minX - 2, bounds.maxY, bounds.maxZ + 2]}
                            label={`${(bounds.maxY - bounds.minY).toFixed(1)}`}
                            color="#FAA300"
                        />

                        {/* Depth (Z) */}
                        <DimensionLine
                            start={[bounds.maxX + 2, bounds.minY - 2, bounds.minZ]}
                            end={[bounds.maxX + 2, bounds.minY - 2, bounds.maxZ]}
                            label={`${(bounds.maxZ - bounds.minZ).toFixed(1)}`}
                            color="#FAA300"
                        />
                    </motion.group>

                    <motion.group animate={{ y: floorY }} transition={{ type: "spring", stiffness: 30, damping: 15 }}>
                        <ContactShadows position={[0, -0.1, 0]} opacity={0.5} scale={60} blur={2} far={L + 5} />
                        <gridHelper args={[100, 100, 0x444444, 0x222222]} />
                    </motion.group>
                </Canvas>
            </div>
        </div>
    );
}
