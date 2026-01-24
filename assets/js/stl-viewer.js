import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { STLLoader } from "https://unpkg.com/three@0.158.0/examples/jsm/loaders/STLLoader.js";

let scene, camera, renderer;
let mesh;
let material;

/* ===============================
   FUNCIÓN GLOBAL PARA EL HTML
================================ */
function changeColor(hexColor) {
  if (material) {
    material.color.set(hexColor);
  }
}
window.changeColor = changeColor;

/* ===============================
   ESCENA
================================ */
scene = new THREE.Scene();

/* ===============================
   CÁMARA
================================ */
camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(0, 0, 80);
camera.lookAt(0, 0, 0);

/* ===============================
   RENDERER (FONDO TRANSPARENTE)
================================ */
renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(300, 200);

/* ===============================
   CONTENEDOR HTML
================================ */
const container = document.getElementById("llavero-viewer");
container.appendChild(renderer.domElement);

/* ===============================
   LUCES
================================ */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

/* ===============================
   CARGA DEL STL
================================ */
const loader = new STLLoader();

loader.load("assets/models/demo.stl", (geometry) => {
  material = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    metalness: 0.2,
    roughness: 0.8,
  });

  mesh = new THREE.Mesh(geometry, material);

  // Centrar geometría
  geometry.center();

  // Escalar automáticamente
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);

  const scale = 40 / Math.max(size.x, size.y, size.z);
  mesh.scale.setScalar(scale);

  // Asegurar centrado visual
  mesh.position.set(0, 0, 0);

  // Rotación inicial (vista 3D clara)
  mesh.rotation.x = -Math.PI / 4;
  mesh.rotation.y = Math.PI / 4;

  scene.add(mesh);

  animate();
});

/* ===============================
   ANIMACIÓN
================================ */
function animate() {
  requestAnimationFrame(animate);

  if (mesh) {
    mesh.rotation.y += 0.01;
    mesh.rotation.x += 0.005;
  }

  renderer.render(scene, camera);
}
