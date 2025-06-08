function getPendingOrders() {
  return JSON.parse(localStorage.getItem("pendingOrders") || "[]");
}

function setPendingOrders(orders) {
  localStorage.setItem("pendingOrders", JSON.stringify(orders));
}

function renderOrders() {
  const orders = getPendingOrders();
  const container = document.getElementById("orders-list");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p>No pending orders ✅</p>";
    return;
  }

  orders.forEach((order, index) => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order";

    const items = order.map(item => `<li>${item.name} x ${item.quantity}</li>`).join("");
    orderDiv.innerHTML = `
      <h4>Order ${index + 1}</h4>
      <ul>${items}</ul>
      <button onclick="completeOrder(${index})">✅ Complete Order</button>
      <hr/>
    `;

    container.appendChild(orderDiv);
  });
}

function completeOrder(index) {
  const orders = getPendingOrders();
  orders.splice(index, 1); // Remove the completed order
  setPendingOrders(orders);
  renderOrders(); // Refresh view immediately
}

// 🔄 Auto-refresh every 1 seconds
setInterval(renderOrders, 1000);

// Also render once on load
renderOrders();