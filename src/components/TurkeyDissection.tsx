import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Line } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];

// Box definition: [width, height, depth, x, y, z] (center coords)
// Using corner-based ranges converted to center/size.
const getBox = (xMin: number, xMax: number, yMin: number, yMax: number, zMin: number, zMax: number) => {
  const w = xMax - xMin;
  const h = yMax - yMin;
  const d = zMax - zMin;
  return { args: [w, h, d] as [number, number, number], position: [xMin + w / 2, yMin + h / 2, zMin + d / 2] as [number, number, number] };
};

const PIECES = [
  // Piece 1: Bot1-Bot2
  {
    id: 1,
    boxes: [
      getBox(0, 6, 0, 8, 0, 8),
      getBox(6, 9, 0, 4, 0, 8),
      getBox(9, 12, 0, 4, 0, 4),
    ],
  },
  // Piece 2: Bot1-Top2
  {
    id: 2,
    boxes: [
      getBox(0, 6, 0, 8, 8, 12),
      getBox(6, 9, 0, 4, 8, 12),
      getBox(9, 12, 0, 4, 4, 12),
    ],
  },
  // Piece 3: Top1-Bot2
  {
    id: 3,
    boxes: [
      getBox(0, 3, 8, 12, 0, 8),
      getBox(3, 6, 8, 12, 0, 4),
      getBox(6, 12, 4, 12, 0, 4),
    ],
  },
  // Piece 4: Top1-Top2
  {
    id: 4,
    boxes: [
      getBox(0, 3, 8, 12, 8, 12),
      getBox(3, 6, 8, 12, 4, 12),
      getBox(6, 12, 4, 12, 4, 12),
    ],
  },
];

const OFFSETS = [
  // Step 0: Cube
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  // Step 1: Slide XY (+6, -4, 0 for Top Pieces 3,4)
  [
    [0, 0, 0],
    [0, 0, 0],
    [6, -4, 0],
    [6, -4, 0],
  ],
  // Step 2: Slide XZ (+9, 0, -4 for Top2 Pieces 2,4)
  // Piece 1 (Bot1-Bot2): stable
  // Piece 2 (Bot1-Top2): +9, 0, -4
  // Piece 3 (Top1-Bot2): +6, -4, 0 (From step 1, stable in step 2)
  // Piece 4 (Top1-Top2): (+6,-4,0) + (+9,0,-4) = (15, -4, -4)
  [
    [0, 0, 0],
    [9, 0, -4],
    [6, -4, 0],
    [15, -4, -4],
  ],
];


const SPREAD_DISTANCE = 8;

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

const COLORS_STEP_0 = '#fb923c'; // Orange-400 (Uniform)
const COLORS_STEP_1 = ['#fb923c', '#fb923c', '#4ade80', '#4ade80']; // Orange vs Green (Groups)
// Step 2 uses original COLORS array: Red/Green/Blue/Yellow

import confetti from 'canvas-confetti';

