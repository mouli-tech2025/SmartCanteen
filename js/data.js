/* ==========================================
   SMART CANTEEN - CENTRAL DATA MANAGEMENT
========================================== */

const STORAGE_KEYS = {
    USERS: "smartCanteenUsers",
    SESSION: "smartCanteenCurrentUser",
    MENU: "smartCanteenMenu",
    ORDERS: "smartCanteenOrders",
    CATEGORIES: "smartCanteenCategories"
};

// ==========================================
// 1. SAFE JSON READER
// ==========================================

function readJSON(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        if (item === null || item === undefined || item === "") {
            return fallback;
        }
        const value = JSON.parse(item);
        return value === null ? fallback : value;
    } catch (error) {
        return fallback;
    }
}

// ==========================================
// DEFAULT FOOD MENU
// ==========================================

const DEFAULT_MENU = [
    {
        id: 1,
        name: "Veg Paneer Burger",
        category: "Snacks",
        price: 60,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        description: "Delicious burger with fresh paneer and vegetables.",
        available: true,
        popular: true
    },
    {
        id: 2,
        name: "Margherita Pizza",
        category: "Snacks",
        price: 120,
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600",
        description: "Classic pizza with cheese and tomato sauce.",
        available: true,
        popular: true
    },
    {
        id: 3,
        name: "Veg Sandwich",
        category: "Breakfast",
        price: 45,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600",
        description: "Fresh sandwich with vegetables and cheese.",
        available: true,
        popular: false
    },
    {
        id: 4,
        name: "Masala Dosa",
        category: "Breakfast",
        price: 55,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600",
        description: "Crispy dosa served with chutney and sambar.",
        available: true,
        popular: true
    },
    {
        id: 5,
        name: "Veg Fried Rice",
        category: "Lunch",
        price: 90,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600",
        description: "Flavorful rice tossed with fresh vegetables.",
        available: true,
        popular: false
    },
    {
        id: 6,
        name: "Paneer Roll",
        category: "Snacks",
        price: 70,
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600",
        description: "Spicy paneer wrapped in a soft roll.",
        available: true,
        popular: true
    },
    {
        id: 7,
        name: "Cold Coffee",
        category: "Beverages",
        price: 35,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
        description: "Chilled creamy coffee.",
        available: true,
        popular: false
    },
    {
        id: 8,
        name: "Fresh Orange Juice",
        category: "Beverages",
        price: 40,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600",
        description: "Freshly prepared orange juice.",
        available: true,
        popular: false
    },
    {
        id: 9,
        name: "Veg Thali",
        category: "Lunch",
        price: 110,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
        description: "Complete meal with rice, dal and vegetables.",
        available: true,
        popular: true
    },
    {
        id: 10,
        name: "French Fries",
        category: "Snacks",
        price: 50,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
        description: "Crispy golden potato fries.",
        available: true,
        popular: false
    },
    {
        id: 11,
        name: "Tea",
        category: "Beverages",
        price: 15,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600",
        description: "Freshly brewed hot tea.",
        available: true,
        popular: false
    },
    {
        id: 12,
        name: "Chocolate Brownie",
        category: "Snacks",
        price: 45,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
        description: "Rich and delicious chocolate brownie.",
        available: true,
        popular: false
    }
];

// Default Initial Categories (Snacks, Breakfast, Lunch, Beverages)
const DEFAULT_CATEGORIES = ["Snacks", "Breakfast", "Lunch", "Beverages"];

// Pre-configured Demo Students
const DEFAULT_DEMO_USERS = [
    {
        id: "STU001",
        name: "Rahul Sharma",
        email: "student@smartcanteen.com",
        password: "Student@123",
        role: "student",
        createdAt: "2026-11-13T10:00:00.000Z"
    },
    {
        id: "STU002",
        name: "Priya Patel",
        email: "priya@smartcanteen.com",
        password: "Student@123",
        role: "student",
        createdAt: "2026-11-13T10:30:00.000Z"
    }
];

// ==========================================
// INITIALIZE APPLICATION DATA
// ==========================================

function initializeAppData() {
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
        localStorage.setItem(
            STORAGE_KEYS.MENU,
            JSON.stringify(DEFAULT_MENU)
        );
    }

    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(
            STORAGE_KEYS.ORDERS,
            JSON.stringify([])
        );
    }

    const currentUsers = readJSON(STORAGE_KEYS.USERS, null);
    if (!currentUsers || currentUsers.length === 0) {
        localStorage.setItem(
            STORAGE_KEYS.USERS,
            JSON.stringify(DEFAULT_DEMO_USERS)
        );
    }

    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
        localStorage.setItem(
            STORAGE_KEYS.CATEGORIES,
            JSON.stringify(DEFAULT_CATEGORIES)
        );
    }
}

// ==========================================
// MENU MANAGEMENT
// ==========================================

function getMenu() {
    return readJSON(STORAGE_KEYS.MENU, DEFAULT_MENU);
}

// Backward-compatibility alias for landing page or other callers
function getMenuItems() {
    return getMenu();
}

function saveMenu(menu) {
    localStorage.setItem(
        STORAGE_KEYS.MENU,
        JSON.stringify(menu)
    );
}

// ==========================================
// CATEGORY MANAGEMENT (ADMIN & STUDENT)
// ==========================================

