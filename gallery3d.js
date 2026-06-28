import * as THREE from 'three';

const canvas = document.getElementById('gallery-canvas');
if (!canvas) throw new Error('gallery-canvas not found');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08061a);
scene.fog = new THREE.FogExp2(0x08061a, 0.018);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 5);
camera.lookAt(0, 1.6, -10);

const amb = new THREE.AmbientLight(0xddd0c0, 0.35);
scene.add(amb);

const hemi = new THREE.HemisphereLight(0xffeedd, 0x0a0820, 0.4);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xffeedd, 0.6);
key.position.set(3, 8, 5);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 30;
key.shadow.camera.left = -10;
key.shadow.camera.right = 10;
key.shadow.camera.top = 10;
key.shadow.camera.bottom = -10;
scene.add(key);

const matFloor = new THREE.MeshStandardMaterial({ color: 0x1a1528, roughness: 0.15, metalness: 0.8 });
const matCeil = new THREE.MeshStandardMaterial({ color: 0x151025, roughness: 0.85, metalness: 0.05 });
const matWall = new THREE.MeshStandardMaterial({ color: 0x1e1830, roughness: 0.8, metalness: 0.02 });
const matWallLight = new THREE.MeshStandardMaterial({ color: 0x2a2240, roughness: 0.7, metalness: 0.03 });
const matPillar = new THREE.MeshStandardMaterial({ color: 0x6a5f80, roughness: 0.3, metalness: 0.25, emissive: 0x100820, emissiveIntensity: 0.4 });
const matPillarDark = new THREE.MeshStandardMaterial({ color: 0x3a3255, roughness: 0.45, metalness: 0.35 });
const matPillarCap = new THREE.MeshStandardMaterial({ color: 0x7a6f90, roughness: 0.25, metalness: 0.3, emissive: 0x151028, emissiveIntensity: 0.3 });
const matMolding = new THREE.MeshStandardMaterial({ color: 0x4a4060, roughness: 0.4, metalness: 0.15, emissive: 0x0a0818, emissiveIntensity: 0.3 });
const matGold = new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.2, metalness: 0.75, emissive: 0x4a3510, emissiveIntensity: 0.5 });
const matSconce = new THREE.MeshStandardMaterial({ color: 0x4a3f55, roughness: 0.35, metalness: 0.6 });
const matBulb = new THREE.MeshBasicMaterial({ color: 0xffe8bb });
const matPaintFrame = new THREE.MeshStandardMaterial({ color: 0x3a2815, roughness: 0.3, metalness: 0.4 });
const matPaint = new THREE.MeshStandardMaterial({ color: 0x1a1530, roughness: 0.6, metalness: 0.05 });

const HW = 8;
const HH = 6;
const HL = 50;

const floor = new THREE.Mesh(new THREE.PlaneGeometry(HW, HL), matFloor);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, -HL / 2 + 6);
floor.receiveShadow = true;
scene.add(floor);

const ceil = new THREE.Mesh(new THREE.PlaneGeometry(HW, HL), matCeil);
ceil.rotation.x = Math.PI / 2;
ceil.position.set(0, HH, -HL / 2 + 6);
scene.add(ceil);

const lw = new THREE.Mesh(new THREE.PlaneGeometry(HL, HH), matWall);
lw.rotation.y = Math.PI / 2;
lw.position.set(-HW / 2, HH / 2, -HL / 2 + 6);
lw.receiveShadow = true;
scene.add(lw);

const rw = new THREE.Mesh(new THREE.PlaneGeometry(HL, HH), matWall);
rw.rotation.y = -Math.PI / 2;
rw.position.set(HW / 2, HH / 2, -HL / 2 + 6);
rw.receiveShadow = true;
scene.add(rw);

const bw = new THREE.Mesh(new THREE.PlaneGeometry(HW, HH), matWall);
bw.position.set(0, HH / 2, -HL + 6);
scene.add(bw);

for (const side of [-1, 1]) {
  const wx = side * HW / 2;

  const baseboard = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, HL), matMolding);
  baseboard.position.set(wx - side * 0.06, 0.125, -HL / 2 + 6);
  scene.add(baseboard);

  const chairRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, HL), matMolding);
  chairRail.position.set(wx - side * 0.04, 1.4, -HL / 2 + 6);
  scene.add(chairRail);

  const wainscot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.15, HL), matWallLight);
  wainscot.position.set(wx - side * 0.03, 0.8, -HL / 2 + 6);
  scene.add(wainscot);

  const crown = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, HL), matMolding);
  crown.position.set(wx - side * 0.09, HH - 0.1, -HL / 2 + 6);
  scene.add(crown);

  const crownTop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, HL), matPillarDark);
  crownTop.position.set(wx - side * 0.06, HH - 0.24, -HL / 2 + 6);
  scene.add(crownTop);
}

