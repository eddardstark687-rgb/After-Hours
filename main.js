import * as THREE from 'three';
import { animate } from 'motion';

const launchText = document.getElementById('launch-text');
const canvas = document.getElementById('three-canvas');
const homepage = document.getElementById('homepage');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020208);
scene.fog = new THREE.Fog(0x020208, 8, 28);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.7, 5);
camera.lookAt(0, 1.7, -20);

scene.add(new THREE.AmbientLight(0x1a2a4a, 0.15));

const ceilingLight = new THREE.PointLight(0x4488ff, 0, 30);
ceilingLight.position.set(0, 3.5, 0);
scene.add(ceilingLight);

const wallMat = new THREE.MeshStandardMaterial({ color: 0x0e0e1a, roughness: 0.85, metalness: 0.05 });

const floorMat = new THREE.MeshStandardMaterial({ color: 0x080812, roughness: 0.3, metalness: 0.7 });

const floor = new THREE.Mesh(new THREE.PlaneGeometry(7, 30), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, -11);
floor.receiveShadow = true;
scene.add(floor);

const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(7, 30), wallMat);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, 4, -11);
scene.add(ceiling);

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(7, 4), wallMat);
backWall.position.set(0, 2, -26);
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 6), wallMat);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-3.5, 2, -11);
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 6), wallMat);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(3.5, 2, -11);
rightWall.receiveShadow = true;
scene.add(rightWall);

const drawingPaths = [
  '/assets/drawings/ScarlettWitch.jpeg',
  '/assets/drawings/SerDuncan.jpeg',
  '/assets/drawings/wolverine.jpeg',
  '/assets/drawings/tony.jpeg',
  '/assets/drawings/olivia_cooke.jpeg',
  '/assets/drawings/melisandre.jpeg',
  '/assets/drawings/martha.jpeg',
  '/assets/drawings/leomessi.jpeg',
  '/assets/drawings/johnshelby.jpeg',
  '/assets/drawings/homelander.jpeg',
  '/assets/drawings/flash.jpeg',
  '/assets/drawings/daredevil.jpeg',
  '/assets/drawings/cillian_murphy.jpeg',
  '/assets/drawings/captainmarvel.jpeg',
  '/assets/drawings/captain_america.jpeg',
  '/assets/drawings/benedict_cumberbatch.jpeg',
];

const shuffled = [...drawingPaths].sort(() => Math.random() - 0.5);
const texLoader = new THREE.TextureLoader();

const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a4a6a, roughness: 0.25, metalness: 0.85, emissive: 0x2a2a4a, emissiveIntensity: 0.4 });
let drawIdx = 0;
const frameSpacing = 3.5;
const numPairs = 7;

const spotLights = [];
const lampLights = [];
const lampGlowMeshes = [];

