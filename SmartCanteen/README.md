# Smart Canteen Management System

A browser-based food ordering system for a college canteen. Students order food, canteen staff process the orders, and an administrator manages the menu, categories, and watches the statistics.

**Academic mini project** - Software Engineering Lab (B.Tech Information Technology, 3rd year)

> This is a frontend-only demonstration. It has no server and no database. All data is stored in the browser's LocalStorage.

---

## 1. Project Objective

Build a simple, robust, and fully working canteen management system that lets:

- **Students** browse food, filter and search live menus, manage carts, place orders, receive digital pickup tokens, and track preparation status in real-time.
- **Canteen staff** receive incoming orders, view student details and tokens, and advance orders through cooking stages (Pending &rarr; Preparing &rarr; Ready &rarr; Completed, or Reject).
- **Administrators** manage the food menu (CRUD), add/rename/delete categories, monitor sales and order reports, oversee registered users, and reset demo data.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Structure | HTML5 (Semantic elements) | Clean, modular page layouts across landing and portals |
| Styling | CSS3 (Custom properties, Flexbox, CSS Grid, media queries) | Warm minimal food-tech theme, responsive layouts for mobile, tablet, and desktop |
| Logic | Vanilla JavaScript (ES6+) | Application behaviour, state management, validations |
| Data storage | Browser LocalStorage API | Resilient client-side persistence for menu, orders, categories, carts, and session |
| Fonts | System font stack with Google Fonts fallback | Fast, clean, legible typography |

**Not used (by design):** React, Next.js, TypeScript, Node.js, Flask, PHP, jQuery, Bootstrap, Tailwind, or external databases. There are no npm packages or build steps required.

---

## 3. System Requirements

- Any modern browser: Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari (latest versions).
- A local HTTP server (such as Python `http.server`) or direct file access.
- Internet connection is optional. Used only for external food photos (if available); otherwise, built-in image fallbacks and placeholders ensure 100% offline functionality.

---

## 4. Features

### 4.1 Login and Access Control
- Dedicated authentication portal (`pages/login.html`) with role tabs for Student, Staff, and Admin.
- Pre-configured demo credentials with quick notes for instant testing.
- Student self-registration with duplicate-email prevention and name/password validation.
- Role-based routing: redirects students to `student.html`, staff to `staff.html`, and admins to `admin.html`.
- Route guard (`enforceRole`): visiting a portal without an active session redirects to `login.html`; accessing another role's dashboard automatically redirects to the user's own portal.
- Handles browser back-button behavior after logout (`pageshow` session validation).
- Logout clears only the session (`smartCanteenCurrentUser`), preserving menu, orders, and student carts.

### 4.2 Student Dashboard (`pages/student.html`)
- Personalized welcome greeting showing the student's name and current date.
- Dynamic category filter buttons ("All Items" plus all active categories from `getCategories()`).
- Live search input filtering by food name, description, and category concurrently with category filters.
- Real-time result counter ("Showing N item(s)") and friendly empty state when no food matches.
- Add to cart with quantity constraints (1 to 10 per item) and instant stock availability checks.
- Per-student cart persistence in LocalStorage (`smartCanteenCart_<studentId>`), surviving browser refreshes.
- Cart subtotal, 5% campus tax calculation, and total computation.
- One-click checkout generating unique, sequential digital tokens (`TK-001`, `TK-002`, ...).
- Order confirmation modal with pickup token display and order summary.
- "My Orders" order history with visual step-by-step progress tracking (Pending &rarr; Preparing &rarr; Ready &rarr; Completed).
- Cross-tab synchronization via `storage` event and periodic polling for real-time status updates without resetting user input.

### 4.3 Canteen Staff Dashboard (`pages/staff.html`)
- Overview metrics tracking all 5 order statuses: Pending, Preparing, Ready, Completed, and Rejected.
- Workspace navigation tabs: Overview, Incoming Orders, Preparing, Ready for Pickup, and Completed.
- Incoming order cards showing digital token, order ID, student name, email, ordered items with quantities, order total, and order timestamp.
- Strict one-step-at-a-time cooking workflow:
  - Pending &rarr; **Accept & Prepare** &rarr; Preparing
  - Preparing &rarr; **Mark as Ready** &rarr; Ready
  - Ready &rarr; **Confirm Collection** &rarr; Completed
  - Pending &rarr; **Reject** &rarr; Rejected (with confirmation prompt)
- Multi-tab synchronization reflecting changes immediately on student and admin screens.

