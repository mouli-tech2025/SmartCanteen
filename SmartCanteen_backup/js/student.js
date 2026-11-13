
/* ==========================================
   SMART CANTEEN - STUDENT MODULE
========================================== */

// ==========================================
// 1. AUTHENTICATION CHECK
// ==========================================

const currentStudent = getLoggedInUser();

if (!currentStudent || currentStudent.role !== "student") {
    window.location.href = "login.html";
}

// ==========================================
// 2. STUDENT STATE
// ==========================================

let cart = [];
let selectedCategory = "All";
let searchText = "";
let sortOption = "default";
let latestOrderId = null;


// ==========================================
// 3. INITIALIZE STUDENT DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    if (!currentStudent || currentStudent.role !== "student") {
        return;
    }

    document.getElementById("navUserName").textContent =
        currentStudent.name;

    document.getElementById("sidebarUserName").textContent =
        currentStudent.name;

    document.getElementById("welcomeName").textContent =
        currentStudent.name.split(" ")[0];

    document.getElementById("currentDate").textContent =
        new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    setupNavigation();
    setupMenuFilters();

    renderPopularFood();
    renderMenu();
    renderCart();
    renderStudentStats();
    renderRecentOrders();
    renderOrders();

});


// ==========================================
// 4. NAVIGATION
// ==========================================

function setupNavigation() {

    document.querySelectorAll(".sidebar-link").forEach(link => {

        link.addEventListener("click", function(event) {

            event.preventDefault();

            showSection(this.dataset.section);

        });

    });

}

function showSection(sectionId) {

    document.querySelectorAll(".student-section").forEach(section => {
        section.classList.add("hidden");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }

    document.querySelectorAll(".sidebar-link").forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.section === sectionId
        );

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// 5. FOOD MENU
// ==========================================

function renderFoodCard(food) {

    return `
        <article class="food-card">

            <img
                class="food-image"
                src="${food.image}"
                alt="${food.name}"
                loading="lazy"
                onerror="this.onerror=null;this.src='https://placehold.co/600x400/fff1e5/f97316?text=Food'"
            >

            <div class="food-info">

                <span class="food-category">
                    ${food.category}
                </span>

                <h3>${food.name}</h3>

                <p class="food-description">
                    ${food.description}
                </p>

                <div class="food-card-bottom">

                    <span class="food-price">
                        ₹${food.price}
                    </span>

                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${food.id})"
                        ${!food.available ? "disabled" : ""}
                    >
                        ${food.available ? "+ Add" : "Unavailable"}
                    </button>

                </div>

            </div>

        </article>
    `;
}


// ==========================================
// 6. POPULAR FOOD
// ==========================================

function renderPopularFood() {

    const menu = getMenu();

    const popularItems = menu.filter(
        food => food.popular && food.available
    ).slice(0, 4);

    document.getElementById("popularFoodGrid").innerHTML =
        popularItems.length
            ? popularItems.map(renderFoodCard).join("")
            : `<p>No popular food available currently.</p>`;

}


// ==========================================
// 7. MENU FILTER SETUP
// ==========================================

function setupMenuFilters() {

    document.querySelectorAll(".category-btn").forEach(button => {

        button.addEventListener("click", function() {

            selectedCategory = this.dataset.category;

            document.querySelectorAll(".category-btn").forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            renderMenu();

        });

    });


    document.getElementById("foodSearch").addEventListener(
        "input",
        function() {

            searchText = this.value.trim().toLowerCase();

            renderMenu();

        }
    );


    document.getElementById("sortFood").addEventListener(
        "change",
        function() {

            sortOption = this.value;

            renderMenu();

        }
    );

}


// ==========================================
// 8. RENDER MENU
// ==========================================

function renderMenu() {

    let menu = getMenu().filter(food => food.available);

    if (selectedCategory !== "All") {

        menu = menu.filter(
            food => food.category === selectedCategory
        );

    }

    if (searchText) {

        menu = menu.filter(food =>
            food.name.toLowerCase().includes(searchText) ||
            food.category.toLowerCase().includes(searchText) ||
            food.description.toLowerCase().includes(searchText)
        );

    }

    if (sortOption === "low") {
        menu.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "high") {
        menu.sort((a, b) => b.price - a.price);
    }

    if (sortOption === "name") {
        menu.sort((a, b) => a.name.localeCompare(b.name));
    }

    document.getElementById("foodCount").textContent =
        `${menu.length} items`;

    document.getElementById("menuFoodGrid").innerHTML =
        menu.length
            ? menu.map(renderFoodCard).join("")
            : `<div class="no-orders">No matching food items found.</div>`;

}


// ==========================================
// 9. ADD FOOD TO CART
// ==========================================

function addToCart(foodId) {

    const food = getMenu().find(
        item => item.id === foodId && item.available
    );

    if (!food) {
        alert("This food item is currently unavailable.");
        return;
    }

    const existingItem = cart.find(
        item => item.id === foodId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            image: food.image,
            quantity: 1
        });

    }

    renderCart();

}


