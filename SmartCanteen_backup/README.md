# Smart Canteen Management System

A browser-based food ordering system for a college canteen. Students order food, canteen staff process the orders, and an administrator manages the menu and watches the statistics.

**Academic mini project** - Software Engineering Lab (B.Tech Information Technology, 3rd year)

> This is a frontend-only demonstration. It has no server and no database. All data is stored in the browser's LocalStorage.

---

## 1. Project Objective

Build a simple but fully working canteen system that lets:

- **Students** browse food, add items to a cart, place orders and track them.
- **Canteen staff** receive orders and move them through the preparation stages.
- **Administrators** manage the food menu and categories and monitor basic statistics.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Structure | HTML5 | Pages and layout |
| Styling | CSS3 (custom properties, Flexbox, Grid, media queries) | Warm minimal food-tech theme, responsive design |
| Logic | Vanilla JavaScript (ES6+) | All application behaviour |
| Data storage | Browser LocalStorage | Users, menu, carts, orders, session |
| Font | Google Fonts - Poppins (system font fallback) | Typography |

**Not used (by design):** React, Next.js, TypeScript, Node.js, Flask, PHP, any backend, any framework or library, any build tool. There is nothing to install.

---

## 3. System Requirements

- Any modern browser: Google Chrome, Microsoft Edge, Firefox or Safari (latest versions).
- A code editor (VS Code, Antigravity, etc.) only if you want to read or edit the code.
- Internet is optional. It is used only for the Google Font and for food photos that have web links. Without internet the app still works with the system font and emoji food pictures.

---

## 4. Features

### 4.1 Login and access control
- Login page with three demo roles and quick-fill buttons.
- Role-based redirect: student -> `student.html`, staff -> `staff.html`, admin -> `admin.html`.
- Route guard: opening a dashboard without logging in, or with the wrong role, redirects away.
- Logout clears only the session. Menu, orders and carts are kept.

### 4.2 Student dashboard
- Welcome message with the student's name.
- Food cards with image, name, description, price and category.
- Category filter (All, Snacks, Meals, Beverages, Desserts, and any category the admin adds).
- Live search by food name (works together with the category filter).
- Add to cart, increase/decrease quantity, remove item, clear cart (maximum 10 per item).
- Cart total is calculated automatically.
- Place Order with validation (cart not empty, items still available).
- My Orders with filters (All, Active, Completed, Rejected), order history and a progress tracker.
- Status changes made by staff appear automatically, with a notification.

### 4.3 Canteen staff dashboard
- Overview with counts: Pending, Preparing, Ready, Completed today.
- Incoming orders (oldest first) showing order ID, student name, items and quantities, total and order time.
- Accept or Reject pending orders (Reject asks for confirmation).
- One-step-at-a-time updates: Accepted -> Preparing -> Ready -> Completed.
- Separate pages for Active orders and Completed/Rejected orders.

### 4.4 Administrator dashboard
- Statistics: Total Orders, Total Food Items, Total Students, Total Revenue (completed orders only).
- Orders-by-status bars and the five most recent orders.
- Add, edit and delete food items, with form validation and live image preview.
- Availability switch per item (unavailable items are shown greyed out to students).
- Add, rename and delete categories (deletion is blocked while food items still use the category).
- View all orders with status filter and search by order ID or student name.
- Reset Demo Data button (restores the original sample data before a demo).

---

## 5. Project Structure

```
Smart-Canteen/
├── index.html          Landing page
├── login.html          Login page
├── student.html        Student dashboard (Menu, Cart, My Orders)
├── staff.html          Staff dashboard (Overview, Incoming, Active, Completed)
├── admin.html          Admin dashboard (Dashboard, Manage Menu, Categories, All Orders)
├── README.md           This file
│
├── css/
│   ├── style.css       Global theme: colours, buttons, forms, badges, toast, modal
│   ├── login.css       Login and landing pages
│   ├── dashboard.css   Sidebar layout, stats, tables, order cards (all roles)
│   └── student.css     Menu grid, food cards, cart
│
├── js/
│   ├── storage.js      LocalStorage helpers and one-time sample data
│   ├── utils.js        Reusable helpers: toast, confirm box, image fallback, sidebar
│   ├── auth.js         Login, logout, session, role guard
│   ├── menu.js         Menu reading, filtering, food card HTML
│   ├── cart.js         Cart logic and checkout
│   ├── orders.js       Order status rules and order card HTML
│   ├── student.js      Student page wiring
│   ├── staff.js        Staff page wiring
│   └── admin.js        Admin page wiring: menu CRUD, categories, stats
│
└── assets/images/      Optional local food photos
```

**Important:** keep the HTML files in the main folder, next to `css/` and `js/`. The pages load files with relative paths such as `css/style.css`.

---

## 6. How to Run

There is nothing to install or build.

### Method A - Open in the browser
- **Windows:** double-click `index.html`.
- **Mac:** right-click `index.html` -> **Open With** -> Chrome or Safari. (A double-click may open a code editor instead.) You can also drag the file into a browser window.

### Method B - Local server (most reliable)
1. Open Terminal (Mac) or Command Prompt (Windows) in the project folder, the one that contains `index.html`.
2. Run:
   ```
   python3 -m http.server 8000
   ```
   (on Windows use `python -m http.server 8000`)
3. Open **http://localhost:8000** in your browser.
4. Press `Ctrl + C` in the terminal to stop.

### Method C - VS Code / Antigravity
1. File -> Open Folder -> choose `Smart-Canteen`.
2. Install the **Live Server** extension.
3. Right-click `index.html` -> **Open with Live Server**.

---

## 7. Demo Accounts

