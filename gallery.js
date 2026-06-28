const drawings = [
  { src: './assets/drawings/wolverine.jpeg', name: 'Wolverine' },
  { src: './assets/drawings/tony.jpeg', name: 'Tony Stark' },
  { src: './assets/drawings/olivia_cooke.jpeg', name: 'Olivia Cooke' },
  { src: './assets/drawings/melisandre.jpeg', name: 'Melisandre' },
  { src: './assets/drawings/martha.jpeg', name: 'Martha' },
  { src: './assets/drawings/leomessi.jpeg', name: 'Leo Messi' },
  { src: './assets/drawings/johnshelby.jpeg', name: 'John Shelby' },
  { src: './assets/drawings/homelander.jpeg', name: 'Homelander' },
  { src: './assets/drawings/flash.jpeg', name: 'The Flash' },
  { src: './assets/drawings/daredevil.jpeg', name: 'Daredevil' },
  { src: './assets/drawings/cillian_murphy.jpeg', name: 'Cillian Murphy' },
  { src: './assets/drawings/captainmarvel.jpeg', name: 'Captain Marvel' },
  { src: './assets/drawings/captain_america.jpeg', name: 'Captain America' },
  { src: './assets/drawings/benedict_cumberbatch.jpeg', name: 'Benedict Cumberbatch' },
  { src: './assets/drawings/ScarlettWitch.jpeg', name: 'Scarlet Witch' },
  { src: './assets/drawings/SerDuncan.jpeg', name: 'Ser Duncan The Tall' },
];

const grid = document.getElementById('gallery-grid');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxLabel = document.getElementById('lightbox-label');
const lightboxClose = document.getElementById('lightbox-close');
const carouselBtns = document.querySelectorAll('.carousel-btn');
const nav = document.querySelector('.nav');

const isMobile = window.innerWidth <= 768;

nav.style.opacity = '0';
if (!isMobile) {
  grid.style.opacity = '0';
  grid.style.filter = 'blur(6px)';
  grid.style.transform = 'scale(0.97)';
  btnLeft.style.opacity = '0';
  btnRight.style.opacity = '0';
  carouselBtns.forEach(b => b.style.pointerEvents = 'none');
}

setTimeout(() => {
  nav.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
  nav.style.opacity = '1';

  if (!isMobile) {
    grid.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    grid.style.opacity = '1';
    grid.style.filter = 'blur(0px)';
    grid.style.transform = 'scale(1)';

    btnLeft.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s';
    btnLeft.style.opacity = '1';
    btnLeft.style.pointerEvents = 'all';

    btnRight.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s';
    btnRight.style.opacity = '1';
    btnRight.style.pointerEvents = 'all';
  }
}, 200);

const cardEls = [];
const total = drawings.length;
const ANGLE_STEP = (Math.PI * 2) / total;
let ORBIT_R = Math.min(550, window.innerWidth * 0.45);

drawings.forEach((d) => {
  const card = document.createElement('div');
  card.className = 'art-card';
  card.innerHTML = `
    <div class="art-frame">
      <div class="frame-face-depth"></div>
      <div class="frame-face-front">
        <div class="frame-inner">
          <img src="${d.src}" alt="${d.name}" class="frame-image" loading="lazy">
        </div>
      </div>
      <div class="frame-edge frame-edge-top"></div>
      <div class="frame-edge frame-edge-right"></div>
      <div class="frame-edge frame-edge-bottom"></div>
      <div class="frame-edge frame-edge-left"></div>
      <div class="frame-label"><h3>${d.name}</h3></div>
    </div>
  `;
  card.addEventListener('click', () => openLightbox(d.src, d.name));
  grid.appendChild(card);
  cardEls.push(card);
});

function openLightbox(src, name) {
  lightboxImg.src = src;
  lightboxLabel.textContent = name;
  lightbox.classList.add('open');
}
lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.querySelector('.lightbox-backdrop').addEventListener('click', () => lightbox.classList.remove('open'));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });

let currentAngle = 0;
let targetAngle = 0;

btnLeft.addEventListener('click', () => { targetAngle -= ANGLE_STEP; });
btnRight.addEventListener('click', () => { targetAngle += ANGLE_STEP; });

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') targetAngle -= ANGLE_STEP;
  if (e.key === 'ArrowRight') targetAngle += ANGLE_STEP;
});

function tick() {
  if (isMobile) return;

  currentAngle += (targetAngle - currentAngle) * 0.1;

  for (let i = 0; i < total; i++) {
    const a = currentAngle + i * ANGLE_STEP;
    const x = Math.sin(a) * ORBIT_R;
    const z = Math.cos(a) * ORBIT_R;
    const depth = (z + ORBIT_R) / (ORBIT_R * 2);
    const vis = Math.max(0, Math.min(1, depth * 2.5 - 0.3));
    const sc = 0.4 + depth * 0.6;

    const card = cardEls[i];
    card.style.transform =
      `translateX(${x}px) translateZ(${(1 - depth) * -300}px) scale(${sc}) rotateY(${-Math.sin(a) * 25}deg)`;
    card.style.opacity = vis;
    card.style.zIndex = (depth * 100) | 0;
    card.style.pointerEvents = vis > 0.6 ? 'all' : 'none';
  }

  requestAnimationFrame(tick);
}
if (!isMobile) tick();

window.addEventListener('resize', () => {
  ORBIT_R = Math.min(550, window.innerWidth * 0.45);
});

let touchStartX = 0;
let touchStartY = 0;

grid.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

grid.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) targetAngle -= ANGLE_STEP;
    else targetAngle += ANGLE_STEP;
  }
}, { passive: true });
