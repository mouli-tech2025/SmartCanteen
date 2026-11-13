
/* ==========================================
   SMART CANTEEN - STAFF MODULE
========================================== */

// ==========================================
// 1. STAFF AUTHENTICATION
// ==========================================

const currentStaff = getLoggedInUser();

if (!currentStaff || currentStaff.role !== "staff") {
    window.location.href = "login.html";
}


// ==========================================
// 2. INITIALIZE STAFF DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    if (!currentStaff || currentStaff.role !== "staff") {
        return;
    }

    document.getElementById("staffName").textContent =
        currentStaff.name || "Kitchen Staff";

    document.getElementById("staffDate").textContent =
        new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    setupStaffNavigation();
    renderStaffDashboard();

    // Refresh orders periodically while this page is open.
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
// 5. UPDATE DASHBOARD STATISTICS
// ==========================================

function renderStaffStats() {

    const orders = getAllStaffOrders();

    const pending = orders.filter(
        order => order.status === "Pending"
    ).length;

    const preparing = orders.filter(
        order => order.status === "Preparing"
    ).length;

    const completed = orders.filter(
        order => order.status === "Completed"
    ).length;

    document.getElementById("staffTotal").textContent =
        orders.length;

    document.getElementById("staffPending").textContent =
        pending;

    document.getElementById("staffPreparing").textContent =
        preparing;

    document.getElementById("staffCompleted").textContent =
        completed;

    document.getElementById("incomingBadge").textContent =
        pending;

    document.getElementById("incomingCount").textContent =
        `${pending} orders`;

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


// ==========================================
// 7. CREATE ORDER CARD
// ==========================================

function createStaffOrderCard(order) {

    const itemsHTML = order.items.map(item => `

        <div class="staff-food-row">

            <span>${item.name} × ${item.quantity}</span>

            <strong>₹${item.price * item.quantity}</strong>

        </div>

    `).join("");


    let actionButtons = "";

    if (order.status === "Pending") {

        actionButtons = `

            <button
                class="staff-action-btn accept-btn"
                onclick="updateOrderStatus('${order.id}', 'Preparing')"
            >
                ✓ Accept & Prepare
            </button>

            <button
                class="staff-action-btn reject-btn"
                onclick="rejectOrder('${order.id}')"
            >
                ✕ Reject
            </button>

        `;

    } else if (order.status === "Preparing") {

        actionButtons = `

            <button
                class="staff-action-btn ready-btn"
                onclick="updateOrderStatus('${order.id}', 'Ready')"
            >
                🔔 Mark as Ready
            </button>

        `;

    } else if (order.status === "Ready") {

        actionButtons = `

            <button
                class="staff-action-btn complete-btn"
                onclick="updateOrderStatus('${order.id}', 'Completed')"
            >
                ✓ Confirm Collection
            </button>

        `;

    }


    return `

        <article class="staff-order-card">

            <div class="staff-order-top">

                <div>
                    <div class="staff-order-token">
                        ${order.token}
                    </div>

                    <div class="staff-order-id">
                        ${order.id}
                    </div>
                </div>

                <span class="staff-status ${getStaffStatusClass(order.status)}">
                    ${order.status}
                </span>

            </div>


            <div class="staff-student-info">

                <strong>🎓 ${order.studentName}</strong>

                <p>✉ ${order.studentEmail}</p>

            </div>


            <div class="staff-items-list">

                <h4>ORDER ITEMS</h4>

                ${itemsHTML}

            </div>


            <div class="staff-order-total">

                <span>Total Amount</span>

                <strong>₹${Number(order.total).toFixed(2)}</strong>

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

    return `

        <div class="staff-empty">

            <span>${icon}</span>

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


    // Dashboard: latest orders
    document.getElementById("overviewOrders").innerHTML =

        orders.length
            ? orders.slice(0, 4).map(createStaffOrderCard).join("")
            : emptyStaffMessage(
                "📦",
                "No orders yet",
                "Student orders will appear here."
            );


    // Incoming orders
    document.getElementById("incomingOrders").innerHTML =

        pending.length
            ? pending.map(createStaffOrderCard).join("")
            : emptyStaffMessage(
                "📥",
                "No incoming orders",
                "New student orders will appear here."
            );


    // Preparing orders
    document.getElementById("preparingOrders").innerHTML =

        preparing.length
            ? preparing.map(createStaffOrderCard).join("")
            : emptyStaffMessage(
                "👨‍🍳",
                "No orders being prepared",
                "Accepted orders will appear here."
            );


    // Ready orders
    document.getElementById("readyOrders").innerHTML =

        ready.length
            ? ready.map(createStaffOrderCard).join("")
            : emptyStaffMessage(
                "🔔",
                "No ready orders",
                "Orders ready for collection will appear here."
            );


    // Completed orders
    document.getElementById("completedOrders").innerHTML =

        completed.length
            ? completed.map(createStaffOrderCard).join("")
            : emptyStaffMessage(
                "✅",
                "No completed orders",
                "Collected orders will appear here."
            );

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
// 11. REJECT ORDER
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

}


// ==========================================
// 13. REFRESH WHEN RETURNING TO TAB
// ==========================================

window.addEventListener("focus", function() {

    renderStaffDashboard();

});


console.log("Smart Canteen Staff Module initialized.");
