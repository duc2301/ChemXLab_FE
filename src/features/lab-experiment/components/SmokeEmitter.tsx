import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useExperimentStore } from "../services/experimentStore";

// ─── Tube Constants (shared) ──────────────────────────────────────────────────
const TUBE_TOP_Y = 0.15;
const TUBE_INNER_R = 0.008;

// ─── SmokeEmitter: Mô phỏng khói phản ứng hóa nhiệt ─────────────────────────
// Tối ưu hiệu năng tuyệt đối bằng InstancedMesh + mutation in-place, không allocation trong useFrame.

const SMOKE_COUNT = 450;          // More particles for denser smoke
const SMOKE_BASE_R = 0.003;      // Smaller spawn radius to keep away from walls
const SMOKE_MAX_SCALE = 0.0028;  // Larger particles for thicker look
const SMOKE_UP_SPEED = 0.022;    // Bay chậm
const SMOKE_MAX_AGE_BASE = 5;  // Bay cao nè :d

// Pre-allocate a stable dummy object at module level (never re-created)
const _smokeDummy = new THREE.Object3D();

interface SmokeParticle {
    x: number; y: number; z: number;   // world-space position (local to group)
    phase: number;                       // initial phase offset for sin/cos drift (radians)
    speedMult: number;                   // individual up-speed multiplier [0.7, 1.3]
    age: number;                         // current age (seconds)
    maxAge: number;                      // lifetime (seconds)
    rotX: number; rotY: number; rotZ: number; // random orientation for dodecahedron
    rotSpeedX: number; rotSpeedY: number;     // gentle tumble speed
}

