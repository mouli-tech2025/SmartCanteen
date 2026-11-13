/* ==========================================
   SMART CANTEEN - AUTHENTICATION MODULE
   Student Registration + Role-Based Login
========================================== */

// Demo credentials for Student, Staff, and Admin
const DEMO_ACCOUNTS = {
    student: {
        email: "student@smartcanteen.com",
        password: "Student@123",
        name: "Rahul Sharma",
        role: "student",
        id: "STU001"
    },

    staff: {
        email: "staff@smartcanteen.com",
        password: "Staff@123",
        name: "Canteen Staff",
        role: "staff"
    },

    admin: {
        email: "admin@smartcanteen.com",
        password: "Admin@123",
        name: "Administrator",
        role: "admin"
    }
};

// LocalStorage keys
const USERS_KEY = "smartCanteenUsers";
const SESSION_KEY = "smartCanteenCurrentUser";

// Current authentication settings
let selectedRole = "student";
let isRegisterMode = false;


// ==========================================
// 1. GET REGISTERED STUDENTS
// ==========================================

function getUsers() {
    if (typeof readJSON === "function") {
        return readJSON(USERS_KEY, []);
    }
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (e) {
        return [];
    }
}


// ==========================================
// 2. SAVE REGISTERED STUDENTS
// ==========================================

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


// ==========================================
// 3. DISPLAY MESSAGE
// ==========================================

function showMessage(message, type) {
    const messageBox = document.getElementById("authMessage");
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = "auth-message " + type;
}


// ==========================================
// 4. CHANGE LOGIN / REGISTRATION MODE
// ==========================================

function updateAuthMode() {
    const nameGroup = document.getElementById("nameGroup");
    const authTitle = document.getElementById("authTitle");
    const authSubtitle = document.getElementById("authSubtitle");
    const submitButton = document.getElementById("submitButton");
    const registerSection = document.getElementById("registerSection");
    const demoInfo = document.getElementById("demoInfo");
    const passwordInput = document.getElementById("password");
    const messageBox = document.getElementById("authMessage");

    if (messageBox) {
        messageBox.className = "auth-message";
        messageBox.textContent = "";
    }

    if (isRegisterMode) {
        if (authTitle) authTitle.textContent = "Create Your Account";
        if (authSubtitle) authSubtitle.textContent = "Register to order your favourite food.";
        if (nameGroup) nameGroup.classList.remove("hidden");
        if (submitButton) submitButton.textContent = "Create Account →";

        if (registerSection) {
            registerSection.innerHTML = `
                Already have an account?
                <button type="button" id="registerToggle">
                    Sign In
                </button>
            `;
        }

        if (demoInfo) demoInfo.classList.add("hidden");
        if (passwordInput) passwordInput.autocomplete = "new-password";

    } else {
        if (authTitle) authTitle.textContent = "Welcome Back!";
        if (authSubtitle) authSubtitle.textContent = "Sign in to continue to Smart Canteen.";
        if (nameGroup) nameGroup.classList.add("hidden");
        if (submitButton) submitButton.textContent = "Sign In →";

        if (registerSection) {
            registerSection.innerHTML = `
                Don't have a student account?
                <button type="button" id="registerToggle">
                    Create Account
                </button>
            `;
        }

        if (demoInfo) demoInfo.classList.remove("hidden");
        if (passwordInput) passwordInput.autocomplete = "current-password";
    }

    // Reattach event listener after updating HTML
    const toggleBtn = document.getElementById("registerToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleRegisterMode);
    }
}


// ==========================================
// 5. TOGGLE REGISTRATION
// ==========================================

function toggleRegisterMode() {
    if (selectedRole !== "student") {
        showMessage(
            "Registration is available only for students.",
            "error"
        );
        return;
    }

    isRegisterMode = !isRegisterMode;
    updateAuthMode();
}


// ==========================================
// 6. CHANGE USER ROLE
// ==========================================

function changeRole(role) {
    selectedRole = role;
    isRegisterMode = false;

    document.querySelectorAll(".role-option").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.role === role
        );
    });

    updateAuthMode();

    const registerSection = document.getElementById("registerSection");
    if (registerSection) {
        registerSection.classList.toggle("hidden", role !== "student");
    }

    const note = document.getElementById("demoInfo");
    if (note) {
        if (role === "staff") {
            note.innerHTML = `
                <strong>Staff Demo Credentials</strong><br>
                Email: staff@smartcanteen.com<br>
                Password: Staff@123
            `;
        } else if (role === "admin") {
            note.innerHTML = `
                <strong>Admin Demo Credentials</strong><br>
                Email: admin@smartcanteen.com<br>
                Password: Admin@123
            `;
        } else {
            note.innerHTML = `
                <strong>Student Demo Credentials</strong><br>
                Email: student@smartcanteen.com<br>
                Password: Student@123<br>
                <small style="color:#78716c;">(Or click Create Account to register your own profile)</small>
            `;
        }
    }
}


