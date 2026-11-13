/* ==========================================
   SMART CANTEEN - ADMIN DASHBOARD
========================================== */

// ==========================================
// 1. AUTHENTICATION & ROLE GUARD
// ==========================================

const currentAdmin = enforceRole("admin");

// ==========================================
// 2. HELPER FUNCTIONS
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
    if (typeof readJSON === "function") {
        return readJSON(STORAGE_KEYS.USERS, []);
    }
    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.USERS)
    ) || [];
}

function getOrderStatusClass(status) {
    return String(status || "").toLowerCase().replace(/\s+/g, "-");
}

function showAdminMessage(text, isError = false) {
    const box = document.getElementById("adminMessageBox");
    if (!box) return;

    box.textContent = text;
    box.style.display = "block";
    box.style.padding = "12px 18px";
    box.style.borderRadius = "8px";
    box.style.marginBottom = "20px";
    box.style.fontWeight = "600";
    box.style.fontSize = "14px";

    if (isError) {
        box.style.background = "#fee2e2";
        box.style.color = "#dc2626";
        box.style.border = "1px solid #fca5a5";
    } else {
        box.style.background = "#dcfce7";
        box.style.color = "#15803d";
        box.style.border = "1px solid #86efac";
    }

    setTimeout(() => {
        box.style.display = "none";
    }, 4000);
}

// ==========================================
// 3. INITIALIZE DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    if (!currentAdmin || currentAdmin.role !== "admin") {
        return;
    }

    const adminNameElem = document.getElementById("adminName");
    if (adminNameElem) {
        adminNameElem.textContent = currentAdmin.name || "Administrator";
    }

    setupAdminNavigation();
    renderAdminDashboard();

    // Initialize Lucide icons for static HTML elements
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }

    // Storage event for live cross-tab updates
    window.addEventListener("storage", function (event) {
        if (!event.key || [STORAGE_KEYS.ORDERS, STORAGE_KEYS.MENU, STORAGE_KEYS.CATEGORIES, STORAGE_KEYS.USERS].includes(event.key)) {
            renderAdminDashboard();
        }
    });

    // Refresh data periodically every 3 seconds (skip if form is active)
    setInterval(function() {
        const formPanel = document.getElementById("foodFormPanel");
        if (!formPanel || formPanel.style.display === "none") {
            renderAdminDashboard();
        }
    }, 3000);

});

// ==========================================
// 4. NAVIGATION
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
// 5. MAIN DASHBOARD RENDER
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

    // Revenue strictly from Completed orders
    const totalRevenue = completedOrders.reduce(
        (total, order) => total + Number(order.total || 0),
        0
    );

    // Overview statistics
    const totalOrdersElem = document.getElementById("totalOrders");
    if (totalOrdersElem) totalOrdersElem.textContent = orders.length;

    const totalRevElem = document.getElementById("totalRevenue");
    if (totalRevElem) totalRevElem.textContent = formatCurrency(totalRevenue);

    const totalMenuElem = document.getElementById("totalMenuItems");
    if (totalMenuElem) totalMenuElem.textContent = menu.length;

    const totalUsersElem = document.getElementById("totalUsers");
    if (totalUsersElem) totalUsersElem.textContent = users.length;

    // Reports section top summary
    const repOrders = document.getElementById("reportOrders");
    if (repOrders) repOrders.textContent = orders.length;

    const repRev = document.getElementById("reportRevenue");
    if (repRev) repRev.textContent = formatCurrency(totalRevenue);

    const repCompleted = document.getElementById("reportCompleted");
    if (repCompleted) repCompleted.textContent = completedOrders.length;

    const repPending = document.getElementById("reportPending");
    if (repPending) repPending.textContent = pendingOrders.length;

    renderRecentOrders(orders);
    renderAllOrders(orders);
    renderAdminMenu(menu);
    renderAdminCategories();
    renderAdminUsers(users);
    renderReportsBreakdown(orders);

    // Reinitialize Lucide icons on dynamically generated content
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }

}

