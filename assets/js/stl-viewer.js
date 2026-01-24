import * as THREE from "three";
import { STLLoader } from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/STLLoader.js";

const container = document.getElementById("llavero-viewer");

if (!container) {
  console.error("No se encontró el div #llavero-viewer");
} else {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf3f4f6);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(5, 5, 5);
  scene.add(light);

  const loader = new STLLoader();

  loader.load("assets/models/demo.stl", (geometry) => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      metalness: 0.2,
      roughness: 0.8,
    });
    const mesh = new THREE.Mesh(geometry, material);
    // 1️⃣ Centrar geometría
    geometry.center();
    // 2️⃣ Escalar automáticamente
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);
    const scale = 40 / Math.max(size.x, size.y, size.z);
    mesh.scale.setScalar(scale);
    // 3️⃣ Rotación inicial (UNA SOLA VEZ)
    mesh.rotation.x = -Math.PI / 4;
    mesh.rotation.y = Math.PI / 4;
    // 4️⃣ Cámara
    camera.position.set(0, 0, 80);
    camera.lookAt(0, 0, 0);
    scene.add(mesh);
    // 5️⃣ Animación limpia (solo suma)
    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.01;
      mesh.rotation.x += 0.005;
      renderer.render(scene, camera);
    }
    animate();
  });
}
