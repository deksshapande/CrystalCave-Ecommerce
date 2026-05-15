
// TOAST NOTIFICATION


function showToast(message){

  const toast = document.createElement("div");

  toast.classList.add("toast");

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 2500);

}



// SHOP BUTTON


const shopBtn = document.getElementById("shopBtn");

if (shopBtn) {

  shopBtn.addEventListener("click", () => {

    document
      .getElementById("products")
      .scrollIntoView({
        behavior: "smooth"
      });

  });

}



// CART COUNT


function updateCartCount(){

  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const totalItems =
    cart.reduce((total, item) => {

      return total + item.quantity;

    }, 0);

  const cartCount =
    document.getElementById("cart-count");

  if(cartCount){

    cartCount.innerText = totalItems;

  }

}

updateCartCount();



// PRODUCTS


let allProducts = [];

async function loadProducts() {

  try {

    const productsSection =
      document.querySelector(".products");

    if(productsSection){

      productsSection.innerHTML = `

        <div class="loader"></div>

      `;

    }

    const res = await fetch(
      "https://crystalcave-backend.onrender.com/api/products"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await res.json();

    allProducts = products;

    displayProducts(products);

  } catch (err) {

    console.error("Error loading products:", err);

    showToast("Failed to load products ❌");

  }

}


function displayProducts(products){

  const productsSection =
    document.querySelector(".products");

  productsSection.innerHTML = "";

  if(products.length === 0){

    productsSection.innerHTML = `
      <h2 class="empty-message">
        No crystals found ✨
      </h2>
    `;

    return;

  }

  products.forEach((product) => {

    const productCard = document.createElement("a");

    productCard.href =
      `product.html?id=${product._id}`;

    productCard.classList.add("product-card");

    productCard.innerHTML = `

      <div class="product-image-wrapper">

        <img
          src="${product.image || './assets/default.png'}"
          alt="${product.name}"
        >

        <span class="product-badge">
          ${product.category || "Crystal"}
        </span>

      </div>

      <div class="info">

        <h3>${product.name}</h3>

        <p>₹${product.price}</p>

      </div>

    `;

    productsSection.appendChild(productCard);

  });

}


// LOAD PRODUCTS
loadProducts();



// SEARCH


const searchInput =
  document.getElementById("searchInput");

if(searchInput){

  searchInput.addEventListener("input", () => {

    const searchValue =
      searchInput.value.toLowerCase();

    const filteredProducts =
      allProducts.filter(product =>

        product.name
          .toLowerCase()
          .includes(searchValue)

      );

    displayProducts(filteredProducts);

  });

}



// FILTERS


const filterButtons =
  document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    document
      .querySelector(".filter-btn.active")
      ?.classList.remove("active");

    button.classList.add("active");

    const category =
      button.dataset.category;

    if(category === "All"){

      displayProducts(allProducts);

      return;

    }

    const filteredProducts =
      allProducts.filter(product =>

        product.category === category

      );

    displayProducts(filteredProducts);

  });

});



// PAYPAL


if(typeof paypal !== "undefined"){

paypal.Buttons({

  async createOrder() {

    const response = await fetch(

      "https://crystalcave-backend.onrender.com/api/paypal/create-order",

      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          amount: "10.00"

        })

      }

    );

    const order = await response.json();

    return order.id;

  },

  async onApprove(data) {

    const response = await fetch(

      "https://crystalcave-backend.onrender.com/api/paypal/capture-order",

      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          orderID: data.orderID

        })

      }

    );

    const details = await response.json();

    console.log(details);

    showToast(
      "Payment successful 🌸"
    );

  },

  onError(err) {

    console.error(err);

    showToast(
      "Payment failed ❌"
    );

  }

}).render("#paypal-button-container");

}



// CONTACT FORM


const contactForm =
  document.getElementById("contactForm");

if (contactForm) {

  contactForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const name =
        e.target[0].value;

      const email =
        e.target[1].value;

      const message =
        e.target[2].value;

      try {

        const res = await fetch(
          "https://crystalcave-backend.onrender.com/api/contact",
          {

            method: "POST",

            headers: {
              "Content-Type":
              "application/json"
            },

            body: JSON.stringify({
              name,
              email,
              message
            })

          }
        );

        const data = await res.json();

        showToast(data.message);

        e.target.reset();

      } catch (err) {

        console.error(err);

        showToast(
          "Something went wrong ❌"
        );

      }

    }
  );

}