for (let i = 0; i < numPairs; i++) {
  const z = -i * frameSpacing - 1;
  const sc = 1 - i * 0.06;
  const fw = 1.6 * sc;
  const fh = 2.1 * sc;
  const bd = 0.06;
  const bd2 = 0.08;

  const borderGeo = new THREE.BoxGeometry(fw + bd2 * 2, fh + bd2 * 2, bd);

  const bL = new THREE.Mesh(borderGeo, frameMat);
  bL.position.set(-3.45, 1.9, z);
  bL.rotation.y = Math.PI / 2;
  bL.castShadow = true;
  scene.add(bL);

  const bR = new THREE.Mesh(borderGeo, frameMat);
  bR.position.set(3.45, 1.9, z);
  bR.rotation.y = -Math.PI / 2;
  bR.castShadow = true;
  scene.add(bR);

  const texL = texLoader.load(shuffled[drawIdx % shuffled.length]);
  drawIdx++;
  texL.minFilter = THREE.LinearFilter;
  texL.magFilter = THREE.LinearFilter;
  const picMatL = new THREE.MeshStandardMaterial({ map: texL, emissive: new THREE.Color(0xffffff), emissiveMap: texL, emissiveIntensity: 0.35, roughness: 0.6, metalness: 0.0 });
  const picL = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), picMatL);
  picL.position.set(-3.42, 1.9, z);
  picL.rotation.y = Math.PI / 2;
  picL.position.x += Math.sin(Math.PI / 2) * 0.035;
  picL.position.z += Math.cos(Math.PI / 2) * 0.035;
  scene.add(picL);

  const texR = texLoader.load(shuffled[drawIdx % shuffled.length]);
  drawIdx++;
  texR.minFilter = THREE.LinearFilter;
  texR.magFilter = THREE.LinearFilter;
  const picMatR = new THREE.MeshStandardMaterial({ map: texR, emissive: new THREE.Color(0xffffff), emissiveMap: texR, emissiveIntensity: 0.35, roughness: 0.6, metalness: 0.0 });
  const picR = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), picMatR);
  picR.position.set(3.42, 1.9, z);
  picR.rotation.y = -Math.PI / 2;
  picR.position.x += Math.sin(-Math.PI / 2) * 0.035;
  picR.position.z += Math.cos(-Math.PI / 2) * 0.035;
  scene.add(picR);

  const spL = new THREE.SpotLight(0x4488ff, 0, 10, Math.PI / 4, 0.5, 1.0);
  spL.position.set(-3.4, 3.1, z);
  spL.target.position.set(-3.4, 1.9, z);
  scene.add(spL);
  scene.add(spL.target);
  spotLights.push(spL);

  const spR = new THREE.SpotLight(0x4488ff, 0, 10, Math.PI / 4, 0.5, 1.0);
  spR.position.set(3.4, 3.1, z);
  spR.target.position.set(3.4, 1.9, z);
  scene.add(spR);
  scene.add(spR.target);
  spotLights.push(spR);

  const lmpPostMat = new THREE.MeshStandardMaterial({ color: 0x1a1a28, roughness: 0.3, metalness: 0.9 });
  const lmpGlowMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x60a5fa, emissiveIntensity: 0 });
  const lz = z + frameSpacing / 2;

  [-3.3, 3.3].forEach(lx => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), lmpPostMat);
    post.position.set(lx, 3.7, lz);
    scene.add(post);

    const armDir = lx > 0 ? -1 : 1;
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8), lmpPostMat);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(lx + armDir * 0.15, 3.85, lz);
    scene.add(arm);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), lmpGlowMat.clone());
    bulb.position.set(lx + armDir * 0.3, 3.7, lz);
    scene.add(bulb);
    lampGlowMeshes.push(bulb);

    const pl = new THREE.PointLight(0x60a5fa, 0, 8, 1.5);
    pl.position.set(lx + armDir * 0.3, 3.7, lz);
    scene.add(pl);
    lampLights.push(pl);
  });
}

let time = 0;
let lightsOn = false;
let flickerStartTime = 0;
const flickerDuration = 3.0;
const flickerRampEnd = 2.4;

function flickerPattern(t) {
  if (t < 0) return 0;
  if (t < 0.15) return t / 0.15 * 0.6;
  if (t < 0.25) return 0.6 - 0.4 * ((t - 0.15) / 0.1);
  if (t < 0.35) return 0.2 + 0.7 * ((t - 0.25) / 0.1);
  if (t < 0.45) return 0.9 - 0.5 * ((t - 0.35) / 0.1);
  if (t < 0.55) return 0.4 + 0.3 * ((t - 0.45) / 0.1);
  if (t < 0.65) return 0.7 - 0.2 * ((t - 0.55) / 0.1);
  if (t < 0.8) return 0.5 + 0.5 * ((t - 0.65) / 0.15);
  if (t < 0.9) return 1.0 - 0.15 * ((t - 0.8) / 0.1);
  if (t < 1.05) return 0.85 + 0.15 * ((t - 0.9) / 0.15);
  if (t < 1.15) return 1.0 - 0.3 * ((t - 1.05) / 0.1);
  if (t < 1.3) return 0.7 + 0.3 * ((t - 1.15) / 0.15);
  if (t < 1.5) return 1.0 - 0.08 * Math.sin((t - 1.3) * 25);
  if (t < 1.8) return 0.92 + 0.08 * Math.sin((t - 1.5) * 20);
  return 1.0;
}

