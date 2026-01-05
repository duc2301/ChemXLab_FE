import React, { useRef, useEffect, useImperativeHandle } from 'react';
import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import getParticleSystem from '../../features/particle-system/getParticleSystem';

// --- SHADER CODE (Giữ nguyên) ---
const waterVertexShader = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 taylorInvSqrt(vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= taylorInvSqrt(a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  uniform float u_time;
  uniform vec2 u_wave_origin; 
  uniform vec2 u_sphere_velocity;
  uniform float u_wave_decay; 
  varying vec3 v_worldPosition;
  varying vec3 v_normal; 
  vec2 getWave(vec2 pos, float time) {
    float baseWave = snoise(pos * 1.5 + time * 0.8) * 0.04; 
    float dist = distance(pos, u_wave_origin);
    float velocity = length(u_sphere_velocity);
    float waveStrength = (1.0 / (1.0 + dist * 2.5)) * velocity * 0.8 * u_wave_decay; 
    float reactionWave1 = sin(dist * 10.0 - time * 12.0) * 0.20 * waveStrength;
    float reactionWave2 = sin(dist * 18.0 - time * 16.0) * 0.15 * waveStrength;
    float reactionWave3 = cos(dist * 25.0 + time * 14.0) * 0.10 * waveStrength;
    float boilingWave = snoise(pos * 10.0 + time * 4.0) * 0.08 * waveStrength;
    float impactWave = sin(dist * 6.0 - time * 10.0) * 0.12 * waveStrength;
    float totalWave = baseWave + reactionWave1 + reactionWave2 + reactionWave3 + boilingWave + impactWave;
    return vec2(totalWave, velocity);
  }
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    float time = u_time;
    float waveY = 0.0;
    if (worldPos.y > -1.7) {
      waveY = getWave(worldPos.xz, time).x;
    }
    worldPos.y += waveY;
    float epsilon = 0.01;
    float waveYA = 0.0;
    float waveZB = 0.0;
    if (worldPos.y > -1.7) {
      waveYA = getWave(worldPos.xz + vec2(epsilon, 0.0), time).x;
      waveZB = getWave(worldPos.xz + vec2(0.0, epsilon), time).x;
    }
    vec3 tangent = normalize(vec3(epsilon, waveYA - waveY, 0.0));
    vec3 bitangent = normalize(vec3(0.0, waveZB - waveY, epsilon));
    vec3 perturbedNormal = cross(bitangent, tangent);
    v_normal = (modelMatrix * vec4(perturbedNormal, 0.0)).xyz;
    v_worldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const waterFragmentShader = `
  uniform vec3 u_color;
  uniform float u_opacity;
  uniform sampler2D envMap; 
  uniform float u_envMapLoaded; 
  varying vec3 v_worldPosition;
  varying vec3 v_normal; 
  const float PI = 3.141592653589793;
  vec2 sampleEquirect(vec3 v) {
    vec2 uv;
    uv.x = atan(v.z, v.x) / (2.0 * PI) + 0.5;
    uv.y = asin(v.y) / PI + 0.5;
    return uv;
  }
  void main() {
    vec3 color = u_color;
    if (u_envMapLoaded > 0.5) {
      vec3 viewDir = normalize(cameraPosition - v_worldPosition);
      vec3 normal = normalize(v_normal); 
      vec3 reflectDir = reflect(-viewDir, normal);
      vec2 uv = sampleEquirect(reflectDir);
      vec4 envColor = texture2D(envMap, uv);
      color = mix(u_color, envColor.rgb, 0.08); 
    }
    gl_FragColor = vec4(color, u_opacity);
  }
`;

const sodiumVertexShader = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 taylorInvSqrt(vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= taylorInvSqrt(a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  uniform float u_time;
  uniform float u_progress;
  varying vec3 v_normal;
  void main() {
    v_normal = normal;
    float time = u_time * 0.5;
    float displacement = 0.0;
    if (u_progress > 0.0) {
      displacement = snoise(position.xy * 3.0 + time) * 0.1 + snoise(position.yz * 2.0 + time) * 0.1;
      displacement += snoise(position.xy * 10.0 + time * 5.0) * (u_progress * u_progress * 0.2);
    }
    vec3 newPosition = position + normal * displacement * (1.0 - u_progress); 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const sodiumFragmentShader = `
  varying vec3 v_normal;
  uniform float u_progress;
  void main() {
    vec3 baseColor = vec3(0.8, 0.8, 0.85); 
    vec3 hotColor = vec3(0.9, 0.6, 0.4); 
    vec3 color = mix(baseColor, hotColor, u_progress * u_progress * 0.8); 
    float light = dot(normalize(v_normal), vec3(0.5, 0.5, 1.0));
    light = clamp(light, 0.3, 1.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

// --- HELPER FUNCTIONS FOR MOLECULAR SCENE ---
const bondMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.2, metalness: 0.1 });
const atomGeo = new THREE.SphereGeometry(1, 48, 48);

const ATOM_PROPS: any = {
  K: { color: 0xab5cf2, radius: 0.85, label: 'K' },
  O: { color: 0xff0d0d, radius: 0.60, label: 'O' },
  H: { color: 0xffffff, radius: 0.35, label: 'H' },
};

function createAtomLabel(text: string) {
  const div = document.createElement('div');
  div.className = 'atom-label';
  div.textContent = text;
  div.style.padding = '2px 6px';
  div.style.borderRadius = '6px';
  div.style.fontSize = '12px';
  div.style.background = 'rgba(0,0,0,0.4)';
  div.style.color = '#fff';
  div.style.pointerEvents = 'none';
  return new CSS2DObject(div);
}

function createAtom(type: string) {
  const props = ATOM_PROPS[type];
  const mat = new THREE.MeshStandardMaterial({ 
    color: props.color, 
    roughness: 0.3, 
    metalness: 0.0, 
    emissive: props.color, 
    emissiveIntensity: 0.05 
  });
  const atom = new THREE.Mesh(atomGeo, mat);
  atom.scale.setScalar(props.radius);
  atom.userData.atomType = type;
  atom.userData.radius = props.radius;

  const label = createAtomLabel(props.label);
  label.position.set(0, props.radius * 1.05, 0);
  atom.add(label);
  return atom;
}

function createBond(aObj: any, bObj: any, opts: any = {}) {
  const radius = opts.radius !== undefined ? opts.radius : 0.13;
  const material = opts.material !== undefined ? opts.material : bondMat.clone();

  const getWorldPos = (o: any) => {
    if (o instanceof THREE.Object3D) return o.getWorldPosition(new THREE.Vector3());
    if (o instanceof THREE.Vector3) return o.clone();
    return new THREE.Vector3(0,0,0);
  };
  const getRadius = (o: any) => (o.userData && o.userData.radius) ? o.userData.radius : 0;

  const pA = getWorldPos(aObj);
  const pB = getWorldPos(bObj);
  const rA = getRadius(aObj);
  const rB = getRadius(bObj);

  const vec = new THREE.Vector3().subVectors(pB, pA);
  const fullDist = vec.length();
  if (fullDist < 1e-6) return null;
  
  const dir = vec.clone().normalize();
  const gap = fullDist - (rA - 0.15) - (rB - 0.15); // overlap 0.15

  const start = pA.clone().addScaledVector(dir, rA - 0.15);
  const mid = start.clone().addScaledVector(dir, gap * 0.5);

  const geom = new THREE.CylinderGeometry(radius, radius, 1, 24);
  const bond = new THREE.Mesh(geom, material);
  bond.scale.set(1, gap, 1);
  bond.position.copy(mid);
  bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

  bond.userData._isBond = true;
  bond.userData.endA = aObj;
  bond.userData.endB = bObj;
  return bond;
}

function detachAtomToScene(atom: any, scene: THREE.Scene) {
  const worldPos = new THREE.Vector3();
  atom.getWorldPosition(worldPos);
  
  const wrap = new THREE.Object3D();
  wrap.position.copy(worldPos);
  scene.add(wrap);

  if (atom.parent) atom.parent.remove(atom);

  atom.position.set(0, 0, 0);
  atom.quaternion.set(0,0,0,1);
  wrap.add(atom);

  return wrap;
}

function removeAllBondsFromScene(scene: THREE.Scene) {
  const toRemove: any[] = [];
  scene.traverse(obj => {
    if (obj.userData && obj.userData._isBond) toRemove.push(obj);
  });
  toRemove.forEach(b => {
    if (b.parent) b.parent.remove(b);
    if (b.geometry) b.geometry.dispose();
    if (b.material && b.material.dispose) b.material.dispose();
  });
}

// --- MAIN REACT COMPONENT ---
const Reaction = React.forwardRef((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startReactionRef = useRef<(() => void) | null>(null);
  const openMolecularRef = useRef<(() => void) | null>(null);
  const resetRef = useRef<(() => void) | null>(null);

  useImperativeHandle(ref, () => ({
    startReaction: () => { if (startReactionRef.current) startReactionRef.current(); },
    openMolecular: () => { if (openMolecularRef.current) openMolecularRef.current(); },
    reset: () => { if (resetRef.current) resetRef.current(); }
  }), []);

  useEffect(() => {
    if (!containerRef.current) return;
    const $ = (id: string) => document.getElementById(id);

    // --- LAB SCENE (MAIN) ---
    const container = containerRef.current;
    const wInit = container.clientWidth || window.innerWidth;
    const hInit = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, wInit / hInit, 0.1, 1000);
    camera.position.set(0, 5, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(wInit, hInit);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    camera.position.set(0, 3, 10);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // -- Table & Stand Setup --
    const TABLE_TOP_Y_LEVEL = -12.0;
    const CLAMP_Y_LEVEL = 1.8;

    function createLabTable(tableTopY: number) {
      const tableGroup = new THREE.Group();
      const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.1 });
      const tableLegMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.2, metalness: 0.8 });
      const tableTop = new THREE.Mesh(new THREE.BoxGeometry(100, 3.33, 50), tableTopMat);
      tableTop.position.y = tableTopY - (3.33 / 2);
      tableGroup.add(tableTop);
      const legGeo = new THREE.BoxGeometry(2.67, 50, 2.67);
      const legPositions = [
        new THREE.Vector3(44.66, tableTop.position.y - 25, 22.33), new THREE.Vector3(44.66, tableTop.position.y - 25, -22.33),
        new THREE.Vector3(-44.66, tableTop.position.y - 25, 22.33), new THREE.Vector3(-44.66, tableTop.position.y - 25, -22.33),
      ];
      legPositions.forEach(pos => { const leg = new THREE.Mesh(legGeo, tableLegMat); leg.position.copy(pos); tableGroup.add(leg); });
      tableGroup.traverse(node => { if ((node as THREE.Mesh).isMesh) (node as THREE.Mesh).receiveShadow = true; });
      return tableGroup;
    }
    scene.add(createLabTable(TABLE_TOP_Y_LEVEL));

    const standGroup = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, metalness: 0.9, roughness: 0.3 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(9.33, 1.33, 13.33), metalMat); base.position.set(-8.7, TABLE_TOP_Y_LEVEL + 0.665, 4.365); standGroup.add(base);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 19, 12), metalMat); rod.position.set(-8.7, TABLE_TOP_Y_LEVEL + 9.5, 0); standGroup.add(rod);
    const bosshead = new THREE.Mesh(new THREE.BoxGeometry(2, 2.67, 2), metalMat); bosshead.position.set(-8.7, CLAMP_Y_LEVEL, 1.5); standGroup.add(bosshead);
    const clampGroup = new THREE.Group();
    const clampRod = new THREE.Mesh(new THREE.CylinderGeometry(0.267, 0.267, 7, 12), metalMat); clampRod.rotation.z = Math.PI / 2; clampRod.position.x = 3.5; clampGroup.add(clampRod);
    const prong1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.33, 0.33), rubberMat); prong1.position.set(7, 0, -0.5); prong1.rotation.y = Math.PI/6; clampGroup.add(prong1);
    const prong2 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.33, 0.33), rubberMat); prong2.position.set(7, 0, 0.5); prong2.rotation.y = -Math.PI/6; clampGroup.add(prong2);
    clampGroup.position.set(-7.7, CLAMP_Y_LEVEL, 1.5); standGroup.add(clampGroup);
    scene.add(standGroup);

    const tubeRadius = 0.6; const tubeBodyHeight = 6.0; const lipThickness = 0.04; const waterLevelY = -1.5;
    
    // Khôi phục các biến trạng thái
    const REACTION_DURATION = 15.0;
    let reactionTimer = 0.0;
    let sodiumVelocityX = 0.0;
    let sodiumVelocityZ = 0.0;
    let waveDecayFactor = 1.0;
    let fallingVelocity = 0.0;
    const GRAVITY = 9.8;
    let waterImpactForce = 0.0;

    // --- MATERIALS & ENVIRONMENT ---
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.0, metalness: 0.1, transparent: true, opacity: 0.2,
      side: THREE.DoubleSide, envMapIntensity: 1.0, depthWrite: false
    });

    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        u_time: { value: 0.0 },
        u_wave_origin: { value: new THREE.Vector2(0.0, 0.0) },
        u_sphere_velocity: { value: new THREE.Vector2(0.0, 0.0) },
        u_wave_decay: { value: 1.0 },
        u_color: { value: new THREE.Color(0x99ccff) },
        u_opacity: { value: 0.45 }, 
        envMap: { value: null },
        u_envMapLoaded: { value: 0.0 }
      }
    });

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      if (waterMaterial.uniforms) {
        waterMaterial.uniforms.envMap.value = texture;
        waterMaterial.uniforms.u_envMapLoaded.value = 1.0;
      }
    });

    const testTubeGroup = new THREE.Group();
    scene.add(testTubeGroup);

    function setupTubeMesh(geom: any, material: any) {
      const mesh = new THREE.Mesh(geom, material);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      return mesh;
    }

    const points = [];
    const bottomSegments = 16;
    for (let i = 0; i <= bottomSegments; i++) {
      const angle_rad = -(Math.PI / 2) + (Math.PI / 2) * (i / bottomSegments);
      points.push(new THREE.Vector2(Math.cos(angle_rad) * tubeRadius, tubeRadius + (Math.sin(angle_rad) * tubeRadius)));
    }
    points.push(new THREE.Vector2(tubeRadius, tubeRadius + tubeBodyHeight));
    const tubeGeom = new THREE.LatheGeometry(points, 32);
    const tubeMesh = setupTubeMesh(tubeGeom, glassMaterial);
    testTubeGroup.add(tubeMesh);

    const lipGeom = new THREE.TorusGeometry(tubeRadius, lipThickness, 16, 100);
    const lipMesh = setupTubeMesh(lipGeom, glassMaterial);
    lipMesh.position.y = tubeBodyHeight + tubeRadius;
    lipMesh.rotation.x = Math.PI / 2;
    testTubeGroup.add(lipMesh);

    const newBottomY = -(tubeBodyHeight / 2) - tubeRadius + 0.5;
    testTubeGroup.position.y = newBottomY;

    const waterTopY = waterLevelY;
    const waterBottomY = testTubeGroup.position.y;
    const waterRadius = tubeRadius * 0.98;
    const waterHeightInTube = waterTopY - (waterBottomY + tubeRadius);

    const waterBottomGeomSimple = new THREE.SphereGeometry(waterRadius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const waterBottomMesh = setupTubeMesh(waterBottomGeomSimple, waterMaterial);
    waterBottomMesh.position.y = tubeRadius;
    testTubeGroup.add(waterBottomMesh);

    if (waterHeightInTube > 0) {
      const waterBodyHeight = waterHeightInTube;
      const waterBodyGeom = new THREE.CylinderGeometry(waterRadius, waterRadius, waterBodyHeight, 32, 1);
      const waterBodyMesh = setupTubeMesh(waterBodyGeom, waterMaterial);
      waterBodyMesh.position.y = tubeRadius + (waterBodyHeight / 2);
      testTubeGroup.add(waterBodyMesh);
    }

    // --- FIX REFERENCE ERROR HERE ---
    const sodiumSize = 0.2;
    const sodiumGeometry = new THREE.IcosahedronGeometry(sodiumSize, 1);
    
    // Assign to variable explicitly
    const sodiumMaterial = new THREE.ShaderMaterial({
      vertexShader: sodiumVertexShader,
      fragmentShader: sodiumFragmentShader,
      uniforms: { u_time: { value: 0.0 }, u_progress: { value: 0.0 } }
    });

    const sodiumSphere = new THREE.Mesh(sodiumGeometry, sodiumMaterial);
    sodiumSphere.position.y = 3.5;
    sodiumSphere.castShadow = true;
    scene.add(sodiumSphere);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.08);
    scene.add(ambientLight);

    const fireLight = new THREE.PointLight(0xff99dd, 0.0, 20, 1.2);
    fireLight.castShadow = true;
    fireLight.shadow.mapSize.width = 1024;
    fireLight.shadow.mapSize.height = 1024;
    sodiumSphere.add(fireLight);
    
    // --- PARTICLES ---
    const actualWaterLevelInWorld = waterLevelY;
    const tubeInnerRadius = tubeRadius * 0.95;
    const steamMaxSize = 0.3; const steamMaxSpline = 2.0; const fireMaxSize = 1.0; const fireMaxSpline = 1.5; const bubbleMaxSize = 0.6; const boilingMaxSize = 0.4; const h2FlameMaxSize = 1.0;
    const particleClipRadius = tubeInnerRadius * 0.55;
    const sodiumMoveRadius = tubeInnerRadius - (sodiumSize * 1.0);
    const minX = -particleClipRadius; const maxX = particleClipRadius; const minZ = -particleClipRadius; const maxZ = particleClipRadius;

    const texFire = '/src/shared/assets/textures/fire.png';
    const texSmoke = '/src/shared/assets/textures/smoke.png';
    const texRad = '/src/shared/assets/textures/rad-grad.png';
    const texBubble = '/src/shared/assets/textures/bubble.png';

    const fireEffect = getParticleSystem({
      camera, emitter: sodiumSphere, parent: scene, rate: 150.0, texture: texFire,
      active: false, clippingPlaneY: actualWaterLevelInWorld, clipBox: new THREE.Vector4(minX, maxZ, minZ, maxX),
      radius: sodiumSize * 0.8, velocity: new THREE.Vector3(0, 0.5, 0), velocityRandomness: 0.3,
      maxLife: 0.8, maxSize: 1.5,
      sizeSplinePoints: [[0.0, 0.0], [0.3, 0.5], [1.0, 0.0]],
      alphaSplinePoints: [[0.0, 0.0], [0.2, 0.6], [0.7, 0.3], [1.0, 0.0]],
      colorSplinePoints: [[0.0, new THREE.Color(0xFFFFFF)], [0.2, new THREE.Color(0xFFDDFF)], [0.5, new THREE.Color(0xFF99DD)], [0.8, new THREE.Color(0xDD77CC)], [1.0, new THREE.Color(0xBB55AA)]],
    }) as any;

    const steamEffect = getParticleSystem({
      camera, emitter: sodiumSphere, parent: scene, rate: 2800.0, texture: texSmoke,
      active: false, clippingPlaneY: actualWaterLevelInWorld - 0.01, clipBox: new THREE.Vector4(minX, maxZ, minZ, maxX),
      blending: THREE.NormalBlending, depthTest: true, depthWrite: false,
      velocity: new THREE.Vector3(0, 0.6, 0), velocityRandomness: 0.3,
      colorSplinePoints: [[0.0, new THREE.Color(0xFFFFFF)], [0.4, new THREE.Color(0xF5F5F5)], [0.7, new THREE.Color(0xE0E0E0)], [1.0, new THREE.Color(0xCCCCCC)]],
      alphaSplinePoints: [[0.0, 0.0], [0.1, 0.18], [0.5, 0.15], [0.8, 0.10], [1.0, 0.0]],
      sizeSplinePoints: [[0.0, 0.4], [0.5, 1.2], [1.0, steamMaxSpline * 1.3]],
      maxLife: 7.0, maxSize: steamMaxSize * 1.1, radius: sodiumSize * 0.8, rotationRate: Math.random() * 0.02 - 0.01
    }) as any;

    const bubbleEffect = getParticleSystem({
      camera, emitter: sodiumSphere, parent: scene, rate: 3500.0, texture: texRad,
      active: false, clippingPlaneY: actualWaterLevelInWorld - 0.05, clipBox: new THREE.Vector4(minX, maxZ, minZ, maxX),
      blending: THREE.NormalBlending, depthTest: true, velocityType: 'radial', radialSpeed: 0.8, spawnRadiusY: 0.0,
      radius: sodiumSize * 2.0,
      colorSplinePoints: [[0.0, new THREE.Color(0xFFFFFF)], [1.0, new THREE.Color(0xEEEEFF)]],
      alphaSplinePoints: [[0.0, 0.0], [0.1, 1.0], [0.7, 0.6], [1.0, 0.0]],
      sizeSplinePoints: [[0.0, 0.03], [0.5, 0.12], [1.0, 0.18]],
      maxLife: 0.8, maxSize: 0.6, rotationRate: 0.0
    }) as any;

    const boilingBubblesEffect = getParticleSystem({
      camera, emitter: sodiumSphere, parent: scene, rate: 1500.0, texture: texBubble,
      active: false, clippingPlaneY: actualWaterLevelInWorld - 0.2, clipBox: new THREE.Vector4(minX, maxZ, minZ, maxX),
      blending: THREE.NormalBlending, depthTest: true, depthWrite: false, velocityType: 'radial', radialSpeed: 0.4, spawnRadiusY: 0.1,
      radius: sodiumSize * 1.8,
      colorSplinePoints: [[0.0, new THREE.Color(0xFFFFFF)], [1.0, new THREE.Color(0xEEFFFF)]],
      alphaSplinePoints: [[0.0, 0.0], [0.2, 0.7], [0.8, 0.3], [1.0, 0.0]],
      sizeSplinePoints: [[0.0, 0.02], [0.5, 0.08], [1.0, 0.12]],
      maxLife: 0.5, maxSize: 0.4, rotationRate: 0.0
    }) as any;

    const hydrogenFlameEffect = getParticleSystem({
      camera, emitter: sodiumSphere, parent: scene, rate: 800.0, texture: texFire,
      active: false, clippingPlaneY: actualWaterLevelInWorld - 0.5, spawnRadiusY: 0.05, clipBox: new THREE.Vector4(minX, maxZ, minZ, maxX),
      blending: THREE.AdditiveBlending, depthTest: true, depthWrite: false,
      velocity: new THREE.Vector3(0, 1.5, 0), velocityRandomness: 0.6,
      colorSplinePoints: [[0.0, new THREE.Color(0xFFFFFF)], [0.3, new THREE.Color(0xFFCCFF)], [0.6, new THREE.Color(0xFF99DD)], [0.8, new THREE.Color(0xDD77CC)], [1.0, new THREE.Color(0xBB55AA)]],
      alphaSplinePoints: [[0.0, 0.0], [0.2, 0.7], [0.6, 0.4], [1.0, 0.0]],
      sizeSplinePoints: [[0.0, 0.2], [0.3, 0.8], [1.0, 0.3]],
      maxLife: 0.6, maxSize: 1.0, radius: sodiumSize * 1.0, rotationRate: Math.random() * 0.05 - 0.025
    }) as any;

    const sparkEffect = getParticleSystem({
      camera, emitter: sodiumSphere, parent: scene, rate: 2000.0, texture: texFire,
      active: false, clippingPlaneY: actualWaterLevelInWorld - 0.5, clipBox: new THREE.Vector4(minX, maxZ, minZ, maxX),
      blending: THREE.AdditiveBlending, depthTest: true, depthWrite: false,
      velocity: new THREE.Vector3(0, 2.0, 0), velocityRandomness: 1.5,
      colorSplinePoints: [[0.0, new THREE.Color(0xFFFFFF)], [0.2, new THREE.Color(0xFFEEAA)], [0.5, new THREE.Color(0xFFAA66)], [0.8, new THREE.Color(0xFF7744)], [1.0, new THREE.Color(0xDD4422)]],
      alphaSplinePoints: [[0.0, 1.0], [0.2, 0.9], [0.5, 0.5], [1.0, 0.0]],
      sizeSplinePoints: [[0.0, 1.0], [0.3, 0.5], [1.0, 0.1]],
      maxLife: 0.4, maxSize: 0.2, radius: sodiumSize * 0.5, rotationRate: Math.random() * 0.1 - 0.05
    }) as any;

    [fireEffect, steamEffect, bubbleEffect, boilingBubblesEffect, hydrogenFlameEffect, sparkEffect].forEach(p => { if (p) p.frustumCulled = false; });

    // --- POST PROCESSING ---
    const renderScene = new RenderPass(scene, camera);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(wInit, hInit), 1.5, 0.4, 0.85);
    bloomPass.threshold = 2.0;
    bloomPass.strength = 0.25;
    bloomPass.radius = 0.2;
    composer.addPass(bloomPass);

    const clock = new THREE.Clock();
    let sphereState = 'idle';
    let reactionStarted = false;
    let mainAnimId = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHovering = false;
    let infoPanelVisible = false;

    function animate() {
      mainAnimId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      (waterMaterial.uniforms.u_time as any).value = elapsedTime;
      (sodiumMaterial.uniforms.u_time as any).value = elapsedTime;

      if (sphereState === 'idle' && reactionStarted) {
        sphereState = 'falling';
      }

      if (sphereState === 'falling') {
        fallingVelocity += GRAVITY * delta;
        sodiumSphere.position.y -= fallingVelocity * delta;

        if (sodiumSphere.position.y <= waterLevelY + sodiumSize * 0.3) {
          waterImpactForce = Math.min(fallingVelocity * 0.5, 8.0);
          fallingVelocity = 0.0;
          sodiumSphere.position.y = waterLevelY + sodiumSize * 0.3;
          sphereState = 'reacting';

          fireEffect.start(); if (fireEffect.emitter) fireEffect.emitter.rate = 150.0;
          steamEffect.start(); if (steamEffect.emitter) steamEffect.emitter.rate = 80.0;
          bubbleEffect.start();
          boilingBubblesEffect.start();
          hydrogenFlameEffect.start();
          sparkEffect.start(); if (sparkEffect.emitter) sparkEffect.emitter.rate = 60.0;
          reactionTimer = 0.0;

          const impactBoost = waterImpactForce * 0.8;
          sodiumVelocityX = (Math.random() - 0.5) * (4.0 + impactBoost);
          sodiumVelocityZ = (Math.random() - 0.5) * (4.0 + impactBoost);
        }
      } else if (sphereState === 'reacting') {
        reactionTimer += delta;
        let progress = reactionTimer / REACTION_DURATION;
        progress = Math.min(progress, 1.0);

        const currentScale = 1.0 - progress;
        sodiumSphere.scale.set(currentScale, currentScale, currentScale);
        (sodiumMaterial.uniforms.u_progress as any).value = progress;

        const fireIntensity = Math.max(0, 1.0 - progress);
        const lightIntensity = fireIntensity * 2.0;

        if (fireEffect && fireEffect.emitter) fireEffect.emitter.rate = 150.0 * fireIntensity;
        if (steamEffect && steamEffect.emitter) steamEffect.emitter.rate = 80.0 * fireIntensity;
        if (sparkEffect && sparkEffect.emitter) sparkEffect.emitter.rate = 60.0 * fireIntensity;

        if (fireLight) fireLight.intensity = lightIntensity;

        if (progress >= 1.0) {
          sphereState = 'done';
          fireEffect.stop(); steamEffect.stop(); bubbleEffect.stop(); boilingBubblesEffect.stop(); hydrogenFlameEffect.stop(); sparkEffect.stop();
          sodiumSphere.remove(fireLight);
          (waterMaterial.uniforms.u_sphere_velocity as any).value.set(0, 0);
          waveDecayFactor = 1.0;

          const btnStartReaction = $('btn-start-reaction') as HTMLButtonElement | null;
          if (btnStartReaction) {
            btnStartReaction.disabled = false;
            btnStartReaction.textContent = '🔄 Phản ứng lại';
            btnStartReaction.style.opacity = '1';
            btnStartReaction.style.cursor = 'pointer';
          }
        }

        fireLight.intensity = (Math.random() * 0.3 + 0.2) * (1.0 - progress * 0.7);
        const h2Force = 18.0 * (1.0 - progress * 0.5);
        const accelerationX = (Math.random() - 0.5) * h2Force;
        const accelerationZ = (Math.random() - 0.5) * h2Force;
        sodiumVelocityX += accelerationX * delta;
        sodiumVelocityZ += accelerationZ * delta;
        sodiumVelocityX *= 0.98;
        sodiumVelocityZ *= 0.98;

        const maxSpeed = 7.0;
        const speed = Math.sqrt(sodiumVelocityX * sodiumVelocityX + sodiumVelocityZ * sodiumVelocityZ);
        if (speed > maxSpeed) {
          sodiumVelocityX = (sodiumVelocityX / speed) * maxSpeed;
          sodiumVelocityZ = (sodiumVelocityZ / speed) * maxSpeed;
        }

        sodiumSphere.position.x += sodiumVelocityX * delta;
        sodiumSphere.position.z += sodiumVelocityZ * delta;

        const maxRadius = sodiumMoveRadius;
        const distFromCenter = Math.sqrt(sodiumSphere.position.x * sodiumSphere.position.x + sodiumSphere.position.z * sodiumSphere.position.z);
        if (distFromCenter > maxRadius) {
          const angle = Math.atan2(sodiumSphere.position.z, sodiumSphere.position.x);
          sodiumSphere.position.x = Math.cos(angle) * maxRadius;
          sodiumSphere.position.z = Math.sin(angle) * maxRadius;
          const normalX = Math.cos(angle);
          const normalZ = Math.sin(angle);
          const dotProduct = sodiumVelocityX * normalX + sodiumVelocityZ * normalZ;
          sodiumVelocityX = sodiumVelocityX - 2 * dotProduct * normalX;
          sodiumVelocityZ = sodiumVelocityZ - 2 * dotProduct * normalZ;
          sodiumVelocityX *= 0.85;
          sodiumVelocityZ *= 0.85;
          sodiumVelocityX += (Math.random() - 0.5) * 3.5;
          sodiumVelocityZ += (Math.random() - 0.5) * 3.5;
        }

        const vibrationAmount = 0.08 * (1.0 - progress);
        const speedFactor = Math.min(speed / maxSpeed, 1.0);
        sodiumSphere.rotation.x = Math.sin(elapsedTime * 25) * vibrationAmount * (1.0 + speedFactor);
        sodiumSphere.rotation.z = Math.cos(elapsedTime * 28) * vibrationAmount * (1.0 + speedFactor);
        sodiumSphere.rotation.y += delta * speed * 2.0;

        (waterMaterial.uniforms.u_wave_origin as any).value.x = sodiumSphere.position.x;
        (waterMaterial.uniforms.u_wave_origin as any).value.y = sodiumSphere.position.z;
        const effectiveVelocity = Math.sqrt(sodiumVelocityX * sodiumVelocityX + sodiumVelocityZ * sodiumVelocityZ);
        const velocityWithImpact = effectiveVelocity + waterImpactForce * 0.3;
        (waterMaterial.uniforms.u_sphere_velocity as any).value.x = sodiumVelocityX * (velocityWithImpact / Math.max(effectiveVelocity, 0.1));
        (waterMaterial.uniforms.u_sphere_velocity as any).value.y = sodiumVelocityZ * (velocityWithImpact / Math.max(effectiveVelocity, 0.1));

        if (waterImpactForce > 0.1) {
          waterImpactForce *= 0.92;
        } else {
          waterImpactForce = 0.0;
        }
      } else if (sphereState === 'done') {
        if (waveDecayFactor > 0.001) {
          waveDecayFactor *= 0.95;
          (waterMaterial.uniforms.u_wave_decay as any).value = waveDecayFactor;
        } else {
          waveDecayFactor = 0.0;
          (waterMaterial.uniforms.u_wave_decay as any).value = 0.0;
        }
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([tubeMesh, lipMesh], false);
      if (intersects.length > 0) {
        if (!isHovering) {
          isHovering = true;
          (tubeMesh.material as any).emissive = new THREE.Color(0x4488ff);
          (tubeMesh.material as any).emissiveIntensity = 0.3;
          (lipMesh.material as any).emissive = new THREE.Color(0x4488ff);
          (lipMesh.material as any).emissiveIntensity = 0.3;
          document.body.style.cursor = 'pointer';
        }
      } else {
        if (isHovering) {
          isHovering = false;
          (tubeMesh.material as any).emissive = new THREE.Color(0x000000);
          (tubeMesh.material as any).emissiveIntensity = 0;
          (lipMesh.material as any).emissive = new THREE.Color(0x000000);
          (lipMesh.material as any).emissiveIntensity = 0;
          document.body.style.cursor = 'default';
        }
      }

      try {
        fireEffect.update(delta); steamEffect.update(delta); bubbleEffect.update(delta);
        boilingBubblesEffect.update(delta); hydrogenFlameEffect.update(delta); sparkEffect.update(delta);
      } catch (e) {}

      controls.update();
      composer.render(delta);
    }

    animate();

    function handleWindowResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    }
    window.addEventListener('resize', handleWindowResize, false);

    function onMouseMove(event: MouseEvent) {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
    window.addEventListener('mousemove', onMouseMove, false);

    function onTestTubeClick(event: MouseEvent) {
      const infoPanel = $('info-panel');
      if (!infoPanel) return;
      const molecularModal = $('molecular-modal-overlay');
      const isClickingMolecularModal = molecularModal && (molecularModal.contains(event.target as Node) || event.target === molecularModal);
      if (isHovering) {
        infoPanelVisible = true;
        infoPanel.classList.add('visible');
        event.stopPropagation();
      } else if (infoPanelVisible && !infoPanel.contains(event.target as Node) && !isClickingMolecularModal) {
        infoPanelVisible = false;
        infoPanel.classList.remove('visible');
      }
    }
    window.addEventListener('click', onTestTubeClick, false);

    // --- BUTTON HANDLERS ---
    const btnStartReaction = $('btn-start-reaction');
    const startReactionFn = () => {
      if (!btnStartReaction) return;
      if (sphereState === 'done') {
        sphereState = 'idle'; reactionStarted = false; reactionTimer = 0;
        sodiumSphere.position.set(0, CLAMP_Y_LEVEL - 1.5, 0);
        sodiumSphere.scale.set(1, 1, 1);
        (sodiumMaterial.uniforms.u_progress as any).value = 0;
        sodiumSphere.add(fireLight);
        waveDecayFactor = 1.0;
        (waterMaterial.uniforms.u_wave_decay as any).value = 1.0;
        fallingVelocity = 0.0;
        waterImpactForce = 0.0;
        btnStartReaction.textContent = '⚗️ Phản ứng';
        setTimeout(() => {
          reactionStarted = true;
          (btnStartReaction as HTMLButtonElement).disabled = true;
          btnStartReaction.textContent = 'Đang phản ứng...';
          btnStartReaction.style.opacity = '0.5';
          btnStartReaction.style.cursor = 'not-allowed';
        }, 100);
      } else if (!reactionStarted) {
        reactionStarted = true;
        (btnStartReaction as HTMLButtonElement).disabled = true;
        btnStartReaction.textContent = 'Đang phản ứng...';
        btnStartReaction.style.opacity = '0.5';
        btnStartReaction.style.cursor = 'not-allowed';
      }
    };
    if (btnStartReaction) btnStartReaction.addEventListener('click', startReactionFn);

    // --- MOLECULAR SIMULATION LOGIC ---
    let scene_mol: THREE.Scene | null = null;
    let camera_mol: THREE.PerspectiveCamera | null = null;
    let renderer_mol: THREE.WebGLRenderer | null = null;
    let controls_mol: OrbitControls | null = null;
    let labelRenderer: CSS2DRenderer | null = null;
    let animate_mol_id = 0;

    function onMolecularResize() {
      if (!renderer_mol || !camera_mol || !labelRenderer) return;
      const canvas = renderer_mol.domElement;
      // Use parent element or fallback to defaults
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || canvas.clientWidth || 800;
      const h = parent?.clientHeight || canvas.clientHeight || 600;
      camera_mol.aspect = w / h;
      camera_mol.updateProjectionMatrix();
      renderer_mol.setSize(w, h);
      labelRenderer.setSize(w, h);
    }

    function initMolecularScene() {
      const canvas = $('molecular-canvas') as HTMLCanvasElement;
      const labelDiv = $('molecular-label-renderer') as HTMLElement;
      if (!canvas || !labelDiv) return;

      scene_mol = new THREE.Scene();
      scene_mol.background = new THREE.Color(0x222222);

      // Initial temporary size
      const w = 800; 
      const h = 600;

      camera_mol = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
      camera_mol.position.set(0, 0, 18);

      renderer_mol = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer_mol.setSize(w, h);
      renderer_mol.setPixelRatio(window.devicePixelRatio || 1);

      labelRenderer = new CSS2DRenderer({ element: labelDiv });
      labelRenderer.setSize(w, h);

      controls_mol = new OrbitControls(camera_mol, renderer_mol.domElement);
      controls_mol.enableDamping = true;
      controls_mol.dampingFactor = 0.15;
      controls_mol.enablePan = false;
      controls_mol.minDistance = 6;
      controls_mol.maxDistance = 50;

      scene_mol.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dir = new THREE.DirectionalLight(0xffffff, 0.8); dir.position.set(6, 8, 12); scene_mol.add(dir);
      const dir2 = new THREE.DirectionalLight(0xffffff, 0.3); dir2.position.set(-6, -4, -8); scene_mol.add(dir2);

      window.addEventListener('resize', onMolecularResize);
      animateMolecularScene();
    }

    function animateMolecularScene() {
      animate_mol_id = requestAnimationFrame(animateMolecularScene);
      TWEEN.update();
      if (controls_mol) controls_mol.update();
      if (renderer_mol && camera_mol && scene_mol) renderer_mol.render(scene_mol, camera_mol);
      if (labelRenderer && camera_mol && scene_mol) labelRenderer.render(scene_mol, camera_mol);
    }

    function startReactionAnimation() {
      if (!scene_mol) return;
      TWEEN.removeAll();
      
      const toRemove: any[] = [];
      scene_mol.traverse((obj: any) => {
        if (obj.isMesh || obj.type === 'Group' || obj.isCSS2DObject) {
           if(!obj.isLight && !obj.isCamera) toRemove.push(obj);
        }
      });
      toRemove.forEach(obj => {
        if(obj.geometry) obj.geometry.dispose();
        if(obj.material && obj.material.dispose) obj.material.dispose();
        if(obj.element && obj.element.remove) obj.element.remove();
        if(obj.parent) obj.parent.remove(obj);
      });

      if(scene_mol.children.length === 0) {
         scene_mol.add(new THREE.AmbientLight(0xffffff, 0.6));
         const dl = new THREE.DirectionalLight(0xffffff, 0.8); dl.position.set(6, 8, 12); scene_mol.add(dl);
         const dl2 = new THREE.DirectionalLight(0xffffff, 0.3); dl2.position.set(-6, -4, -8); scene_mol.add(dl2);
      }

      const atoms: any = {
        k1: createAtom('K'), k2: createAtom('K'),
        o1: createAtom('O'), h1a: createAtom('H'), h1b: createAtom('H'),
        o2: createAtom('O'), h2a: createAtom('H'), h2b: createAtom('H'),
      };

      const waterAngle = 104.45 * Math.PI / 180;
      const ohBondLength = 1.4;

      atoms.o1.position.set(0, 0, 0);
      atoms.h1a.position.set(ohBondLength * Math.sin(waterAngle/2), ohBondLength * Math.cos(waterAngle/2), 0);
      atoms.h1b.position.set(-ohBondLength * Math.sin(waterAngle/2), ohBondLength * Math.cos(waterAngle/2), 0);
      const bond_o1_h1a = createBond(atoms.o1, atoms.h1a);
      const bond_o1_h1b = createBond(atoms.o1, atoms.h1b);
      const water1 = new THREE.Group();
      water1.add(atoms.o1, atoms.h1a, atoms.h1b);
      if (bond_o1_h1a) water1.add(bond_o1_h1a);
      if (bond_o1_h1b) water1.add(bond_o1_h1b);

      atoms.o2.position.set(0, 0, 0);
      atoms.h2a.position.set(ohBondLength * Math.sin(waterAngle/2), ohBondLength * Math.cos(waterAngle/2), 0);
      atoms.h2b.position.set(-ohBondLength * Math.sin(waterAngle/2), ohBondLength * Math.cos(waterAngle/2), 0);
      const bond_o2_h2a = createBond(atoms.o2, atoms.h2a);
      const bond_o2_h2b = createBond(atoms.o2, atoms.h2b);
      const water2 = new THREE.Group();
      water2.add(atoms.o2, atoms.h2a, atoms.h2b);
      if (bond_o2_h2a) water2.add(bond_o2_h2a);
      if (bond_o2_h2b) water2.add(bond_o2_h2b);

      atoms.k1.position.set(-1, 0, 0);
      atoms.k2.position.set(1, 0, 0);
      const groupK = new THREE.Group();
      groupK.add(atoms.k1, atoms.k2);

      groupK.position.set(-8, 3, 0);
      water1.position.set(8, 0, 0);
      water2.position.set(8, -3, 0);
      scene_mol.add(groupK, water1, water2);

      new TWEEN.Tween(water1.rotation).to({ y: Math.PI * 2 }, 8000).repeat(Infinity).start();
      new TWEEN.Tween(water2.rotation).to({ y: -Math.PI * 2 }, 9000).repeat(Infinity).start();
      new TWEEN.Tween(groupK.rotation).to({ z: Math.PI * 2 }, 10000).repeat(Infinity).start();

      const bondDist_KOH = 2.4; const bondDist_OH_KOH = 1.4; const H_H_Dist = 1.2;      
      const h2_base_y = 3.0; const koh1_base_y = 0.5; const koh2_base_y = -2.5; 

      const h2_pos = { h1a: { x: -2.0, y: h2_base_y, z: 0 }, h2a: { x: -2.0 + H_H_Dist, y: h2_base_y, z: 0 }, };
      const koh1_pos = { k1: { x: 1.0,  y: koh1_base_y, z: 0 }, o1:  { x: 1.0 + bondDist_KOH,  y: koh1_base_y, z: 0 }, h1b: { x: 1.0 + bondDist_KOH + bondDist_OH_KOH,  y: koh1_base_y, z: 0 }, };
      const koh2_pos = { k2: { x: 1.0,  y: koh2_base_y, z: 0 }, o2:  { x: 1.0 + bondDist_KOH,  y: koh2_base_y, z: 0 }, h2b: { x: 1.0 + bondDist_KOH + bondDist_OH_KOH,  y: koh2_base_y, z: 0 }, };

      const duration = 2800; const delay = 840;

      const tK = new TWEEN.Tween(groupK.position).to({ x: -4, y: 0 }, duration).easing(TWEEN.Easing.Back.Out);
      const tW1 = new TWEEN.Tween(water1.position).to({ x: 3.6, y: 1.5, z: 0 }, duration).easing(TWEEN.Easing.Back.Out).delay(100);
      const tW2 = new TWEEN.Tween(water2.position).to({ x: 3.6, y: -1.5, z: 0 }, duration).easing(TWEEN.Easing.Back.Out).delay(200);

      const tBreak = new TWEEN.Tween({}).to({}, duration).delay(delay).onStart(() => {
        const bonds = [bond_o1_h1a, bond_o1_h1b, bond_o2_h2a, bond_o2_h2b].filter(b => b);
        bonds.forEach((b: any, i) => {
          const shakeAnim = { x: 0 };
          new TWEEN.Tween(shakeAnim).to({ x: 1 }, 150).repeat(3).onUpdate(() => { b.rotation.z = Math.sin(shakeAnim.x * Math.PI * 4) * 0.2; }).start();
          new TWEEN.Tween(b.scale).to({ y: 0.02 }, 260).delay(150 * 3 + i * 50).easing(TWEEN.Easing.Cubic.In).start();
          b.material.transparent = true;
          new TWEEN.Tween(b.material).to({ opacity: 0 }, 260).delay(150 * 3 + i * 50).start();
        });
        setTimeout(() => {
          removeAllBondsFromScene(scene_mol!);
          Object.keys(atoms).forEach(k => detachAtomToScene(atoms[k], scene_mol!));
        }, 300);
      });

      const tFormH2 = new TWEEN.Tween({}).to({}, duration);
      const tFormKOH1 = new TWEEN.Tween({}).to({}, duration);
      const tFormKOH2 = new TWEEN.Tween({}).to({}, duration);

      tBreak.onComplete(() => {
        new TWEEN.Tween(atoms.h1a.parent.position).to(h2_pos.h1a, duration).easing(TWEEN.Easing.Back.InOut).start();
        new TWEEN.Tween(atoms.h2a.parent.position).to(h2_pos.h2a, duration).easing(TWEEN.Easing.Back.InOut).chain(tFormH2).start();
        new TWEEN.Tween(atoms.k1.parent.position).to(koh1_pos.k1, duration).easing(TWEEN.Easing.Back.InOut).start();
        new TWEEN.Tween(atoms.o1.parent.position).to(koh1_pos.o1, duration).easing(TWEEN.Easing.Back.InOut).start();
        new TWEEN.Tween(atoms.h1b.parent.position).to(koh1_pos.h1b, duration).easing(TWEEN.Easing.Back.InOut).chain(tFormKOH1).start();
        new TWEEN.Tween(atoms.k2.parent.position).to(koh2_pos.k2, duration).easing(TWEEN.Easing.Back.InOut).start();
        new TWEEN.Tween(atoms.o2.parent.position).to(koh2_pos.o2, duration).easing(TWEEN.Easing.Back.InOut).start();
        new TWEEN.Tween(atoms.h2b.parent.position).to(koh2_pos.h2b, duration).easing(TWEEN.Easing.Back.InOut).chain(tFormKOH2).start();
      });

      tFormH2.onStart(() => {
        const bondH2 = createBond(atoms.h1a, atoms.h2a, { radius: 0.13 });
        if(bondH2) {
            scene_mol!.add(bondH2); bondH2.scale.y = 0.01;
            new TWEEN.Tween(bondH2.scale).to({ y: bondH2.scale.y * 100 }, 400).easing(TWEEN.Easing.Elastic.Out).start();
        }
        [atoms.h1a, atoms.h2a].forEach((atom: any, i: number) => {
          const originalScale = atom.scale.x;
          new TWEEN.Tween(atom.scale).to({ x: originalScale * 1.3, y: originalScale * 1.3, z: originalScale * 1.3 }, 200).delay(i * 100).yoyo(true).repeat(1).easing(TWEEN.Easing.Quadratic.Out).start();
        });
      });

      tFormKOH1.onStart(() => {
        const b1 = createBond(atoms.k1, atoms.o1, { radius: 0.13 }); const b2 = createBond(atoms.o1, atoms.h1b, { radius: 0.13 });
        if (b1) { scene_mol!.add(b1); b1.scale.y = 0.01; new TWEEN.Tween(b1.scale).to({ y: b1.scale.y * 100 }, 500).easing(TWEEN.Easing.Elastic.Out).start(); }
        if (b2) { scene_mol!.add(b2); b2.scale.y = 0.01; new TWEEN.Tween(b2.scale).to({ y: b2.scale.y * 100 }, 500).delay(150).easing(TWEEN.Easing.Elastic.Out).start(); }
        [atoms.k1, atoms.o1, atoms.h1b].forEach((atom: any, i: number) => {
          const originalScale = atom.scale.x;
          new TWEEN.Tween(atom.scale).to({ x: originalScale * 1.3, y: originalScale * 1.3, z: originalScale * 1.3 }, 200).delay(i * 100).yoyo(true).repeat(1).easing(TWEEN.Easing.Quadratic.Out).start();
        });
      });

      tFormKOH2.onStart(() => {
        const b1 = createBond(atoms.k2, atoms.o2, { radius: 0.13 }); const b2 = createBond(atoms.o2, atoms.h2b, { radius: 0.13 });
        if (b1) { scene_mol!.add(b1); b1.scale.y = 0.01; new TWEEN.Tween(b1.scale).to({ y: b1.scale.y * 100 }, 500).easing(TWEEN.Easing.Elastic.Out).start(); }
        if (b2) { scene_mol!.add(b2); b2.scale.y = 0.01; new TWEEN.Tween(b2.scale).to({ y: b2.scale.y * 100 }, 500).delay(150).easing(TWEEN.Easing.Elastic.Out).start(); }
        [atoms.k2, atoms.o2, atoms.h2b].forEach((atom: any, i: number) => {
          const originalScale = atom.scale.x;
          new TWEEN.Tween(atom.scale).to({ x: originalScale * 1.3, y: originalScale * 1.3, z: originalScale * 1.3 }, 200).delay(i * 100).yoyo(true).repeat(1).easing(TWEEN.Easing.Quadratic.Out).start();
        });
      });

      tK.chain(tBreak); tK.start(); tW1.start(); tW2.start();
    }

    startReactionRef.current = startReactionFn;
    openMolecularRef.current = () => {
      const modal = document.getElementById('molecular-modal-overlay');
      if (modal) modal.style.display = 'flex';
      
      // Force resize after display:flex applies
      requestAnimationFrame(() => {
        if (!renderer_mol) initMolecularScene();
        onMolecularResize();
        startReactionAnimation();
      });
    };

    resetRef.current = () => { /* ... */ };

    return () => {
      cancelAnimationFrame(mainAnimId);
      cancelAnimationFrame(animate_mol_id);
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onTestTubeClick);
      window.removeEventListener('resize', onMolecularResize);
      try { composer.dispose(); renderer.dispose(); } catch (e) {}
      if (renderer.domElement && renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto' }} />
  );
});

export default Reaction;