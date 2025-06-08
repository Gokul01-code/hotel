const menuItems = [
  { name: "Veg Fried Rice", price: 90, prepTime: 10 },
  { name: "Chicken Biryani", price: 150, prepTime: 15 },
  { name: "Paneer Butter Masala", price: 120, prepTime: 12 },
  { name: "Noodles", price: 80, prepTime: 8 },
  { name: "Grill Chicken", price: 200, prepTime: 20 }
];

const menuContainer = document.getElementById("menu");
const cartItems = document.getElementById("cart-items");
const totalDisplay = document.getElementById("total");
const waitTimeDisplay = document.getElementById("wait-time");

let cart = [];

// Get pending orders from localStorage
function getPendingOrders() {
  return JSON.parse(localStorage.getItem("pendingOrders") || "[]");
}

// Save pending orders to localStorage
function setPendingOrders(orders) {
  localStorage.setItem("pendingOrders", JSON.stringify(orders));
}

function renderMenu() {
  menuContainer.innerHTML = ""; // clear before re-render
  menuItems.forEach((item, index) => {
    const cartItem = cart.find(ci => ci.name === item.name);
    const quantity = cartItem ? cartItem.quantity : 0;

    const div = document.createElement("div");
    div.className = "menu-item";

    if (quantity === 0) {
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <p>Prep Time: ${item.prepTime} min</p>
        <button onclick="addToCart(${index})" class="add-btn">+ Add</button>
      `;
    } else {
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <p>Prep Time: ${item.prepTime} min</p>
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${index})" class="qty-btn">−</button>
          <span class="qty-number">${quantity}</span>
          <button onclick="increaseQuantity(${index})" class="qty-btn">+</button>
        </div>
      `;
    }

    menuContainer.appendChild(div);
  });
}

function addToCart(index) {
  const selectedItem = menuItems[index];
  cart.push({ ...selectedItem, quantity: 1 });
  updateCart();
  renderMenu();
}

function increaseQuantity(index) {
  const selectedItem = menuItems[index];
  const cartItem = cart.find(item => item.name === selectedItem.name);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...selectedItem, quantity: 1 });
  }
  updateCart();
  renderMenu();
}

function decreaseQuantity(index) {
  const selectedItem = menuItems[index];
  const cartItemIndex = cart.findIndex(item => item.name === selectedItem.name);
  if (cartItemIndex > -1) {
    cart[cartItemIndex].quantity--;
    if (cart[cartItemIndex].quantity <= 0) {
      cart.splice(cartItemIndex, 1);
    }
  }
  updateCart();
  renderMenu();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.quantity} = ₹${itemTotal}`;
    cartItems.appendChild(li);
    total += itemTotal;
  });

  totalDisplay.textContent = `Total: ₹${total}`;
}

document.getElementById("place-order-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const currentOrder = JSON.parse(JSON.stringify(cart));
  const orders = getPendingOrders();
  orders.push(currentOrder);
  setPendingOrders(orders);

  // Calculate estimated wait time
  let waitTime = 0;
  orders.forEach(order => {
    const prepTimes = order.map(item => item.prepTime);
    waitTime += Math.max(...prepTimes);
  });

  waitTimeDisplay.textContent = `⏳ Estimated Wait Time: ${waitTime} mins`;

  // Clear cart
  cart = [];
  updateCart();
  renderMenu();
});

function updateWaitTime() {
  const orders = getPendingOrders();
  let waitTime = 0;
  orders.forEach(order => {
    const prepTimes = order.map(item => item.prepTime);
    waitTime += Math.max(...prepTimes);
  });

  waitTimeDisplay.textContent = orders.length
    ? `⏳ Estimated Wait Time: ${waitTime} mins`
    : "✅ No current orders";
}

// Auto-refresh wait time every 5 seconds
setInterval(updateWaitTime, 5000);

// Initial rendering
renderMenu();
updateCart();
updateWaitTime();
