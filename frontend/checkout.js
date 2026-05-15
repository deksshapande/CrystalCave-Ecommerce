const token =
  localStorage.getItem("token");

if(!token){

  alert("Please login first 🌸");

  window.location.href =
    "login.html";

}



const checkoutItems =
  document.getElementById("checkout-items");

const checkoutTotal =
  document.getElementById("checkout-total");

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;



// LOAD CHECKOUT


function loadCheckout(){

  // EMPTY CART PROTECTION

  if(cart.length === 0){

    window.location.href =
      "cart.html";

    return;

  }

  checkoutItems.innerHTML = "";

  total = 0;

  cart.forEach(item => {

    total += item.price * item.quantity;

    checkoutItems.innerHTML += `

      <div class="checkout-item">

        <img
          src="${item.image}"
          alt="${item.name}"
        />

        <div>

          <h4>${item.name}</h4>

          <p>
            ₹${item.price}
            ×
            ${item.quantity}
          </p>

        </div>

      </div>

    `;

  });

  checkoutTotal.innerText =
    `Total: ₹${total}`;

}

loadCheckout();



// PLACE ORDER


document
.getElementById("placeOrderBtn")
.addEventListener("click", async () => {

  try {

    const placeOrderBtn =
      document.getElementById("placeOrderBtn");

    placeOrderBtn.disabled = true;

    placeOrderBtn.innerText =
      "Processing...";


    const inputs =
      document.querySelectorAll(
        ".checkout-form input, .checkout-form textarea"
      );

    const customerName =
      inputs[0].value.trim();

    const email =
      inputs[1].value.trim();

    const phone =
      inputs[2].value.trim();

    const address =
      inputs[3].value.trim();


    
    // VALIDATION
    

    if(
      !customerName ||
      !email ||
      !phone ||
      !address
    ){

      alert("Please fill all fields ❌");

      placeOrderBtn.disabled = false;

      placeOrderBtn.innerText =
        "Place Order 💖";

      return;

    }


    // EMAIL VALIDATION

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){

      alert("Invalid email ❌");

      placeOrderBtn.disabled = false;

      placeOrderBtn.innerText =
        "Place Order 💖";

      return;

    }


    
    // ORDER DATA
    

    const paymentMethod =

  document.getElementById(
    "paymentMethod"
  ).value;


const orderData = {

  customerName,

  email,

  phone,

  address,

  products: cart,

  totalAmount: total,

  paymentMethod,

  paymentStatus:

    paymentMethod === "COD"
    ? "Pending"
    : "Sandbox Paid"

};

    console.log(
      "SENDING ORDER:",
      orderData
    );


    
    // SEND ORDER
    

    const res = await fetch(

      "https://crystalcave-backend.onrender.com/api/orders",

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify(orderData)

      }

    );

    console.log(
      "RESPONSE STATUS:",
      res.status
    );

    const data = await res.json();

    console.log(
      "SERVER RESPONSE:",
      data
    );


    
    // SUCCESS
    

    if(data.success){

      localStorage.removeItem("cart");

      document
      .getElementById("orderSuccess")
      .classList.add("show");


      // AUTO REDIRECT

      setTimeout(() => {

        window.location.href =
          "index.html";

      }, 3000);

    }

    else {

      alert(
        data.message ||
        "Order failed ❌"
      );

      placeOrderBtn.disabled = false;

      placeOrderBtn.innerText =
        "Place Order 💖";

    }

  }

  catch(err){

    console.error(
      "CHECKOUT ERROR:",
      err
    );

    alert("Server error ❌");

    const placeOrderBtn =
      document.getElementById("placeOrderBtn");

    placeOrderBtn.disabled = false;

    placeOrderBtn.innerText =
      "Place Order 💖";

  }

});



// GO HOME


function goHome(){

  window.location.href =
    "index.html";

}