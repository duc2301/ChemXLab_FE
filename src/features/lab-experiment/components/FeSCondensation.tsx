import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// ─── FeSCondensation: Serum-like film condensation for Fe + S reaction ─────
const COND_DROP_COUNT = 80;

// Variables for detached droplets
const _condDummy = new THREE.Object3D();

interface CondDrop {
    angle: number;
    detachTriggerY: number;
    y: number;
    scale: number;
    speed: number;
    isDetached: boolean;
    currentScale: number;
}

// Reusable color objects for lerping (avoid allocation in useFrame)

export const FeSCondensation = ({ tubeR, tubeBottomY, liquidSurfaceY, reactionProgress, isFinished }: {
    tubeR: number;
    tubeBottomY: number; // Bottom of the inside of the tube
    liquidSurfaceY: number; // Surface of the FeS mixture
    reactionProgress: number;
    isFinished: boolean; // hasFinishedReaction
}) => {
    const filmRef = useRef<THREE.Mesh>(null);
    const filmGeoRef = useRef<THREE.CylinderGeometry>(null);
    const dropletsRef = useRef<THREE.InstancedMesh>(null);

    // Track how much time we've animated
    const [localTime, setLocalTime] = useState(0);
    const [finishedTime, setFinishedTime] = useState(0);

    // Calculate film dimensions
    const EXTRA_HEIGHT = 0.08; // Reduced for lower max film
    const FILM_MAX_HEIGHT = (liquidSurfaceY - tubeBottomY) + EXTRA_HEIGHT;
    const FILM_RADIUS = tubeR * 0.999; // Tighter fit (0.98 -> 0.998)

    // Adhesion starts at 1R above tube bottom (where hemisphere meets cylinder)
    const ADHESION_START_Y = tubeBottomY + tubeR;

    // Create droplets data once
    const dropData = useMemo<CondDrop[]>(() => {
        const arr: CondDrop[] = [];
        for (let i = 0; i < COND_DROP_COUNT; i++) {
            arr.push({
                angle: Math.random() * Math.PI * 2,
                // Droplets now start from ADHESION_START_Y (1R above bottom)
                detachTriggerY: ADHESION_START_Y + Math.random() * (FILM_MAX_HEIGHT - tubeR) * 0.9,
                y: 0,
                scale: 0.00015 + Math.random() * 0.00035,
                speed: 0.000003 + Math.random() * 0.00001,
                isDetached: false,
                currentScale: 0
            });
        }
        return arr;
    }, [tubeBottomY, FILM_MAX_HEIGHT, ADHESION_START_Y, tubeR]);

    // Build the cylinder & sphere hybrid geometry
    const { geo, origPositions } = useMemo(() => {
        const segmentsH = 80;
        const segmentsR = 60;
        const cyl = new THREE.CylinderGeometry(FILM_RADIUS, FILM_RADIUS, FILM_MAX_HEIGHT, segmentsR, segmentsH, true);

        // Translate so bottom is at Y=0 initially
        cyl.translate(0, FILM_MAX_HEIGHT / 2, 0);

        const posAttr = cyl.attributes.position;
        const oPos = [];

        // Initialize vertex colors to very light (will be updated in useFrame)
        const colors = [];
        for (let i = 0; i < posAttr.count; i++) {
            let yLocal = posAttr.getY(i);
            const x = posAttr.getX(i);
            const z = posAttr.getZ(i);

            let mappedY = tubeBottomY + yLocal;
            oPos.push({ x: x, y: mappedY, z: z, yLocal: yLocal });

            // Start with light colors (will be updated dynamically)
            colors.push(0.7, 0.65, 0.4);
        }

        cyl.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        return { geo: cyl, origPositions: oPos };
    }, [FILM_RADIUS, FILM_MAX_HEIGHT, tubeBottomY]);


    // Tearing logic noise
    const getTearNoise = (angle: number, t: number, noiseIntensity: number = 1.0) => {
        const wave1 = Math.sin(angle * 2 + t * 0.8) * 0.15;
        const wave2 = Math.cos(angle * 5 - t * 0.5) * 0.08;
        const wave3 = Math.sin(angle * 10 + t * 1.2) * 0.03;
        return (wave1 + wave2 + wave3) * 0.015 * noiseIntensity;
    };

    const getTargetEdgeY = (progress: number, localFinishedTime: number) => {
        if (progress < 0.16 && !isFinished) return tubeBottomY;

        // Growth phase — slower, extends to progress 0.7
        if (progress < 0.7 && !isFinished) {
            const growthRatio = (progress - 0.16) / 0.54; // Slower growth over wider range
            // Use ease-out for natural deceleration
            const easedGrowth = 1 - Math.pow(1 - growthRatio, 2);
            return ADHESION_START_Y + (FILM_MAX_HEIGHT - tubeR) * easedGrowth;
        }

        // Wait until finished to slide down
        if (isFinished) {
            const duration = 15.0;
            const slideProgress = Math.min(1.0, localFinishedTime / duration);
            const easeOut = 1 - Math.pow(1 - slideProgress, 3);
            const startY = tubeBottomY + FILM_MAX_HEIGHT;
            return startY - (startY - liquidSurfaceY) * easeOut;
        }

        return tubeBottomY + FILM_MAX_HEIGHT;
    };

    const targetEdgeY = getTargetEdgeY(reactionProgress, finishedTime);
    const edgeYRef = useRef(tubeBottomY);

    useFrame((_state, delta) => {
        if (!filmRef.current || !filmGeoRef.current || !dropletsRef.current) return;

        // Appear immediately (no fade-in duration)
        const isVisibleNow = reactionProgress >= 0.16 || isFinished;
        const overallOpacity = isVisibleNow ? 1.0 : 0.0;

        if (!isVisibleNow) {
            filmRef.current.visible = false;
            dropletsRef.current.visible = false;
            return;
        }
        filmRef.current.visible = true;
        dropletsRef.current.visible = true;
        // Make the film overall much thinner and more transparent
        (filmRef.current.material as THREE.MeshPhysicalMaterial).opacity = overallOpacity * 0.85;
        (dropletsRef.current.material as THREE.MeshPhysicalMaterial).opacity = overallOpacity * 0.85;

        const dt = Math.min(delta, 0.05);
        if (isFinished) {
            setFinishedTime(prev => prev + dt);
        }

        // Smoothly interpolate the edge (slower lerp for gentler movement)
        edgeYRef.current = THREE.MathUtils.lerp(edgeYRef.current, targetEdgeY, dt * 0.8);

        const distToSurface = Math.max(0, edgeYRef.current - liquidSurfaceY);
        const noiseIntensity = distToSurface > 0.05 ? 1.0 : (distToSurface / 0.05);

        if (noiseIntensity > 0) {
            setLocalTime(prev => prev + dt * 0.15);
        }
        const t = localTime;

        // ─── STATIC HEIGHT-BASED COLOR REGIONS ───
        // 4 color stages based on height from bottom to top of the film
        const c1 = new THREE.Color("#0a0a0a"); // Vùng 1 (Đáy): Đen
        const c2 = new THREE.Color("#4a3a0e"); // Vùng 2: Vàng đen
        const c3 = new THREE.Color("#facc15"); // Vùng 3: Vàng
        const c4 = new THREE.Color("#fef08a"); // Vùng 4 (Đỉnh): Vàng nhạt

        const colorAttr = filmGeoRef.current.attributes.color;
        if (colorAttr) {
            for (let i = 0; i < colorAttr.count; i++) {
                const orig = origPositions[i];
                const vertexY = orig.y; // actual world Y of this vertex

                // Map vertex Y to a 0.0 - 1.0 scale spanning the max film height
                const totalH = Math.max(0.001, FILM_MAX_HEIGHT);
                const hRatio = Math.max(0, Math.min(1, (vertexY - tubeBottomY) / totalH));

                // Determine which of the 4 regions this ratio falls into and lerp
                const mixed = new THREE.Color();

                if (hRatio < 0.25) {
                    // Stage 1: bottom 25% (c1 -> c2)
                    mixed.lerpColors(c1, c2, hRatio / 0.25);
                } else if (hRatio < 0.6) {
                    // Stage 2: 25% -> 60% (c2 -> c3)
                    mixed.lerpColors(c2, c3, (hRatio - 0.25) / 0.35);
                } else {
                    // Stage 3 & 4: 60% -> 100% (c3 -> c4)
                    mixed.lerpColors(c3, c4, (hRatio - 0.6) / 0.4);
                }

                colorAttr.setXYZ(i, mixed.r, mixed.g, mixed.b);
            }
            colorAttr.needsUpdate = true;
        }

        // Also update droplet material color dynamically
        const dropletMat = dropletsRef.current.material as THREE.MeshPhysicalMaterial;
        dropletMat.color.setHex(0x7a6015);

        // --- 1. FILM SHAPE & TEARING ---
        const positions = filmGeoRef.current.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const orig = origPositions[i];
            const angle = Math.atan2(orig.z, orig.x);

            const tearNoise = getTearNoise(angle, t, noiseIntensity);
            const localEdgeY = edgeYRef.current + tearNoise;

            let newY = orig.y;
            let radiusOffset = 0;

            if (orig.y > localEdgeY) {
                newY = Math.max(tubeBottomY, localEdgeY);
                radiusOffset = -0.0005;
            } else {
                const distToEdge = localEdgeY - orig.y;
                if (distToEdge < 0.01) {
                    radiusOffset = -0.0004 * Math.pow(1.0 - (distToEdge / 0.01), 2);
                }
                // Removed radial sine noise to keep it flat against the wall
            }

            // Tube hemisphere mapping logic
            const curveStartY = tubeBottomY + tubeR;
            let currentR = FILM_RADIUS;

            if (newY < curveStartY) {
                const dy = Math.max(0, Math.min(tubeR, curveStartY - newY));
                // Use normalized hemisphere formula for perfect smoothness and continuity
                // This scales FILM_RADIUS down to 0 over the distance tubeR
                currentR = FILM_RADIUS * Math.sqrt(Math.max(0, 1 - Math.pow(dy / tubeR, 2)));
            }

            if (newY < tubeBottomY) {
                newY = tubeBottomY;
                currentR = 0.0001; // Pinch to a point — seals the bottom
            }

            const newRadius = Math.max(0.00001, currentR + radiusOffset);
            positions.setXYZ(i, Math.cos(angle) * newRadius, newY, Math.sin(angle) * newRadius);
        }

        filmGeoRef.current.computeVertexNormals();
        filmGeoRef.current.attributes.position.needsUpdate = true;

        // --- 2. DROPLETS ---
        dropData.forEach((drop, i) => {
            const currentTearNoise = getTearNoise(drop.angle, t, noiseIntensity);
            const localEdgeY = edgeYRef.current + currentTearNoise;

            if (!drop.isDetached) {
                if (localEdgeY < drop.detachTriggerY && edgeYRef.current > ADHESION_START_Y + 0.005) {
                    drop.isDetached = true;
                    drop.y = Math.max(ADHESION_START_Y, localEdgeY);
                    drop.currentScale = drop.scale;
                } else if (Math.random() < 0.001 && localEdgeY > ADHESION_START_Y + 0.01) {
                    drop.isDetached = true;
                    drop.y = ADHESION_START_Y + Math.random() * (localEdgeY - ADHESION_START_Y);
                    drop.currentScale = drop.scale;
                }
            } else {
                drop.y -= drop.speed * dt * 60;

                // Disappear when reaching the liquid surface
                if (drop.y <= liquidSurfaceY) {
                    drop.y = Math.max(tubeBottomY, liquidSurfaceY);
                    drop.currentScale *= 0.8;
                }

                drop.currentScale *= 0.999;
                if (drop.currentScale < 0.00001) {
                    drop.isDetached = false;
                    drop.detachTriggerY = ADHESION_START_Y + Math.random() * (FILM_MAX_HEIGHT - tubeR) * 0.9;
                }
            }

            if (drop.isDetached) {
                let currentR = tubeR * 0.985;
                const curveStartY = tubeBottomY + tubeR;
                if (drop.y < curveStartY) {
                    const dy = curveStartY - drop.y;
                    currentR = Math.sqrt(Math.max(0, Math.pow(tubeR * 0.985, 2) - Math.pow(dy, 2)));
                }

                const x = Math.cos(drop.angle) * currentR;
                const z = Math.sin(drop.angle) * currentR;

                _condDummy.position.set(x, drop.y, z);
                _condDummy.lookAt(0, drop.y, 0);
                _condDummy.scale.set(drop.currentScale, drop.currentScale * 1.5, drop.currentScale * 0.2);
                _condDummy.updateMatrix();
                dropletsRef.current!.setMatrixAt(i, _condDummy.matrix);
            } else {
                _condDummy.scale.setScalar(0);
                _condDummy.updateMatrix();
                dropletsRef.current!.setMatrixAt(i, _condDummy.matrix);
            }
        });
        dropletsRef.current.instanceMatrix.needsUpdate = true;
    });

    const matProps = {
        vertexColors: true,
        transmission: 0.9,   // More transparent
        roughness: 1.0,      // Extremely rough (no gloss)
        metalness: 0.0,      // No metalness
        ior: 1.2,            // Lower IOR
        thickness: 0.001,    // Extremely thin
        transparent: true,
        opacity: 0,
        depthWrite: true,
        side: THREE.DoubleSide
    };

    return (
        <group>
            <mesh ref={filmRef} renderOrder={3}>
                <primitive object={geo} attach="geometry" ref={filmGeoRef} />
                <meshPhysicalMaterial {...matProps} />
            </mesh>

            <instancedMesh
                ref={dropletsRef}
                args={[undefined, undefined, COND_DROP_COUNT]}
                renderOrder={4}
                frustumCulled={false}
            >
                <sphereGeometry args={[1, 12, 12]} />
                <meshPhysicalMaterial
                    color="#b0a030"
                    transmission={0.9}
                    roughness={1.0} // Reduce gloss on droplets too
                    metalness={0.0}
                    transparent
                    opacity={0}
                    depthWrite={true}
                />
            </instancedMesh>
        </group>
    );
};