function tick() {
  requestAnimationFrame(tick);
  time += 0.016;
  camera.position.x = Math.sin(time * 0.1) * 0.3;
  camera.position.y = 1.6 + Math.sin(time * 0.15) * 0.05;
  camera.lookAt(0, 1.6, -2);

  if (!lightsOn) {
    const elapsed = time - flickerStartTime;
    if (elapsed > 0 && elapsed < flickerDuration) {
      const base = flickerPattern(elapsed);
      spotLights.forEach((sp, i) => {
        const jitter = 0.85 + 0.15 * Math.sin(time * 37 + i * 7.3);
        sp.intensity = base * 3.5 * jitter;
      });
      lampLights.forEach((pl, i) => {
        const jitter = 0.9 + 0.1 * Math.sin(time * 43 + i * 5.1);
        pl.intensity = base * 2.0 * jitter;
      });
      lampGlowMeshes.forEach((mesh, i) => {
        const jitter = 0.9 + 0.1 * Math.sin(time * 43 + i * 5.1);
        mesh.material.emissiveIntensity = base * 2.0 * jitter;
      });
      ceilingLight.intensity = base * 1.0;
    } else if (elapsed >= flickerDuration) {
      lightsOn = true;
      spotLights.forEach(sp => { sp.intensity = 3.5; });
      lampLights.forEach(pl => { pl.intensity = 2.0; });
      lampGlowMeshes.forEach(mesh => { mesh.material.emissiveIntensity = 2.0; });
      ceilingLight.intensity = 1.0;
    }
  }

  renderer.render(scene, camera);
}
tick();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function runLaunch() {
  camera.position.z = 14;

  const lineTopEl = document.getElementById('line-top');
  const lineBottomEl = document.getElementById('line-bottom');
  const letters1 = 'AFTER'.split('');
  const letters2 = 'HOURS'.split('');

  letters1.forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    lineTopEl.appendChild(span);
  });

  letters2.forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    lineBottomEl.appendChild(span);
  });

  const allLetters = document.querySelectorAll('.letter');

  allLetters.forEach((el, i) => {
    const row = i < 5 ? 0 : 1;
    const col = i < 5 ? i : i - 5;
    const delay = 0.1 + col * 0.08 + row * 0.3;

    animate(el,
      {
        opacity: [0, 1, 1, 0],
        y: [80, 0, 0, -40],
        rotateX: [-60, 0, 0, 30],
        rotateY: [20, 0, 0, -15],
        scale: [0.3, 1.05, 1, 0.8],
        filter: ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'],
      },
      {
        duration: 2.8,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
        times: [0, 0.3, 0.7, 1],
      },
    );
  });

  flickerStartTime = time + 0.5;

  setTimeout(() => {
    canvas.classList.add('visible');
    animate(camera.position, { z: [14, 5] }, { duration: 2.0, ease: [0.16, 1, 0.3, 1] });
    setTimeout(() => {
      launchText.style.display = 'none';
      homepage.classList.add('active');
      animateHomepage();
    }, 600);
  }, 2600);
}

function animateHomepage() {
  const nav = document.querySelector('.nav');
  const title = document.querySelector('.hero-title');
  const sub = document.querySelector('.hero-sub');
  const meta = document.querySelector('.hero-meta');
  animate(nav, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] });
  animate(title, { opacity: [0, 1], y: [40, 0], filter: ['blur(8px)', 'blur(0px)'] }, { duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] });
  animate(sub, { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] });
  animate(meta, { opacity: [0, 1], y: [15, 0] }, { duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] });

  const galleryLink = document.querySelector('.gallery-link');
  const overlay = document.getElementById('transition-overlay');
  const heroText = document.querySelector('.hero-text');

  galleryLink.addEventListener('click', (e) => {
    e.preventDefault();

    overlay.classList.add('go');

    animate(heroText, { opacity: [1, 0], y: [0, -30], filter: ['blur(0px)', 'blur(8px)'] }, { duration: 0.4, ease: [0.4, 0, 1, 1] });

    setTimeout(() => {
      window.location.href = './gallery.html';
    }, 1000);
  });
}

runLaunch();
