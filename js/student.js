/* ==========================================
   SMART CANTEEN - STUDENT MODULE
   Theme: Modern Premium Food-Tech
========================================== */

// ==========================================
// 1. AUTHENTICATION & ROLE GUARD
// ==========================================

const currentStudent = enforceRole("student");

// ==========================================
// 2. STUDENT STATE
// ==========================================

let cart = [];
let selectedCategory = "All";
let searchText = "";
let sortOption = "default";
let latestOrderId = null;
let lastOrdersFingerprint = "";


// ==========================================
// 3. INITIALIZE STUDENT DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    if (!currentStudent || currentStudent.role !== "student") {
        return;
    }

    // Load persisted cart for this student
    if (typeof getStudentCart === "function") {
        cart = getStudentCart(currentStudent.id);
    }

    const navName = document.getElementById("navUserName");
    if (navName) navName.textContent = currentStudent.name;

    const sidebarName = document.getElementById("sidebarUserName");
    if (sidebarName) sidebarName.textContent = currentStudent.name;

    const welcome = document.getElementById("welcomeName");
    if (welcome) welcome.textContent = (currentStudent.name || "Student").split(" ")[0];

    const dateElem = document.getElementById("currentDate");
    if (dateElem) {
        dateElem.textContent = new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
    }

    setupNavigation();
    setupMenuFilters();
    renderCategoryButtons();

    renderPopularFood();
    renderMenu();
    renderCart();
    renderStudentStats();
    renderRecentOrders();
    renderOrders();

    // Cache initial orders fingerprint
    lastOrdersFingerprint = getOrdersFingerprint();

    // Storage event for instant multi-tab synchronisation
    window.addEventListener("storage", function(event) {
        if (!event.key || event.key === STORAGE_KEYS.ORDERS) {
            syncStudentOrders();
        }
        if (event.key === STORAGE_KEYS.MENU || event.key === STORAGE_KEYS.CATEGORIES) {
            renderCategoryButtons();
            renderPopularFood();
            renderMenu();
        }
    });

    // Light periodic check every 3 seconds without losing input focus or scroll
    setInterval(function() {
        const currentFingerprint = getOrdersFingerprint();
        if (currentFingerprint !== lastOrdersFingerprint) {
            lastOrdersFingerprint = currentFingerprint;
            syncStudentOrders();
        }
    }, 3000);

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
// 5. FOOD MENU CARD
// ==========================================