const ceilBeamMat = new THREE.MeshStandardMaterial({ color: 0x1a1530, roughness: 0.7, metalness: 0.1 });
for (let i = 0; i < 7; i++) {
  const z = 5 - i * 7;
  const beam = new THREE.Mesh(new THREE.BoxGeometry(HW - 0.4, 0.15, 0.25), ceilBeamMat);
  beam.position.set(0, HH - 0.08, z);
  scene.add(beam);
}

function buildPillar(x, z) {
  const g = new THREE.Group();

  const basePlat = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.22, 1.0), matPillarDark);
  basePlat.position.y = 0.11;
  basePlat.castShadow = true;
  g.add(basePlat);

  const baseMold = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.12, 0.88), matMolding);
  baseMold.position.y = 0.28;
  g.add(baseMold);

  const baseRound = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.15, 24), matPillar);
  baseRound.position.y = 0.42;
  g.add(baseRound);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, HH - 1.8, 16), matPillarCap);
  shaft.position.y = HH / 2 - 0.15;
  shaft.castShadow = true;
  g.add(shaft);

  for (let i = 0; i < 18; i++) {
    const ry = 0.6 + (i / 17) * (HH - 2.4);
    const groove = new THREE.Mesh(
      new THREE.TorusGeometry(0.26 + Math.sin(i * 0.5) * 0.005, 0.004, 6, 16),
      matPillarDark
    );
    groove.position.set(0, ry, 0);
    groove.rotation.x = Math.PI / 2;
    g.add(groove);
  }

  const echinus = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.30, 0.12, 24), matPillar);
  echinus.position.y = HH - 1.06;
  g.add(echinus);

  const voluteL = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.022, 8, 12, Math.PI), matPillar);
  voluteL.position.set(-0.30, HH - 1.1, 0.38);
  voluteL.rotation.y = Math.PI / 2;
  g.add(voluteL);

  const voluteR = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.022, 8, 12, Math.PI), matPillar);
  voluteR.position.set(0.30, HH - 1.1, 0.38);
  voluteR.rotation.y = Math.PI / 2;
  g.add(voluteR);

  const voluteL2 = voluteL.clone();
  voluteL2.position.z = -0.38;
  g.add(voluteL2);

  const voluteR2 = voluteR.clone();
  voluteR2.position.z = -0.38;
  g.add(voluteR2);

  const capital = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.14, 0.78), matPillarDark);
  capital.position.y = HH - 0.92;
  g.add(capital);

  const abacus = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.06, 0.88), matMolding);
  abacus.position.y = HH - 0.82;
  g.add(abacus);

  g.position.set(x, 0, z);
  scene.add(g);
}

const pillarSpacing = 6.5;
const numPillars = 8;
for (let i = 0; i < numPillars; i++) {
  const z = 4 - i * pillarSpacing;
  buildPillar(-HW / 2 + 0.55, z);
  buildPillar(HW / 2 - 0.55, z);
}

function buildSconce(x, y, z, rotY) {
  const g = new THREE.Group();

  const wallPlate = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.06), matSconce);
  g.add(wallPlate);

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, 0.28, 8), matSconce);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(0, 0.04, 0);
  g.add(arm);

  const armUp = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8), matSconce);
  armUp.position.set(0.14, 0.12, 0);
  g.add(armUp);

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.06, 8), matSconce);
  cup.position.set(0.14, 0.04, 0);
  g.add(cup);

  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.10, 8, 1, true), new THREE.MeshStandardMaterial({
    color: 0x2a2040, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide
  }));
  shade.position.set(0.14, 0.10, 0);
  g.add(shade);

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), matBulb);
  bulb.position.set(0.14, 0.08, 0);
  g.add(bulb);

  const light = new THREE.PointLight(0xffe0a0, 2.0, 6, 1.5);
  light.position.set(0.14, 0.10, 0.08);
  g.add(light);

  g.position.set(x, y, z);
  g.rotation.y = rotY;
  scene.add(g);
  return { group: g, light };
}

const sconces = [];
for (let i = 0; i < numPillars - 1; i++) {
  const z = 4 - i * pillarSpacing - pillarSpacing / 2;
  sconces.push(buildSconce(-HW / 2 + 0.12, 3.2, z, Math.PI / 2));
  sconces.push(buildSconce(HW / 2 - 0.12, 3.2, z, -Math.PI / 2));
}

