const ordersContainer =
  document.getElementById(
    "orders-container"
  );


// =========================================
// LOAD ORDERS
// =========================================

async function loadOrders(){

  try {

    const res = await fetch(

      "http://localhost:5000/api/orders"

    );

    const orders = await res.json();

    ordersContainer.innerHTML = "";


    if(orders.length === 0){

      ordersContainer.innerHTML = `

        <h2 class="empty-message">
          No orders yet 🌸
        </h2>

      `;

      return;

    }


    orders.forEach(order => {

      const orderCard =
        document.createElement("div");

      orderCard.classList.add(
        "admin-order-card"
      );

      orderCard.innerHTML = `

        <h3>
          ${order.orderId || "No ID"}
        </h3>

        <p>
          <strong>Name:</strong>
          ${order.customerName}
        </p>

        <p>
          <strong>Email:</strong>
          ${order.email}
        </p>

        <p>
          <strong>Total:</strong>
          ₹${order.totalAmount}
        </p>

        <p>
          <strong>Payment:</strong>
          ${order.paymentMethod}
        </p>

        <p>
          <strong>Status:</strong>
          ${order.orderStatus}
        </p>

        <select
          onchange="updateStatus(
            '${order._id}',
            this.value
          )"
        >

          <option value="Processing">
            Processing
          </option>

          <option value="Shipped">
            Shipped
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      `;

      ordersContainer.appendChild(
        orderCard
      );

    });

  }

  catch(err){

    console.error(err);

    ordersContainer.innerHTML = `

      <h2 class="empty-message">
        Failed to load orders ❌
      </h2>

    `;

  }

}

loadOrders();


// =========================================
// UPDATE STATUS
// =========================================

async function updateStatus(

  orderId,

  status

){

  try {

    const res = await fetch(

      `http://localhost:5000/api/orders/${orderId}`,

      {

        method: "PUT",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          orderStatus: status

        })

      }

    );

    const data = await res.json();

    alert(data.message);

    loadOrders();

  }

  catch(err){

    console.error(err);

    alert("Status update failed ❌");

  }

}