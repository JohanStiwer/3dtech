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

function renderProducts(filter = "all") {
  grid.innerHTML = "";

  products
    .filter((p) => filter === "all" || p.niche === filter)
    .forEach((product) => {
      const card = document.createElement("div");
      card.className =
        "product-card bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden";

      card.innerHTML = `
          <img
            src="${product.image}"
            alt="${product.name}"
            class="w-full h-48 object-cover"
          />

          <div class="p-6 text-center">
            <h3 class="text-xl font-semibold mb-2">
              ${product.name}
            </h3>

            <p class="text-gray-600 mb-4">
              ${product.description}
            </p>

            <a
              href="https://wa.me/573026978100?text=${encodeURIComponent(product.whatsappText)}"
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
}
renderProducts();

const buttons = document.querySelectorAll(".filter-btn");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    buttons.forEach((b) => b.classList.remove("bg-indigo-600", "text-white"));
    btn.classList.add("bg-indigo-600", "text-white");
    renderProducts(filter);
  });
});

// ===============================
// FILTRO DESDE URL (?cat=)
// ===============================
const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("cat");

if (categoryFromUrl) {
  renderProducts(categoryFromUrl);

  // Activar botón visualmente
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("bg-indigo-600", "text-white");

    if (btn.dataset.filter === categoryFromUrl) {
      btn.classList.add("bg-indigo-600", "text-white");
    }
  });
}
