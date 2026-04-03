import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
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

// EDIT HERE - CLOUDINARY CONFIG
const CLOUDINARY = {
  cloud_name: "dfmzotwnn",
  upload_preset: "shivkirana",
};

const catInput = document.getElementById("catInput");
const categoryList = document.getElementById("categoryList");
const catSelect = document.getElementById("pCategory");
const statusEl = document.getElementById("adminStatus");
const productRows = document.getElementById("productRows");

const state = { categories: [], products: [] };

async function uploadImage(file) {
  if (!file) throw new Error("Please select an image.");
  if (CLOUDINARY.cloud_name === "your_cloud_name" || CLOUDINARY.upload_preset === "your_unsigned_preset") {
    throw new Error("Update Cloudinary config in admin.js first.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY.upload_preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloud_name}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Image upload failed.");
  const data = await res.json();
  return data.secure_url;
}

function renderCategories() {
  catSelect.innerHTML = state.categories.length
    ? state.categories.map((c) => `<option value="${c.name}">${c.name}</option>`).join("")
    : `<option value="">No categories</option>`;

  categoryList.innerHTML = state.categories.length
    ? state.categories
        .map(
          (c) => `<div class="list-item"><span>${c.name}</span><button class="btn btn-danger" data-del-cat="${c.id}">Delete</button></div>`
        )
        .join("")
    : `<p class="muted">No categories yet.</p>`;
}

function renderProducts() {
  productRows.innerHTML = state.products.length
    ? state.products
        .map(
          (p) => `<tr>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>₹${Number(p.price || 0)}</td>
      <td>${Number(p.quantity || 0)}</td>
      <td><button class="btn btn-danger" data-del-product="${p.id}">Delete</button></td>
    </tr>`
        )
        .join("")
    : `<tr><td colspan="5" class="muted">No products yet.</td></tr>`;
}

document.getElementById("addCategory").addEventListener("click", async () => {
  const name = catInput.value.trim();
  if (!name) return;
  await addDoc(collection(db, "categories"), { name, createdAt: serverTimestamp() });
  catInput.value = "";
});

categoryList.addEventListener("click", async (e) => {
  const id = e.target.dataset.delCat;
  if (!id) return;
  await deleteDoc(doc(db, "categories", id));
});

document.getElementById("addProduct").addEventListener("click", async () => {
  const name = document.getElementById("pName").value.trim();
  const category = catSelect.value;
  const price = Number(document.getElementById("pPrice").value);
  const quantity = Number(document.getElementById("pQty").value);
  const file = document.getElementById("pImage").files[0];

  if (!name || !category || !price || Number.isNaN(quantity)) {
    statusEl.textContent = "Fill all product details.";
    return;
  }

  try {
    statusEl.textContent = "Uploading image...";
    const image = await uploadImage(file);
    statusEl.textContent = "Saving product...";

    await addDoc(collection(db, "products"), {
      name,
      category,
      price,
      quantity,
      image,
      createdAt: serverTimestamp(),
    });

    statusEl.textContent = "Product added successfully.";
    ["pName", "pPrice", "pQty", "pImage"].forEach((id) => (document.getElementById(id).value = ""));
  } catch (err) {
    statusEl.textContent = err.message;
  }
});

productRows.addEventListener("click", async (e) => {
  const id = e.target.dataset.delProduct;
  if (!id) return;
  await deleteDoc(doc(db, "products", id));
});

onSnapshot(query(collection(db, "categories"), orderBy("createdAt", "asc")), (snap) => {
  state.categories = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderCategories();
});

onSnapshot(query(collection(db, "products"), orderBy("createdAt", "desc")), (snap) => {
  state.products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderProducts();
});
