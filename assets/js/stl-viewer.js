import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js";

/* ===============================
   CONFIGURACIÓN INICIAL
================================ */
const MODEL_LIBRARY = {
  llaveros: ["keychain_gear.glb", "keychain_logo.glb", "keychain_logo.glb"],
  imanes: ["magnet_cube.glb", "magnet_heart.glb", "magnet_star.glb"],
  tecnico: ["pokemon_single.glb", "pokemon_single.glb", "pokemon_single.glb"],
};

const INITIAL_COLORS = ["#6366F1", "#EF4444", "#22C55E", "#1F2937", "#F59E0B"];
const viewers = new Map();

// Función para obtener elemento aleatorio
const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

/* ===============================
   CONTROLADOR DE COLOR GLOBAL
================================ */
window.changeViewerColor = function (button, hexColor) {
  const card = button.closest(".bg-white");
  const viewerContainer = card.querySelector(".viewer");
  const viewerData = viewers.get(viewerContainer);

  if (viewerData && viewerData.material) {
    viewerData.material.color.set(hexColor);
  }
};

/* ===============================
   CREAR INSTANCIA DE VISOR
================================ */
function createViewer(container, category) {
  // 1. Escena y Cámara
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 15, 50); // Posición inicial de la cámara

  // 2. Renderizador
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 3. Iluminación Profesional
  scene.add(new THREE.AmbientLight(0xffffff, 0.8)); // Luz base
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 15, 10);
  scene.add(dirLight);

  // Luz de apoyo desde abajo para resaltar detalles
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  scene.add(hemiLight);

  // 4. Carga de Modelo Aleatorio
  const modelFile = getRandom(MODEL_LIBRARY[category]);
  const modelPath = `assets/models/${modelFile}`;
  const startColor = getRandom(INITIAL_COLORS);

  const loader = new GLTFLoader();

  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      let mainMaterial = null;

      // 1. Aplicar Material, Color y Centrar Geometría
      model.traverse((node) => {
        if (node.isMesh) {
          // RE-AÑADIDO: Creamos el material con el color aleatorio
          node.material = new THREE.MeshStandardMaterial({
            color: startColor,
            metalness: 0.3,
            roughness: 0.7,
          });
          mainMaterial = node.material; // Guardamos la referencia para el selector
          node.geometry.center();
        }
      });

      // 2. Ajustamos el escalado
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 22 / maxDim;
      model.scale.setScalar(scale);

      // 3. Posicionamiento del modelo
      model.position.set(0, 2, 0);
      scene.add(model);

      // 4. Configuración de Cámara
      camera.position.set(0, 18, 50);
      camera.lookAt(0, 2, 0);

      // IMPORTANTE: Guardamos el material en el Map para que los botones funcionen
      viewers.set(container, { material: mainMaterial });

      // 5. Animación
      function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    },
    undefined,
    (error) => {
      console.error("Error cargando modelo:", modelPath, error);
    },
  );

  // 6. Manejo de Resize
  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}

/* ===============================
   INICIALIZACIÓN AL CARGAR
================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".viewer").forEach((viewer) => {
    const category = viewer.dataset.category;
    if (category && MODEL_LIBRARY[category]) {
      createViewer(viewer, category);
    }
  });
});
