import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("#simulation");
const temperatureSlider = document.querySelector("#temperatureSlider");
const loadSlider = document.querySelector("#loadSlider");
const temperatureText = document.querySelector("#temperature");
const loadText = document.querySelector("#loadValue");
const methaneScore = document.querySelector("#methaneScore");
const riskScore = document.querySelector("#riskScore");
const phbScore = document.querySelector("#phbScore");
const gateScore = document.querySelector("#gateScore");
const toggleFlow = document.querySelector("#toggleFlow");
const resetView = document.querySelector("#resetView");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x08110e, 12, 34);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
camera.position.set(7.4, 5.2, 10.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.1, 0);
controls.maxDistance = 20;
controls.minDistance = 5.5;
controls.maxPolarAngle = Math.PI * 0.48;

const ambientLight = new THREE.AmbientLight(0xb8ffe1, 0.7);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
keyLight.position.set(5, 7, 6);
keyLight.castShadow = true;
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x47d2d8, 90, 24);
rimLight.position.set(-7, 4, -6);
scene.add(rimLight);

const base = new THREE.Mesh(
  new THREE.CylinderGeometry(5.8, 6.8, 0.28, 72),
  new THREE.MeshStandardMaterial({ color: 0x12231d, roughness: 0.68, metalness: 0.1 })
);
base.receiveShadow = true;
scene.add(base);

const tankGroup = new THREE.Group();
scene.add(tankGroup);

const tankGlass = new THREE.Mesh(
  new THREE.CylinderGeometry(2.4, 2.6, 4.2, 96, 1, true),
  new THREE.MeshPhysicalMaterial({
    color: 0x64d8c5,
    transparent: true,
    opacity: 0.2,
    roughness: 0.16,
    metalness: 0,
    transmission: 0.25,
    side: THREE.DoubleSide
  })
);
tankGlass.position.y = 2.28;
tankGlass.castShadow = true;
tankGroup.add(tankGlass);

const sludge = new THREE.Mesh(
  new THREE.CylinderGeometry(2.28, 2.46, 1.75, 96),
  new THREE.MeshStandardMaterial({ color: 0x5d4933, roughness: 0.9 })
);
sludge.position.y = 1.38;
sludge.castShadow = true;
tankGroup.add(sludge);

const topRing = new THREE.Mesh(
  new THREE.TorusGeometry(2.49, 0.08, 16, 96),
  new THREE.MeshStandardMaterial({ color: 0xb8e9dd, roughness: 0.25, metalness: 0.35 })
);
topRing.position.y = 4.4;
tankGroup.add(topRing);

const bottomRing = topRing.clone();
bottomRing.position.y = 0.18;
tankGroup.add(bottomRing);

const cap = new THREE.Mesh(
  new THREE.CylinderGeometry(2.54, 2.54, 0.18, 96),
  new THREE.MeshStandardMaterial({ color: 0x203631, roughness: 0.45, metalness: 0.35 })
);
cap.position.y = 4.52;
cap.castShadow = true;
tankGroup.add(cap);

const coilMaterial = new THREE.MeshStandardMaterial({ color: 0xe5aa4b, emissive: 0x5a2e00, emissiveIntensity: 0.45, roughness: 0.35 });
const coilPoints = [];
for (let i = 0; i < 260; i += 1) {
  const t = i / 259;
  const angle = t * Math.PI * 9;
  coilPoints.push(new THREE.Vector3(Math.cos(angle) * 2.82, 0.72 + t * 3.1, Math.sin(angle) * 2.82));
}
const coil = new THREE.Mesh(
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coilPoints), 240, 0.045, 10, false),
  coilMaterial
);
tankGroup.add(coil);

function makePipe(points, color, emissive = 0x000000) {
  return new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 80, 0.055, 12, false),
    new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0.35, roughness: 0.28 })
  );
}

const inletPipe = makePipe([
  new THREE.Vector3(-6.2, 1.2, 0),
  new THREE.Vector3(-4.6, 1.2, 0),
  new THREE.Vector3(-3.1, 1.8, 0),
  new THREE.Vector3(-2.35, 1.8, 0)
], 0x7a6042);
scene.add(inletPipe);

const biogasPipe = makePipe([
  new THREE.Vector3(0, 4.62, 0),
  new THREE.Vector3(0.5, 5.2, 0),
  new THREE.Vector3(3.2, 5.2, 0),
  new THREE.Vector3(4.9, 4.1, 0)
], 0x51c878, 0x0f5428);
scene.add(biogasPipe);

const co2Pipe = makePipe([
  new THREE.Vector3(4.9, 4.1, 0),
  new THREE.Vector3(6.0, 3.5, -1.1),
  new THREE.Vector3(6.0, 2.1, -2.6),
  new THREE.Vector3(4.8, 1.4, -3.4)
], 0x46d0d8, 0x063d45);
scene.add(co2Pipe);