export const SmokeEmitter = ({ active, isFinished, totalGrams, tubeId, color = "#ffe787" }: { active: boolean; isFinished: boolean; totalGrams: number; tubeId: string; color?: string }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const matRef = useRef<THREE.MeshBasicMaterial>(null);

    const reactionProgress = useExperimentStore((s) => s.reactionProgress.get(tubeId) || 0);
    const stopTimeRef = useRef<number | null>(null);

    // ── Stable particle array — allocated once ──────────────────────────────────
    const particles = useMemo<SmokeParticle[]>(() => {
        const arr: SmokeParticle[] = [];
        for (let i = 0; i < SMOKE_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = Math.random() * SMOKE_BASE_R;
            const maxAge = SMOKE_MAX_AGE_BASE * (0.75 + Math.random() * 0.5);
            arr.push({
                x: Math.cos(theta) * r,
                y: 0, // Start all particles at the bottom surface initially
                z: Math.sin(theta) * r,
                phase: Math.random() * Math.PI * 2,
                speedMult: 0.7 + Math.random() * 0.6,
                age: 0, // Start at age 0 so they rise up organically
                maxAge,
                rotX: Math.random() * Math.PI * 2,
                rotY: Math.random() * Math.PI * 2,
                rotZ: Math.random() * Math.PI * 2,
                rotSpeedX: (Math.random() - 0.5) * 0.4,
                rotSpeedY: (Math.random() - 0.5) * 0.4,
            });
        }
        return arr;
    }, []);

    // ── Helper: reset a particle to origin ─────────────────────────────────────
    const resetParticle = (p: SmokeParticle) => {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * SMOKE_BASE_R;
        p.x = Math.cos(theta) * r;
        p.y = 0;
        p.z = Math.sin(theta) * r;
        p.phase = Math.random() * Math.PI * 2;
        p.speedMult = 0.7 + Math.random() * 0.6;
        p.age = 0;
        p.maxAge = SMOKE_MAX_AGE_BASE * (0.75 + Math.random() * 0.5);
        p.rotSpeedX = (Math.random() - 0.5) * 0.4;
        p.rotSpeedY = (Math.random() - 0.5) * 0.4;
    };

    useFrame((state, delta) => {
        if (!meshRef.current || !matRef.current) return;

        // ── 1. Opacity / Fade logic ──────────────────────────────────────────────
        let baseOpacity = 0;
        if (reactionProgress > 0.33 || isFinished) {
            // Fade-in: 10s → 15s (progress 0.33 → 0.5)
            const progressVal = isFinished ? 1.0 : reactionProgress;
            const fadeIn = Math.min(1.0, (progressVal - 0.33) / 0.17);
            baseOpacity = fadeIn * 0.38; // Much more visible/opaque
        }

        const shouldFade = !active || reactionProgress >= 1.0 || isFinished;
        let fadeFactor = 1.0;
        if (shouldFade) {
            if (stopTimeRef.current === null) stopTimeRef.current = state.clock.elapsedTime;
            const elapsed = state.clock.elapsedTime - stopTimeRef.current;
            // 5-second linger with power-1.3 easing for gradual tail
            fadeFactor = Math.max(0, 1 - Math.pow(elapsed / 5.0, 1.3));
        } else {
            stopTimeRef.current = null;
        }

        const finalOpacity = baseOpacity * fadeFactor;
        matRef.current.opacity = finalOpacity;

        if (finalOpacity <= 0.002) {
            meshRef.current.visible = false;
            return;
        }
        meshRef.current.visible = true;

        // ── 2. Local-space tube bounds ───────────────────────────────────────────
        const startY = 0.026 + totalGrams * 0.0028;
        const mouthY = TUBE_TOP_Y - startY; // height of tube mouth in local space
        const tubeR = TUBE_INNER_R - 0.002; // Tighter constraint to avoid wall penetration

        const dt = Math.min(delta, 0.05); // clamp delta to avoid physics explosion on tab switch
        const t = state.clock.elapsedTime;

        // ── 3. Update every particle — zero allocation ───────────────────────────
        for (let i = 0; i < SMOKE_COUNT; i++) {
            const p = particles[i];

            p.age += dt;
            if (p.age >= p.maxAge) {
                // Dead → reset, but only respawn if smoke is still active/lingering
                if (fadeFactor < 0.05) {
                    // Almost gone: freeze particle so it fades invisibly
                    _smokeDummy.scale.setScalar(0);
                    _smokeDummy.updateMatrix();
                    meshRef.current.setMatrixAt(i, _smokeDummy.matrix);
                    continue;
                }
                resetParticle(p);
            }

            const lifePct = p.age / p.maxAge; // 0 → 1

            // ── 3a. Vertical velocity: fast at birth (热气流), decelerates (giảm nhiệt)
            //   v(y) = SPEED * speedMult * (1 - 0.6 * lifePct)  [decelerating]
            const upV = SMOKE_UP_SPEED * p.speedMult * (1.0 - 0.6 * lifePct) * fadeFactor;
            p.y += upV * dt;

            // ── 3b. Horizontal convection (Phễu & Đối lưu):
            //   Drift sử dụng sin/cos với pha offset theo từng hạt,
            //   biên độ mở rộng theo chiều cao (khói thoát ra ngoài khi lên cao).
            const heightAboveMouth = Math.max(0, p.y - mouthY);
            // Very small horizontal drift inside tube, slightly more above mouth
            const convectAmp = p.y < mouthY
                ? 0.0003 // Minimal drift inside tube
                : 0.0006 + heightAboveMouth * 0.004; // Slightly more above mouth
            p.x += Math.sin(t * 1.1 + p.phase) * convectAmp * dt;
            p.z += Math.cos(t * 0.9 + p.phase + 1.3) * convectAmp * dt;

            // ── 3c. Tube constraint: ALWAYS clamp inside inner radius while below mouth ──
            if (p.y < mouthY) {
                const rr = p.x * p.x + p.z * p.z;
                if (rr > tubeR * tubeR) {
                    const inv = tubeR / Math.sqrt(rr);
                    p.x *= inv;
                    p.z *= inv;
                }
            }

            // ── 3d. Lifecycle scale curve ────────────────────────────────────────
            //   Phase 1 (0%–20%): grow fast   → smoothstep 0→1
            //   Phase 2 (20%–70%): hold full  → scale = 1
            //   Phase 3 (70%–100%): taper out → smoothstep 1→0  (tránh cắt cụt)
            let scalePct: number;
            if (lifePct < 0.20) {
                const tt = lifePct / 0.20;
                scalePct = tt * tt * (3 - 2 * tt); // smoothstep up
            } else if (lifePct < 0.70) {
                scalePct = 1.0;
            } else {
                const tt = (lifePct - 0.70) / 0.30;
                scalePct = 1.0 - tt * tt * (3 - 2 * tt); // smoothstep down
            }
            const s = SMOKE_MAX_SCALE * scalePct;

            // ── 3e. Gentle tumble ──────────────────────────────────────────────────
            p.rotX += p.rotSpeedX * dt;
            p.rotY += p.rotSpeedY * dt;

            // ── 3f. Write instance matrix ──────────────────────────────────────────
            _smokeDummy.position.set(p.x, p.y, p.z);
            _smokeDummy.rotation.set(p.rotX, p.rotY, p.rotZ);
            _smokeDummy.scale.setScalar(s);
            _smokeDummy.updateMatrix();
            meshRef.current.setMatrixAt(i, _smokeDummy.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    const startY = 0.026 + totalGrams * 0.0028;

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, SMOKE_COUNT]}
            position={[0, startY, 0]}
            raycast={() => null}
            frustumCulled={false}
        >
            {/* Dodecahedron: 12 mặt ngũ giác → cảm giác khối cuộn tròn khi xoay */}
            <dodecahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
                ref={matRef}
                color={color} // Màu khói động
                transparent
                opacity={0}
                depthWrite={false}
            />
        </instancedMesh>
    );
};
