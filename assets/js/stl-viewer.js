import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { STLLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/STLLoader.js";

/* ===============================
   ORIENTACIÓN DE LOS MODELOS 
================================ */
const MODEL_ORIENTATIONS = {
  "demo.stl": {
    rotation: [0, 0, 0],
  },
  "cubone.stl": {
    rotation: [Math.PI / 2, Math.PI, 2],
  },
  "mew.stl": {
    rotation: [Math.PI / 2, Math.PI, 0],
  },
};

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
  camera.position.set(0, 15, 80);
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
    const pivot = new THREE.Group();
    scene.add(pivot);

    const mesh = new THREE.Mesh(geometry, material);

    geometry.center();

    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);

    const scale = 40 / Math.max(size.x, size.y, size.z);
    mesh.scale.setScalar(scale);

    const modelName = modelPath.split("/").pop();
    const orientation = MODEL_ORIENTATIONS[modelName];

    if (orientation) {
      mesh.rotation.set(
        orientation.rotation[0],
        orientation.rotation[1],
        orientation.rotation[2],
      );
    } else {
      mesh.rotation.set(0, 0, 0);
    }

    pivot.add(mesh);

    const base = new THREE.Mesh(
      new THREE.CircleGeometry(20, 64),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    base.rotation.x = -Math.PI / 2;
    scene.add(base);

    viewers.set(container, { material });

    function animate() {
      requestAnimationFrame(animate);
      const ROTATION_SPEED = 0.01; // suave y profesional
      pivot.rotation.y += ROTATION_SPEED;
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
