import * as THREE from 'three';

// ============ TYPE DEFINITIONS ============
export interface ParticleSystemOptions {
  camera: THREE.Camera;
  emitter: THREE.Object3D;
  parent: THREE.Object3D;
  rate: number;
  texture: string;
  active?: boolean;
  clippingPlaneY?: number;
  clipBox?: THREE.Vector4;
  blending?: THREE.Blending;
  depthTest?: boolean;
  depthWrite?: boolean;
  velocityType?: 'uniform' | 'radial';
  radialSpeed?: number;
  velocity?: THREE.Vector3;
  spawnRadiusY?: number | null;
  colorSplinePoints?: [number, THREE.Color][];
  alphaSplinePoints?: [number, number][];
  sizeSplinePoints?: [number, number][];
  maxLife?: number;
  maxSize?: number;
  radius?: number;
  rotationRate?: number;
  velocityRandomness?: number;
}

interface Particle {
  position: THREE.Vector3;
  size: number;
  colour: THREE.Color;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationRate: number;
  velocity: THREE.Vector3;
  currentSize: number;
}

interface LinearSpline<T> {
  addPoint: (t: number, d: T) => void;
  getValueAt: (t: number) => T;
}

export interface ParticleSystem {
  update: (timeElapsed: number) => void;
  start: () => void;
  stop: () => void;
  emitter?: { rate: number };
}

// ============ SHADERS ============
const VERTEX_SHADER = `
uniform float pointMultiplier;
uniform float clippingPlaneY;
uniform vec4 clipBox;

attribute float size;
attribute float angle;
attribute vec4 aColor;

varying vec4 vColor;
varying vec2 vAngle;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vAngle = vec2(cos(angle), sin(angle));
  vColor = aColor;

  if (position.y < clippingPlaneY) {
    gl_Position = vec4(10000.0, 10000.0, 10000.0, 1.0); 
    return;
  }

  if (position.x < clipBox.x || position.x > clipBox.w ||
      position.z < clipBox.z || position.z > clipBox.y) { 
    gl_Position = vec4(10000.0, 10000.0, 10000.0, 1.0);
    return;
  }
}`;

const FRAGMENT_SHADER = `
uniform sampler2D diffuseTexture;

varying vec4 vColor;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColor;
}`;

// ============ HELPER FUNCTIONS ============
function getLinearSpline<T>(lerp: (t: number, a: T, b: T) => T): LinearSpline<T> {
  const points: [number, T][] = [];

  function addPoint(t: number, d: T): void {
    points.push([t, d]);
  }

  function getValueAt(t: number): T {
    let p1 = 0;

    for (let i = 0; i < points.length; i++) {
      if (points[i][0] >= t) {
        break;
      }
      p1 = i;
    }

    const p2 = Math.min(points.length - 1, p1 + 1);

    if (p1 === p2) {
      return points[p1][1];
    }

    return lerp(
      (t - points[p1][0]) / (points[p2][0] - points[p1][0]),
      points[p1][1],
      points[p2][1]
    );
  }

  return { addPoint, getValueAt };
}

