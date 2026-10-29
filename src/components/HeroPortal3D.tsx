"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { GROUND, LIGHT, PANEL } from "@/lib/palette";

// The hero's 3D object — a portal, since that's half of what S3 builds. At
// rest it is a big ribbed ring turning in the sky above the wordmark, a vortex
// pouring into it and small worlds on tilted orbits around it, leaning toward
// the pointer. Then the hero pins and the scroll becomes the camera: the type
// falls away, the ring swings round to face you and grows, you pass through
// its membrane, and a tunnel of hoops and streaking stars carries you down to
// the next section.
//
// Every surface is shaded through a gradient map of the palette (ground →
// panel → light) and every particle is the light at partial opacity, so each
// pixel is a blend of palette colors — no white, no new hues. three.js loads on
// demand after the page, the loop sleeps when the hero is off screen or the tab
// is hidden, and reduced motion gets one still frame and no flight.

const RAMP = /* glsl */ `
  uniform vec3 uGround;
  uniform vec3 uPanel;
  uniform vec3 uLight;
  vec3 ramp(float t) {
    t = clamp(t, 0.0, 1.0);
    return t < 0.55 ? mix(uGround, uPanel, t / 0.55) : mix(uPanel, uLight, (t - 0.55) / 0.45);
  }
`;

const SOLID_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const SOLID_FRAG = /* glsl */ `
  ${RAMP}
  uniform vec3 uKey;
  uniform float uTime;
  uniform float uRibs;
  uniform float uBase;
  uniform float uAlpha;
  varying vec3 vN;
  varying vec3 vV;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vN);
    vec3 v = normalize(vV);
    float diff = max(dot(n, uKey), 0.0);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 2.4);
    float spec = pow(max(dot(reflect(-uKey, n), v), 0.0), 34.0);
    float t = uBase + diff * 0.5 + rim * 0.42 + spec * 0.75;
    // grooves around the ring, with a band of light running along them
    if (uRibs > 0.0) {
      float rib = sin(vUv.x * 6.28318 * uRibs);
      float run = smoothstep(0.92, 1.0, sin(vUv.x * 6.28318 * 2.0 - uTime * 0.9));
      t += rib * 0.05 + run * 0.22;
    }
    // printed in soft bands, like a gradient map
    t = mix(t, floor(t * 7.0) / 7.0, 0.3);
    gl_FragColor = vec4(ramp(t), uAlpha);
  }
`;

const MEMBRANE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const MEMBRANE_FRAG = /* glsl */ `
  ${RAMP}
  uniform float uTime;
  uniform float uOpen;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    float lr = log(r + 0.03);
    float s1 = sin(a * 5.0 + lr * 7.0 - uTime * 1.1);
    float s2 = sin(a * 3.0 - lr * 4.0 + uTime * 0.6);
    float core = 1.0 - smoothstep(0.0, 0.5, r);
    float arms = smoothstep(0.35, 1.0, s1) * (1.0 - r * 0.7);
    // as you near it, the light at the far end swells
    float t = 0.16 + 0.34 * arms * (1.0 - uOpen * 0.6) + 0.08 * s2 + 0.62 * core * core;
    float alpha = (1.0 - smoothstep(0.9, 1.0, r)) * 0.92 * (1.0 - uOpen);
    gl_FragColor = vec4(ramp(t), alpha);
  }
`;

const DOT_FRAG = /* glsl */ `
  ${RAMP}
  varying float vA;
  varying float vT;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float s = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(ramp(0.7 + 0.3 * vT), vA * s);
  }
`;

// a vortex: points spiralling inward and down the throat of the ring
const VORTEX_VERT = /* glsl */ `
  attribute vec3 aSeed;
  uniform float uTime;
  uniform float uPx;
  varying float vA;
  varying float vT;
  void main() {
    float ph = fract(aSeed.z + uTime * 0.07);
    float r = mix(1.18, 0.05, ph) * (0.78 + 0.22 * aSeed.y);
    float a = aSeed.x + ph * 7.5 + uTime * 0.18;
    vec3 pos = vec3(cos(a) * r, sin(a) * r, -ph * 1.3);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPx * (1.0 + aSeed.y * 1.6) * (12.0 / max(0.5, -mv.z));
    vA = sin(ph * 3.14159) * 0.9;
    vT = aSeed.y;
  }
`;

