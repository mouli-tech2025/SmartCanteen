
/* ==========================================
   SMART CANTEEN - AUTHENTICATION MODULE
   Student Registration + Role-Based Login
========================================== */

// Demo credentials for Staff and Admin
const DEMO_ACCOUNTS = {
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
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
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

    messageBox.className = "auth-message";
    messageBox.textContent = "";

    if (isRegisterMode) {

        authTitle.textContent = "Create Your Account";
        authSubtitle.textContent = "Register to order your favourite food.";

        nameGroup.classList.remove("hidden");

        submitButton.textContent = "Create Account →";

        registerSection.innerHTML = `
            Already have an account?
            <button type="button" id="registerToggle">
                Sign In
            </button>
        `;

        demoInfo.classList.add("hidden");

        passwordInput.autocomplete = "new-password";

    } else {

        authTitle.textContent = "Welcome Back!";
        authSubtitle.textContent = "Sign in to continue to Smart Canteen.";

        nameGroup.classList.add("hidden");

        submitButton.textContent = "Sign In →";

        registerSection.innerHTML = `
            Don't have a student account?
            <button type="button" id="registerToggle">
                Create Account
            </button>
        `;

        demoInfo.classList.remove("hidden");

        passwordInput.autocomplete = "current-password";
    }

    // Reattach event listener after updating HTML
    document.getElementById("registerToggle").addEventListener(
        "click",
        toggleRegisterMode
    );
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

    // Registration is only for students
    document.getElementById("registerSection").classList.toggle(
        "hidden",
        role !== "student"
    );

    const note = document.getElementById("demoInfo");

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
            <strong>Student Access</strong><br>
            Create a student account to get started.
        `;
    }
}


// ==========================================
// 7. STUDENT REGISTRATION
// ==========================================

function registerStudent(name, email, password) {

    const users = getUsers();

    // Check duplicate email
    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        showMessage(
            "An account with this email already exists.",
            "error"
        );
        return;
    }

    // Validate name
    if (name.length < 2) {
        showMessage(
            "Please enter a valid full name.",
            "error"
        );
        return;
    }

    // Validate password
    if (password.length < 6) {
        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );
        return;
    }

    // Create new student
    const newStudent = {
        id: "STU" + Date.now(),
        name: name,
        email: email,
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

        document.getElementById("email").value = email;

        document.getElementById("password").value = "";

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
                item.email === email &&
                item.password === password &&
                item.role === "student"
        );

    } else {

        const account = DEMO_ACCOUNTS[selectedRole];

        if (
            email === account.email &&
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

        window.location.href = dashboardPages[user.role];

    }, 700);
}


// ==========================================
// 9. LOGOUT FUNCTION
// ==========================================

function logoutUser() {

    localStorage.removeItem(SESSION_KEY);

    window.location.href = "login.html";
}


// ==========================================
// 10. GET CURRENT LOGGED-IN USER
// ==========================================

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem(SESSION_KEY)
    );
}



// ==========================================
// 11. AUTHENTICATION FORM SUBMISSION
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


    // ==========================================
    // 12. INITIALIZE LOGIN PAGE
    // ==========================================

    document.addEventListener("DOMContentLoaded", function() {

        document.querySelectorAll(".role-option").forEach(button => {

            button.addEventListener("click", function() {
                changeRole(this.dataset.role);
            });

        });

        changeRole("student");

        console.log("Smart Canteen Authentication Ready!");

    });

}


    // Registration toggle
    document.getElementById("registerToggle").addEventListener(
        "click",
        toggleRegisterMode
    );

    // Initialize default role
    changeRole("student");

    console.log("Smart Canteen Authentication Ready!");