// ============ MAIN PARTICLE SYSTEM FUNCTION ============
export function getParticleSystem(params: ParticleSystemOptions): ParticleSystem {
  const {
    camera,
    emitter,
    parent,
    rate,
    texture,
    active = true,
    clippingPlaneY = -Infinity,
    clipBox = new THREE.Vector4(-Infinity, Infinity, -Infinity, Infinity),

    blending = THREE.AdditiveBlending,
    depthTest = false,
    depthWrite = false,

    velocityType = 'uniform',
    radialSpeed = 0.5,
    velocity = new THREE.Vector3(0, 1.5, 0),

    spawnRadiusY = null,

    colorSplinePoints = [
      [0.0, new THREE.Color(0xffffff)],
      [1.0, new THREE.Color(0xff8080)]
    ],
    alphaSplinePoints = [
      [0.0, 0.0],
      [0.6, 1.0],
      [1.0, 0.0]
    ],
    sizeSplinePoints = [
      [0.0, 0.0],
      [0.4, 1.0],
      [1.0, 0.0]
    ],
    maxLife = 1.5,
    maxSize = 1.0,
    radius = 0.1,
    rotationRate = Math.random() * 0.01 - 0.005,
    velocityRandomness = 0.0
  } = params;

  // Uniforms
  const uniforms = {
    diffuseTexture: {
      value: new THREE.TextureLoader().load(texture)
    },
    pointMultiplier: {
      value: window.innerHeight / (2.0 * Math.tan((camera as THREE.PerspectiveCamera).fov * 0.5 * Math.PI / 180.0))
    },
    clippingPlaneY: { value: clippingPlaneY },
    clipBox: { value: clipBox }
  };

  // Material
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    blending: blending,
    depthTest: depthTest,
    depthWrite: depthWrite,
    transparent: true,
    vertexColors: true
  });

  let particles: Particle[] = [];
  let _active = active;

  // Geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
  geometry.setAttribute('aColor', new THREE.Float32BufferAttribute([], 4));
  geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

  const points = new THREE.Points(geometry, material);
  parent.add(points);

  // Splines
  const alphaSpline = getLinearSpline<number>((t, a, b) => a + t * (b - a));
  alphaSplinePoints.forEach(p => alphaSpline.addPoint(p[0], p[1]));

  const colorSpline = getLinearSpline<THREE.Color>((t, a, b) => {
    const c = a.clone();
    return c.lerp(b, t);
  });
  colorSplinePoints.forEach(p => colorSpline.addPoint(p[0], p[1]));

  const sizeSpline = getLinearSpline<number>((t, a, b) => a + t * (b - a));
  sizeSplinePoints.forEach(p => sizeSpline.addPoint(p[0], p[1]));

  let accumulatedTime = 0.0;

  // ============ INTERNAL FUNCTIONS ============
  function addParticles(timeElapsed: number): void {
    if (!_active) {
      accumulatedTime = 0.0;
      return;
    }

    accumulatedTime += timeElapsed;
    const n = Math.floor(accumulatedTime * rate);
    accumulatedTime -= n / rate;

    const rY = spawnRadiusY !== null ? spawnRadiusY : radius;

    for (let i = 0; i < n; i += 1) {
      const life = (Math.random() * 0.75 + 0.25) * maxLife;

      let p_velocity: THREE.Vector3;
      if (velocityType === 'radial') {
        const angle = Math.random() * Math.PI * 2;
        p_velocity = new THREE.Vector3(
          Math.cos(angle) * radialSpeed,
          0,
          Math.sin(angle) * radialSpeed
        );
      } else {
        p_velocity = velocity.clone();
        if (velocityRandomness > 0.0) {
          p_velocity.x += (Math.random() - 0.5) * velocityRandomness;
          p_velocity.y += Math.random() * 0.5 * velocityRandomness;
          p_velocity.z += (Math.random() - 0.5) * velocityRandomness;
        }
      }

      particles.push({
        position: new THREE.Vector3(
          (Math.random() * 2 - 1) * radius,
          (Math.random() * 2 - 1) * rY,
          (Math.random() * 2 - 1) * radius
        ).add(emitter.position),
        size: (Math.random() * 0.5 + 0.5) * maxSize,
        colour: new THREE.Color(),
        alpha: 1.0,
        life: life,
        maxLife: life,
        rotation: Math.random() * 2.0 * Math.PI,
        rotationRate: rotationRate,
        velocity: p_velocity,
        currentSize: 0
      });
    }
  }

  function updateGeometry(): void {
    const positions: number[] = [];
    const sizes: number[] = [];
    const colours: number[] = [];
    const angles: number[] = [];

    for (const p of particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
      angles.push(p.rotation);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colours, 4));
    geometry.setAttribute('angle', new THREE.Float32BufferAttribute(angles, 1));

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
    geometry.attributes.aColor.needsUpdate = true;
    geometry.attributes.angle.needsUpdate = true;
  }

  function updateParticles(timeElapsed: number): void {
    for (const p of particles) {
      p.life -= timeElapsed;
    }

    particles = particles.filter(p => p.life > 0.0);

    for (const p of particles) {
      const t = 1.0 - p.life / p.maxLife;
      p.rotation += p.rotationRate;
      p.alpha = alphaSpline.getValueAt(t);
      p.currentSize = p.size * sizeSpline.getValueAt(t);
      p.colour.copy(colorSpline.getValueAt(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));

      const drag = p.velocity.clone();
      drag.multiplyScalar(timeElapsed * 0.1);
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
      p.velocity.sub(drag);
    }

    particles.sort((a, b) => {
      const d1 = camera.position.distanceTo(a.position);
      const d2 = camera.position.distanceTo(b.position);

      if (d1 > d2) return -1;
      if (d1 < d2) return 1;
      return 0;
    });
  }

  // Initial geometry update
  updateGeometry();

  // ============ PUBLIC API ============
  function update(timeElapsed: number): void {
    addParticles(timeElapsed);
    updateParticles(timeElapsed);
    updateGeometry();
  }

  function start(): void {
    _active = true;
  }

  function stop(): void {
    _active = false;
  }

  return {
    update,
    start,
    stop
  };
}

export default getParticleSystem;