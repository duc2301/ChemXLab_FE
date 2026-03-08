import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ─── H2GasEmitter: White smoke/vapor for H2 gas from Zn + HCl reaction ────────
const H2_GAS_COUNT = 150;
const H2_MAX_SCALE = 0.0022;
const H2_UP_SPEED = 0.025;
const H2_DELAY = 1.5; // Reduced from 3.0 seconds delay before H2 appears

const _h2Dummy = new THREE.Object3D();

interface H2Particle {
    x: number; y: number; z: number;
    phase: number;
    speedMult: number;
    age: number;
    maxAge: number;
    rotX: number; rotY: number; rotZ: number;
    rotSpeedX: number; rotSpeedY: number;
}

export const H2GasEmitter = ({ liquidSurfaceY, tubeTopY, tubeR, active = true }: {
    liquidSurfaceY: number;
    tubeTopY: number;
    tubeR: number;
    active?: boolean;
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const matRef = useRef<THREE.MeshBasicMaterial>(null);
    const mountTimeRef = useRef<number | null>(null);

    const particles = useMemo<H2Particle[]>(() => {
        const arr: H2Particle[] = [];
        for (let i = 0; i < H2_GAS_COUNT; i++) {
            const maxA = 2.0 + Math.random() * 2.0;
            arr.push({
                x: 0, y: -999, z: 0,
                phase: Math.random() * Math.PI * 2,
                speedMult: 0.6 + Math.random() * 0.8,
                age: Math.random() * maxA, // staggered initial age so they respawn gradually
                maxAge: maxA,
                rotX: Math.random() * Math.PI * 2,
                rotY: Math.random() * Math.PI * 2,
                rotZ: Math.random() * Math.PI * 2,
                rotSpeedX: (Math.random() - 0.5) * 0.3,
                rotSpeedY: (Math.random() - 0.5) * 0.3,
            });
        }
        return arr;
    }, []);

    const resetH2Particle = (p: H2Particle, startY: number) => {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * tubeR * 0.7;
        p.x = Math.cos(theta) * r;
        p.y = startY;
        p.z = Math.sin(theta) * r;
        p.phase = Math.random() * Math.PI * 2;
        p.speedMult = 0.6 + Math.random() * 0.8;
        p.age = 0;
        p.maxAge = 2.0 + Math.random() * 2.0;
        p.rotSpeedX = (Math.random() - 0.5) * 0.3;
        p.rotSpeedY = (Math.random() - 0.5) * 0.3;
    };

    useFrame((state, delta) => {
        if (!meshRef.current || !matRef.current) return;

        const dt = Math.min(delta, 0.05);
        const t = state.clock.elapsedTime;

        // Track mount time for 3s delay
        if (mountTimeRef.current === null) mountTimeRef.current = t;
        const elapsed = t - mountTimeRef.current;

        // Don't show anything for first 3 seconds
        if (elapsed < H2_DELAY) {
            if (meshRef.current.visible) meshRef.current.visible = false;
            return;
        }
        if (!meshRef.current.visible) meshRef.current.visible = true;

        // Opacity ramps up from 0 to 0.15 over 2 seconds after delay
        const fadeIn = Math.min(1, (elapsed - H2_DELAY) / 2.0);
        // Fade out when zinc is fully dissolved (active = false)
        const fadeOutTarget = active ? 1.0 : 0.0;
        const currentOpacity = matRef.current.opacity;
        const targetOpacity = fadeIn * 0.15 * fadeOutTarget;
        matRef.current.opacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, dt * 3);

        // Stop respawning when inactive and opacity is very low
        if (!active && matRef.current.opacity < 0.005) {
            meshRef.current.visible = false;
            return;
        }
        // Also skip respawning dead particles when inactive
        const shouldRespawn = active;

        // Height range for particles: from liquid surface — allow smoke to rise above tube mouth
        const maxHeight = (tubeTopY - liquidSurfaceY) * 1.5;

        for (let i = 0; i < H2_GAS_COUNT; i++) {
            const p = particles[i];

            p.age += dt;
            if (p.age >= p.maxAge) {
                if (shouldRespawn) {
                    resetH2Particle(p, 0);
                } else {
                    // Don't respawn — hide this particle
                    _h2Dummy.scale.setScalar(0);
                    _h2Dummy.updateMatrix();
                    meshRef.current.setMatrixAt(i, _h2Dummy.matrix);
                    continue;
                }
            }

            const lifePct = p.age / p.maxAge;

            // Rise up — but cap at tube mouth height
            const upV = H2_UP_SPEED * p.speedMult * (1.0 - 0.4 * lifePct);
            p.y += upV * dt;
            if (p.y > maxHeight) p.y = maxHeight;

            // Horizontal drift
            const convectAmp = 0.0006;
            p.x += Math.sin(t * 1.5 + p.phase) * convectAmp * dt;
            p.z += Math.cos(t * 1.2 + p.phase + 1.3) * convectAmp * dt;

            // Clamp inside tube radius
            const rr = p.x * p.x + p.z * p.z;
            const innerR = tubeR - 0.001;
            if (rr > innerR * innerR) {
                const inv = innerR / Math.sqrt(rr);
                p.x *= inv;
                p.z *= inv;
            }

            // Scale lifecycle: grow → hold → fade
            let scalePct: number;
            if (lifePct < 0.15) {
                const tt = lifePct / 0.15;
                scalePct = tt * tt * (3 - 2 * tt);
            } else if (lifePct < 0.65) {
                scalePct = 1.0;
            } else {
                const tt = (lifePct - 0.65) / 0.35;
                scalePct = 1.0 - tt * tt * (3 - 2 * tt);
            }
            const s = H2_MAX_SCALE * scalePct;

            // Tumble
            p.rotX += p.rotSpeedX * dt;
            p.rotY += p.rotSpeedY * dt;

            _h2Dummy.position.set(p.x, p.y, p.z);
            _h2Dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
            _h2Dummy.scale.setScalar(s);
            _h2Dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, _h2Dummy.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, H2_GAS_COUNT]}
            position={[0, liquidSurfaceY, 0]}
            raycast={() => null}
            frustumCulled={false}
            visible={false}
        >
            <dodecahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
                ref={matRef}
                color="#ffffff"
                transparent
                opacity={0}
                depthWrite={false}
            />
        </instancedMesh>
    );
};
