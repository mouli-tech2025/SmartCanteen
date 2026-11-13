# Smart Canteen Management System

A browser-based food ordering and canteen management system for a college canteen. Students can browse food items, manage their carts, place orders and track order status. Canteen staff process incoming orders, while administrators manage food items, categories, users and canteen operations.

**Academic Mini Project** – Software Engineering Lab  
B.Tech Information Technology – 3rd Year

---

## 1. Project Objective

Build a simple, robust and user-friendly canteen management system that allows:

- **Students:** Browse food, search and filter menus, manage carts, place orders, receive digital pickup tokens and track order status.
- **Canteen Staff:** Receive incoming orders, view student details and order tokens, and update orders through preparation stages.
- **Administrators:** Manage food menu items, add, rename and delete categories, monitor orders, view users and manage canteen operations.

The application uses Supabase as its backend to provide centralized authentication and database storage.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Structure | HTML5 | Page layouts and application structure |
| Styling | CSS3 | Responsive design and user interface |
| Logic | Vanilla JavaScript (ES6+) | Application functionality and validation |
| Backend | Supabase | Backend services and database integration |
| Database | PostgreSQL | Persistent storage of application data |
| Authentication | Supabase Auth | User authentication |
| Access Control | Supabase Row Level Security (RLS) | Role-based data access and security |
| Cart Storage | Browser LocalStorage | Per-student cart persistence |
| Hosting | Netlify | Website deployment and hosting |

**Not used:** React, Next.js, TypeScript, Node.js, Flask, PHP, jQuery, Bootstrap or Tailwind CSS.

The application uses vanilla HTML, CSS and JavaScript without requiring a frontend framework or build process.

---

## 3. System Requirements

- Any modern browser: Google Chrome, Microsoft Edge, Mozilla Firefox or Safari.
- A code editor such as Visual Studio Code.
- Internet connection for Supabase authentication and database access.
- A Supabase account and configured project.
- A local HTTP server or static website hosting platform such as Netlify.

---

## 4. Features

### 4.1 Login and Access Control

- Dedicated authentication portal (`pages/login.html`) with Student, Staff and Admin access.
- User authentication through Supabase Auth.
- Student registration and login.
- User profile information stored in the Supabase `profiles` table.
- Role-based access using Student, Staff and Admin roles.
- Role-based routing to the appropriate dashboard.
- Route guard (`enforceRole`) to prevent unauthorized dashboard access.
- Session validation after browser navigation.
- Logout functionality.

### 4.2 Student Dashboard (`pages/student.html`)

- Personalized welcome greeting showing the student's name.
- Current date display.
- Dynamic category filter buttons.
- Search food by name, description and category.
- Popular food section.
- Add food items to the cart.
- Update item quantities and remove items.
- Per-student cart persistence using browser LocalStorage.
- Cart subtotal, 5% campus tax calculation and total computation.
- Checkout and order placement.
- Unique digital pickup tokens.
- Order confirmation with order summary.
- Student order history retrieved from Supabase.
- Visual order progress tracking:
  Pending → Preparing → Ready → Completed.
- Storage-event synchronization and periodic order checking.

### 4.3 Canteen Staff Dashboard (`pages/staff.html`)

- View incoming orders from Supabase.
- View student names and email addresses.
- View digital order tokens.
- View ordered food items and quantities.
- View order totals and payment methods.
- Order statistics for all five statuses.
- Order management workflow:

  - Pending → Preparing
  - Preparing → Ready
  - Ready → Completed
  - Pending → Rejected

- Confirmation before rejecting an order.
- Order status changes saved in Supabase.
- Refresh dashboard data from the database.

### 4.4 Administrator Dashboard (`pages/admin.html`)

- Dashboard statistics and order monitoring.
- View total orders, revenue, menu items and registered users.
- View recent orders and complete order information.
- Food menu management:
  - Add new food items.
  - Edit existing food items.
  - Update food availability.
  - Delete food items.
- Category management:
  - Add categories.
  - Rename categories.
  - Delete categories with safety validation.
- View registered students and staff.
- Monitor canteen orders and operations.

---

## 5. Project Structure

The main application files are organized as follows:

```text
SmartCanteen/
│
├── index.html
├── README.md
├── supabase.js
│
├── pages/
│   ├── login.html
│   ├── student.html
│   ├── staff.html
│   └── admin.html
│
├── css/
│   ├── style.css
│   ├── student.css
│   ├── staff.css
│   └── admin.css
│
├── js/
│   ├── data.js
│   ├── auth.js
│   ├── student.js
│   ├── staff.js
│   └── admin.js
│
└── assets/
    └── images/
```

*Note: The structure above represents the main application organization. Additional assets and files may be present in the project.*

---

## 6. How to Run

### Prerequisites

- Supabase project.
- Supabase Project URL.
- Supabase Publishable Key.
- Modern web browser.
- Local development server.

### Step 1 – Configure Supabase

Create a Supabase project and configure the required database tables and authentication.

Main tables:

- `profiles`
- `menu_items`
- `categories`
- `orders`
- `order_items`

### Step 2 – Configure Supabase Connection

Open `supabase.js` and configure the project URL and publishable key:

```javascript
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
```

Use the Supabase publishable key in frontend code. Never expose the service role key.

### Step 3 – Run the Application Locally

Open the project folder in a terminal and start a local server:

```bash
python3 -m http.server 5500
```