// ==========================================
// 7. STUDENT REGISTRATION
// ==========================================

function registerStudent(name, email, password) {
    const users = getUsers();

    // Check duplicate email
    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        showMessage(
            "An account with this email already exists.",
            "error"
        );
        return;
    }

    // Validate name
    if (!name || name.trim().length < 2) {
        showMessage(
            "Please enter a valid full name (at least 2 characters).",
            "error"
        );
        return;
    }

    // Validate password
    if (!password || password.length < 6) {
        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );
        return;
    }

    // Create new student
    const newStudent = {
        id: "STU" + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: "student",
        createdAt: new Date().toISOString()
    };

    users.push(newStudent);
    saveUsers(users);

    showMessage(
        "Registration successful! Please sign in.",
        "success"
    );

    // Switch back to login mode
    setTimeout(() => {
        isRegisterMode = false;
        updateAuthMode();
        const emailField = document.getElementById("email");
        const passwordField = document.getElementById("password");
        if (emailField) emailField.value = email;
        if (passwordField) passwordField.value = "";
    }, 1000);
}


// ==========================================
// 8. USER LOGIN
// ==========================================

function loginUser(email, password) {
    let user = null;

    if (selectedRole === "student") {
        const users = getUsers();

        user = users.find(
            item =>
                item.email.toLowerCase() === email.toLowerCase() &&
                item.password === password &&
                item.role === "student"
        );

        // Fallback check against DEMO_ACCOUNTS student
        if (!user && email.toLowerCase() === DEMO_ACCOUNTS.student.email.toLowerCase() && password === DEMO_ACCOUNTS.student.password) {
            user = DEMO_ACCOUNTS.student;
        }

    } else {
        const account = DEMO_ACCOUNTS[selectedRole];

        if (
            email.toLowerCase() === account.email.toLowerCase() &&
            password === account.password
        ) {
            user = account;
        }
    }

    if (!user) {
        showMessage(
            "Invalid email or password for the selected portal.",
            "error"
        );
        return;
    }

    // Create login session
    const session = {
        id: user.id || user.role.toUpperCase() + "001",
        name: user.name,
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );

    showMessage(
        "Login successful! Redirecting...",
        "success"
    );

    // Redirect based on role
    const dashboardPages = {
        student: "student.html",
        staff: "staff.html",
        admin: "admin.html"
    };

    setTimeout(() => {
        window.location.href = dashboardPages[user.role] || "login.html";
    }, 600);
}


// ==========================================
// 9. LOGOUT FUNCTION
// ==========================================

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    // Replace window location so pressing back does not return
    window.location.replace("login.html");
}


// ==========================================
// 10. GET CURRENT LOGGED-IN USER
// ==========================================

function getCurrentUser() {
    if (typeof readJSON === "function") {
        return readJSON(SESSION_KEY, null);
    }
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
        return null;
    }
}


// ==========================================
// 11. ROLE GUARD HELPER
// ==========================================

function enforceRole(expectedRole) {
    const user = getCurrentUser();

    if (!user || !user.role) {
        window.location.replace("login.html");
        return null;
    }

    if (user.role !== expectedRole) {
        const routes = {
            student: "student.html",
            staff: "staff.html",
            admin: "admin.html"
        };
        const target = routes[user.role] || "login.html";
        window.location.replace(target);
        return null;
    }

    // Guard against browser back button after logout
    window.addEventListener("pageshow", function(event) {
        if (event.persisted) {
            const recheck = getCurrentUser();
            if (!recheck || recheck.role !== expectedRole) {
                window.location.replace("login.html");
            }
        }
    });

    return user;
}


// ==========================================
// 12. AUTHENTICATION FORM SETUP (LOGIN PAGE)
// ==========================================

const authForm = document.getElementById("authForm");

if (authForm) {
    authForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email")
            .value.trim().toLowerCase();

        const password = document.getElementById("password")
            .value;

        if (!email || !password) {
            showMessage("Please fill in all required fields.", "error");
            return;
        }

        if (isRegisterMode) {
            const name = document.getElementById("name")
                .value.trim();

            registerStudent(name, email, password);
        } else {
            loginUser(email, password);
        }
    });

    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll(".role-option").forEach(button => {
            button.addEventListener("click", function() {
                changeRole(this.dataset.role);
            });
        });

        const toggleBtn = document.getElementById("registerToggle");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", toggleRegisterMode);
        }

        // Check URL params for role selection (?role=staff or ?role=admin)
        const params = new URLSearchParams(window.location.search);
        const queryRole = params.get("role");
        if (queryRole && ["student", "staff", "admin"].includes(queryRole)) {
            changeRole(queryRole);
        } else {
            changeRole("student");
        }

        console.log("Smart Canteen Authentication Ready!");
    });
}