// stars ride with the camera and stream past it; uDrift runs faster in the tunnel
const STAR_VERT = /* glsl */ `
  attribute vec3 aSeed;
  uniform float uTime;
  uniform float uPx;
  uniform float uDepth;
  uniform float uDrift;
  uniform float uWarp;
  varying float vA;
  varying float vT;
  void main() {
    vec3 pos = position;
    pos.z = mod(pos.z + uDrift, uDepth) - uDepth;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPx * (0.7 + aSeed.y * 1.3) * (1.0 + uWarp * 1.8) * (14.0 / max(0.5, -mv.z));
    float fade = smoothstep(-uDepth, -uDepth + 5.0, pos.z) * (1.0 - smoothstep(-2.5, -0.5, pos.z));
    float twinkle = 0.25 + 0.4 * (0.5 + 0.5 * sin(uTime * (1.0 + aSeed.x * 2.0) + aSeed.z * 40.0));
    vA = mix(twinkle, 0.85, uWarp) * fade;
    vT = aSeed.y;
  }
`;

const BASE_FOV = 30;
const CAM_Z = 14;
const RING_OUTER = 1.94; // torus radius + tube
const MODEL_RADIUS = 2.75; // out to the farthest orbit
const HOOPS = 18;
const HOOP_GAP = 1.3;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const easeInOut = (v: number) => {
  const t = clamp01(v);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Props = {
  /** The pinned, screen-sized stage the canvas fills. */
  stage: RefObject<HTMLElement | null>;
  /** The tall scroll track the stage is pinned inside; its scroll drives the flight. */
  track: RefObject<HTMLElement | null>;
  loaded: boolean;
};

export function HeroPortal3D({ stage, track, loaded }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedRef = useRef(loaded);
  const reduce = useReducedMotion();

  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = stage.current;
    const rail = track.current;
    if (!canvas || !host || !rail) return;

    let disposed = false;
    let teardown = () => {};

    import("three").then((THREE) => {
      if (disposed) return;

      // the palette goes into the shaders as-is, so what is mixed is what you see
      THREE.ColorManagement.enabled = false;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the hero stands on its own
      }
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.05, 120);
      camera.position.z = CAM_Z;
      scene.add(camera);

      const palette = {
        uGround: { value: new THREE.Color(GROUND) },
        uPanel: { value: new THREE.Color(PANEL) },
        uLight: { value: new THREE.Color(LIGHT) },
      };
      const time = { value: 0 };
      const px = { value: 1 };
      const key = { value: new THREE.Vector3(0.55, 0.7, 0.45).normalize() };

      const solid = (ribs: number, base: number, alpha?: { value: number }) =>
        new THREE.ShaderMaterial({
          vertexShader: SOLID_VERT,
          fragmentShader: SOLID_FRAG,
          uniforms: {
            ...palette,
            uKey: key,
            uTime: time,
            uRibs: { value: ribs },
            uBase: { value: base },
            uAlpha: alpha ?? { value: 1 },
          },
          transparent: Boolean(alpha),
          depthWrite: !alpha,
        });

      // everything hangs off one rig: placed in the hero's sky at rest, then
      // swung to the centre of the screen for the flight
      const rig = new THREE.Group();
      scene.add(rig);

      const portal = new THREE.Group();
      rig.add(portal);

      const ringGeo = new THREE.TorusGeometry(1.6, 0.34, 72, 240);
      const ringMat = solid(84, 0.1);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      portal.add(ring);

      // a thin halo just outside it, turning the other way
      const haloGeo = new THREE.TorusGeometry(2.08, 0.025, 12, 200);
      const haloMat = solid(0, 0.35);
      const halo = new THREE.Mesh(haloGeo, haloMat);
      portal.add(halo);

      const open = { value: 0 };
      const membraneGeo = new THREE.CircleGeometry(1.3, 96);
      const membraneMat = new THREE.ShaderMaterial({
        vertexShader: MEMBRANE_VERT,
        fragmentShader: MEMBRANE_FRAG,
        uniforms: { ...palette, uTime: time, uOpen: open },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const membrane = new THREE.Mesh(membraneGeo, membraneMat);
      portal.add(membrane);

      const seeds = (n: number) => {
        const a = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          a[i * 3] = Math.random() * Math.PI * 2;
          a[i * 3 + 1] = Math.random();
          a[i * 3 + 2] = Math.random();
        }
        return a;
      };

      const small = host.clientWidth < 768;
      const VORTEX = small ? 500 : 1100;
      const vortexGeo = new THREE.BufferGeometry();
      vortexGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(VORTEX * 3), 3));
      vortexGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds(VORTEX), 3));
      const vortexMat = new THREE.ShaderMaterial({
        vertexShader: VORTEX_VERT,
        fragmentShader: DOT_FRAG,
        uniforms: { ...palette, uTime: time, uPx: px },
        transparent: true,
        depthWrite: false,
      });
      const vortex = new THREE.Points(vortexGeo, vortexMat);
      vortex.frustumCulled = false;
      vortex.renderOrder = 2;
      portal.add(vortex);

      // the tunnel behind the membrane: hoops, receding and slowly turning,
      // only there once you are on your way in
      const hoopGeo = new THREE.TorusGeometry(1, 0.045, 12, 180);
      const hoopAlphas = Array.from({ length: HOOPS }, () => ({ value: 0 }));
      const hoopMats = hoopAlphas.map((a) => solid(0, 0.5, a));
      const hoops = hoopMats.map((m, k) => {
        const h = new THREE.Mesh(hoopGeo, m);
        h.position.z = -(k + 1) * HOOP_GAP;
        h.scale.setScalar(1.5 - k * 0.018);
        h.rotation.z = k * 0.7;
        rig.add(h);
        return h;
      });

      // small worlds on tilted orbits, each with its orbit drawn in
      const orbitGroup = new THREE.Group();
      rig.add(orbitGroup);
      const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(LIGHT), transparent: true, opacity: 0.22 });
      const shapes = [
        new THREE.IcosahedronGeometry(0.2, 0),
        new THREE.OctahedronGeometry(0.19, 0),
        new THREE.BoxGeometry(0.26, 0.26, 0.26),
        new THREE.SphereGeometry(0.15, 32, 16),
        new THREE.TorusGeometry(0.13, 0.05, 12, 40),
      ];
      const orbitDefs = [
        { r: 2.45, tiltX: 1.15, tiltZ: 0.3, speed: 0.32, phase: 0 },
        { r: 2.6, tiltX: 1.45, tiltZ: -0.55, speed: -0.22, phase: 2.1 },
        { r: 2.3, tiltX: 0.75, tiltZ: 0.9, speed: 0.27, phase: 4.0 },
        { r: 2.55, tiltX: 1.3, tiltZ: -0.2, speed: 0.18, phase: 1.1 },
        { r: 2.38, tiltX: 0.95, tiltZ: -1.0, speed: -0.3, phase: 5.2 },
      ];
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 160 }, (_, i) => {
          const a = (i / 160) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a), Math.sin(a), 0);
        }),
      );
      const bodyMat = solid(0, 0.18);
      const orbiters = orbitDefs.map((d, i) => {
        const plane = new THREE.Group();
        plane.rotation.set(d.tiltX, 0, d.tiltZ);
        const line = new THREE.LineLoop(orbitGeo, lineMat);
        line.scale.setScalar(d.r);
        if (i < 3) plane.add(line);
        const body = new THREE.Mesh(shapes[i], bodyMat);
        plane.add(body);
        orbitGroup.add(plane);
        return { ...d, body };
      });

      // stars ride with the camera, streaming past it
      const STARS = small ? 300 : 700;
      const DEPTH = 28;
      const starPos = new Float32Array(STARS * 3);
      for (let i = 0; i < STARS; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 22;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
        starPos[i * 3 + 2] = Math.random() * DEPTH;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds(STARS), 3));
      const drift = { value: 0 };
      const warp = { value: 0 };
      const starMat = new THREE.ShaderMaterial({
        vertexShader: STAR_VERT,
        fragmentShader: DOT_FRAG,
        uniforms: { ...palette, uTime: time, uPx: px, uDepth: { value: DEPTH }, uDrift: drift, uWarp: warp },
        transparent: true,
        depthWrite: false,
      });
      const stars = new THREE.Points(starGeo, starMat);
      stars.frustumCulled = false;
      camera.add(stars);

      // Where the rig rests, and how big it gets for the flight. At rest it is
      // big and sits up in the sky toward the light source; the type stays in
      // front of it.
      const rest = { x: 0, y: 0, s: 1, fly: 1 };
      let H = 1;
      const layout = () => {
        const W = host.clientWidth;
        H = Math.min(host.clientHeight, window.innerHeight);
        const dpr = Math.min(window.devicePixelRatio || 1, W < 768 ? 1.5 : 2);
        renderer.setPixelRatio(dpr);
        renderer.setSize(W, host.clientHeight, false);
        px.value = dpr * (W < 768 ? 1.6 : 2.2);
        camera.aspect = W / host.clientHeight;
        camera.fov = BASE_FOV;
        camera.updateProjectionMatrix();

        const hr = host.getBoundingClientRect();
        const bar = host.querySelector("[data-hero-bar]")?.getBoundingClientRect();
        const content = host.querySelector("[data-hero-content]");
        const tops = content ? Array.from(content.children, (c) => c.getBoundingClientRect().top) : [];
        const top = (bar ? bar.bottom : hr.top) - hr.top + 12;
        const bottom = (tops.length ? Math.min(...tops) : hr.top + H * 0.55) - hr.top;

        let size: number, cx: number, cy: number;
        if (W >= 1024) {
          size = Math.min(H * 0.82, W * 0.52);
          cx = W * 0.7;
          cy = H * 0.37;
        } else if (W >= 768) {
          size = Math.min(H * 0.6, W * 0.78);
          cx = W * 0.6;
          cy = top + (bottom - top) * 0.5;
        } else {
          size = W * 0.86;
          cx = W * 0.58;
          cy = top + size * 0.36;
        }

        const hh = host.clientHeight;
        const worldPerPx = (2 * Math.tan((BASE_FOV * Math.PI) / 360) * CAM_Z) / hh;
        rest.x = (cx - W / 2) * worldPerPx;
        rest.y = -(cy - hh / 2) * worldPerPx;
        rest.s = ((size / 2) * worldPerPx) / MODEL_RADIUS;
        // for the flight the ring fills most of the screen
        const viewH = 2 * Math.tan((BASE_FOV * Math.PI) / 360) * CAM_Z;
        rest.fly = (Math.min(viewH, viewH * camera.aspect) * 0.46) / RING_OUTER;
      };

      // pointer lean, eased
      const lean = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        lean.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        lean.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const progress = () => {
        if (reduce) return 0;
        const span = rail.offsetHeight - window.innerHeight;
        return span > 0 ? clamp01(-rail.getBoundingClientRect().top / span) : 0;
      };

      let intro = 0; // 0 → 1 once the preloader lifts
      let frame = 0;
      let last = performance.now();
      let running = false;

      const draw = (now: number, dt: number) => {
        time.value = now / 1000;
        if (loadedRef.current) intro = Math.min(1, intro + dt / 1.8);
        const e = 1 - Math.pow(1 - intro, 4);

        lean.x += (lean.tx - lean.x) * Math.min(1, dt * 3);
        lean.y += (lean.ty - lean.y) * Math.min(1, dt * 3);

        const p = progress();
        const align = easeInOut(p / 0.34); // swing round to face the camera, centred
        const dive = easeInOut((p - 0.14) / 0.8); // the camera's way in
        const through = smooth((p - 0.36) / 0.1); // passing the membrane
        const tunnel = smooth((p - 0.42) / 0.3);

        // the rig: from its place in the sky to dead centre, facing you
        const s = lerp(rest.s * (0.55 + 0.45 * e), rest.fly, align);
        rig.scale.setScalar(s);
        rig.position.set(lerp(rest.x, 0, align), lerp(rest.y, 0, align), 0);
        const free = 1 - align;
        rig.rotation.x = (-0.32 + lean.y * 0.22) * free;
        rig.rotation.y = (0.46 + lean.x * 0.3 - (1 - e) * 1.6) * free;
        rig.rotation.z = p * 1.4;

        // the camera: straight down the throat and on through the tunnel
        const travel = CAM_Z + HOOP_GAP * (HOOPS - 3) * rest.fly;
        camera.position.z = CAM_Z - travel * dive;
        camera.rotation.z = -p * 0.5;
        const fov = BASE_FOV + 26 * tunnel;
        if (Math.abs(camera.fov - fov) > 0.01) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }

        ring.rotation.z = time.value * 0.12;
        halo.rotation.z = -time.value * 0.2;
        halo.rotation.x = Math.sin(time.value * 0.4) * 0.12 * free;
        portal.rotation.x = Math.sin(time.value * 0.3) * 0.06 * free;
        portal.rotation.y = Math.cos(time.value * 0.25) * 0.08 * free;
        open.value = through;

        hoops.forEach((h, k) => {
          h.rotation.z = k * 0.7 + time.value * (k % 2 ? 0.25 : -0.2);
          hoopAlphas[k].value = tunnel * (1 - (k / HOOPS) * 0.8) * (1 - smooth((p - 0.84) / 0.16));
          h.visible = hoopAlphas[k].value > 0.01;
        });

        // the orbits fling outward and out of frame as you go in
        orbitGroup.scale.setScalar(1 + align * 2.2);
        for (const o of orbiters) {
          const a = o.phase + time.value * o.speed;
          o.body.position.set(Math.cos(a) * o.r, Math.sin(a) * o.r, 0);
          o.body.rotation.x = time.value * 0.9 + o.phase;
          o.body.rotation.y = time.value * 0.6;
        }

        warp.value = tunnel;
        drift.value += dt * (0.35 + 14 * tunnel);
        stars.position.x = -lean.x * 0.4 * free;
        stars.position.y = lean.y * 0.25 * free;

        // at the end of the flight the tunnel thins out but the stars stay,
        // so they are still drifting as the next section rises into view
        canvas.style.opacity = String(e * (1 - 0.45 * smooth((p - 0.86) / 0.14)));
        renderer.render(scene, camera);
      };

      layout();
      const ro = new ResizeObserver(() => {
        layout();
        if (reduce) draw(4000, 0);
      });
      ro.observe(host);

      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        draw(now, dt);
        frame = requestAnimationFrame(tick);
      };
      const start = () => {
        if (running || reduce) return;
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
      };

      // run only while the hero's track is on screen and the tab is visible
      let onScreen = true;
      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      });
      io.observe(rail);
      const onVis = () => (document.hidden || !onScreen ? stop() : start());
      document.addEventListener("visibilitychange", onVis);

      if (reduce) {
        intro = 1;
        draw(4000, 0);
      } else {
        start();
      }

      teardown = () => {
        stop();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onPointer);
        [ringGeo, haloGeo, membraneGeo, vortexGeo, hoopGeo, orbitGeo, starGeo, ...shapes].forEach((g) => g.dispose());
        [ringMat, haloMat, membraneMat, vortexMat, lineMat, bodyMat, starMat, ...hoopMats].forEach((m) => m.dispose());
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      teardown();
    };
  }, [stage, track, reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-0"
    />
  );
}