### 4.4 Administrator Dashboard (`pages/admin.html`)
- Real-time KPI statistics: Total Orders, Total Revenue (calculated strictly from Completed orders), Total Menu Items, and Registered Users.
- Order Management: Recent Orders table and All Orders table with digital token column, student name, items list, total, and status badge.
- Food Menu Management:
  - Add/Edit food item form with validation (name 2–50 characters, unique name, price > 0, description required).
  - Category select dropdown populated dynamically from `getCategories()`.
  - Item availability toggle switch (unavailable items immediately update on student menu).
  - Food deletion with confirmation dialog.
- Category Management:
  - Add new category with validation (2–20 characters, unique).
  - Rename category, automatically updating all food items currently assigned to it.
  - Delete category with safety lock: blocked with a clear message if any food items are currently using it.
- Sales and Order Reports:
  - Total revenue from completed orders.
  - Orders by status breakdown with percentage visual bars.
  - Top-selling food items table (units sold and revenue generated).
- User Management: list of registered students and canteen staff.
- Reset Demo Data button: restores the default menu, resets categories, and clears orders/carts with confirmation, while safely keeping user accounts and session intact.

---

## 5. Project Structure

```text
SmartCanteen/
│
├── index.html              Landing page (Theme: Warm Minimal Food-Tech)
├── README.md               Project documentation and viva reference
│
├── pages/
│   ├── login.html          Role sign-in and student registration
│   ├── student.html        Student portal (Menu, Cart, My Orders)
│   ├── staff.html          Kitchen staff dashboard (Order queues, status updates)
│   └── admin.html          Admin panel (Menu CRUD, categories, reports)
│
├── css/
│   ├── style.css           Global design system tokens, landing page, responsive navbar
│   ├── student.css         Student menu grid, food cards, cart sidebar, progress tracker
│   ├── staff.css           Kitchen workspace, order queue cards, status badges
│   └── admin.css           Admin sidebar, KPI stat cards, tables, category & food forms
│
├── js/
│   ├── data.js             LocalStorage manager, safe JSON reader, sample menu, token generator
│   ├── auth.js             Authentication, registration, session management, role guards
│   ├── student.js          Student menu filters, live search, cart persistence, checkout
│   ├── staff.js            Kitchen queue management, status workflow, order stats
│   └── admin.js            Admin menu CRUD, category management, reports, reset demo data
│
└── assets/
    └── images/             Optional local food photos and assets
```

---

## 6. How to Run

There are no dependencies to install.

### Method A - Python Local Server (Recommended)
1. Open Terminal or Command Prompt in the `SmartCanteen` project folder:
   ```bash
   python3 -m http.server 5500
   ```
   *(on Windows use `python -m http.server 5500`)*
2. Open **http://localhost:5500** or **http://localhost:5500/pages/login.html** in your browser.
3. Press `Ctrl + C` in the terminal to stop the server.

### Method B - Direct Browser Opening
- Double-click `index.html` or drag it into Google Chrome, Microsoft Edge, Firefox, or Safari.

---

## 7. Demo Accounts

| Role | Email / Username | Password | Notes |
|---|---|---|---|
| **Student** | `student@smartcanteen.com` | `Student@123` | Default student (Rahul Sharma); also supports registering a new account |
| **Canteen Staff** | `staff@smartcanteen.com` | `Staff@123` | Kitchen staff display |
| **Administrator** | `admin@smartcanteen.com` | `Admin@123` | Full cafeteria management access |

---

## 8. Demo Walkthrough (for Evaluation & Viva)

1. **Admin Portal** (`admin@smartcanteen.com` / `Admin@123`):
   - Open **Manage Categories**, add a new category (e.g. `Desserts`).
   - Open **Menu Management**, click **+ Add New Food Item**, select `Desserts` from the dropdown, fill details, and save.
   - Note the updated Total Menu Items counter.
2. **Student Portal** (Open in a new tab: `student@smartcanteen.com` / `Student@123`):
   - Notice the new category `Desserts` is automatically present in the category filter chips.
   - Use search and filter together to locate items.
   - Add items to the cart, test quantity limits (+ / −, max 10), and refresh the browser to confirm the cart persists.
   - Click **Place Order &rarr;** to receive an instant digital token (e.g. `TK-001`).
3. **Staff Portal** (Open in another tab: `staff@smartcanteen.com` / `Staff@123`):
   - The new order appears with its digital token `TK-001` and student details.
   - Click **✓ Accept & Prepare** &rarr; updates to `Preparing`.
   - Click **🔔 Mark as Ready** &rarr; updates to `Ready`.
   - Click **✓ Confirm Collection** &rarr; updates to `Completed`.
4. **Student Tab Verification**:
   - The student's order card and tracker update in real-time to `Ready` and `Completed` without requiring a page reload.