const ceilLightMat = new THREE.MeshStandardMaterial({ color: 0x4a3f55, roughness: 0.3, metalness: 0.6 });
const ceilLights = [];
for (let i = 0; i < 5; i++) {
  const z = 3 - i * 9;

  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.4, 4), ceilLightMat);
  chain.position.set(0, HH - 0.2, z);
  scene.add(chain);

  const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.15, 8), ceilLightMat);
  fixture.position.set(0, HH - 0.45, z);
  scene.add(fixture);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.008, 6, 16), matGold);
  ring.position.set(0, HH - 0.52, z);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), matBulb);
  bulb.position.set(0, HH - 0.55, z);
  scene.add(bulb);

  const pl = new THREE.PointLight(0xffe0b0, 2.5, 14, 1.2);
  pl.position.set(0, HH - 0.55, z);
  scene.add(pl);
  ceilLights.push(pl);
}

const floorTileMat = new THREE.MeshStandardMaterial({ color: 0x1e1830, roughness: 0.2, metalness: 0.7 });
for (let i = 0; i < 50; i++) {
  const z = 5 - i;
  if (i % 2 === 0) {
    const tile = new THREE.Mesh(new THREE.PlaneGeometry(HW - 2.5, 0.95), floorTileMat);
    tile.rotation.x = -Math.PI / 2;
    tile.position.set(0, 0.003, z);
    scene.add(tile);
  }
}

const pathEdgeMat = new THREE.MeshStandardMaterial({ color: 0x2a2240, roughness: 0.3, metalness: 0.5 });
for (let i = 0; i < 50; i++) {
  const z = 5 - i;
  const el = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.95), pathEdgeMat);
  el.position.set(-1.1, 0.008, z);
  scene.add(el);
  const er = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.95), pathEdgeMat);
  er.position.set(1.1, 0.008, z);
  scene.add(er);
}

const paintingSizes = [
  { w: 0.9, h: 1.2 },
  { w: 0.7, h: 0.9 },
  { w: 1.0, h: 1.4 },
  { w: 0.6, h: 0.8 },
  { w: 0.8, h: 1.1 },
];

for (let i = 0; i < 5; i++) {
  const z = 1 - i * 8;
  const ps = paintingSizes[i];
  const side = i % 2 === 0 ? -1 : 1;
  const wx = side * (HW / 2 - 0.04);
  const rotY = side > 0 ? -Math.PI / 2 : Math.PI / 2;

  const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(ps.w + 0.12, ps.h + 0.12, 0.04), matPaintFrame);
  frameOuter.position.set(wx, 2.6, z);
  frameOuter.rotation.y = rotY;
  frameOuter.castShadow = true;
  scene.add(frameOuter);

  const frameInner = new THREE.Mesh(new THREE.BoxGeometry(ps.w, ps.h, 0.02), matGold);
  frameInner.position.set(wx, 2.6, z);
  frameInner.rotation.y = rotY;
  scene.add(frameInner);

  const picture = new THREE.Mesh(new THREE.PlaneGeometry(ps.w - 0.04, ps.h - 0.04), matPaint);
  picture.position.set(wx, 2.6, z);
  picture.rotation.y = rotY;
  const offset = side > 0 ? -0.025 : 0.025;
  if (side > 0) {
    picture.position.x += Math.sin(rotY) * 0.025;
    picture.position.z += Math.cos(rotY) * 0.025;
  } else {
    picture.position.x += Math.sin(rotY) * 0.025;
    picture.position.z += Math.cos(rotY) * 0.025;
  }
  scene.add(picture);

  const spotP = new THREE.SpotLight(0xffeedd, 3.0, 6, Math.PI / 6, 0.6, 1.2);
  spotP.position.set(wx - side * 0.3, 4.2, z);
  spotP.target.position.set(wx, 2.6, z);
  scene.add(spotP);
  scene.add(spotP.target);
}

let mx = 0, my = 0;
let smoothMx = 0, smoothMy = 0;

window.addEventListener('mousemove', (e) => {
  mx = (e.clientX / window.innerWidth - 0.5) * 2;
  my = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

let time = 0;

function tick() {
  requestAnimationFrame(tick);
  time += 0.016;

  smoothMx += (mx - smoothMx) * 0.04;
  smoothMy += (my - smoothMy) * 0.04;

  camera.position.x = smoothMx * 0.8;
  camera.position.y = 1.6 - smoothMy * 0.3;
  camera.lookAt(smoothMx * 0.3, 1.6 + smoothMy * 0.1, -10);

  for (let i = 0; i < sconces.length; i++) {
    const flicker = 1.6 + Math.sin(time * 4.2 + i * 2.7) * 0.3 + Math.sin(time * 6.8 + i * 1.9) * 0.15;
    sconces[i].light.intensity = flicker;
  }

  for (let i = 0; i < ceilLights.length; i++) {
    const flicker = 2.2 + Math.sin(time * 3.5 + i * 3.1) * 0.2;
    ceilLights[i].intensity = flicker;
  }

  renderer.render(scene, camera);
}
tick();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
