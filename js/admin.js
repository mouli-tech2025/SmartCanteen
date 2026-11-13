
/* ==========================================
   SMART CANTEEN - ADMIN DASHBOARD
========================================== */

// ==========================================
// AUTHENTICATION
// ==========================================

const currentAdmin = getLoggedInUser();

if (!currentAdmin || currentAdmin.role !== "admin") {
    window.location.href = "login.html";
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatCurrency(amount) {
    return "₹" + Number(amount || 0).toFixed(2);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function getUsers() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.USERS)
    ) || [];
}

function getOrderStatusClass(status) {
    return String(status || "").toLowerCase();
}

// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("adminName").textContent =
        currentAdmin.name || "Administrator";

    setupAdminNavigation();
    renderAdminDashboard();

});

// ==========================================
// NAVIGATION
// ==========================================

function setupAdminNavigation() {

    const navLinks = document.querySelectorAll(".admin-nav a");

    navLinks.forEach(link => {

        link.addEventListener("click", function () {

            navLinks.forEach(item => item.classList.remove("active"));

            this.classList.add("active");

        });

    });

}

// ==========================================
// MAIN DASHBOARD
// ==========================================

function renderAdminDashboard() {

    const orders = getOrders();
    const menu = getMenu();
    const users = getUsers();

    const completedOrders = orders.filter(
        order => order.status === "Completed"
    );

    const pendingOrders = orders.filter(
        order => order.status === "Pending"
    );

    // Revenue from completed orders
    const totalRevenue = completedOrders.reduce(
        (total, order) => total + Number(order.total || 0),
        0
    );

    // Overview statistics
    document.getElementById("totalOrders").textContent =
        orders.length;

    document.getElementById("totalRevenue").textContent =
        formatCurrency(totalRevenue);

    document.getElementById("totalMenuItems").textContent =
        menu.length;

    document.getElementById("totalUsers").textContent =
        users.length;

    // Reports
    document.getElementById("reportOrders").textContent =
        orders.length;

    document.getElementById("reportRevenue").textContent =
        formatCurrency(totalRevenue);

    document.getElementById("reportCompleted").textContent =
        completedOrders.length;

    document.getElementById("reportPending").textContent =
        pendingOrders.length;

    renderRecentOrders(orders);
    renderAllOrders(orders);
    renderAdminMenu(menu);
    renderAdminUsers(users);

}

// ==========================================
// RECENT ORDERS
// ==========================================

function renderRecentOrders(orders) {

    const container = document.getElementById("recentOrders");

    const recentOrders = [...orders].reverse().slice(0, 5);

    if (recentOrders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="4">No orders found.</td>
            </tr>
        `;
        return;
    }

    container.innerHTML = recentOrders.map(order => `

        <tr>
            <td>${escapeHTML(order.id)}</td>
            <td>${escapeHTML(order.studentName)}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>
                <span class="admin-status ${getOrderStatusClass(order.status)}">
                    ${escapeHTML(order.status)}
                </span>
            </td>
        </tr>

    `).join("");

}

// ==========================================
// ALL ORDERS
// ==========================================

function renderAllOrders(orders) {

    const container = document.getElementById("allOrders");

    if (orders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6">No orders available.</td>
            </tr>
        `;
        return;
    }

    container.innerHTML = [...orders].reverse().map(order => {

        const items = (order.items || []).map(item => {
            return `${escapeHTML(item.name)} x ${Number(item.quantity || 0)}`;
        }).join(", ");

        return `
            <tr>
                <td>${escapeHTML(order.id)}</td>
                <td>${escapeHTML(order.studentName)}</td>
                <td>${items || "No items"}</td>
                <td>${formatCurrency(order.total)}</td>
                <td>${escapeHTML(order.paymentMethod)}</td>
                <td>
                    <span class="admin-status ${getOrderStatusClass(order.status)}">
                        ${escapeHTML(order.status)}
                    </span>
                </td>
            </tr>
        `;

    }).join("");

}

// ==========================================
// MENU MANAGEMENT
// ==========================================