On Windows:

```bash
python -m http.server 5500
```

Open:

```text
http://localhost:5500/
```

---

## 7. User Roles and Accounts

The application supports three user roles:

| Role | Access |
|---|---|
| Student | Food menu, cart, checkout and order history |
| Canteen Staff | Incoming orders and order status management |
| Administrator | Menu, categories, users and order management |

User accounts are managed through Supabase Authentication, with corresponding profile information stored in the `profiles` table.

For security, account passwords are not included in this documentation.

---

## 8. Demo Walkthrough (for Evaluation & Viva)

### 1. Administrator Portal

- Log in using an administrator account.
- Open category management and add a new category.
- Open menu management and add a food item.
- Edit an existing item or change its availability.
- View registered users and order information.

### 2. Student Portal

- Log in using a student account.
- Browse available food items.
- Use search and category filters.
- Add food items to the cart.
- Change quantities and verify the total.
- Place an order.
- Receive the digital order token.
- Open My Orders to view order details and progress.

### 3. Staff Portal

- Log in using a staff account.
- View incoming student orders.
- Check student information and ordered items.
- Accept an order and change its status to Preparing.
- Mark it as Ready.
- Confirm collection to complete the order.
- Test rejection of a pending order.

### 4. Student Order Verification

- Return to the student dashboard.
- Open order history.
- Verify that the order status reflects the staff's update.

### 5. Database Verification

- Open the Supabase dashboard.
- Verify student profiles.
- Verify food menu and categories.
- Verify saved orders and order items.
- Verify order status changes.

---

## 9. Database and Data Storage

The project uses Supabase PostgreSQL for centralized data storage.

| Table | Purpose |
|---|---|
| `profiles` | Stores user names, email addresses and roles |
| `menu_items` | Stores food item information, prices and availability |
| `categories` | Stores food categories |
| `orders` | Stores student orders, tokens, totals and statuses |
| `order_items` | Stores individual food items associated with orders |
| `cart` | Additional cart-related database table |
| `cart_items` | Additional cart-related database table |

The current student cart implementation uses browser LocalStorage for per-student cart persistence.

### Supabase Security

- Supabase Authentication manages user sessions.
- PostgreSQL Row Level Security protects database records.
- Students can access their own orders.
- Staff and administrators have authorized access to order management.
- Role-based policies control access to protected data.

---

## 10. Order Status Workflow

```text
Pending ──► Preparing ──► Ready ──► Completed
   │
   └──────► Rejected
```

### Valid Transitions

- Pending → Preparing
- Preparing → Ready
- Ready → Completed
- Pending → Rejected

Completed and Rejected are terminal states. Backward transitions and skipping stages are prevented by the application logic.

---

## 11. Design Theme – Warm Minimal Food-Tech

The application uses a warm, minimal food-inspired visual theme.

| Color Token | Hex Code | Visual Application |
|---|---|---|
| Primary Orange | `#F97316` | Buttons and highlights |
| Darker Orange | `#EA580C` | Hover states and active elements |
| Background Cream | `#FFF7ED` | Page background |
| Dark Charcoal | `#292524` | Text and headings |
| Success Green | `#16A34A` | Success and completed status |
| White Surface | `#FFFFFF` | Cards, sidebars and modals |

The interface is designed to provide a consistent experience across student, staff and administrator dashboards.

---

## 12. Testing & Verification Checklist

- [x] Supabase connection initialization.
- [x] Authentication for Student, Staff and Admin roles.
- [x] Role-based dashboard access.
- [x] Student menu loaded from Supabase.
- [x] Category management.
- [x] Student cart functionality.
- [x] Per-student cart persistence.
- [x] Checkout and order creation.
- [x] Order details saved in Supabase.
- [x] Student order history.
- [x] Staff order viewing.
- [x] Staff order status updates.
- [x] Order rejection.
- [x] Student and staff order information.
- [x] Admin menu and category management.
- [x] User and order management.
- [x] Database Row Level Security policies.
- [ ] Final live deployment verification.

---

## 13. Limitations and Future Enhancements

### Current Limitations

- Student cart data is stored in browser LocalStorage rather than synchronized across devices.
- Online payment gateway integration is not included.
- Real-time push notifications are not included.
- Application functionality depends on internet connectivity for Supabase services.
- The project is designed as an academic mini project rather than a production-scale commercial canteen platform.

### Future Enhancements

- Online payment gateway integration.
- Email and SMS order notifications.
- Real-time order status notifications.
- QR-code-based pickup verification.
- Advanced sales and revenue analytics.
- Downloadable order reports.
- Cross-device cart synchronization.

---

## Project Information

**Project Name:** Smart Canteen Management System

**Project Type:** Academic Mini Project

**Course:** B.Tech Information Technology

**Academic Activity:** Software Engineering Lab

**Frontend:** HTML, CSS and JavaScript

**Backend:** Supabase

**Database:** PostgreSQL

**Hosting:** Netlify

---

## Conclusion

The Smart Canteen Management System provides a digital solution for simplifying college canteen operations.

Students can conveniently browse food items, place orders and track their order progress. Canteen staff can efficiently manage incoming orders, while administrators can manage food items, categories, users and canteen activities.

By combining frontend web technologies with Supabase backend services, the project provides a centralized and user-friendly canteen management platform.

**Smart Canteen Management System – Making Canteen Ordering Smarter and Easier! 🍽️**