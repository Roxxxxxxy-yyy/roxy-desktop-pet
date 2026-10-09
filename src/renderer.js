const character = document.querySelector('#character');
const characterImage = document.querySelector('#character-image');
const bubble = document.querySelector('#bubble');
const controls = document.querySelector('#controls');
const sizeLabel = document.querySelector('#size-label');
const smallerButton = document.querySelector('#smaller');
const largerButton = document.querySelector('#larger');
const hideButton = document.querySelector('#hide');
const quitButton = document.querySelector('#quit');
const languageSelect = document.querySelector('#language');

const spritePaths = {
  idle: '../assets/chibi-v4/idle.png',
  happy: '../assets/chibi-v4/happy.png',
  shy: '../assets/chibi-v4/shy.png',
  proud: '../assets/chibi-v4/proud.png',
  surprised: '../assets/chibi-v4/surprised.png',
  magic: '../assets/chibi-v4/magic.png'
};

const actionClasses = [
  'walking',
  'action-happy',
  'action-shy',
  'action-proud',
  'action-surprised',
  'action-magic'
];

Object.values(spritePaths).forEach((source) => {
  const image = new Image();
  image.src = source;
});

let pointerStart;
let controlTimer;
let bubbleTimer;
let actionTimer;
let ambientTimer;
let wanderX = 0;
let lastReaction;
let scale = Number.parseFloat(localStorage.getItem('pet-scale') || '1');
let language = localStorage.getItem('pet-language') || 'zh';

function applyLanguage(nextLanguage) {
  language = Object.hasOwn(window.petLocales, nextLanguage) ? nextLanguage : 'zh';
  const copy = window.petLocales[language];
  localStorage.setItem('pet-language', language);
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
  document.title = copy.name;
  languageSelect.value = language;
  languageSelect.title = copy.language;
  languageSelect.setAttribute('aria-label', copy.language);
  smallerButton.title = copy.smaller;
  largerButton.title = copy.larger;
  hideButton.title = copy.hide;
  quitButton.title = copy.quit;
  character.title = copy.character;
  characterImage.alt = copy.name;
  window.petApp.setLanguage(language);
  hideLine();
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function showControls(duration = 3600) {
  window.clearTimeout(controlTimer);
  controls.classList.add('visible');
  controlTimer = window.setTimeout(() => controls.classList.remove('visible'), duration);
}

function showLine(text, duration = 3600) {
  window.clearTimeout(bubbleTimer);
  bubble.textContent = text;
  bubble.classList.add('visible');
  bubbleTimer = window.setTimeout(() => bubble.classList.remove('visible'), duration);
}

function hideLine() {
  window.clearTimeout(bubbleTimer);
  bubble.classList.remove('visible');
}

function clearActionClasses() {
  character.classList.remove(...actionClasses);
}

function setPose(pose) {
  characterImage.src = spritePaths[pose] || spritePaths.idle;
}

function returnToIdle() {
  clearActionClasses();
  setPose('idle');
}

function playPose(pose, { line, duration = 2600 } = {}) {
  window.clearTimeout(actionTimer);
  clearActionClasses();
  setPose(pose);
  if (pose !== 'idle') character.classList.add(`action-${pose}`);
  if (line) showLine(line, Math.max(2800, duration));
  actionTimer = window.setTimeout(returnToIdle, duration);
}

function playInteraction() {
  const reactions = window.petLocales[language].reactions;
  const choices = Object.keys(reactions).filter((pose) => pose !== lastReaction);
  const pose = randomItem(choices);
  lastReaction = pose;
  playPose(pose, {
    line: randomItem(reactions[pose]),
    duration: pose === 'magic' ? 3200 : 2500
  });
}

function wander() {
  window.clearTimeout(actionTimer);
  clearActionClasses();
  const direction = Math.random() < 0.5 ? -1 : 1;
  wanderX = clamp(wanderX + (Math.random() * 54 + 18) * direction, -42, 42);
  document.documentElement.style.setProperty('--wander-x', `${wanderX}px`);
  setPose(Math.random() < 0.35 ? 'happy' : 'idle');
  character.classList.add('walking');
  actionTimer = window.setTimeout(returnToIdle, 1750);
}

function runAmbientAction() {
  if (pointerStart) {
    scheduleAmbient();
    return;
  }

  if (Math.random() < 0.45) {
    wander();
  } else {
    const [pose, line] = randomItem(window.petLocales[language].ambient);
    playPose(pose, {
      line: Math.random() < 0.62 ? line : undefined,
      duration: pose === 'magic' ? 3300 : 2800
    });
  }
  scheduleAmbient();
}

function scheduleAmbient() {
  window.clearTimeout(ambientTimer);
  ambientTimer = window.setTimeout(runAmbientAction, 8000 + Math.random() * 10000);
}

function applyScale(nextScale, notifyMain = true, revealControls = true) {
  scale = Math.round(clamp(nextScale, 0.7, 1.4) * 10) / 10;
  document.documentElement.style.setProperty('--character-size', `${Math.round(320 * scale)}px`);
  sizeLabel.textContent = `${Math.round(scale * 100)}%`;
  localStorage.setItem('pet-scale', String(scale));
  if (notifyMain) window.petApp.setScale(scale);
  if (revealControls) showControls();
}

character.addEventListener('pointerenter', () => showControls());
character.addEventListener('pointermove', () => showControls());

character.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  window.clearTimeout(actionTimer);
  window.clearTimeout(ambientTimer);
  returnToIdle();
  hideLine();
  wanderX = 0;
  document.documentElement.style.setProperty('--wander-x', '0px');
  pointerStart = { x: event.screenX, y: event.screenY };
  character.setPointerCapture(event.pointerId);
  character.classList.add('dragging');
  window.petApp.startDrag();
  showControls(5000);
});

character.addEventListener('pointerup', (event) => {
  if (!pointerStart) return;
  const distance = Math.hypot(event.screenX - pointerStart.x, event.screenY - pointerStart.y);
  pointerStart = undefined;
  character.classList.remove('dragging');
  window.petApp.endDrag();
  if (distance < 7) playInteraction();
  scheduleAmbient();
});

character.addEventListener('pointercancel', () => {
  pointerStart = undefined;
  character.classList.remove('dragging');
  window.petApp.endDrag();
  scheduleAmbient();
});

controls.addEventListener('pointerenter', () => showControls(5000));
controls.addEventListener('pointermove', () => showControls(5000));
controls.addEventListener('pointerdown', (event) => event.stopPropagation());
languageSelect.addEventListener('change', () => applyLanguage(languageSelect.value));

smallerButton.addEventListener('click', () => applyScale(scale - 0.1));
largerButton.addEventListener('click', () => applyScale(scale + 0.1));
hideButton.addEventListener('click', () => window.petApp.hide());
quitButton.addEventListener('click', () => window.petApp.quit());

applyScale(scale, true, false);
applyLanguage(language);
window.setTimeout(() => showLine(window.petLocales[language].greeting), 550);
scheduleAmbient();
