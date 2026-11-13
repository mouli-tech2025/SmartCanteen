/* ==========================================
   SMART CANTEEN - STAFF MODULE
========================================== */

// ==========================================
// 1. STAFF AUTHENTICATION & ROLE GUARD
// ==========================================

const currentStaff = enforceRole("staff");

// ==========================================
// 2. INITIALIZE STAFF DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    if (!currentStaff || currentStaff.role !== "staff") {
        return;
    }

    const nameElem = document.getElementById("staffName");
    if (nameElem) nameElem.textContent = currentStaff.name || "Kitchen Staff";

    const dateElem = document.getElementById("staffDate");
    if (dateElem) {
        dateElem.textContent = new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    setupStaffNavigation();
    renderStaffDashboard();

    // Initialize Lucide icons for static HTML elements
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }

    // Listen to storage event for cross-tab sync
    window.addEventListener("storage", function(event) {
        if (!event.key || event.key === STORAGE_KEYS.ORDERS) {
            renderStaffDashboard();
        }
    });

    // Refresh orders periodically while this page is open
    setInterval(renderStaffDashboard, 3000);

});


// ==========================================
// 3. STAFF NAVIGATION
// ==========================================

function setupStaffNavigation() {

    document.querySelectorAll(".staff-link").forEach(link => {

        link.addEventListener("click", function(event) {

            event.preventDefault();

            showStaffSection(this.dataset.section);

        });

    });

}