| Role | Username | Password |
|---|---|---|
| Student | `student` | `1234` |
| Staff | `staff` | `1234` |
| Admin | `admin` | `1234` |

Extra student records (`priya`, `amit`, `sneha`, all with password `1234`) exist so that "Total Students" shows a meaningful number.

---

## 8. Demo Walkthrough (for presentation)

1. **Admin** (`admin`/`1234`): open Manage Menu, add a category and a new food item, and note the dashboard counts.
2. **Student** (`student`/`1234`): find the new item (try search and category chips), add 2 to the cart, change the quantity, place the order, and open My Orders.
3. **Staff** (second browser tab, same browser): Incoming Orders -> Accept -> Start Preparing -> Mark Ready -> Mark Completed.
4. **Student tab:** the status and progress tracker update automatically within a few seconds.
5. **Admin:** Total Orders and Total Revenue have increased. Switch an item to unavailable and show that the student can no longer order it.
6. Click **Reset demo data** (Admin -> Dashboard) to restore the original data.

---

## 9. Data Storage (LocalStorage)

All keys start with `sc_`.

| Key | Content |
|---|---|
| `sc_initialized` | Flag that stops sample data being added twice |
| `sc_users` | Demo users (id, name, username, password, role) |
| `sc_categories` | List of category names |
| `sc_menu` | Food items |
| `sc_cart_<userId>` | One cart per student, e.g. `sc_cart_u1` |
| `sc_orders` | All orders, shared by every role |
| `sc_session` | Currently logged-in user (no password) |

### Food item
```json
{ "id": "f2", "name": "Veg Burger", "category": "Snacks", "description": "...", "price": 60, "image": "https://...", "available": true }
```

### Order
```json
{
  "id": "ORD-1005", "userId": "u1", "studentName": "Rahul Sharma",
  "items": [ { "foodId": "f2", "name": "Veg Burger", "price": 60, "quantity": 2 } ],
  "total": 120, "status": "Pending",
  "createdAt": "2026-11-13T10:30:00.000Z", "updatedAt": "2026-11-13T10:30:00.000Z"
}
```
Each order stores a **snapshot** of the item name and price, so later menu changes never alter past orders.

---

## 10. Order Status Workflow

```
Pending --> Accepted --> Preparing --> Ready --> Completed
   |
   +--> Rejected        (possible only from Pending)
```

Completed and Rejected are final. Steps cannot be skipped or reversed. The rule is stored in one place (`NEXT_STATUS` in `js/orders.js`) and checked in `updateOrderStatus()`.

---

## 11. How It Works (design notes)

- **Shared data:** student, staff and admin pages all read and write the same `sc_orders` key. This is how a staff action reaches the student.
- **Live updates:** each dashboard listens to the browser `storage` event (other tabs) and also checks for changes every 3 seconds.
- **Reusable functions:** `getData/setData`, `showToast`, `confirmDialog`, `renderFoodCard`, `renderOrderCard`, `updateOrderStatus`, `placeOrder`, `requireRole`.
- **Safe rendering:** all user-entered text passes through `escapeHTML()` before it goes into `innerHTML`.
- **No duplicate sample data:** `seedData()` checks `sc_initialized` and does nothing after the first run.
- **Image fallback:** every food image has an `onerror` handler that switches to a built-in emoji picture.
- **Responsive design:** on screens narrower than 900px the sidebar becomes a slide-in menu.

---

## 12. Design Theme - Warm Minimal Food-Tech

| Colour | Hex | Use |
|---|---|---|
| Primary Orange | `#F97316` | Buttons, active items, highlights |
| Background Cream | `#FFF7ED` | Page background |
| Dark Charcoal | `#292524` | Text |
| Success Green | `#16A34A` | Ready/Completed, success messages |
| White | `#FFFFFF` | Cards, sidebar |

Soft status colours (amber, blue, red) are used only for order status badges and errors.

---

## 13. Testing Checklist

**Login**
- [ ] `student`, `staff`, `admin` each open the correct dashboard
- [ ] Wrong password and empty fields show an error
- [ ] Logout returns to the login page
- [ ] Opening `admin.html` as a student redirects away

**Student**
- [ ] Menu, category chips and search work together
- [ ] Unavailable item cannot be added
- [ ] Add, +, -, remove and clear cart work; total updates
- [ ] Cart survives a page refresh
- [ ] Place Order creates a Pending order and empties the cart
- [ ] Order status updates after staff changes it

**Staff**
- [ ] Accept and Reject work
- [ ] Each step to Completed works, one at a time
- [ ] Orders appear in the correct section

**Admin**
- [ ] Statistics are correct (revenue counts Completed orders only)
- [ ] Add, edit, delete food item and validation messages work
- [ ] Availability switch is reflected in the student menu
- [ ] Add, rename, delete category (delete blocked if in use)
- [ ] All Orders filter and search work

**General**
- [ ] Data stays after refresh; sample data is not duplicated
- [ ] Layout works on a phone-sized window
- [ ] No red errors in the browser console (F12)

---

## 14. Limitations

- LocalStorage belongs to one browser on one computer. It is not a multi-user system, and different devices do not share data.
- Passwords are stored as plain text because this is a demo. Real systems store hashed passwords on a server.
- Anyone who opens the browser developer tools can read or change the data.
- No online payment, no real notifications, no image upload (images use a URL or a local file path).
- Some sample food photos load from the internet. If one fails, the emoji fallback is shown.

---

## 15. Possible Future Improvements

- Backend and database (for example Node.js with MongoDB, or Flask with MySQL) for real multi-user use.
- Secure authentication with hashed passwords and tokens.
- Online payment and QR/token-based order pickup.
- Email or SMS notifications.
- Sales reports and charts for the administrator.

---