function renderFoodCard(food) {

    const safeName = escapeHTML(food.name);
    const safeDesc = escapeHTML(food.description);
    const safeCat = escapeHTML(food.category);
    const safeImg = food.image || DEFAULT_FALLBACK_IMAGE;

    const popularBadgeHTML = food.popular ? `
        <div class="popular-badge">
            ${getLucideIcon("flame", 12, 2.5)}
            <span>Popular</span>
        </div>
    ` : "";

    const addBtnContent = food.available
        ? `${getLucideIcon("plus", 14, 2.5)} Add`
        : "Unavailable";

    return `
        <article class="food-card ${!food.available ? "food-unavailable" : ""}">

            <div class="food-image-wrap">
                <img
                    class="food-image"
                    src="${safeImg}"
                    alt="${safeName}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='${DEFAULT_FALLBACK_IMAGE}'"
                >
                ${popularBadgeHTML}
            </div>

            <div class="food-info">

                <span class="food-category">
                    ${safeCat}
                </span>

                <h3>${safeName}</h3>

                <p class="food-description">
                    ${safeDesc}
                </p>

                <div class="food-card-bottom">

                    <span class="food-price">
                        ₹${Number(food.price).toFixed(2)}
                    </span>

                    <button
                        type="button"
                        class="add-cart-btn"
                        onclick="addToCart(${food.id})"
                        ${!food.available ? "disabled" : ""}
                    >
                        ${addBtnContent}
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

    const container = document.getElementById("popularFoodGrid");
    if (!container) return;

    container.innerHTML =
        popularItems.length
            ? popularItems.map(renderFoodCard).join("")
            : `<p style="color:#777777; padding:15px; grid-column:1/-1;">No popular food available currently.</p>`;

}


// ==========================================
// 7. DYNAMIC CATEGORY BUTTONS & FILTERS WITH ICONS
// ==========================================

function renderCategoryButtons() {
    const container = document.getElementById("categoryFilters");
    if (!container) return;

    const categories = typeof getCategories === "function" ? getCategories() : ["Breakfast", "Lunch", "Snacks", "Beverages"];

    // If selectedCategory is no longer in categories and not "All", fall back to "All"
    if (selectedCategory !== "All" && !categories.includes(selectedCategory)) {
        selectedCategory = "All";
    }

    const allButtonsHTML = [
        `<button type="button" class="category-btn ${selectedCategory === "All" ? "active" : ""}" data-category="All">${getLucideIcon("utensils", 15)} All Items</button>`,
        ...categories.map(cat => {
            const isActive = selectedCategory === cat ? "active" : "";
            const iconName = typeof getCategoryIcon === "function" ? getCategoryIcon(cat) : "tag";
            return `<button type="button" class="category-btn ${isActive}" data-category="${escapeHTML(cat)}">${getLucideIcon(iconName, 15)} ${escapeHTML(cat)}</button>`;
        })
    ].join("");

    container.innerHTML = allButtonsHTML;

    // Attach listeners
    container.querySelectorAll(".category-btn").forEach(button => {
        button.addEventListener("click", function() {
            selectedCategory = this.dataset.category;

            container.querySelectorAll(".category-btn").forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");
            renderMenu();
        });
    });
}

function setupMenuFilters() {

    const searchInput = document.getElementById("foodSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            searchText = this.value.trim().toLowerCase();
            renderMenu();
        });
    }

    const sortSelect = document.getElementById("sortFood");
    if (sortSelect) {
        sortSelect.addEventListener("change", function() {
            sortOption = this.value;
            renderMenu();
        });
    }

}


// ==========================================
// 8. RENDER MENU (SEARCH & CATEGORY WORK TOGETHER)
// ==========================================

function renderMenu() {

    let menu = getMenu();

    // 1. Category Filter
    if (selectedCategory !== "All") {
        menu = menu.filter(food =>
            String(food.category || "").toLowerCase() === selectedCategory.toLowerCase()
        );
    }

    // 2. Search Text Filter (Works together with Category Filter)
    if (searchText) {
        menu = menu.filter(food =>
            String(food.name || "").toLowerCase().includes(searchText) ||
            String(food.category || "").toLowerCase().includes(searchText) ||
            String(food.description || "").toLowerCase().includes(searchText)
        );
    }

    // 3. Sorting
    if (sortOption === "low") {
        menu.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high") {
        menu.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name") {
        menu.sort((a, b) => a.name.localeCompare(b.name));
    }

    const countElem = document.getElementById("foodCount");
    if (countElem) {
        countElem.textContent = `Showing ${menu.length} item${menu.length === 1 ? "" : "s"}`;
    }

    const grid = document.getElementById("menuFoodGrid");
    if (!grid) return;

    if (menu.length > 0) {
        grid.innerHTML = menu.map(renderFoodCard).join("");
    } else {
        grid.innerHTML = `
            <div class="no-orders" style="grid-column: 1 / -1; text-align: center; padding: 45px 20px;">
                <img src="../assets/images/illustrations/no-orders.svg" alt="No Food Found" style="width:130px; margin-bottom:14px;">
                <h3 style="margin-bottom: 6px; font-size:16px;">No food items found</h3>
                <p style="color: #777777; font-size: 13px; margin:0;">Try searching for another keyword or select a different category filter.</p>
            </div>
        `;
    }

}


// ==========================================
// 9. ADD FOOD TO CART (MAX 10, UNAVAILABLE BLOCKED)
// ==========================================

function addToCart(foodId) {

    const food = getMenu().find(
        item => Number(item.id) === Number(foodId)
    );

    if (!food || !food.available) {
        alert("This food item is currently unavailable.");
        return;
    }

    const existingItem = cart.find(
        item => Number(item.id) === Number(foodId)
    );

    if (existingItem) {
        if (existingItem.quantity >= 10) {
            alert("Maximum quantity limit of 10 reached for " + food.name + ".");
            return;
        }
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

    persistCart();
    renderCart();

}


// ==========================================
// 10. CHANGE CART QUANTITY (1 TO 10 LIMITS)
// ==========================================

function changeQuantity(foodId, change) {

    const item = cart.find(
        food => Number(food.id) === Number(foodId)
    );

    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity > 10) {
        alert("Maximum quantity of 10 reached per item.");
        return;
    }

    if (newQuantity <= 0) {
        cart = cart.filter(food => Number(food.id) !== Number(foodId));
    } else {
        item.quantity = newQuantity;
    }

    persistCart();
    renderCart();

}

function removeFromCart(foodId) {
    cart = cart.filter(food => Number(food.id) !== Number(foodId));
    persistCart();
    renderCart();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        persistCart();
        renderCart();
    }
}

function persistCart() {
    if (currentStudent && typeof saveStudentCart === "function") {
        saveStudentCart(currentStudent.id, cart);
    }
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
    if (!cartContainer) return;

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const badge = document.getElementById("cartBadge");
    if (badge) badge.textContent = totalQuantity;

    const count = document.getElementById("cartItemCount");
    if (count) count.textContent = `${totalQuantity} item${totalQuantity === 1 ? "" : "s"}`;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <img src="../assets/images/illustrations/empty-cart.svg" alt="Empty Cart" style="width:130px; margin-bottom:12px;">
                <h3>Your cart is empty</h3>
                <p>Select delicious meals from the campus menu to get started.</p>
            </div>
        `;

    } else {

        cartContainer.innerHTML = cart.map(item => `

            <div class="cart-item">

                <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}"
                    onerror="this.onerror=null;this.src='${DEFAULT_FALLBACK_IMAGE}'">

                <div class="cart-item-info">

                    <strong>${escapeHTML(item.name)}</strong>

                    <small>₹${(item.price * item.quantity).toFixed(2)}</small>

                    <div class="quantity-controls">

                        <button type="button" onclick="changeQuantity(${item.id}, -1)" aria-label="Decrease quantity">
                            ${getLucideIcon("minus", 12, 2.5)}
                        </button>

                        <span>${item.quantity}</span>

                        <button type="button" onclick="changeQuantity(${item.id}, 1)" aria-label="Increase quantity">
                            ${getLucideIcon("plus", 12, 2.5)}
                        </button>

                    </div>

                </div>

                <button type="button" class="cart-item-remove-btn" onclick="removeFromCart(${item.id})" title="Remove item">
                    ${getLucideIcon("trash-2", 14)}
                </button>

            </div>

        `).join("");

    }

    const bill = calculateCart();

    const subtotalElem = document.getElementById("cartSubtotal");
    if (subtotalElem) subtotalElem.textContent = "₹" + bill.subtotal.toFixed(2);

    const taxElem = document.getElementById("cartTax");
    if (taxElem) taxElem.textContent = "₹" + bill.tax.toFixed(2);

    const totalElem = document.getElementById("cartTotal");
    if (totalElem) totalElem.textContent = "₹" + bill.total.toFixed(2);

    const checkoutBtn = document.getElementById("checkoutButton");
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

}


