/* ====================================================================
   PRAN EcoCore - Authentication Mock Logic JS
   ==================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Company Registration Form Interception
    const registerForm = document.getElementById("ecocore-register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const companyName = document.getElementById("reg-company").value.trim();
            const email = document.getElementById("reg-email").value.trim();
            const password = document.getElementById("reg-password").value;
            const confirmPass = document.getElementById("reg-confirm").value;
            const country = document.getElementById("reg-country").value;
            const terms = document.getElementById("reg-terms").checked;

            if (!companyName || !email || !password || !confirmPass) {
                alert("Please fill in all required fields.");
                return;
            }

            if (password !== confirmPass) {
                alert("Passwords do not match.");
                return;
            }

            if (!terms) {
                alert("You must agree to the Terms & Conditions.");
                return;
            }

            // Store credentials temporarily to mock a database entry
            localStorage.setItem("ecocore_pending_company", companyName);
            localStorage.setItem("ecocore_pending_email", email);
            localStorage.setItem("ecocore_pending_password", password);
            localStorage.setItem("ecocore_user_email", email);

            // Redirect to Email Verification page
            window.location.href = "/ecocore/verify-email/index.html";
        });
    }

    // 2. Email Verification Flow
    const verifyBtn = document.getElementById("ecocore-verify-btn");
    if (verifyBtn) {
        // Simple automatic mock timer to show verification completion
        const statusText = document.getElementById("verify-status-text");
        const statusIcon = document.getElementById("verify-status-icon");
        const resendBtn = document.getElementById("verify-resend-btn");
        
        setTimeout(() => {
            if (statusText && statusIcon) {
                statusIcon.innerHTML = '<i class="fa-solid fa-envelope-open-text" style="color: var(--col-accent);"></i>';
                statusIcon.style.backgroundColor = "#DCFCE7";
                statusText.innerHTML = '<strong style="color: var(--col-accent);">Email Verified Successfully!</strong><br/>Your business email has been confirmed.';
                verifyBtn.removeAttribute("disabled");
                verifyBtn.style.opacity = "1";
                if (resendBtn) resendBtn.style.display = "none";
            }
        }, 1500);

        verifyBtn.addEventListener("click", function () {
            window.location.href = "/ecocore/login/index.html";
        });
    }

    // 3. Login Form Interception
    const loginForm = document.getElementById("ecocore-login-form");
    if (loginForm) {
        // Pre-fill email from registration if present
        const pendingEmail = localStorage.getItem("ecocore_pending_email");
        if (pendingEmail) {
            document.getElementById("login-email").value = pendingEmail;
        }

        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            // Save login session details
            localStorage.setItem("ecocore_user_email", email);
            localStorage.setItem("ecocore_session_active", "true");

            // Determine redirect target based on Onboarding state
            const isOnboardingComplete = localStorage.getItem("ecocore_onboarding_completed");
            if (isOnboardingComplete === "true") {
                window.location.href = "/ecocore/dashboard/index.html";
            } else {
                window.location.href = "/ecocore/onboarding/company/index.html";
            }
        });
    }

    // 4. Forgot Password Interception
    const forgotForm = document.getElementById("ecocore-forgot-form");
    if (forgotForm) {
        forgotForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("forgot-email").value.trim();
            if (!email) {
                alert("Please enter your business email.");
                return;
            }
            alert(`A password reset link has been dispatched to ${email}. Please check your inbox.`);
            window.location.href = "/ecocore/login/index.html";
        });
    }

    // 5. Reset Password Interception
    const resetForm = document.getElementById("ecocore-reset-form");
    if (resetForm) {
        resetForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const newPass = document.getElementById("reset-pass").value;
            const confirmPass = document.getElementById("reset-confirm").value;

            if (!newPass || !confirmPass) {
                alert("Please fill in both fields.");
                return;
            }

            if (newPass !== confirmPass) {
                alert("Passwords do not match.");
                return;
            }

            alert("Your password has been reset successfully. Please log in with your new credentials.");
            window.location.href = "/ecocore/login/index.html";
        });
    }
});