const heatSource = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 1.2, 1.4),
  new THREE.MeshStandardMaterial({ color: 0x332519, emissive: 0x5c3004, emissiveIntensity: 0.25, roughness: 0.55 })
);
heatSource.position.set(-4.9, 0.9, -3.4);
heatSource.castShadow = true;
scene.add(heatSource);

const exchanger = new THREE.Mesh(
  new THREE.CylinderGeometry(0.65, 0.65, 1.4, 48),
  new THREE.MeshStandardMaterial({ color: 0xb87524, emissive: 0x6b3200, emissiveIntensity: 0.22, roughness: 0.35, metalness: 0.25 })
);
exchanger.position.set(-3.5, 1.1, -2.2);
exchanger.rotation.z = Math.PI / 2;
exchanger.castShadow = true;
scene.add(exchanger);

const heatPipe = makePipe([
  new THREE.Vector3(-4.2, 1.0, -3.1),
  new THREE.Vector3(-3.5, 1.2, -2.2),
  new THREE.Vector3(-2.6, 1.4, -1.4),
  new THREE.Vector3(-2.4, 2.2, -0.4)
], 0xe5aa4b, 0x5c3004);
scene.add(heatPipe);

const scrubber = new THREE.Mesh(
  new THREE.CylinderGeometry(0.64, 0.72, 2.6, 48),
  new THREE.MeshStandardMaterial({ color: 0x23443a, roughness: 0.5, metalness: 0.2 })
);
scrubber.position.set(5.1, 2.82, 0);
scrubber.castShadow = true;
scene.add(scrubber);

const phbReactor = new THREE.Mesh(
  new THREE.SphereGeometry(0.9, 48, 24),
  new THREE.MeshPhysicalMaterial({ color: 0x46d0d8, transparent: true, opacity: 0.5, roughness: 0.2, transmission: 0.18 })
);
phbReactor.position.set(4.6, 1.35, -3.5);
phbReactor.castShadow = true;
scene.add(phbReactor);

const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0x70a7ff, emissive: 0x163a7a, emissiveIntensity: 0.7 });
const sensors = [
  [-1.7, 2.8, 1.72],
  [1.6, 1.8, 1.82],
  [0.1, 3.5, -1.95]
].map(([x, y, z]) => {
  const sensor = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 12), sensorMaterial);
  sensor.position.set(x, y, z);
  tankGroup.add(sensor);
  return sensor;
});

const particleGroup = new THREE.Group();
scene.add(particleGroup);

function makeParticle(color, size) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(size, 16, 8),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.15, roughness: 0.45 })
  );
}

const sludgeParticles = Array.from({ length: 90 }, () => {
  const particle = makeParticle(0x8b6a3e, 0.035 + Math.random() * 0.035);
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * 2.0;
  particle.position.set(Math.cos(angle) * radius, 0.65 + Math.random() * 1.65, Math.sin(angle) * radius);
  particle.userData = { angle, radius, speed: 0.2 + Math.random() * 0.35, phase: Math.random() * Math.PI * 2 };
  particleGroup.add(particle);
  return particle;
});

const bubbles = Array.from({ length: 38 }, () => {
  const bubble = makeParticle(0x51c878, 0.045 + Math.random() * 0.055);
  bubble.material.transparent = true;
  bubble.material.opacity = 0.72;
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * 1.8;
  bubble.position.set(Math.cos(angle) * radius, 1 + Math.random() * 3.2, Math.sin(angle) * radius);
  bubble.userData = { radius, angle, speed: 0.6 + Math.random() * 0.8 };
  particleGroup.add(bubble);
  return bubble;
});

const flowDots = [];
function addFlowDot(pathPoints, color, size = 0.07) {
  const dot = makeParticle(color, size);
  dot.userData = {
    curve: new THREE.CatmullRomCurve3(pathPoints),
    offset: Math.random(),
    speed: 0.08 + Math.random() * 0.06
  };
  scene.add(dot);
  flowDots.push(dot);
}

for (let i = 0; i < 18; i += 1) {
  addFlowDot(coilPoints, 0xe5aa4b, 0.055);
}
for (let i = 0; i < 14; i += 1) {
  addFlowDot([
    new THREE.Vector3(0, 4.62, 0),
    new THREE.Vector3(0.5, 5.2, 0),
    new THREE.Vector3(3.2, 5.2, 0),
    new THREE.Vector3(4.9, 4.1, 0)
  ], 0x51c878, 0.06);
}
for (let i = 0; i < 12; i += 1) {
  addFlowDot([
    new THREE.Vector3(4.9, 4.1, 0),
    new THREE.Vector3(6.0, 3.5, -1.1),
    new THREE.Vector3(6.0, 2.1, -2.6),
    new THREE.Vector3(4.8, 1.4, -3.4)
  ], 0x46d0d8, 0.055);
}

