import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzYesdT-95K86IbvyUCPDy0BvGJBtn7Jk",
  authDomain: "shivkirana-bcd14.firebaseapp.com",
  projectId: "shivkirana-bcd14",
  storageBucket: "shivkirana-bcd14.firebasestorage.app",
  messagingSenderId: "523436780783",
  appId: "1:523436780783:web:035259590762be0cb3bf1a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// EDIT HERE - SHOP NAME
const SHOP_NAME = "Shiv Kirana";
// EDIT HERE - WHATSAPP NUMBER
const WHATSAPP_NUMBER = "919999999999";

document.querySelector(".brand").textContent = SHOP_NAME;
document.title = `${SHOP_NAME} | Fresh Grocery`;

const state = {
  categories: [],
  products: [],
  selectedCategory: "All",
  search: "",
  cart: JSON.parse(localStorage.getItem("shiv_kirana_cart") || "[]"),
};

const categoriesEl = document.getElementById("categories");
const gridEl = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartBadge = document.getElementById("cartBadge");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutModal = document.getElementById("checkoutModal");
const chatbox = document.getElementById("chatbox");

function inr(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function persistCart() {
  localStorage.setItem("shiv_kirana_cart", JSON.stringify(state.cart));
}

function renderCategories() {
  const all = ["All", ...state.categories.map((x) => x.name)];
  categoriesEl.innerHTML = all
    .map(
      (name) => `<button class="pill ${state.selectedCategory === name ? "active" : ""}" data-cat="${name}">${name}</button>`
    )
    .join("");
}

function renderProducts() {
  const filtered = state.products.filter((p) => {
    const byCategory = state.selectedCategory === "All" || p.category === state.selectedCategory;
    const bySearch = p.name.toLowerCase().includes(state.search.toLowerCase());
    return byCategory && bySearch;
  });

  if (!filtered.length) {
    gridEl.innerHTML = `<div class="muted">No products found for your filter.</div>`;
    return;
  }

  gridEl.innerHTML = filtered
    .map(
      (p) => `<article class="card">
      <img class="card-image" src="${p.image || "https://placehold.co/600x400?text=No+Image"}" alt="${p.name}" />
      <div class="card-body">
        <div class="title-row">
          <h4>${p.name}</h4>
          <span class="price">${inr(Number(p.price || 0))}</span>
        </div>
        <div class="meta">
          <span>${p.category}</span>
          <span class="stock ${Number(p.quantity || 0) > 0 ? "in" : "out"}">${Number(p.quantity || 0) > 0 ? `In stock (${p.quantity})` : "Out of stock"}</span>
        </div>
        <button class="btn btn-primary" data-add="${p.id}" style="margin-top:0.7rem; width:100%;" ${Number(p.quantity || 0) <= 0 ? "disabled" : ""}>Add to Cart</button>
      </div>
    </article>`
    )
    .join("");
}

function getCartSummary() {
  return state.cart.reduce(
    (acc, item) => {
      acc.count += item.qty;
      acc.total += item.qty * Number(item.price || 0);
      return acc;
    },
    { count: 0, total: 0 }
  );
}

function renderCart() {
  const { count, total } = getCartSummary();
  cartBadge.textContent = count;
  cartTotalEl.textContent = inr(total);

  if (!state.cart.length) {
    cartItemsEl.innerHTML = `<p class="muted">Your cart is empty.</p>`;
    return;
  }

  cartItemsEl.innerHTML = state.cart
    .map(
      (item) => `<div class="cart-row">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <strong>${item.name}</strong>
        <div class="muted">${inr(Number(item.price || 0))}</div>
        <div class="qty">
          <button data-dec="${item.id}">-</button>
          <span>${item.qty}</span>
          <button data-inc="${item.id}">+</button>
        </div>
      </div>
      <button data-remove="${item.id}" class="btn btn-danger">✕</button>
    </div>`
    )
    .join("");
}

function addToCart(product) {
  const found = state.cart.find((c) => c.id === product.id);
  if (found) found.qty += 1;
  else state.cart.push({ id: product.id, name: product.name, price: Number(product.price), image: product.image, qty: 1 });
  persistCart();
  renderCart();
}

function updateQty(id, diff) {
  const item = state.cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += diff;
  if (item.qty <= 0) state.cart = state.cart.filter((c) => c.id !== id);
  persistCart();
  renderCart();
}

function removeItem(id) {
  state.cart = state.cart.filter((c) => c.id !== id);
  persistCart();
  renderCart();
}

function toggleDrawer(open) {
  cartDrawer.classList.toggle("open", open);
  overlay.classList.toggle("show", open || checkoutModal.classList.contains("show"));
}

function toggleModal(open) {
  checkoutModal.classList.toggle("show", open);
  overlay.classList.toggle("show", open || cartDrawer.classList.contains("open"));
}

function generateWhatsAppText() {
  const name = document.getElementById("cName").value.trim();
  const phone = document.getElementById("cPhone").value.trim();
  const address = document.getElementById("cAddress").value.trim();
  if (!name || !phone || !address) return null;

  const items = state.cart
    .map((item, i) => `${i + 1}. ${item.name} x${item.qty} = ${inr(item.qty * Number(item.price || 0))}`)
    .join("\n");

  const rawMessage = `Hello ${SHOP_NAME},

Order Details:
${items}

Total: ${cartTotalEl.textContent}

Customer:
Name: ${name}
Phone: ${phone}
Address: ${address}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(rawMessage)}`;
}

onSnapshot(query(collection(db, "categories"), orderBy("createdAt", "asc")), (snap) => {
  state.categories = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  renderCategories();
});

onSnapshot(query(collection(db, "products"), orderBy("createdAt", "desc")), (snap) => {
  state.products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  renderProducts();
});

categoriesEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".pill");
  if (!btn) return;
  state.selectedCategory = btn.dataset.cat;
  renderCategories();
  renderProducts();
});

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  renderProducts();
});

gridEl.addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  const product = state.products.find((p) => p.id === id);
  if (product) addToCart(product);
});

cartItemsEl.addEventListener("click", (e) => {
  if (e.target.dataset.inc) updateQty(e.target.dataset.inc, 1);
  if (e.target.dataset.dec) updateQty(e.target.dataset.dec, -1);
  if (e.target.dataset.remove) removeItem(e.target.dataset.remove);
});

document.getElementById("cartToggle").onclick = () => toggleDrawer(true);
document.getElementById("closeCart").onclick = () => toggleDrawer(false);
document.getElementById("checkoutBtn").onclick = () => {
  if (!state.cart.length) return;
  toggleModal(true);
};
document.getElementById("closeModal").onclick = () => toggleModal(false);
overlay.onclick = () => {
  toggleDrawer(false);
  toggleModal(false);
};

document.getElementById("placeOrder").onclick = () => {
  const url = generateWhatsAppText();
  if (!url) return alert("Please fill all checkout details.");
  window.open(url, "_blank");
};

document.getElementById("chatToggle").onclick = () => chatbox.classList.toggle("open");
document.querySelectorAll(".chat-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.action;
    const response = {
      products: "Browse products below and use search/category filter for quick finding.",
      order: "Add products to cart, click checkout, and confirm via WhatsApp.",
      delivery: "Deliveries are typically completed same day within nearby local area.",
      contact: `Call or WhatsApp us: +${WHATSAPP_NUMBER}`,
    };
    document.getElementById("chatResponse").textContent = response[key];
  });
});

renderCart();
renderCategories();
renderProducts();
