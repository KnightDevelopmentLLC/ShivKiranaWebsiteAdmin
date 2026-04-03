Build a complete grocery store website system named "Shiv Kirana" using HTML, CSS, and Vanilla JavaScript.

This project MUST have 2 pages:

1. index.html (Customer side)
2. admin.html (Admin dashboard)

---

🔥 CORE REQUIREMENTS

- Use Firebase Firestore (for products + categories)
- Use Cloudinary (for image upload + storage)
- Fully functional (no bugs)
- Clean + modern + premium UI (IMPORTANT)
- Lightweight but visually attractive
- Fully mobile responsive

---

🎨 UI / DESIGN REQUIREMENTS (VERY IMPORTANT)

The website must look premium and modern like a real startup product.

- Use soft color palette (light background + accent color)
- Rounded cards (border-radius 12px–20px)
- Smooth hover animations (scale, shadow)
- Subtle shadows (not heavy)
- Clean spacing (padding & margins)
- Sticky navbar with blur effect
- Smooth transitions (0.2–0.3s)
- Use modern font (Poppins / Inter / system-ui)

Make it visually appealing enough to SELL to clients.

---

📦 FIREBASE CONFIG

Use this config (already integrated):

const firebaseConfig = {
apiKey: "AIzaSyAzYesdT-95K86IbvyUCPDy0BvGJBtn7Jk",
authDomain: "shivkirana-bcd14.firebaseapp.com",
projectId: "shivkirana-bcd14",
storageBucket: "shivkirana-bcd14.firebasestorage.app",
messagingSenderId: "523436780783",
appId: "1:523436780783:web:035259590762be0cb3bf1a"
};

---

🛒 INDEX.HTML (CUSTOMER SIDE)

1. HEADER (Premium)

- Shop Name
- Search bar (live)
- Cart icon with badge
- Sticky + blur background

2. CATEGORY FILTER

- Dynamic from Firebase
- Pill-style buttons
- Active highlight

3. PRODUCT GRID

- Card design:
  
  - Image (Cloudinary)
  - Name
  - Price
  - Category tag
  - Stock badge

- Hover:
  
  - Slight scale
  - Shadow increase

4. CART SYSTEM (Smooth UI)

- Slide-in cart drawer (right side)
- Quantity control (+ / -)
- Remove button
- Total calculation
- Save in localStorage

5. CHECKOUT MODAL (Styled)

- Name
- Phone
- Address
- CTA button: WhatsApp order

6. CHATBOT (MODERN UI)

- Floating button (bottom-left)
- Glassmorphism panel
- Smooth open animation

Options:

- View Products
- Order Help
- Delivery Info
- Contact

---

⚙️ ADMIN.HTML (ADMIN PANEL)

1. Dashboard style UI (clean + minimal)

2. CATEGORY MANAGEMENT

- Add category
- Delete category
- Show list

3. PRODUCT MANAGEMENT FORM

- Name
- Category dropdown
- Price
- Quantity
- Image upload

4. CLOUDINARY UPLOAD (IMPORTANT)

- Upload image via API
- Get secure_url
- Save in Firebase

---

📦 FIREBASE STRUCTURE

Collection: products
{
name,
category,
price,
quantity,
image,
createdAt
}

Collection: categories
{
name,
createdAt
}

---

📸 CLOUDINARY

// EDIT HERE - CLOUDINARY
cloud_name = "your_cloud_name"
upload_preset = "your_unsigned_preset"

---

📌 EDIT MARKERS

// EDIT HERE - SHOP NAME
// EDIT HERE - WHATSAPP NUMBER
// EDIT HERE - CLOUDINARY CONFIG

---

🧪 FINAL CHECK

- UI looks premium
- Add product works
- Categories sync
- Images upload properly
- Cart smooth
- WhatsApp works
- No console errors

---

🎯 GOAL

A SELLABLE product:

- Looks premium
- Works fast
- Easy for shop owners
- Easy for customers
