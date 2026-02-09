const products = [
  {
    name: "Llaveros corporativos",
    niche: "empresarial",
    description: "Ideales para marcas, eventos y merchandising.",
    image: "assets/images/products/llavero.jpg",
    whatsappText: "Hola, quiero cotizar llaveros corporativos",
  },
  {
    name: "Imanes publicitarios",
    niche: "empresarial",
    description: "Publicidad útil para tu marca.",
    image: "assets/images/products/iman.jpg",
    whatsappText: "Hola, quiero cotizar imanes publicitarios",
  },
  {
    name: "Soportes para celular",
    niche: "hogar",
    description: "Diseño funcional y decorativo.",
    image: "assets/images/products/soporte-celular.jpg",
    whatsappText: "Hola, quiero cotizar un soporte para celular",
  },
  {
    name: "Organizadores 3D",
    niche: "hogar",
    description: "Soluciones personalizadas para tu espacio.",
    image: "assets/images/products/organizador.jpg",
    whatsappText: "Hola, quiero cotizar organizadores 3D",
  },
  {
    name: "Piezas técnicas",
    niche: "tecnico",
    description: "Repuestos y piezas funcionales a medida.",
    image: "assets/images/products/pieza-tecnica.jpg",
    whatsappText: "Hola, quiero cotizar una pieza técnica",
  },
  {
    name: "Prototipos personalizados",
    niche: "tecnico",
    description: "Desarrollo y pruebas de productos.",
    image: "assets/images/products/prototipo.jpg",
    whatsappText: "Hola, quiero cotizar un prototipo 3D",
  },
];

const grid = document.getElementById("products-grid");

// ===============================
// RENDER PRODUCTOS
// ===============================
window.renderProducts = function (filter = "all") {
  grid.innerHTML = "";

  products
    .filter((p) => filter === "all" || p.niche === filter)
    .forEach((product) => {
      const card = document.createElement("div");
      card.id = product.name;

      card.className =
        "bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden";

      card.innerHTML = `
        <img
          src="${product.image}"
          alt="${product.name}"
          class="w-full h-48 object-cover"
        />
        <div class="p-6 text-center">
          <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
          <p class="text-gray-600 mb-4">${product.description}</p>
          <a
            href="https://wa.me/573026978100?text=${encodeURIComponent(
              product.whatsappText,
            )}"
            target="_blank"
            class="inline-block bg-green-500 text-white px-6 py-2 rounded-lg
                   font-semibold hover:bg-green-600 transition"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
};

renderProducts();

// ===============================
// SCROLL A PRODUCTO
// ===============================
window.scrollToProduct = function (productName) {
  renderProducts("all");

  setTimeout(() => {
    const element = document.getElementById(productName);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("ring-2", "ring-indigo-500");

      setTimeout(() => {
        element.classList.remove("ring-2", "ring-indigo-500");
      }, 1500);
    }
  }, 100);
};

// ===============================
// SIDEBAR DRAWER
// ===============================
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("menuOverlay");
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");

window.closeSideMenu = function () {
  sideMenu.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
};

openBtn.addEventListener("click", () => {
  sideMenu.classList.remove("-translate-x-full");
  overlay.classList.remove("hidden");
});

closeBtn.addEventListener("click", closeSideMenu);
overlay.addEventListener("click", closeSideMenu);

// ===============================
// SUBMENÚ CATÁLOGO
// ===============================
const catalogSubmenu = document.getElementById("catalogSubmenu");
const catalogArrow = document.getElementById("catalogArrow");

window.toggleCatalogMenu = function () {
  catalogSubmenu.classList.toggle("hidden");
  catalogArrow.textContent = catalogArrow.textContent === "▸" ? "▾" : "▸";
};