const labelTexture = new THREE.CanvasTexture(makeLabelCanvas("37°C Mesophilic Zone"));
const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture, transparent: true }));
labelSprite.position.set(0, 5.15, 0.2);
labelSprite.scale.set(2.8, 0.7, 1);
scene.add(labelSprite);

function makeLabelCanvas(text) {
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 128;
  const context = labelCanvas.getContext("2d");
  context.fillStyle = "rgba(8,17,14,0.82)";
  context.strokeStyle = "rgba(81,200,120,0.65)";
  context.lineWidth = 5;
  context.roundRect(12, 18, 488, 84, 18);
  context.fill();
  context.stroke();
  context.fillStyle = "#ecf7f1";
  context.font = "700 34px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 62);
  return labelCanvas;
}

let running = true;
let clock = new THREE.Clock();

function updateStatus() {
  const temperature = Number(temperatureSlider.value);
  const load = Number(loadSlider.value);
  const tempDistance = Math.abs(temperature - 37);
  const tooHot = temperature >= 43;
  const overloaded = load >= 82;

  temperatureText.textContent = `${temperature.toFixed(1)}°C`;
  loadText.textContent = `${load}%`;

  methaneScore.textContent = tempDistance < 2.2 && load < 78 ? "High" : tempDistance < 5 && !tooHot ? "Moderate" : "Low";
  riskScore.textContent = tooHot || overloaded ? "High" : tempDistance > 4 || load > 74 ? "Watch" : "Stable";
  phbScore.textContent = methaneScore.textContent === "Low" ? "Limited" : "Active";
  gateScore.textContent = tooHot || overloaded ? "Bypass" : "Open";

  const riskColor = riskScore.textContent === "High" ? "var(--red)" : riskScore.textContent === "Watch" ? "var(--gold)" : "var(--green)";
  riskScore.style.color = riskColor;
  gateScore.style.color = gateScore.textContent === "Bypass" ? "var(--red)" : "var(--green)";
  methaneScore.style.color = methaneScore.textContent === "High" ? "var(--green)" : "var(--gold)";

  const heatIntensity = THREE.MathUtils.clamp((temperature - 30) / 15, 0, 1);
  coil.material.emissiveIntensity = 0.2 + heatIntensity * 0.9;
  sludge.scale.y = 0.82 + load / 180;
}

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;
  const load = Number(loadSlider.value);
  const flowMultiplier = running ? 0.7 + load / 100 : 0;

  tankGroup.rotation.y += delta * 0.08;
  phbReactor.rotation.y += delta * 0.7;
  scrubber.rotation.y += delta * 0.35;

  sludgeParticles.forEach((particle) => {
    const data = particle.userData;
    data.angle += delta * data.speed * flowMultiplier;
    particle.position.x = Math.cos(data.angle) * data.radius;
    particle.position.z = Math.sin(data.angle) * data.radius;
    particle.position.y += Math.sin(elapsed * 1.4 + data.phase) * delta * 0.05;
  });

  bubbles.forEach((bubble) => {
    const data = bubble.userData;
    bubble.position.y += delta * data.speed * flowMultiplier;
    bubble.position.x = Math.cos(data.angle + elapsed * 0.5) * data.radius;
    bubble.position.z = Math.sin(data.angle + elapsed * 0.5) * data.radius;
    if (bubble.position.y > 4.35) {
      bubble.position.y = 1;
      data.radius = Math.sqrt(Math.random()) * 1.8;
    }
  });

  flowDots.forEach((dot) => {
    const data = dot.userData;
    data.offset = (data.offset + delta * data.speed * flowMultiplier) % 1;
    dot.position.copy(data.curve.getPointAt(data.offset));
  });

  sensors.forEach((sensor, index) => {
    const pulse = 1 + Math.sin(elapsed * 3.5 + index) * 0.18;
    sensor.scale.setScalar(pulse);
  });

  controls.update();
  renderer.render(scene, camera);
}

temperatureSlider.addEventListener("input", updateStatus);
loadSlider.addEventListener("input", updateStatus);

toggleFlow.addEventListener("click", () => {
  running = !running;
  toggleFlow.textContent = running ? "Pause Flow" : "Resume Flow";
});

resetView.addEventListener("click", () => {
  camera.position.set(7.4, 5.2, 10.5);
  controls.target.set(0, 1.1, 0);
  controls.update();
});

window.addEventListener("resize", resize);

resize();
updateStatus();
animate();