function showStaffSection(sectionId) {

    document.querySelectorAll(".staff-section").forEach(section => {
        section.classList.add("hidden");
    });

    const section = document.getElementById(sectionId);

    if (section) {
        section.classList.remove("hidden");
    }

    document.querySelectorAll(".staff-link").forEach(link => {

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
// 4. GET ALL ORDERS
// ==========================================

function getAllStaffOrders() {

    return getOrders().sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

}


// ==========================================
// 5. UPDATE DASHBOARD STATISTICS (5 STATUSES)
// ==========================================

function renderStaffStats() {

    const orders = getAllStaffOrders();

    const pending = orders.filter(
        order => order.status === "Pending"
    ).length;

    const preparing = orders.filter(
        order => order.status === "Preparing"
    ).length;

    const ready = orders.filter(
        order => order.status === "Ready"
    ).length;

    const completed = orders.filter(
        order => order.status === "Completed"
    ).length;

    const rejected = orders.filter(
        order => order.status === "Rejected"
    ).length;

    const totalElem = document.getElementById("staffTotal");
    if (totalElem) totalElem.textContent = orders.length;

    const pendingElem = document.getElementById("staffPending");
    if (pendingElem) pendingElem.textContent = pending;

    const preparingElem = document.getElementById("staffPreparing");
    if (preparingElem) preparingElem.textContent = preparing;

    const readyElem = document.getElementById("staffReady");
    if (readyElem) readyElem.textContent = ready;

    const completedElem = document.getElementById("staffCompleted");
    if (completedElem) completedElem.textContent = completed;

    const rejectedElem = document.getElementById("staffRejected");
    if (rejectedElem) rejectedElem.textContent = rejected;

    const badge = document.getElementById("incomingBadge");
    if (badge) badge.textContent = pending;

    const count = document.getElementById("incomingCount");
    if (count) count.textContent = `${pending} order${pending === 1 ? "" : "s"}`;

}


// ==========================================
// 6. GET STATUS CLASS
// ==========================================

function getStaffStatusClass(status) {

    const classes = {
        Pending: "",
        Preparing: "preparing",
        Ready: "ready",
        Completed: "completed",
        Rejected: "rejected",
        Cancelled: "cancelled"
    };

    return classes[status] || "";

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
// 7. CREATE ORDER CARD
// ==========================================

function createStaffOrderCard(order) {

    const itemsHTML = (order.items || []).map(item => `

        <div class="staff-food-row">

            <span>${escapeHTML(item.name)} × ${Number(item.quantity)}</span>

            <strong>₹${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</strong>

        </div>

    `).join("");

    // Lucide inline SVG helpers for action buttons
    var checkSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    var bellSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>';
    var xSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    var userSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    var mailSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';

    let actionButtons = "";

    if (order.status === "Pending") {

        actionButtons = `

            <button
                type="button"
                class="staff-action-btn accept-btn"
                onclick="updateOrderStatus('${order.id}', 'Preparing')"
            >
                ${checkSvg} Accept & Prepare
            </button>

            <button
                type="button"
                class="staff-action-btn reject-btn"
                onclick="rejectOrder('${order.id}')"
            >
                ${xSvg} Reject
            </button>

        `;

    } else if (order.status === "Preparing") {

        actionButtons = `

            <button
                type="button"
                class="staff-action-btn ready-btn"
                onclick="updateOrderStatus('${order.id}', 'Ready')"
            >
                ${bellSvg} Mark as Ready
            </button>

        `;

    } else if (order.status === "Ready") {

        actionButtons = `

            <button
                type="button"
                class="staff-action-btn complete-btn"
                onclick="updateOrderStatus('${order.id}', 'Completed')"
            >
                ${checkSvg} Confirm Collection
            </button>

        `;

    }


    return `

        <article class="staff-order-card">

            <div class="staff-order-top">

                <div>
                    <div class="staff-order-token">
                        ${escapeHTML(order.token || "-")}
                    </div>

                    <div class="staff-order-id">
                        ${escapeHTML(order.id)}
                    </div>
                </div>

                <span class="staff-status ${getStaffStatusClass(order.status)}">
                    ${escapeHTML(order.status)}
                </span>

            </div>


            <div class="staff-student-info">

                <strong>${userSvg} ${escapeHTML(order.studentName || "Student")}</strong>

                <p>${mailSvg} ${escapeHTML(order.studentEmail || "-")}</p>

            </div>


            <div class="staff-items-list">

                <h4>ORDER ITEMS</h4>

                ${itemsHTML}

            </div>


            <div class="staff-order-total">

                <span>Total Amount</span>

                <strong>₹${Number(order.total || 0).toFixed(2)}</strong>

            </div>


            <div class="staff-order-time">
                Ordered: ${new Date(order.createdAt).toLocaleString("en-IN")}
            </div>


            <div class="staff-actions">
                ${actionButtons}
            </div>

        </article>

    `;

}


// ==========================================
// 8. DISPLAY EMPTY STATE
// ==========================================

function emptyStaffMessage(icon, title, description) {

    // Use illustration images when available; fall back to icon
    var illustrationMap = {
        "kitchen": "../assets/images/illustrations/kitchen.svg",
        "no-orders": "../assets/images/illustrations/no-orders.svg"
    };

    var imgHTML = "";
    if (icon === "kitchen" || icon === "no-orders") {
        imgHTML = '<img src="' + illustrationMap[icon] + '" alt="" class="staff-empty-img">';
    } else {
        imgHTML = '<span>' + icon + '</span>';
    }

    return `

        <div class="staff-empty">

            ${imgHTML}

            <h3>${title}</h3>

            <p>${description}</p>

        </div>

    `;

}


// ==========================================
// 9. RENDER ORDER LISTS
// ==========================================

function renderStaffOrders() {

    const orders = getAllStaffOrders();

    const pending = orders.filter(
        order => order.status === "Pending"
    );

    const preparing = orders.filter(
        order => order.status === "Preparing"
    );

    const ready = orders.filter(
        order => order.status === "Ready"
    );

    const completed = orders.filter(
        order => order.status === "Completed"
    );


    // Dashboard: latest incoming / active orders
    const overviewElem = document.getElementById("overviewOrders");
    if (overviewElem) {
        overviewElem.innerHTML =
            orders.length
                ? orders.slice(0, 4).map(createStaffOrderCard).join("")
                : emptyStaffMessage(
                    "kitchen",
                    "No orders yet",
                    "Student orders will appear here."
                );
    }


    // Incoming orders
    const incomingElem = document.getElementById("incomingOrders");
    if (incomingElem) {
        incomingElem.innerHTML =
            pending.length
                ? pending.map(createStaffOrderCard).join("")
                : emptyStaffMessage(
                    "no-orders",
                    "No incoming orders",
                    "New student orders will appear here."
                );
    }


    // Preparing orders
    const preparingElem = document.getElementById("preparingOrders");
    if (preparingElem) {
        preparingElem.innerHTML =
            preparing.length
                ? preparing.map(createStaffOrderCard).join("")
                : emptyStaffMessage(
                    "kitchen",
                    "No orders being prepared",
                    "Accepted orders will appear here."
                );
    }


    // Ready orders
    const readyElem = document.getElementById("readyOrders");
    if (readyElem) {
        readyElem.innerHTML =
            ready.length
                ? ready.map(createStaffOrderCard).join("")
                : emptyStaffMessage(
                    "no-orders",
                    "No ready orders",
                    "Orders ready for collection will appear here."
                );
    }


    // Completed orders
    const completedElem = document.getElementById("completedOrders");
    if (completedElem) {
        completedElem.innerHTML =
            completed.length
                ? completed.map(createStaffOrderCard).join("")
                : emptyStaffMessage(
                    "no-orders",
                    "No completed orders",
                    "Collected orders will appear here."
                );
    }

}


// ==========================================
// 10. UPDATE ORDER STATUS
// ==========================================

function updateOrderStatus(orderId, newStatus) {

    const orders = getOrders();

    const order = orders.find(
        item => item.id === orderId
    );

    if (!order) {
        alert("Order not found.");
        return;
    }

    const allowedTransitions = {
        Pending: ["Preparing"],
        Preparing: ["Ready"],
        Ready: ["Completed"]
    };

    if (!allowedTransitions[order.status]?.includes(newStatus)) {
        alert("This order status cannot be updated in that way.");
        return;
    }

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    saveOrders(orders);
    renderStaffDashboard();

}


// ==========================================
// 11. REJECT ORDER (FROM PENDING ONLY)
// ==========================================

function rejectOrder(orderId) {

    const confirmed = confirm(
        "Are you sure you want to reject this order?"
    );

    if (!confirmed) return;

    const orders = getOrders();

    const order = orders.find(
        item => item.id === orderId
    );

    if (!order || order.status !== "Pending") {
        alert("This order can no longer be rejected.");
        return;
    }

    order.status = "Rejected";
    order.updatedAt = new Date().toISOString();

    saveOrders(orders);
    renderStaffDashboard();

}


// ==========================================
// 12. REFRESH DASHBOARD
// ==========================================

function renderStaffDashboard() {

    renderStaffStats();
    renderStaffOrders();

    // Initialize Lucide icons on dynamically generated content
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }

}


// ==========================================
// 13. REFRESH WHEN RETURNING TO TAB
// ==========================================

window.addEventListener("focus", function() {
    renderStaffDashboard();
});


console.log("Smart Canteen Staff Module initialized.");
