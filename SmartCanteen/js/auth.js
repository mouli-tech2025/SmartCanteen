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

async function registerStudent(name, email, password) {
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

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email.trim().toLowerCase(),
            password: password,
            options: {
                data: {
                    full_name: name.trim()
                }
            }
        });

        if (error) throw error;

        showMessage(
            data.session
                ? "Registration successful! You can now sign in."
                : "Registration successful! Please check your email to confirm your account.",
            "success"
        );

        setTimeout(() => {
            isRegisterMode = false;
            updateAuthMode();

            const emailField = document.getElementById("email");
            const passwordField = document.getElementById("password");

            if (emailField) emailField.value = email;
            if (passwordField) passwordField.value = "";
        }, 1800);

    } catch (error) {
        console.error("Registration error:", error);
        showMessage(error.message, "error");
    }
}

// ==========================================
// 8. USER LOGIN
// ==========================================
async function loginUser(email, password) {
    try {
        // Sign in through Supabase Auth
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password: password
            });

        if (error) throw error;

        const authUser = data.user;

        // Fetch the user's profile and role
        const { data: profile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("id, full_name, email, role")
                .eq("id", authUser.id)
                .single();

        if (profileError) throw profileError;

        // Ensure the selected portal matches the actual role
        if (profile.role !== selectedRole) {
            await supabaseClient.auth.signOut();

            showMessage(
                "This account does not belong to the selected portal.",
                "error"
            );
            return;
        }

        // Save a frontend session for existing dashboard code
        const session = {
            id: authUser.id,
            name: profile.full_name,
            email: profile.email,
            role: profile.role,
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

        const dashboardPages = {
            student: "student.html",
            staff: "staff.html",
            admin: "admin.html"
        };

        setTimeout(() => {
            window.location.href =
                dashboardPages[profile.role] || "login.html";
        }, 600);

    } catch (error) {
        console.error("Login error:", error);

        showMessage(
            error.message || "Invalid email or password.",
            "error"
        );
    }
}

// ==========================================
// 9. LOGOUT FUNCTION
// ==========================================

async function logoutUser() {
    try {
        const { error } = await supabaseClient.auth.signOut();

        if (error) throw error;

        localStorage.removeItem(SESSION_KEY);

        window.location.replace("login.html");

    } catch (error) {
        console.error("Logout error:", error);
        showMessage("Unable to log out. Please try again.", "error");
    }
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
    authForm.addEventListener("submit", async function(event) {
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

    await registerStudent(name, email, password);
} else {
    await loginUser(email, password);
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