// ==========================================
// 10. CHANGE CART QUANTITY
// ==========================================

function changeQuantity(foodId, change) {

    const item = cart.find(
        food => food.id === foodId
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        cart = cart.filter(
            food => food.id !== foodId
        );

    }

    renderCart();

}


// ==========================================
// 11. CART CALCULATIONS
// ==========================================

function calculateCart() {

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const tax = Math.round(subtotal * 0.05 * 100) / 100;

    const total = subtotal + tax;

    return {
        subtotal,
        tax,
        total
    };

}


// ==========================================
// 12. DISPLAY CART
// ==========================================

function renderCart() {

    const cartContainer = document.getElementById("cartItems");

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartBadge").textContent =
        totalQuantity;

    document.getElementById("cartItemCount").textContent =
        `${totalQuantity} items`;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add some delicious food to get started.</p>
            </div>
        `;

    } else {

        cartContainer.innerHTML = cart.map(item => `

            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}"
                    onerror="this.onerror=null;this.src='https://placehold.co/100x100/fff1e5/f97316?text=Food'">

                <div class="cart-item-info">

                    <strong>${item.name}</strong>

                    <small>₹${item.price * item.quantity}</small>

                    <div class="quantity-controls">

                        <button onclick="changeQuantity(${item.id}, -1)">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${item.id}, 1)">
                            +
                        </button>

                    </div>

                </div>

            </div>

        `).join("");

    }

    const bill = calculateCart();

    document.getElementById("cartSubtotal").textContent =
        "₹" + bill.subtotal.toFixed(2);

    document.getElementById("cartTax").textContent =
        "₹" + bill.tax.toFixed(2);

    document.getElementById("cartTotal").textContent =
        "₹" + bill.total.toFixed(2);

    document.getElementById("checkoutButton").disabled =
        cart.length === 0;

}


// ==========================================
// 13. CHECKOUT AND PLACE ORDER
// ==========================================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    // Check current food availability and prices again
    const latestMenu = getMenu();

    for (const item of cart) {

        const latestFood = latestMenu.find(
            food => food.id === item.id && food.available
        );

        if (!latestFood) {

            alert(item.name + " is no longer available. Please update your cart.");

            cart = cart.filter(food => food.id !== item.id);

            renderCart();
            renderMenu();

            return;

        }

        item.price = latestFood.price;
    }

    const bill = calculateCart();

    const orders = getOrders();

    const token = generateOrderToken();

    const newOrder = {

        id: "ORD" + Date.now(),

        token: token,

        studentId: currentStudent.id,

        studentName: currentStudent.name,

        studentEmail: currentStudent.email,

        items: cart.map(item => ({ ...item })),

        subtotal: bill.subtotal,

        tax: bill.tax,

        total: bill.total,

        status: "Pending",

        paymentMethod: "Pay at Counter",

        createdAt: new Date().toISOString()

    };

    orders.push(newOrder);

    saveOrders(orders);

    latestOrderId = newOrder.id;

    cart = [];

    renderCart();
    renderStudentStats();
    renderRecentOrders();
    renderOrders();

    showOrderConfirmation(newOrder);

}


// ==========================================
// 14. ORDER CONFIRMATION
// ==========================================

function showOrderConfirmation(order) {

    document.getElementById("generatedToken").textContent =
        order.token;

    document.getElementById("modalOrderDetails").innerHTML = `
        <p>Order ID: ${order.id}</p>
        <p>Total Amount: <strong>₹${order.total.toFixed(2)}</strong></p>
        <p>Payment: Pay at Counter</p>
    `;

    document.getElementById("orderModal").classList.remove("hidden");

}


function closeOrderModal() {

    document.getElementById("orderModal").classList.add("hidden");

    showSection("orders");

}


// ==========================================
// 15. GET STUDENT ORDERS
// ==========================================

function getStudentOrders() {

    return getOrders()
        .filter(order => order.studentId === currentStudent.id)
        .sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

}


// ==========================================
// 16. ORDER STATUS DISPLAY
// ==========================================

function getStatusClass(status) {

    return status.toLowerCase().replace(/\s+/g, "-");

}


// ==========================================
// 17. RENDER STUDENT STATISTICS
// ==========================================

function renderStudentStats() {

    const orders = getStudentOrders();

    const completed = orders.filter(
        order => order.status === "Completed"
    ).length;

    const active = orders.filter(
        order => !["Completed", "Rejected", "Cancelled"].includes(order.status)
    ).length;

    document.getElementById("totalOrders").textContent =
        orders.length;

    document.getElementById("completedOrders").textContent =
        completed;

    document.getElementById("activeOrders").textContent =
        active;

}


// ==========================================
// 18. RENDER RECENT ORDERS
// ==========================================

function renderRecentOrders() {

    const orders = getStudentOrders().slice(0, 3);

    const container = document.getElementById("recentOrdersContainer");

    if (!orders.length) {

        container.innerHTML = `
            <div class="no-orders">
                <p>You haven't placed any orders yet.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = orders.map(order => `

        <div class="order-card">

            <div class="order-card-top">

                <div>
                    <h3>${order.token}</h3>
                    <p>${new Date(order.createdAt).toLocaleString("en-IN")}</p>
                </div>

                <span class="order-status status-${getStatusClass(order.status)}">
                    ${order.status}
                </span>

            </div>

            <div class="order-card-bottom">
                <span>${order.items.length} food types</span>
                <strong>₹${order.total.toFixed(2)}</strong>
            </div>

        </div>

    `).join("");

}


// ==========================================
// 19. RENDER ALL ORDERS
// ==========================================

function renderOrders() {

    const orders = getStudentOrders();

    const container = document.getElementById("ordersContainer");

    if (!orders.length) {

        container.innerHTML = `
            <div class="no-orders">
                <div style="font-size:45px;">📦</div>
                <h3>No orders yet</h3>
                <p>Your food orders will appear here.</p>
            </div>
        `;

        return;

    }

    container.innerHTML = orders.map(order => `

        <article class="order-card">

            <div class="order-card-top">

                <div>
                    <h3>${order.token}</h3>
                    <p>Order ID: ${order.id}</p>
                    <p>${new Date(order.createdAt).toLocaleString("en-IN")}</p>
                </div>

                <span class="order-status status-${getStatusClass(order.status)}">
                    ${order.status}
                </span>

            </div>

            <div class="order-items-text">
                ${order.items.map(item =>
                    `${item.name} × ${item.quantity}`
                ).join("<br>")}
            </div>

            <div class="order-card-bottom">

                <span>Digital Token: <strong>${order.token}</strong></span>

                <strong>₹${order.total.toFixed(2)}</strong>

            </div>

        </article>

    `).join("");

}


// ==========================================
// 20. REFRESH ORDERS WHEN RETURNING TO TAB
// ==========================================

window.addEventListener("focus", function() {

    renderStudentStats();
    renderRecentOrders();
    renderOrders();
    renderMenu();

});


// ==========================================
// END OF STUDENT MODULE
// ==========================================

console.log("Student dashboard initialized.");
