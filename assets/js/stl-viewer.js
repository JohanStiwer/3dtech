import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { STLLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/STLLoader.js";

/* ===============================
   MAPA DE VIEWERS
================================ */
const viewers = new Map();

/* ===============================
   FUNCIÓN GLOBAL PARA CAMBIAR COLOR
================================ */
function changeViewerColor(button, hexColor) {
  const card = button.closest(".bg-white");
  const viewer = card.querySelector(".viewer");

  const viewerData = viewers.get(viewer);
  if (viewerData) {
    viewerData.material.color.set(hexColor);
  }
}
window.changeViewerColor = changeViewerColor;

/* ===============================
   CREAR VIEWER
================================ */
function createViewer(container, modelPath) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 0, 80);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(container.clientWidth, container.clientHeight);

  container.appendChild(renderer.domElement);

  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  const loader = new STLLoader();

  loader.load(modelPath, (geometry) => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.2,
      roughness: 0.8,
    });

    const mesh = new THREE.Mesh(geometry, material);

    geometry.center();

    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);

    const scale = 40 / Math.max(size.x, size.y, size.z);
    mesh.scale.setScalar(scale);

    mesh.rotation.x = -Math.PI / 4;
    mesh.rotation.y = Math.PI / 4;

    scene.add(mesh);

    viewers.set(container, { material });

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.01;
      mesh.rotation.x += 0.005;
      renderer.render(scene, camera);
    }

    animate();
  });
}

/* ===============================
   INICIALIZAR TODOS LOS VIEWERS
================================ */
document.querySelectorAll(".viewer").forEach((viewer) => {
  const model = viewer.dataset.model;
  createViewer(viewer, model);
});