export default function TurkeyDissection() {
  const [step, setStep] = useState(0);
  const [exploded, setExploded] = useState(false);

  const nextStep = () => {
    setStep((s) => {
      const next = Math.min(s + 1, 2);
      if (next === 2 && s !== 2) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E4002B', '#ffffff', '#fb923c'] // KFC Colors + Orange
        });
      }
      return next;
    });
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => { setStep(0); setExploded(false); };

  // Adjust visualization based on explode state (spread pieces out)
  const getExplodedPos = React.useCallback((basePos: number[], index: number) => {
    if (!exploded) return basePos;

    // Step 0: No explosion (Single Piece)
    if (step === 0) return basePos;

    // Step 1: Explode into 2 Groups (Pieces 0,1 vs Pieces 2,3)
    if (step === 1) {
      // Group A (0,1) moves Left/Back? Group B (2,3) moves Right/Front?
      // Based on cut: Pieces 2/3 moved (6, -4, 0).
      // So let's separate them along the X axis (or dragging vector).
      const isGroupA = index < 2;
      // Move Group A slightly Left (-X), Group B slightly Right (+X)
      const dir = isGroupA ? -1 : 1;
      return [basePos[0] + dir * SPREAD_DISTANCE, basePos[1], basePos[2]];
    }

    // Step 2: Explode all 4 pieces
    const xDir = index % 2 === 0 ? -1 : 1;
    const yDir = index < 2 ? -1 : 1;
    return [basePos[0] + xDir * SPREAD_DISTANCE, basePos[1] + yDir * SPREAD_DISTANCE, basePos[2]];
  }, [exploded, step]);

  // Determine color based on step
  const getPieceColor = (index: number) => {
    if (step === 0) return COLORS_STEP_0;
    if (step === 1) return COLORS_STEP_1[index];
    return COLORS[index];
  };

  // Calculate center and bounds of the entire assembly
  const { centerOffset, floorY, bounds } = useMemo(() => {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    PIECES.forEach((piece, i) => {
      const basePos = OFFSETS[step][i] as [number, number, number];
      const piecePos = getExplodedPos(basePos, i); // [x, y, z]

      piece.boxes.forEach(box => {
        // box.position is relative to piece origin
        // box.args is [w, h, d]
        const absoluteCenter = [
          piecePos[0] + box.position[0],
          piecePos[1] + box.position[1],
          piecePos[2] + box.position[2]
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
    // The bottom of the model in World Space (after centering) is -Height/2
    // Because we shift the center to 0. So Top is +H/2, Bottom is -H/2.
    // User wants it to "float" (not touch grid). Add padding.
    const FLOAT_OFFSET = 3;
    const calculatedFloorY = (-height / 2) - FLOAT_OFFSET;

    return {
      centerOffset: [-centerX, -centerY, -centerZ] as [number, number, number],
      floorY: calculatedFloorY,
      bounds: { minX, maxX, minY, maxY, minZ, maxZ }
    };
  }, [step, getExplodedPos]);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 relative">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-4 rounded-xl text-black border border-gray-200 shadow-sm">
          <h3 className="font-bold text-lg">ขั้นตอนที่ {step + 1} / 3</h3>
          <p className="text-sm text-gray-600">
            {step === 0 && 'เริ่มต้น: ลูกบาศก์ขนาด 12 x 12 x 12'}
            {step === 1 && 'การตัดครั้งที่ 1: เลื่อนในแนวระนาบ XY'}
            {step === 2 && 'การตัดครั้งที่ 2: เลื่อนในแนวระนาบ XZ'}
          </p>
          <p className="text-xs text-[var(--kfc-red)] mt-1 font-mono">
            {step === 0 && 'เป้าหมาย: เลื่อนแกน X+6, แกน Y-4'}
            {step === 1 && 'ผลลัพธ์: 18 x 8 x 12. ถัดไป: เลื่อนแกน X+9, แกน Z-4'}
            {step === 2 && 'เสร็จสิ้น: ทรงสี่เหลี่ยม 27 x 8 x 8 (4 ชิ้น)'}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="explode-view"
              checked={exploded}
              onChange={(e) => setExploded(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[var(--kfc-red)] focus:ring-[var(--kfc-red)]"
            />
            <label htmlFor="explode-view" className="text-sm cursor-pointer select-none text-gray-800">
              แยกชิ้นส่วนให้ดูชัดๆ (Explode View)
            </label>
          </div>
        </div>

        <Canvas camera={{ position: [30, 25, 30], fov: 45 }} shadows>
          <color attach="background" args={['#ffffff']} />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />

          <ambientLight intensity={0.4} />
          <pointLight position={[20, 30, 20]} intensity={1} castShadow />
          <directionalLight position={[-10, 10, -10]} intensity={0.5} />
          <Environment preset="city" />

          {/* Animate centering to smooth out jumps */}
          <motion.group
            animate={{ x: centerOffset[0], y: centerOffset[1], z: centerOffset[2] }}
            transition={{ type: "spring", stiffness: 30, damping: 15 }}
          >
            {PIECES.map((piece, index) => {
              const pos = OFFSETS[step][index] as [number, number, number];
              const displayPos = getExplodedPos(pos, index);
              return (
                <Piece
                  key={piece.id}
                  boxes={piece.boxes}
                  color={getPieceColor(index)}
                  position={displayPos as [number, number, number]}
                />
              );
            })}
          </motion.group>

          {/* Dimension Lines */}
          {!exploded && (
            <motion.group
              animate={{ x: centerOffset[0], y: centerOffset[1], z: centerOffset[2] }}
              transition={{ type: "spring", stiffness: 30, damping: 15 }}
            >
              {/* Width (X) */}
              <DimensionLine
                start={[bounds.minX, bounds.minY - 2, bounds.maxZ + 2]}
                end={[bounds.maxX, bounds.minY - 2, bounds.maxZ + 2]}
                label={`${(bounds.maxX - bounds.minX).toFixed(1)}`}
                color="#E4002B"
              />

              {/* Height (Y) */}
              <DimensionLine
                start={[bounds.minX - 2, bounds.minY, bounds.maxZ + 2]}
                end={[bounds.minX - 2, bounds.maxY, bounds.maxZ + 2]}
                label={`${(bounds.maxY - bounds.minY).toFixed(1)}`}
                color="#E4002B"
              />

              {/* Depth (Z) */}
              <DimensionLine
                start={[bounds.maxX + 2, bounds.minY - 2, bounds.minZ]}
                end={[bounds.maxX + 2, bounds.minY - 2, bounds.maxZ]}
                label={`${(bounds.maxZ - bounds.minZ).toFixed(1)}`}
                color="#E4002B"
              />
            </motion.group>
          )}

          {/* Floor moves to match the bottom of the centered model */}
          <motion.group animate={{ y: floorY }} transition={{ type: "spring", stiffness: 30, damping: 15 }}>
            <ContactShadows position={[0, -0.1, 0]} opacity={0.5} scale={50} blur={2} far={4.5} />
            <gridHelper args={[60, 60, 0xdddddd, 0xeeeeee]} />
          </motion.group>
        </Canvas>
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-semibold transition-all border border-gray-300"
        >
          <ArrowLeft size={20} /> ก่อนหน้า
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black rounded-full font-semibold transition-all border border-gray-300"
        >
          <RotateCcw size={20} /> เริ่มใหม่
        </button>
        <button
          onClick={nextStep}
          disabled={step === 2}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--kfc-red)] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-semibold shadow-lg shadow-red-900/20 transition-all"
        >
          ขั้นตอนถัดไป <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function Piece({ boxes, color, position }: { boxes: { args: [number, number, number]; position: [number, number, number] }[]; color: string; position: [number, number, number] }) {
  return (

    <motion.group
      animate={{ x: position[0], y: position[1], z: position[2] }}
      transition={{ type: "spring", stiffness: 40, damping: 12 }}
    >
      {boxes.map((box, i) => (
        <mesh key={i} position={box.position} castShadow receiveShadow>
          <boxGeometry args={box.args} />

          <motion.meshStandardMaterial
            animate={{ color: color }}
            metalness={0.2}
            roughness={0.7}
            emissive={color}
            emissiveIntensity={0.1}
          />
          {/* Edges removed as requested */}
        </mesh>
      ))}
    </motion.group>
  );
}


