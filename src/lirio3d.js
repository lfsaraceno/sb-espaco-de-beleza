// Lírio em partículas de luz (Three.js). Amostra os traços do mesmo SVG usado no fallback.
// Build: npm run build -> assets/lirio3d.js (global Lirio3D).
import {
  WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, BufferAttribute,
  Float32BufferAttribute, ShaderMaterial, Points, Group, Color, AdditiveBlending,
} from 'three';

const CENTER = { x: 280, y: 250 }, SCALE = 190; // unidades do viewBox -> mundo

export function start(canvas, svgGroup) {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.z = 6;

  const mobile = innerWidth < 700;
  const density = mobile ? 1.6 : 3; // pontos por unidade de comprimento do traço
  const targets = [], delays = [];
  const toWorld = (x, y) => [(x - CENTER.x) / SCALE, -(y - CENTER.y) / SCALE];

  const paths = svgGroup.querySelectorAll('path');
  paths.forEach((path, pi) => {
    const len = path.getTotalLength();
    const n = Math.ceil(len * density);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const p = path.getPointAtLength(t * len);
      const [x, y] = toWorld(p.x + (Math.random() - 0.5) * 3, p.y + (Math.random() - 0.5) * 3);
      targets.push(x, y, (Math.random() - 0.5) * 0.06);
      delays.push(Math.min(0.45, (pi / paths.length) * 0.3 + t * 0.12 + Math.random() * 0.05));
    }
  });
  svgGroup.querySelectorAll('ellipse').forEach((el) => {
    const cx = +el.getAttribute('cx'), cy = +el.getAttribute('cy');
    const rx = +el.getAttribute('rx'), ry = +el.getAttribute('ry');
    for (let i = 0; i < (mobile ? 40 : 80); i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random());
      const [x, y] = toWorld(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r);
      targets.push(x, y, (Math.random() - 0.5) * 0.04);
      delays.push(0.42 + Math.random() * 0.03);
    }
  });
  const dust = mobile ? 500 : 1400; // poeira de luz em volta
  for (let i = 0; i < dust; i++) {
    targets.push((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6, -Math.random() * 4);
    delays.push(Math.random() * 0.3);
  }

  const count = delays.length;
  const startPos = new Float32Array(count * 3), size = new Float32Array(count), seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = 3 + Math.random() * 4;
    const s = Math.sqrt(1 - u * u);
    startPos.set([Math.cos(th) * s * r, Math.sin(th) * s * r, u * r - 2], i * 3);
    size[i] = i >= count - dust ? 1 + Math.random() * 2 : 3 + Math.random() * 2.6;
    seed[i] = Math.random();
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(targets, 3));
  geo.setAttribute('aStart', new BufferAttribute(startPos, 3));
  geo.setAttribute('aDelay', new Float32BufferAttribute(delays, 1));
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));

  const uniforms = {
    uProgress: { value: 0 }, uScatter: { value: 0 }, uTime: { value: 0 },
    uPixelRatio: { value: dpr }, uColor: { value: new Color('#f6e7dc') },
  };
  const mat = new ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uProgress, uScatter, uTime, uPixelRatio;
      attribute vec3 aStart; attribute float aDelay, aSize, aSeed;
      varying float vAlpha;
      void main() {
        float p = clamp((uProgress - aDelay) / 0.55, 0.0, 1.0);
        p = 1.0 - pow(1.0 - p, 3.0);
        vec3 pos = mix(aStart, position, p);
        pos += 0.012 * vec3(sin(uTime * 1.3 + aSeed * 6.28), cos(uTime * 1.1 + aSeed * 4.0), sin(uTime * 0.9 + aSeed * 9.0));
        pos += normalize(aStart) * uScatter * (1.2 + aSeed * 2.0);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPixelRatio * (4.0 / -mv.z);
        float twinkle = 0.65 + 0.35 * sin(uTime * 2.0 + aSeed * 40.0);
        vAlpha = mix(0.25, 0.9, p) * twinkle * (1.0 - uScatter * 0.85);
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColor; varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, a * a * vAlpha);
      }`,
  });
  // lírio segue a marca; a poeira fica no lugar, espalhada pela abertura toda
  const dustGeo = geo.clone();
  geo.setDrawRange(0, count - dust);
  dustGeo.setDrawRange(count - dust, dust);
  const group = new Group(), dustGroup = new Group();
  group.add(new Points(geo, mat));
  dustGroup.add(new Points(dustGeo, mat));
  scene.add(group, dustGroup);

  // mouse inclina o lírio; em tela de toque, só o balanço automático
  const mouse = { x: 0, y: 0 };
  const onMove = (e) => { if (e.pointerType === 'mouse') { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; } };
  addEventListener('pointermove', onMove);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  // o lírio 3D ocupa o lugar do <svg> (escondido): se a marca se move, ele vai junto
  const viewH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360); // altura visível em z=0
  const anchor = svgGroup.ownerSVGElement;
  const follow = () => {
    const c = canvas.getBoundingClientRect(), r = anchor.getBoundingClientRect();
    if (!c.height || !r.height) return;
    const nx = ((r.left + r.width / 2 - c.left) / c.width) * 2 - 1;
    const ny = 1 - ((r.top + r.height / 2 - c.top) / c.height) * 2;
    group.position.set((nx * viewH * camera.aspect) / 2, (ny * viewH) / 2, 0);
    group.scale.setScalar((r.height / c.height) * viewH / (380 / SCALE)); // 380 = altura do viewBox
  };
  addEventListener('resize', resize);
  resize();

  // render pausa fora da tela e com a aba escondida
  let onScreen = true;
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; });
  io.observe(canvas);
  const t0 = performance.now();
  renderer.setAnimationLoop(() => {
    if (!onScreen || document.hidden) return;
    const t = (performance.now() - t0) / 1000;
    uniforms.uTime.value = t;
    follow();
    group.rotation.y += (mouse.x * 0.5 + Math.sin(t * 0.3) * 0.12 - group.rotation.y) * 0.05;
    group.rotation.x += (mouse.y * 0.25 - group.rotation.x) * 0.05;
    dustGroup.rotation.copy(group.rotation);
    renderer.render(scene, camera);
  });

  return {
    uniforms,
    dispose() {
      renderer.setAnimationLoop(null);
      io.disconnect();
      removeEventListener('pointermove', onMove);
      removeEventListener('resize', resize);
      geo.dispose(); dustGeo.dispose(); mat.dispose(); renderer.dispose();
    },
  };
}
