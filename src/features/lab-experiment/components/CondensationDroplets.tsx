import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// ─── CondensationDroplets: Realistic water condensation on inner tube wall ─────
const COND_DROP_COUNT = 400;
const COND_DELAY = 5.5; // seconds delay (4s after H2 gas starts at 1.5s)
const COND_RAMP_TIME = 10.0; // seconds over which all 400 droplets gradually appear

const _condDummy = new THREE.Object3D();
const _condLookTarget = new THREE.Vector3();

interface CondDrop {
    angle: number;       // theta around tube axis
    y: number;           // current Y position (model space)
    scale: number;       // droplet size
    speed: number;       // slide speed (Y per second)
    dead: boolean;       // true when dissolved into liquid
    spawnDelay: number;  // seconds after COND_DELAY before this drop appears
    spawned: boolean;    // true once visible for the first time
}

export const CondensationDroplets = ({ tubeTopY, tubeBottomY, tubeR, liquidSurfaceY, active = true }: {
    tubeTopY: number;
    tubeBottomY: number;
    tubeR: number;
    liquidSurfaceY: number;
    active?: boolean;
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const mountTimeRef = useRef<number | null>(null);

    // Helper: random speed (slower overall, bigger drops slightly faster)
    const makeSpeed = (s: number) =>
        (0.0006 + Math.sqrt(s / 0.0012) * 0.0018) * (0.7 + Math.random() * 0.6);

    const drops = useMemo<CondDrop[]>(() => {
        const arr: CondDrop[] = [];
        const rangeY = tubeTopY - tubeBottomY;
        for (let i = 0; i < COND_DROP_COUNT; i++) {
            const s = 0.0003 + Math.random() * 0.0009;
            arr.push({
                angle: Math.random() * Math.PI * 2,
                y: tubeBottomY + Math.random() * rangeY,
                scale: s,
                speed: makeSpeed(s),
                dead: false,
                spawnDelay: (i / COND_DROP_COUNT) * COND_RAMP_TIME + Math.random() * (COND_RAMP_TIME / COND_DROP_COUNT),
                spawned: false,
            });
        }
        return arr;
    }, [tubeTopY, tubeBottomY]);

    useFrame((state, delta) => {
        if (!meshRef.current || !matRef.current) return;
        const dt = Math.min(delta, 0.05);
        const t = state.clock.elapsedTime;

        // Track mount time for delay
        if (mountTimeRef.current === null) mountTimeRef.current = t;
        const elapsed = t - mountTimeRef.current;

        // Don't show anything during initial delay
        if (elapsed < COND_DELAY) {
            if (meshRef.current.visible) meshRef.current.visible = false;
            return;
        }
        if (!meshRef.current.visible) meshRef.current.visible = true;

        // Fade in opacity over 2 seconds
        const fadeIn = Math.min(1, (elapsed - COND_DELAY) / 2.0);
        matRef.current.opacity = fadeIn * 0.75;

        const wallR = tubeR * 0.97;
        // The Y at which droplets dissolve into the liquid (slightly above surface for visual precision)
        const dissolveY = liquidSurfaceY + 0.004;

        let aliveCount = 0;

        for (let i = 0; i < COND_DROP_COUNT; i++) {
            const d = drops[i];

            // Already dissolved — keep hidden
            if (d.dead) {
                _condDummy.scale.setScalar(0);
                _condDummy.updateMatrix();
                meshRef.current.setMatrixAt(i, _condDummy.matrix);
                continue;
            }

            // Not yet spawned — check if it's time
            const timeSinceDelay = elapsed - COND_DELAY;
            if (!d.spawned) {
                if (timeSinceDelay < d.spawnDelay) {
                    // Not yet time to appear
                    _condDummy.scale.setScalar(0);
                    _condDummy.updateMatrix();
                    meshRef.current.setMatrixAt(i, _condDummy.matrix);
                    continue;
                }
                // First spawn — place at a random Y across the tube
                d.spawned = true;
                d.y = tubeBottomY + Math.random() * (tubeTopY - tubeBottomY);
                d.angle = Math.random() * Math.PI * 2;
            }

            // Slide downward
            d.y -= d.speed * dt;

            // Dissolve when touching the liquid surface
            if (d.y <= dissolveY) {
                if (active) {
                    // Respawn at top
                    d.y = tubeTopY - Math.random() * 0.005;
                    d.angle = Math.random() * Math.PI * 2;
                    d.scale = 0.0003 + Math.random() * 0.0009;
                    d.speed = makeSpeed(d.scale);
                } else {
                    // Mark as dissolved — no respawn
                    d.dead = true;
                    _condDummy.scale.setScalar(0);
                    _condDummy.updateMatrix();
                    meshRef.current.setMatrixAt(i, _condDummy.matrix);
                    continue;
                }
            }

            aliveCount++;

            // Position on tube inner wall
            const px = Math.cos(d.angle) * wallR;
            const pz = Math.sin(d.angle) * wallR;

            // Orientation: flat face pressed against tube wall (lookAt center)
            _condLookTarget.set(0, d.y, 0);
            _condDummy.position.set(px, d.y, pz);
            _condDummy.lookAt(_condLookTarget);

            // Scale: flatten Z (against wall), vary XY for size
            _condDummy.scale.set(d.scale, d.scale, d.scale * 0.35);
            _condDummy.updateMatrix();
            meshRef.current.setMatrixAt(i, _condDummy.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;

        // All drops dissolved — hide mesh entirely
        if (!active && aliveCount === 0) {
            meshRef.current.visible = false;
        }
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, COND_DROP_COUNT]}
            raycast={() => null}
            frustumCulled={false}
            visible={false}
        >
            <sphereGeometry args={[1, 12, 8]} />
            <meshPhysicalMaterial
                ref={matRef}
                color="#ffffff"
                transmission={1}
                roughness={0.05}
                ior={1.2}
                thickness={0.0005}
                transparent
                opacity={0}
                metalness={0}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                depthWrite={false}
                envMapIntensity={1.5}
                attenuationColor="#ffffff"
                attenuationDistance={0.5}
                side={THREE.FrontSide}
            />
        </instancedMesh>
    );
};
