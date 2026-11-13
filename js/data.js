/* ==========================================
   SMART CANTEEN - CENTRAL DATA MANAGEMENT
   Theme: Modern Premium Food-Tech
========================================== */

const STORAGE_KEYS = {
    USERS: "smartCanteenUsers",
    SESSION: "smartCanteenCurrentUser",
    MENU: "smartCanteenMenu",
    ORDERS: "smartCanteenOrders",
    CATEGORIES: "smartCanteenCategories"
};

// Sleek offline vector fallback image
const DEFAULT_FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23FFF9F1'/%3E%3Ccircle cx='200' cy='135' r='55' fill='%23FFEDD5'/%3E%3Cpath d='M155 155 C155 115 245 115 245 155 Z' fill='%23F97316'/%3E%3Ccircle cx='200' cy='112' r='6' fill='%23EA580C'/%3E%3Cellipse cx='200' cy='162' rx='55' ry='8' fill='%23E5E7EB'/%3E%3Ctext x='200' y='210' font-family='sans-serif' font-size='15' font-weight='600' fill='%23777777' text-anchor='middle'%3ESmart Canteen%3C/text%3E%3C/svg%3E";

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
// 2. LUCIDE SVG ICON REGISTRY & HELPER
// ==========================================

const LUCIDE_ICONS = {
    "layout-dashboard": `<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>`,
    "utensils": `<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 11v11"/><path d="M5 2v4a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2"/><path d="M8 9v13"/>`,
    "shopping-cart": `<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>`,
    "package": `<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`,
    "users": `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    "user": `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    "indian-rupee": `<path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/>`,
    "settings": `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,
    "bell": `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,
    "clock": `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    "check-circle": `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
    "check-circle-2": `<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>`,
    "x-circle": `<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>`,
    "check": `<polyline points="20 6 9 17 4 12"/>`,
    "coffee": `<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>`,
    "pizza": `<path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16Z"/><path d="M5.71 17.11a17.71 17.71 0 0 1 11.4-11.4"/>`,
    "sandwich": `<path d="m2.37 11.22 8.6-8.6a2 2 0 0 1 2.83 0l7.83 7.83a2 2 0 0 1 0 2.83l-8.6 8.6a2 2 0 0 1-2.83 0l-7.83-7.83a2 2 0 0 1 0-2.83Z"/><path d="M14.5 16.5 16 18"/><path d="M6 13.5 7.5 15"/><path d="M9.5 8.5 11 10"/>`,
    "sun": `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
    "search": `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
    "log-out": `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>`,
    "trash-2": `<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>`,
    "plus": `<path d="M5 12h14"/><path d="M12 5v14"/>`,
    "minus": `<path d="M5 12h14"/>`,
    "x": `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
    "chef-hat": `<path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/>`,
    "rotate-ccw": `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>`,
    "arrow-right": `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
    "flame": `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,
    "inbox": `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>`,
    "trending-up": `<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`,
    "tags": `<path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a2 2 0 0 0-2 2v5.172a2 2 0 0 0 .586 1.414l6.3 6.3a2.4 2.4 0 0 0 3.4 0l4.3-4.3a2.4 2.4 0 0 0 0-3.4L9.586 5.586z"/><circle cx="5.5" cy="9.5" r=".5" fill="currentColor"/>`,
    "tag": `<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.4 2.4 0 0 0 3.4 0l4.704-4.704a2.4 2.4 0 0 0 0-3.4L12.586 2.586z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>`,
    "bar-chart-3": `<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>`,
    "home": `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`
};

