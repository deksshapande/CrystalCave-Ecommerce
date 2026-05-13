const cartItemsContainer =
  document.getElementById("cart-items");

const cartTotal =
  document.getElementById("cart-total");

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];



// TOAST


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



// CART COUNT


function updateCartCount(){

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



// RENDER CART


function renderCart() {

  cartItemsContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {

    cartItemsContainer.innerHTML = `
      <h2 class="empty-message">
        Your cart is empty 🌸
      </h2>
    `;

    cartTotal.innerText = "Total: ₹0";

    updateCartCount();

    return;

  }

  cart.forEach((item, index) => {

    total += item.price * item.quantity;

    const cartItem = document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `

      <img src="${item.image}" alt="${item.name}">

      <div class="cart-info">

        <h3>${item.name}</h3>

        <p>₹${item.price}</p>

        <div class="quantity-controls">

          <button onclick="decreaseQuantity(${index})">-</button>

          <span>${item.quantity}</span>

          <button onclick="increaseQuantity(${index})">+</button>

        </div>

        <button
          class="remove-btn"
          onclick="removeItem(${index})"
        >
          Remove
        </button>

      </div>

    `;

    cartItemsContainer.appendChild(cartItem);

  });

  cartTotal.innerText = `Total: ₹${total}`;

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  updateCartCount();

}



// QUANTITY


function increaseQuantity(index) {

  cart[index].quantity++;

  renderCart();

}

function decreaseQuantity(index) {

  if (cart[index].quantity > 1) {

    cart[index].quantity--;

  }

  renderCart();

}



// REMOVE


function removeItem(index) {

  cart.splice(index, 1);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  updateCartCount();

  renderCart();

  showToast("Item removed 🗑️");

}



// CHECKOUT


document
.getElementById("checkoutBtn")
.addEventListener("click", () => {

  if(cart.length === 0){

    showToast("Your cart is empty ❌");

    return;

  }

  window.location.href =
    "checkout.html";

});



// START


renderCart();