// ==========================================
// 6. RECENT ORDERS (WITH TOKEN)
// ==========================================

function renderRecentOrders(orders) {

    const container = document.getElementById("recentOrders");
    if (!container) return;

    const recentOrders = [...orders].reverse().slice(0, 5);

    if (recentOrders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:20px; color:#78716c;">No orders found yet.</td>
            </tr>
        `;
        return;
    }

    container.innerHTML = recentOrders.map(order => `

        <tr>
            <td><strong>${escapeHTML(order.token || "-")}</strong></td>
            <td>${escapeHTML(order.id)}</td>
            <td>${escapeHTML(order.studentName || "Student")}</td>
            <td><strong>${formatCurrency(order.total)}</strong></td>
            <td>
                <span class="admin-status ${getOrderStatusClass(order.status)}">
                    ${escapeHTML(order.status)}
                </span>
            </td>
        </tr>

    `).join("");

}

// ==========================================
// 7. ALL ORDERS (WITH TOKEN)
// ==========================================

function renderAllOrders(orders) {

    const container = document.getElementById("allOrders");
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px; color:#78716c;">No orders available.</td>
            </tr>
        `;
        return;
    }

    container.innerHTML = [...orders].reverse().map(order => {

        const items = (order.items || []).map(item => {
            return `${escapeHTML(item.name)} × ${Number(item.quantity || 0)}`;
        }).join(", ");

        return `
            <tr>
                <td><strong>${escapeHTML(order.token || "-")}</strong></td>
                <td>${escapeHTML(order.id)}</td>
                <td>${escapeHTML(order.studentName || "Student")}</td>
                <td style="max-width:240px; font-size:13px;">${items || "No items"}</td>
                <td><strong>${formatCurrency(order.total)}</strong></td>
                <td>${escapeHTML(order.paymentMethod || "Pay at Counter")}</td>
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
// 8. MENU MANAGEMENT
// ==========================================

function renderAdminMenu(menu) {

    const container = document.getElementById("adminMenuList");
    if (!container) return;

    if (menu.length === 0) {
        container.innerHTML = "<p style='color:#78716c; padding:20px;'>No menu items found. Click '+ Add New Food Item' to add one.</p>";
        return;
    }

    container.innerHTML = menu.map(item => `

        <div class="admin-menu-item">

            <div>
                <strong>${escapeHTML(item.name)}</strong>
                <p style="margin:4px 0; color:#64748b; font-size:13px;">
                    <span style="display:inline-block; background:#ffedd5; color:#ea580c; padding:2px 8px; border-radius:12px; font-weight:700; font-size:11px;">
                        ${escapeHTML(item.category)}
                    </span>
                    &bull; ${formatCurrency(item.price)}
                </p>
                <small style="color:${item.available ? '#16a34a' : '#dc2626'}; font-weight:600;">
                    ${item.available ? "● Available for Ordering" : "○ Currently Unavailable"}
                </small>
            </div>

            <div class="admin-menu-actions">
                <button type="button" onclick="openEditFoodForm('${escapeHTML(item.id)}')">
                    Edit
                </button>

                <button type="button" onclick="toggleMenuAvailability('${escapeHTML(item.id)}')">
                    ${item.available ? "Disable" : "Enable"}
                </button>

                <button type="button" onclick="deleteMenuItem('${escapeHTML(item.id)}')">
                    Delete
                </button>
            </div>

        </div>

    `).join("");

}

// Populate Categories in the Food Form Dropdown
function populateFoodCategoryDropdown(selectedCategory = "") {
    const select = document.getElementById("foodCategorySelect");
    if (!select) return;

    const categories = typeof getCategories === "function" ? getCategories() : ["Snacks", "Breakfast", "Lunch", "Beverages"];

    select.innerHTML = categories.map(cat => `
        <option value="${escapeHTML(cat)}" ${cat.toLowerCase() === selectedCategory.toLowerCase() ? "selected" : ""}>
            ${escapeHTML(cat)}
        </option>
    `).join("");
}

function openAddFoodForm() {
    const formPanel = document.getElementById("foodFormPanel");
    const title = document.getElementById("foodFormTitle");
    const idInput = document.getElementById("foodFormId");
    const nameInput = document.getElementById("foodNameInput");
    const priceInput = document.getElementById("foodPriceInput");
    const imageInput = document.getElementById("foodImageInput");
    const descInput = document.getElementById("foodDescInput");
    const availInput = document.getElementById("foodAvailableInput");
    const errBox = document.getElementById("foodFormError");

    title.textContent = "Add New Food Item";
    idInput.value = "";
    nameInput.value = "";
    priceInput.value = "";
    imageInput.value = "";
    descInput.value = "";
    availInput.checked = true;
    errBox.style.display = "none";

    populateFoodCategoryDropdown();

    formPanel.style.display = "block";
    nameInput.focus();
    formPanel.scrollIntoView({ behavior: "smooth" });
}

function openEditFoodForm(itemId) {
    const menu = getMenu();
    const item = menu.find(food => String(food.id) === String(itemId));
    if (!item) return;

    const formPanel = document.getElementById("foodFormPanel");
    const title = document.getElementById("foodFormTitle");
    const idInput = document.getElementById("foodFormId");
    const nameInput = document.getElementById("foodNameInput");
    const priceInput = document.getElementById("foodPriceInput");
    const imageInput = document.getElementById("foodImageInput");
    const descInput = document.getElementById("foodDescInput");
    const availInput = document.getElementById("foodAvailableInput");
    const errBox = document.getElementById("foodFormError");

    title.textContent = "Edit Food Item: " + item.name;
    idInput.value = item.id;
    nameInput.value = item.name;
    priceInput.value = item.price;
    imageInput.value = item.image || "";
    descInput.value = item.description || "";
    availInput.checked = item.available !== false;
    errBox.style.display = "none";

    populateFoodCategoryDropdown(item.category);

    formPanel.style.display = "block";
    nameInput.focus();
    formPanel.scrollIntoView({ behavior: "smooth" });
}

function closeFoodForm() {
    const formPanel = document.getElementById("foodFormPanel");
    if (formPanel) formPanel.style.display = "none";
}

function handleFoodFormSubmit(event) {
    event.preventDefault();

    const idInput = document.getElementById("foodFormId").value;
    const name = document.getElementById("foodNameInput").value.trim();
    const category = document.getElementById("foodCategorySelect").value.trim();
    const price = Number(document.getElementById("foodPriceInput").value);
    const image = document.getElementById("foodImageInput").value.trim();
    const description = document.getElementById("foodDescInput").value.trim();
    const available = document.getElementById("foodAvailableInput").checked;
    const errBox = document.getElementById("foodFormError");

    // Validation
    if (name.length < 2 || name.length > 50) {
        errBox.textContent = "Food name must be between 2 and 50 characters.";
        errBox.style.display = "block";
        return;
    }

    if (!category) {
        errBox.textContent = "Please select a category.";
        errBox.style.display = "block";
        return;
    }

    if (!Number.isFinite(price) || price <= 0) {
        errBox.textContent = "Price must be greater than ₹0.";
        errBox.style.display = "block";
        return;
    }

    if (!description) {
        errBox.textContent = "Description is required.";
        errBox.style.display = "block";
        return;
    }

    const menu = getMenu();

    // Check unique name (case-insensitive)
    const isDuplicate = menu.some(item =>
        String(item.id) !== String(idInput) &&
        item.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
        errBox.textContent = `A food item named "${name}" already exists. Please choose a unique name.`;
        errBox.style.display = "block";
        return;
    }

    if (idInput) {
        // Edit existing item
        const existing = menu.find(food => String(food.id) === String(idInput));
        if (existing) {
            existing.name = name;
            existing.category = category;
            existing.price = price;
            existing.image = image || existing.image || "https://placehold.co/600x400/fff1e5/f97316?text=Food";
            existing.description = description;
            existing.available = available;
        }
        showAdminMessage(`Food item "${name}" updated successfully!`);
    } else {
        // Add new item
        const newId = menu.reduce(
            (max, item) => Math.max(max, Number(item.id) || 0),
            0
        ) + 1;

        menu.push({
            id: newId,
            name: name,
            category: category,
            price: price,
            image: image || "https://placehold.co/600x400/fff1e5/f97316?text=Food",
            description: description,
            available: available,
            popular: false
        });
        showAdminMessage(`Food item "${name}" added successfully!`);
    }

    saveMenu(menu);
    closeFoodForm();
    renderAdminDashboard();
}

function toggleMenuAvailability(itemId) {
    const menu = getMenu();
    const item = menu.find(food => String(food.id) === String(itemId));

    if (!item) return;

    item.available = !item.available;
    saveMenu(menu);
    renderAdminDashboard();
    showAdminMessage(`"${item.name}" is now ${item.available ? "Available" : "Unavailable"}.`);
}

function deleteMenuItem(itemId) {
    const menu = getMenu();
    const item = menu.find(food => String(food.id) === String(itemId));

    if (!item) return;

    const confirmDelete = confirm(
        `Are you sure you want to delete "${item.name}" from the menu?`
    );

    if (!confirmDelete) return;

    const filtered = menu.filter(food => String(food.id) !== String(itemId));
    saveMenu(filtered);
    renderAdminDashboard();
    showAdminMessage(`Food item "${item.name}" deleted from the menu.`);
}

// ==========================================
// 9. CATEGORY MANAGEMENT (NEW FEATURE)
// ==========================================

function renderAdminCategories() {
    const container = document.getElementById("adminCategoryList");
    if (!container) return;

    const categories = typeof getCategories === "function" ? getCategories() : [];
    const menu = getMenu();

    if (categories.length === 0) {
        container.innerHTML = "<p style='color:#78716c;'>No categories found.</p>";
        return;
    }

    container.innerHTML = categories.map(cat => {
        // Count food items in this category
        const count = menu.filter(item =>
            item.category && item.category.toLowerCase() === cat.toLowerCase()
        ).length;

        return `
            <div class="admin-menu-item">
                <div>
                    <strong style="font-size:15px;">${escapeHTML(cat)}</strong>
                    <span style="margin-left:10px; font-size:12px; background:#f1f5f9; color:#475569; padding:3px 9px; border-radius:12px;">
                        ${count} item${count === 1 ? "" : "s"}
                    </span>
                </div>

                <div class="admin-menu-actions">
                    <button type="button" onclick="handleRenameCategory('${escapeHTML(cat)}')">
                        Rename
                    </button>
                    <button type="button" onclick="handleDeleteCategory('${escapeHTML(cat)}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function handleAddCategory(event) {
    event.preventDefault();
    const input = document.getElementById("newCategoryInput");
    const name = input.value.trim();
    const msgBox = document.getElementById("categoryMessageBox");

    const result = addCategory(name);

    msgBox.style.display = "block";
    msgBox.textContent = result.msg;

    if (result.ok) {
        msgBox.style.background = "#dcfce7";
        msgBox.style.color = "#15803d";
        input.value = "";
        renderAdminDashboard();
    } else {
        msgBox.style.background = "#fee2e2";
        msgBox.style.color = "#dc2626";
    }

    setTimeout(() => {
        msgBox.style.display = "none";
    }, 4000);
}

function handleRenameCategory(oldName) {
    const newName = prompt(`Enter new name for category "${oldName}":`, oldName);
    if (newName === null) return;

    const result = renameCategory(oldName, newName.trim());
    showAdminMessage(result.msg, !result.ok);

    if (result.ok) {
        renderAdminDashboard();
    }
}

function handleDeleteCategory(name) {
    const confirmDel = confirm(`Are you sure you want to delete category "${name}"?`);
    if (!confirmDel) return;

    const result = deleteCategory(name);
    showAdminMessage(result.msg, !result.ok);

    if (result.ok) {
        renderAdminDashboard();
    }
}

// ==========================================
// 10. RESET DEMO DATA
// ==========================================

function handleResetDemoData() {
    const confirmed = confirm(
        "Are you sure you want to reset demo data?\n\nThis will restore the original sample menu, empty orders, and reset default categories. Your user accounts and login session will be kept safe."
    );

    if (!confirmed) return;

    if (typeof resetDemoData === "function") {
        resetDemoData();
    }

    showAdminMessage("Demo data has been reset to default state.");
    setTimeout(() => {
        window.location.reload();
    }, 700);
}

// ==========================================
// 11. USER MANAGEMENT
// ==========================================

function renderAdminUsers(users) {

    const container = document.getElementById("adminUsers");
    if (!container) return;

    if (users.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; padding:20px; color:#78716c;">No registered users found.</td>
            </tr>
        `;
        return;
    }

    container.innerHTML = users.map(user => `

        <tr>
            <td><strong>${escapeHTML(user.name || "User")}</strong></td>
            <td>${escapeHTML(user.email || "-")}</td>
            <td>
                <span class="admin-status" style="background:#e0e7ff; color:#3730a3;">
                    ${escapeHTML(user.role || "student")}
                </span>
            </td>
        </tr>

    `).join("");

}

// ==========================================
// 12. REPORTS BREAKDOWN
// ==========================================

function renderReportsBreakdown(orders) {
    // 1. Orders by Status
    const statusContainer = document.getElementById("reportStatusBars");
    if (statusContainer) {
        const statuses = ["Pending", "Preparing", "Ready", "Completed", "Rejected"];
        const total = orders.length || 1;

        statusContainer.innerHTML = statuses.map(st => {
            const count = orders.filter(o => o.status === st).length;
            const pct = Math.round((count / total) * 100);

            const colors = {
                Pending: "#f59e0b",
                Preparing: "#3b82f6",
                Ready: "#10b981",
                Completed: "#16a34a",
                Rejected: "#ef4444"
            };

            return `
                <div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
                        <span><strong>${st}</strong> (${count})</span>
                        <span style="color:#64748b;">${pct}%</span>
                    </div>
                    <div style="width:100%; height:9px; background:#e2e8f0; border-radius:5px; overflow:hidden;">
                        <div style="width:${pct}%; height:100%; background:${colors[st] || '#64748b'}; border-radius:5px;"></div>
                    </div>
                </div>
            `;
        }).join("");
    }

    // 2. Top-Selling Food Items (from Completed orders)
    const topContainer = document.getElementById("reportTopItems");
    if (topContainer) {
        const completed = orders.filter(o => o.status === "Completed");

        if (completed.length === 0) {
            topContainer.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; padding:20px; color:#78716c;">No completed orders yet to generate top-sellers report.</td>
                </tr>
            `;
            return;
        }

        const itemSales = {};
        completed.forEach(order => {
            (order.items || []).forEach(item => {
                const id = item.id || item.name;
                if (!itemSales[id]) {
                    itemSales[id] = {
                        name: item.name,
                        category: item.category || "Menu Item",
                        units: 0,
                        revenue: 0
                    };
                }
                itemSales[id].units += Number(item.quantity || 1);
                itemSales[id].revenue += Number(item.price || 0) * Number(item.quantity || 1);
            });
        });

        const sortedItems = Object.values(itemSales).sort((a, b) => b.units - a.units).slice(0, 5);

        topContainer.innerHTML = sortedItems.map(item => `
            <tr>
                <td><strong>${escapeHTML(item.name)}</strong></td>
                <td><span style="font-size:12px; background:#ffedd5; color:#ea580c; padding:2px 8px; border-radius:10px;">${escapeHTML(item.category)}</span></td>
                <td><strong>${item.units}</strong></td>
                <td><strong>${formatCurrency(item.revenue)}</strong></td>
            </tr>
        `).join("");
    }
}

// Refresh dashboard on tab focus
window.addEventListener("focus", renderAdminDashboard);

console.log("Admin Dashboard initialized.");