function renderAdminMenu(menu) {

    const container = document.getElementById("adminMenuList");

    if (menu.length === 0) {
        container.innerHTML = "<p>No menu items found.</p>";
        return;
    }

    container.innerHTML = `

        <div style="margin-bottom:20px;">
            <button class="admin-add-button" data-action="add">
                + Add New Food Item
            </button>
        </div>

        ${menu.map(item => `

            <div class="admin-menu-item">

                <div>
                    <strong>${escapeHTML(item.name)}</strong>
                    <p>
                        ${escapeHTML(item.category)}
                        | ${formatCurrency(item.price)}
                    </p>
                    <small>
                        ${item.available ? "Available" : "Unavailable"}
                    </small>
                </div>

                <div class="admin-menu-actions">
                    <button data-action="edit" data-id="${escapeHTML(item.id)}">
                        Edit
                    </button>

                    <button data-action="toggle" data-id="${escapeHTML(item.id)}">
                        ${item.available ? "Disable" : "Enable"}
                    </button>

                    <button data-action="delete" data-id="${escapeHTML(item.id)}">
                        Delete
                    </button>
                </div>

            </div>

        `).join("")}

    `;

}

// ==========================================
// ADD, EDIT, DELETE MENU ITEMS
// ==========================================

document.getElementById("adminMenuList").addEventListener(
    "click",
    function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const itemId = button.dataset.id;

        if (action === "add") {
            addMenuItem();
        }

        if (action === "edit") {
            editMenuItem(itemId);
        }

        if (action === "toggle") {
            toggleMenuAvailability(itemId);
        }

        if (action === "delete") {
            deleteMenuItem(itemId);
        }

    }
);

function addMenuItem() {

    const name = prompt("Enter food item name:");
    if (!name || !name.trim()) return;

    const category = prompt(
        "Enter category (Breakfast, Lunch, Snacks, Beverages):"
    );

    if (!category || !category.trim()) return;

    const priceInput = prompt("Enter price:");

    if (priceInput === null) return;

    const price = Number(priceInput);

    if (!Number.isFinite(price) || price <= 0) {
        alert("Please enter a valid price.");
        return;
    }

    const description = prompt("Enter food description:") || "";

    const menu = getMenu();

    const newId = menu.reduce(
        (max, item) => Math.max(max, Number(item.id) || 0),
        0
    ) + 1;

    menu.push({
        id: newId,
        name: name.trim(),
        category: category.trim(),
        price,
        description,
        image: "",
        available: true,
        popular: false
    });

    saveMenu(menu);

    renderAdminDashboard();

    alert("Food item added successfully!");

}

function editMenuItem(itemId) {

    const menu = getMenu();

    const item = menu.find(
        food => String(food.id) === String(itemId)
    );

    if (!item) return;

    const newName = prompt("Enter food name:", item.name);

    if (newName === null || !newName.trim()) return;

    const newCategory = prompt("Enter category:", item.category);

    if (newCategory === null || !newCategory.trim()) return;

    const newPriceInput = prompt("Enter price:", item.price);

    if (newPriceInput === null) return;

    const newPrice = Number(newPriceInput);

    if (!Number.isFinite(newPrice) || newPrice <= 0) {
        alert("Please enter a valid price.");
        return;
    }

    item.name = newName.trim();
    item.category = newCategory.trim();
    item.price = newPrice;

    saveMenu(menu);

    renderAdminDashboard();

    alert("Food item updated successfully!");

}

function toggleMenuAvailability(itemId) {

    const menu = getMenu();

    const item = menu.find(
        food => String(food.id) === String(itemId)
    );

    if (!item) return;

    item.available = !item.available;

    saveMenu(menu);

    renderAdminDashboard();

}

function deleteMenuItem(itemId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this food item?"
    );

    if (!confirmDelete) return;

    const menu = getMenu().filter(
        item => String(item.id) !== String(itemId)
    );

    saveMenu(menu);

    renderAdminDashboard();

    alert("Food item deleted successfully!");

}

// ==========================================
// USER MANAGEMENT
// ==========================================

function renderAdminUsers(users) {

    const container = document.getElementById("adminUsers");

    if (users.length === 0) {

        container.innerHTML = `
            <tr>
                <td colspan="3">No registered users found.</td>
            </tr>
        `;

        return;
    }

    container.innerHTML = users.map(user => `

        <tr>
            <td>${escapeHTML(user.name)}</td>
            <td>${escapeHTML(user.email)}</td>
            <td>${escapeHTML(user.role)}</td>
        </tr>

    `).join("");

}

// ==========================================
// AUTOMATIC REFRESH
// ==========================================

// Refresh dashboard when returning to this tab
window.addEventListener("focus", renderAdminDashboard);

// Refresh data periodically
setInterval(renderAdminDashboard, 3000);

console.log("Admin Dashboard initialized.");
