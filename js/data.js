
/* ==========================================
   SMART CANTEEN - CENTRAL DATA MANAGEMENT
========================================== */

const STORAGE_KEYS = {
    USERS: "smartCanteenUsers",
    SESSION: "smartCanteenCurrentUser",
    MENU: "smartCanteenMenu",
    ORDERS: "smartCanteenOrders"
};

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

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(
            STORAGE_KEYS.USERS,
            JSON.stringify([])
        );
    }
}

// ==========================================
// MENU MANAGEMENT
// ==========================================

function getMenu() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.MENU)
    ) || [];
}

function saveMenu(menu) {
    localStorage.setItem(
        STORAGE_KEYS.MENU,
        JSON.stringify(menu)
    );
}

// ==========================================
// ORDER MANAGEMENT
// ==========================================

function getOrders() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ORDERS)
    ) || [];
}

function saveOrders(orders) {
    localStorage.setItem(
        STORAGE_KEYS.ORDERS,
        JSON.stringify(orders)
    );
}

// ==========================================
// CURRENT USER
// ==========================================

function getLoggedInUser() {
    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.SESSION)
    );
}

// ==========================================
// ORDER TOKEN GENERATION
// ==========================================

function generateOrderToken() {
    const orders = getOrders();

    const nextNumber = orders.length + 1;

    return "TK-" + String(nextNumber).padStart(3, "0");
}

// Initialize data when the script loads
initializeAppData();

console.log("Smart Canteen data initialized.");