function getCategories() {
    let categories = readJSON(STORAGE_KEYS.CATEGORIES, null);

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        // Build initial list from menu items if categories key is not set
        const menu = getMenu();
        const extracted = [];
        menu.forEach(item => {
            if (item.category && !extracted.includes(item.category)) {
                extracted.push(item.category);
            }
        });
        categories = extracted.length > 0 ? extracted : [...DEFAULT_CATEGORIES];
        saveCategories(categories);
    }

    return categories;
}

function saveCategories(categories) {
    localStorage.setItem(
        STORAGE_KEYS.CATEGORIES,
        JSON.stringify(categories)
    );
}

function addCategory(name) {
    const trimmed = String(name || "").trim();

    if (trimmed.length < 2 || trimmed.length > 20) {
        return { ok: false, msg: "Category name must be between 2 and 20 characters." };
    }

    const categories = getCategories();
    const isDuplicate = categories.some(cat => cat.toLowerCase() === trimmed.toLowerCase());

    if (isDuplicate) {
        return { ok: false, msg: `Category "${trimmed}" already exists.` };
    }

    categories.push(trimmed);
    saveCategories(categories);

    return { ok: true, msg: `Category "${trimmed}" added successfully.` };
}

function renameCategory(oldName, newName) {
    const trimmedOld = String(oldName || "").trim();
    const trimmedNew = String(newName || "").trim();

    if (trimmedNew.length < 2 || trimmedNew.length > 20) {
        return { ok: false, msg: "New category name must be between 2 and 20 characters." };
    }

    const categories = getCategories();
    const index = categories.findIndex(cat => cat.toLowerCase() === trimmedOld.toLowerCase());

    if (index === -1) {
        return { ok: false, msg: `Category "${trimmedOld}" not found.` };
    }

    const isDuplicate = categories.some((cat, i) => i !== index && cat.toLowerCase() === trimmedNew.toLowerCase());
    if (isDuplicate) {
        return { ok: false, msg: `Category "${trimmedNew}" already exists.` };
    }

    // Update categories array
    categories[index] = trimmedNew;
    saveCategories(categories);

    // Update all menu items using oldName
    const menu = getMenu();
    let updatedCount = 0;
    menu.forEach(item => {
        if (item.category && item.category.toLowerCase() === trimmedOld.toLowerCase()) {
            item.category = trimmedNew;
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        saveMenu(menu);
    }

    return {
        ok: true,
        msg: `Renamed category to "${trimmedNew}". Updated ${updatedCount} food item(s).`
    };
}

function deleteCategory(name) {
    const trimmed = String(name || "").trim();
    const categories = getCategories();
    const index = categories.findIndex(cat => cat.toLowerCase() === trimmed.toLowerCase());

    if (index === -1) {
        return { ok: false, msg: `Category "${trimmed}" not found.` };
    }

    // Check if any menu item is currently using this category
    const menu = getMenu();
    const itemsInCat = menu.filter(item =>
        item.category && item.category.toLowerCase() === trimmed.toLowerCase()
    );

    if (itemsInCat.length > 0) {
        return {
            ok: false,
            msg: `Cannot delete "${trimmed}": ${itemsInCat.length} food item(s) are currently assigned to this category. Please reassign or delete them first.`
        };
    }

    categories.splice(index, 1);
    saveCategories(categories);

    return { ok: true, msg: `Category "${trimmed}" deleted successfully.` };
}

// ==========================================
// ORDER MANAGEMENT
// ==========================================

function getOrders() {
    return readJSON(STORAGE_KEYS.ORDERS, []);
}

function saveOrders(orders) {
    localStorage.setItem(
        STORAGE_KEYS.ORDERS,
        JSON.stringify(orders)
    );
}

// ==========================================
// USER & SESSION MANAGEMENT
// ==========================================

function getLoggedInUser() {
    return readJSON(STORAGE_KEYS.SESSION, null);
}

function getUsers() {
    return readJSON(STORAGE_KEYS.USERS, []);
}

function saveUsers(users) {
    localStorage.setItem(
        STORAGE_KEYS.USERS,
        JSON.stringify(users)
    );
}

// Student Cart Persistence
function getStudentCart(studentId) {
    if (!studentId) return [];
    return readJSON("smartCanteenCart_" + studentId, []);
}

function saveStudentCart(studentId, cart) {
    if (!studentId) return;
    localStorage.setItem("smartCanteenCart_" + studentId, JSON.stringify(cart));
}

// ==========================================
// ORDER TOKEN GENERATION (FIXED HIGHEST + 1)
// ==========================================

function generateOrderToken() {
    const orders = getOrders();

    const highestNumber = orders.reduce((max, order) => {
        const rawToken = String(order.token || order.orderToken || "");
        const match = rawToken.match(/TK-(\d+)/i) || rawToken.match(/(\d+)/);
        const num = match ? parseInt(match[1], 10) : 0;
        return !isNaN(num) && num > max ? num : max;
    }, 0);

    const nextNumber = highestNumber + 1;

    return "TK-" + String(nextNumber).padStart(3, "0");
}

// ==========================================
// RESET DEMO DATA
// ==========================================

function resetDemoData() {
    // Remove menu, orders, categories, and student carts
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);

    // Remove any student cart keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("smartCanteenCart_")) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    // Re-initialize app data
    initializeAppData();
    getCategories();

    console.log("Smart Canteen demo data reset successfully.");
}

// Initialize data when script loads
initializeAppData();
getCategories();

console.log("Smart Canteen data initialized.");
