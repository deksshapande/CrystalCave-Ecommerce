const wishlistContainer =
  document.getElementById("wishlist-items");

let wishlist =
  JSON.parse(
    localStorage.getItem("wishlist")
  ) || [];


// =========================================
// RENDER WISHLIST
// =========================================

function renderWishlist(){

  wishlistContainer.innerHTML = "";

  if(wishlist.length === 0){

    wishlistContainer.innerHTML = `

      <h2 class="empty-message">
        Wishlist is empty 💔
      </h2>

    `;

    return;

  }

  wishlist.forEach((item, index) => {

    const product = document.createElement("div");

    product.classList.add("cart-item");

    product.innerHTML = `

      <img
        src="${item.image}"
        alt="${item.name}"
      />

      <div class="cart-info">

        <h3>${item.name}</h3>

        <p>₹${item.price}</p>

        <button
          class="remove-btn"
          onclick="removeWishlist(${index})"
        >
          Remove
        </button>

      </div>

    `;

    wishlistContainer.appendChild(product);

  });

}


// =========================================
// REMOVE
// =========================================

function removeWishlist(index){

  wishlist.splice(index, 1);

  localStorage.setItem(

    "wishlist",

    JSON.stringify(wishlist)

  );

  renderWishlist();

}

renderWishlist();