5. **Admin Reporting & Safety**:
   - View **Reports**: Total Revenue reflects the completed order amount, status breakdown bars update, and top-selling food items are calculated.
   - Attempt to delete a category that still has items; observe the safety warning blocking deletion.
   - Click **↺ Reset Demo Data** to restore the clean initial state.

---

## 9. Data Storage (LocalStorage)

All application data is isolated under documented keys with safe JSON error recovery:

| Key | Format | Content & Purpose |
|---|---|---|
| `smartCanteenUsers` | Array of Objects | Registered student accounts and demo users |
| `smartCanteenCurrentUser` | Object | Current active session (name, email, role, loginTime) |
| `smartCanteenMenu` | Array of Objects | Food items (id, name, category, price, image, description, available, popular) |
| `smartCanteenOrders` | Array of Objects | Orders with digital tokens, student info, items, totals, timestamps, and statuses |
| `smartCanteenCategories` | Array of Strings | Categories list (`["Snacks", "Breakfast", "Lunch", "Beverages", ...]`) |
| `smartCanteenCart_<studentId>` | Array of Objects | Per-student cart items (`id, name, price, image, quantity`) |

---

## 10. Order Status Workflow

```text
Pending ──► Preparing ──► Ready ──► Completed
   │
   └──────► Rejected       (Permitted from Pending only)
```

- **Valid Transitions**:
  - `Pending` &rarr; `Preparing`
  - `Preparing` &rarr; `Ready`
  - `Ready` &rarr; `Completed`
  - `Pending` &rarr; `Rejected`
- `Completed` and `Rejected` are terminal states. Transitioning backward or skipping steps is prohibited by validation logic in `updateOrderStatus()`.

---

## 11. Design Theme - Warm Minimal Food-Tech

| Color Token | Hex Code | Visual Application |
|---|---|---|
| **Primary Orange** | `#F97316` | Action buttons, active navigation, brand highlights |
| **Darker Orange** | `#EA580C` | Button hover states, category pill text |
| **Background Cream** | `#FFF7ED` | Page background, warm soft surface |
| **Dark Charcoal** | `#292524` | Primary typography and headings |
| **Success Green** | `#16A34A` | Completed status, ready badge, confirmation icons |
| **White Surface** | `#FFFFFF` | Cards, sidebars, tables, and modal backgrounds |

---

## 12. Testing & Verification Checklist

- [x] **Authentication**: Student, Staff, and Admin roles each log in and reach their respective dashboards.
- [x] **Invalid Login**: Incorrect passwords show inline error alerts without crashing.
- [x] **Role Guard**: Accessing `admin.html` as a student redirects to `student.html`; accessing unauthorized pages without logging in redirects to `login.html`.
- [x] **Logout & Back-Button**: Logout clears `smartCanteenCurrentUser`; browser back button does not reopen protected dashboards.
- [x] **Safe JSON Reader**: Corrupted LocalStorage strings fall back safely without uncaught exceptions.
- [x] **Token Generation**: Uses highest existing token number + 1 (`TK-001`, `TK-002`, ...); prevents duplicate tokens even across deletions.
- [x] **Student Menu**: Live search and category filters work together seamlessly with dynamic category chips.
- [x] **Student Cart**: Persists across refreshes per student; enforces 1 to 10 quantity limits; blocks unavailable items.
- [x] **Staff Workflow**: Real-time status transitions (Pending &rarr; Preparing &rarr; Ready &rarr; Completed, and Pending &rarr; Rejected).
- [x] **Staff Statistics**: Accurate live counts for all 5 statuses (Pending, Preparing, Ready, Completed, Rejected).
- [x] **Admin Menu CRUD**: Add, edit, availability toggle, and delete with input validation (unique name, price > 0).
- [x] **Admin Categories**: Add, rename (cascading to food items), and delete (blocked when category contains items).
- [x] **Admin Reports**: Total revenue (Completed only), status percentage bars, and top-selling food items table.
- [x] **Reset Demo Data**: Restores initial sample menu, categories, and resets orders/carts while preserving registered users.
- [x] **Responsive Layout**: Verified on mobile (375px), tablet (768px), and desktop (1280px) widths.
- [x] **Console Integrity**: Zero errors or warnings across all pages.

---

## 13. Limitations

- **Browser-scoped storage**: LocalStorage is isolated to the specific browser on the local machine; cross-device syncing requires a backend.
- **Client-side passwords**: As an academic demonstration, passwords are stored in plain text in LocalStorage. A production system would utilize server-side bcrypt/Argon2 hashing and JWTs.
- **Demo payments**: Simulates "Pay at Counter" and wallet checkouts without live payment gateway APIs.

---
