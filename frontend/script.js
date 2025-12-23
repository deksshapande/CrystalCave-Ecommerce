// Shop Now button (dummy)
document.getElementById("shopBtn").addEventListener("click", () => {
  alert("Welcome! Product functionality coming soon 🌸");
});

// Function to fetch products from backend
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");

    const products = await res.json();
    const productsSection = document.querySelector(".products");
    productsSection.innerHTML = ""; // Clear static content

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <img src="${product.image || './assets/default.png'}" alt="${product.name}">
        <div class="info">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        </div>
      `;

      productsSection.appendChild(productCard);
    });
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// Load products on page load
loadProducts();

// ✅ Initialize PayPal Sandbox Button
paypal.Buttons({
  createOrder: function (data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '2.50' // change this to any USD amount for demo
        },
        description: 'CrystalCave 💎🌸 Demo Product'
      }]
    });
  },
  onApprove: function (data, actions) {
    return actions.order.capture().then(function (details) {
      alert('Payment successful! Thank you, ' + details.payer.name.given_name + ' 🌸');
      console.log('Payment Details:', details);
    });
  },
  onError: function (err) {
    console.error(err);
    alert('Something went wrong during payment.');
  }
}).render('#paypal-button-container');