function getLucideIcon(iconName, size = 18, strokeWidth = 2, className = "") {
    const content = LUCIDE_ICONS[iconName] || LUCIDE_ICONS["utensils"];
    const cls = className ? `class="lucide lucide-${iconName} ${className}"` : `class="lucide lucide-${iconName}"`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${cls} style="vertical-align: middle; display: inline-block;">${content}</svg>`;
}

// Global icon trigger
function renderAppIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
}

// Category Icon Mapper
function getCategoryIcon(categoryName) {
    const cat = String(categoryName || "").toLowerCase();
    if (cat.includes("breakfast") || cat.includes("morning")) return "sun";
    if (cat.includes("lunch") || cat.includes("meal") || cat.includes("thali")) return "utensils";
    if (cat.includes("snack") || cat.includes("fast") || cat.includes("burger")) return "pizza";
    if (cat.includes("beverage") || cat.includes("drink") || cat.includes("tea") || cat.includes("coffee")) return "coffee";
    return "tag";
}

// ==========================================
// DEFAULT FOOD MENU (HIGH-RES PHOTOGRAPHS)
// ==========================================

const DEFAULT_MENU = [
    {
        id: 1,
        name: "Veg Paneer Burger",
        category: "Snacks",
        price: 60,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
        description: "Juicy grilled paneer patty topped with fresh lettuce, onions, and tandoori mayo in a toasted bun.",
        available: true,
        popular: true
    },
    {
        id: 2,
        name: "Margherita Pizza",
        category: "Snacks",
        price: 120,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
        description: "Stone-baked hand-tossed crust with rich tomato passata and molten mozzarella.",
        available: true,
        popular: true
    },
    {
        id: 3,
        name: "Veg Sandwich",
        category: "Breakfast",
        price: 45,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
        description: "Golden toasted sandwich filled with crisp garden vegetables and melted cheddar cheese.",
        available: true,
        popular: false
    },
    {
        id: 4,
        name: "Crispy Masala Dosa",
        category: "Breakfast",
        price: 55,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        description: "Thin crispy golden crepe filled with spiced potato masala, served with coconut chutney and sambar.",
        available: true,
        popular: true
    },
    {
        id: 5,
        name: "Veg Fried Rice",
        category: "Lunch",
        price: 90,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80",
        description: "Fragrant wok-tossed basmati rice packed with crunchy seasonal greens and light soy sauce.",
        available: true,
        popular: false
    },
    {
        id: 6,
        name: "Paneer Kathi Roll",
        category: "Snacks",
        price: 70,
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
        description: "Spiced marinated paneer cubes rolled in a warm flaky paratha with mint mayonnaise.",
        available: true,
        popular: true
    },
    {
        id: 7,
        name: "Chilled Cold Coffee",
        category: "Beverages",
        price: 35,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
        description: "Creamy iced brew blended with rich espresso and cocoa drizzle.",
        available: true,
        popular: false
    },
    {
        id: 8,
        name: "Fresh Orange Juice",
        category: "Beverages",
        price: 40,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80",
        description: "Cold-pressed ripe Valencia oranges, 100% natural with no added preservatives.",
        available: true,
        popular: false
    },
    {
        id: 9,
        name: "Special Veg Thali",
        category: "Lunch",
        price: 110,
        image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80",
        description: "Wholesome lunch platter: 3 soft rotis, jeera rice, yellow dal tadka, paneer curry, and salad.",
        available: true,
        popular: true
    },
    {
        id: 10,
        name: "Crispy French Fries",
        category: "Snacks",
        price: 50,
        image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
        description: "Golden fried potato batons dusted with peri-peri seasoning and sea salt.",
        available: true,
        popular: false
    },
    {
        id: 11,
        name: "Masala Chai",
        category: "Beverages",
        price: 15,
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
        description: "Freshly boiled tea infused with crushed ginger and aromatic green cardamom.",
        available: true,
        popular: false
    },
    {
        id: 12,
        name: "Chocolate Fudge Brownie",
        category: "Snacks",
        price: 45,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
        description: "Warm, gooey dark chocolate brownie loaded with melted chocolate chunks.",
        available: true,
        popular: false
    }
];

// Default Initial Categories
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
// 3. INITIALIZE APPLICATION DATA
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
// 4. SUPABASE MENU & CATEGORY MANAGEMENT
// ==========================================

let menuCache = [];
let categoriesCache = [];
let categoryRowsCache = [];

function mapSupabaseMenuItem(row) {
    return {
        id: row.id,
        name: row.name,
        category: row.categories?.name || "",
        price: Number(row.price),
        image: row.image_url || DEFAULT_FALLBACK_IMAGE,
        description: row.description || "",
        available: row.is_available,
        popular: row.is_popular
    };
}

// Load menu and categories from Supabase.
async function loadMenuData() {
    try {
        const { data: categories, error: categoryError } =
            await supabaseClient
                .from("categories")
                .select("id, name")
                .order("name");

        if (categoryError) throw categoryError;

        const { data: menuItems, error: menuError } =
            await supabaseClient
                .from("menu_items")
                .select(`
                    id, name, price, image_url, description,
                    is_available, is_popular,
                    categories ( id, name )
                `)
                .order("name");

        if (menuError) throw menuError;

        categoryRowsCache = categories || [];
        categoriesCache = categoryRowsCache.map(category => category.name);
        menuCache = (menuItems || []).map(mapSupabaseMenuItem);

        console.log("Supabase menu loaded:", menuCache.length, "items");
        console.log("Supabase categories loaded:", categoriesCache);

        return { ok: true };

    } catch (error) {
        console.error("Could not load menu from Supabase:", error);
        return { ok: false, msg: error.message || "Could not load menu." };
    }
}

// Return copies so frontend edits don't change the cache before saving.
function getMenu() {
    return menuCache.map(item => ({ ...item }));
}

function getMenuItems() {
    return getMenu();
}

function getCategories() {
    return [...categoriesCache];
}

// Find the Supabase category ID using its name.
function getCategoryId(categoryName) {
    const category = categoryRowsCache.find(
        item => item.name.toLowerCase() === String(categoryName).toLowerCase()
    );

    return category ? category.id : null;
}

// Save additions, edits and deletions to Supabase.
async function saveMenu(menu) {
    try {
        const oldItems = menuCache || [];
        const newItems = menu || [];

        // Helper to check whether an ID is an existing valid UUID
        const isUUID = id =>
            typeof id === "string" &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        // Find items removed from the menu (only comparing valid existing UUIDs)
        const newIds = new Set(
            newItems
                .filter(item => isUUID(item.id))
                .map(item => String(item.id))
        );

        const removedIds = oldItems
            .filter(item => isUUID(item.id) && !newIds.has(String(item.id)))
            .map(item => item.id);

        if (removedIds.length > 0) {
            const { error } = await supabaseClient
                .from("menu_items")
                .delete()
                .in("id", removedIds);

            if (error) throw error;
        }

        const existingRows = [];
        const newRows = [];

        for (const item of newItems) {
            const categoryId = getCategoryId(item.category);

            if (!categoryId) {
                throw new Error(`Category "${item.category}" was not found.`);
            }

            if (isUUID(item.id)) {
                // Existing menu item: preserve actual UUID for updating/upserting
                existingRows.push({
                    id: item.id,
                    name: item.name,
                    category_id: categoryId,
                    price: Number(item.price),
                    image_url: item.image || DEFAULT_FALLBACK_IMAGE,
                    description: item.description || "",
                    is_available: item.available !== false,
                    is_popular: item.popular === true
                });
            } else {
                // New menu item: completely omit the `id` property from the payload.
                // Supabase will automatically generate a UUID using gen_random_uuid().
                newRows.push({
                    name: item.name,
                    category_id: categoryId,
                    price: Number(item.price),
                    image_url: item.image || DEFAULT_FALLBACK_IMAGE,
                    description: item.description || "",
                    is_available: item.available !== false,
                    is_popular: item.popular === true
                });
            }
        }

        // Insert new items (no `id` property sent)
        if (newRows.length > 0) {
            const { error: insertError } = await supabaseClient
                .from("menu_items")
                .insert(newRows);

            if (insertError) throw insertError;
        }

        // Upsert existing items with their actual UUIDs
        if (existingRows.length > 0) {
            const { error: updateError } = await supabaseClient
                .from("menu_items")
                .upsert(existingRows);

            if (updateError) throw updateError;
        }

        const result = await loadMenuData();
        if (!result.ok) throw new Error(result.msg);

        return { ok: true, msg: "Menu saved successfully." };

    } catch (error) {
        console.error("Could not save menu:", error);
        return { ok: false, msg: error.message || "Could not save menu." };
    }
}

// ==========================================
// 5. SUPABASE CATEGORY MANAGEMENT
// ==========================================

async function addCategory(name) {
    const trimmed = String(name || "").trim();

    if (trimmed.length < 2 || trimmed.length > 20) {
        return { ok: false, msg: "Category name must be between 2 and 20 characters." };
    }

    if (categoriesCache.some(cat => cat.toLowerCase() === trimmed.toLowerCase())) {
        return { ok: false, msg: `Category "${trimmed}" already exists.` };
    }

    try {
        const { error } = await supabaseClient
            .from("categories")
            .insert({ name: trimmed });

        if (error) throw error;

        const result = await loadMenuData();
        if (!result.ok) throw new Error(result.msg);

        return { ok: true, msg: `Category "${trimmed}" added successfully.` };

    } catch (error) {
        console.error("Could not add category:", error);
        return { ok: false, msg: error.message || "Could not add category." };
    }
}

async function renameCategory(oldName, newName) {
    const trimmedOld = String(oldName || "").trim();
    const trimmedNew = String(newName || "").trim();

    if (trimmedNew.length < 2 || trimmedNew.length > 20) {
        return { ok: false, msg: "New category name must be between 2 and 20 characters." };
    }

    const category = categoryRowsCache.find(
        item => item.name.toLowerCase() === trimmedOld.toLowerCase()
    );

    if (!category) {
        return { ok: false, msg: `Category "${trimmedOld}" not found.` };
    }

    if (categoriesCache.some(
        cat => cat.toLowerCase() === trimmedNew.toLowerCase() &&
               cat.toLowerCase() !== trimmedOld.toLowerCase()
    )) {
        return { ok: false, msg: `Category "${trimmedNew}" already exists.` };
    }

    try {
        const { error } = await supabaseClient
            .from("categories")
            .update({ name: trimmedNew })
            .eq("id", category.id);

        if (error) throw error;

        const result = await loadMenuData();
        if (!result.ok) throw new Error(result.msg);

        const updatedCount = menuCache.filter(
            item => item.category.toLowerCase() === trimmedNew.toLowerCase()
        ).length;

        return {
            ok: true,
            msg: `Renamed category to "${trimmedNew}". ${updatedCount} food item(s) remain assigned to it.`
        };

    } catch (error) {
        console.error("Could not rename category:", error);
        return { ok: false, msg: error.message || "Could not rename category." };
    }
}

async function deleteCategory(name) {
    const trimmed = String(name || "").trim();

    const category = categoryRowsCache.find(
        item => item.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (!category) {
        return { ok: false, msg: `Category "${trimmed}" not found.` };
    }

    const itemsInCategory = menuCache.filter(
        item => item.category.toLowerCase() === trimmed.toLowerCase()
    );

    if (itemsInCategory.length > 0) {
        return {
            ok: false,
            msg: `Cannot delete "${trimmed}": ${itemsInCategory.length} food item(s) are currently assigned to this category. Please reassign or delete them first.`
        };
    }

    try {
        const { error } = await supabaseClient
            .from("categories")
            .delete()
            .eq("id", category.id);

        if (error) throw error;

        const result = await loadMenuData();
        if (!result.ok) throw new Error(result.msg);

        return { ok: true, msg: `Category "${trimmed}" deleted successfully.` };

    } catch (error) {
        console.error("Could not delete category:", error);
        return { ok: false, msg: error.message || "Could not delete category." };
    }
}




// ==========================================
// 6. ORDER MANAGEMENT
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
// 7. USER & SESSION MANAGEMENT
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

function getStudentCart(studentId) {
    if (!studentId) return [];
    return readJSON("smartCanteenCart_" + studentId, []);
}

function saveStudentCart(studentId, cart) {
    if (!studentId) return;
    localStorage.setItem("smartCanteenCart_" + studentId, JSON.stringify(cart));
}

// ==========================================
// 8. ORDER TOKEN GENERATION (HIGHEST + 1)
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
// 9. RESET DEMO DATA
// ==========================================

function resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("smartCanteenCart_")) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    initializeAppData();
    getCategories();

    console.log("Smart Canteen demo data reset successfully.");
}

// Auto-run initialization
initializeAppData();
getCategories();

console.log("Smart Canteen data initialized.");