// ==========================================
// 13. CHECKOUT AND PLACE ORDER
// ==========================================

function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty! Please add some food items before placing an order.");
        return;
    }

    const latestMenu = getMenu();

    for (const item of cart) {

        const latestFood = latestMenu.find(
            food => Number(food.id) === Number(item.id) && food.available
        );

        if (!latestFood) {
            alert(`"${item.name}" is no longer available. Please update your cart.`);
            cart = cart.filter(food => Number(food.id) !== Number(item.id));
            persistCart();
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
        status: "Pending", // Pending -> Preparing -> Ready -> Completed
        paymentMethod: "Pay at Counter",
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    saveOrders(orders);

    latestOrderId = newOrder.id;
    cart = [];
    persistCart();

    renderCart();
    renderStudentStats();
    renderRecentOrders();
    renderOrders();

    showOrderConfirmation(newOrder);

}


// ==========================================
// 14. ORDER CONFIRMATION MODAL
// ==========================================

function showOrderConfirmation(order) {

    const tokenElem = document.getElementById("generatedToken");
    if (tokenElem) tokenElem.textContent = order.token;

    const detailsElem = document.getElementById("modalOrderDetails");
    if (detailsElem) {
        detailsElem.innerHTML = `
            <p style="margin:4px 0;">Order ID: <strong>${escapeHTML(order.id)}</strong></p>
            <p style="margin:4px 0;">Total Amount: <strong>₹${Number(order.total).toFixed(2)}</strong></p>
            <p style="margin:4px 0;">Status: <span class="order-status status-pending">${getLucideIcon("clock", 12)} Pending</span></p>
            <p style="margin:4px 0;">Payment: Pay at Counter</p>
        `;
    }

    const modal = document.getElementById("orderModal");
    if (modal) modal.classList.remove("hidden");

}

function closeOrderModal() {

    const modal = document.getElementById("orderModal");
    if (modal) modal.classList.add("hidden");

    showSection("orders");

}


// ==========================================
// 15. GET STUDENT ORDERS
// ==========================================

function getStudentOrders() {

    return getOrders()
        .filter(order => order.studentId === currentStudent.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

}

function getOrdersFingerprint() {
    const orders = getStudentOrders();
    return orders.map(o => `${o.id}_${o.status}_${o.updatedAt || ""}`).join("|");
}

function syncStudentOrders() {
    renderStudentStats();
    renderRecentOrders();
    renderOrders();
}


// ==========================================
// 16. ORDER STATUS DISPLAY
// ==========================================

function getStatusClass(status) {
    return String(status || "").toLowerCase().replace(/\s+/g, "-");
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

    const totalOrdersElem = document.getElementById("totalOrders");
    if (totalOrdersElem) totalOrdersElem.textContent = orders.length;

    const completedElem = document.getElementById("completedOrders");
    if (completedElem) completedElem.textContent = completed;

    const activeElem = document.getElementById("activeOrders");
    if (activeElem) activeElem.textContent = active;

}


// ==========================================
// 18. RENDER RECENT ORDERS
// ==========================================

function renderRecentOrders() {

    const orders = getStudentOrders().slice(0, 3);
    const container = document.getElementById("recentOrdersContainer");
    if (!container) return;

    if (!orders.length) {
        container.innerHTML = `
            <div class="no-orders" style="text-align:center; padding:30px; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:14px;">
                <p style="color:#777777; font-size:13px; margin:0;">You haven't placed any orders yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `

        <div class="order-card">

            <div class="order-card-top">

                <div>
                    <h3>${escapeHTML(order.token)}</h3>
                    <p>${new Date(order.createdAt).toLocaleString("en-IN")}</p>
                </div>

                <span class="order-status status-${getStatusClass(order.status)}">
                    ${escapeHTML(order.status)}
                </span>

            </div>

            <div class="order-card-bottom">
                <span>${order.items.length} item${order.items.length === 1 ? "" : "s"}</span>
                <strong>₹${Number(order.total).toFixed(2)}</strong>
            </div>

        </div>

    `).join("");

}


// ==========================================
// 19. RENDER ALL ORDERS (WITH PROGRESS TRACKER)
// ==========================================

function renderOrders() {

    const orders = getStudentOrders();
    const container = document.getElementById("ordersContainer");
    if (!container) return;

    if (!orders.length) {
        container.innerHTML = `
            <div class="no-orders" style="text-align:center; padding:50px 20px; background:#FFFFFF; border:1px solid #E5E7EB; border-radius:16px;">
                <img src="../assets/images/illustrations/no-orders.svg" alt="No Orders" style="width:140px; margin-bottom:14px;">
                <h3 style="margin-bottom:6px; font-size:17px; color:#252525;">No orders placed yet</h3>
                <p style="color:#777777; font-size:13px; margin:0;">Explore the campus menu to place your first order.</p>
            </div>
        `;
        return;

    }

    container.innerHTML = orders.map(order => {

        const isRejected = order.status === "Rejected";
        const steps = ["Pending", "Preparing", "Ready", "Completed"];
        const currentStepIndex = steps.indexOf(order.status);

        const trackerHTML = !isRejected ? `
            <div class="order-tracker" style="display:flex; justify-content:space-between; margin:16px 0; position:relative; font-size:11px; padding:10px 0;">
                ${steps.map((step, idx) => {
                    const isPassed = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;
                    return `
                        <div style="text-align:center; flex:1; position:relative;">
                            <div style="width:22px; height:22px; border-radius:50%; background:${isPassed ? '#16A36A' : '#E5E7EB'}; color:white; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:10px; margin-bottom:4px; box-shadow:${isCurrent ? '0 0 0 4px rgba(22, 163, 106, 0.2)' : 'none'};">
                                ${isPassed ? "✓" : idx + 1}
                            </div>
                            <div style="color:${isCurrent ? '#F97316' : isPassed ? '#16A36A' : '#777777'}; font-weight:${isCurrent ? '800' : '600'};">
                                ${step}
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        ` : `
            <div style="background:#FEE2E2; color:#DC2626; border:1px solid #FECACA; padding:10px 14px; border-radius:8px; margin:14px 0; font-size:12.5px; font-weight:600; display:flex; align-items:center; gap:8px;">
                ${getLucideIcon("x-circle", 16)}
                This order was rejected by the kitchen counter. Please contact canteen staff.
            </div>
        `;

        return `
            <article class="order-card">

                <div class="order-card-top">

                    <div>
                        <h3>${escapeHTML(order.token)}</h3>
                        <p style="font-size:12px; color:#777777;">Order ID: ${escapeHTML(order.id)} &bull; ${new Date(order.createdAt).toLocaleString("en-IN")}</p>
                    </div>

                    <span class="order-status status-${getStatusClass(order.status)}">
                        ${escapeHTML(order.status)}
                    </span>

                </div>

                ${trackerHTML}

                <div class="order-items-text">
                    ${order.items.map(item =>
                        `<strong>${Number(item.quantity)}x</strong> ${escapeHTML(item.name)} &bull; ₹${(item.price * item.quantity).toFixed(2)}`
                    ).join("<br>")}
                </div>

                <div class="order-card-bottom">

                    <span>Pickup Token: <strong style="color:#F97316;">${escapeHTML(order.token)}</strong></span>

                    <strong>Total: ₹${Number(order.total).toFixed(2)}</strong>

                </div>

            </article>
        `;
    }).join("");

}


// ==========================================
// 20. REFRESH ON TAB FOCUS
// ==========================================

window.addEventListener("focus", function() {
    renderStudentStats();
    renderRecentOrders();
    renderOrders();
    renderMenu();
});

console.log("Student dashboard initialized.");
