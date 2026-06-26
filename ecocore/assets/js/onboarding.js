/* ====================================================================
   PRAN EcoCore - Onboarding State Manager and Wizard JS
   ==================================================================== */

// Wizard Steps Definition
const WIZARD_STEPS = [
    { key: "company", label: "Profile", path: "/ecocore/onboarding/company/index.html" },
    { key: "locations", label: "Locations", path: "/ecocore/onboarding/locations/index.html" },
    { key: "departments", label: "Departments", path: "/ecocore/onboarding/departments/index.html" },
    { key: "users", label: "Users", path: "/ecocore/onboarding/users/index.html" },
    { key: "roles", label: "Roles", path: "/ecocore/onboarding/roles/index.html" },
    { key: "review", label: "Review", path: "/ecocore/onboarding/review/index.html" }
];

document.addEventListener("DOMContentLoaded", function () {
    const currentStepKey = getCurrentStepKey();
    if (!currentStepKey) return;

    // Inject step progress indicator
    injectStepIndicator(currentStepKey);

    // Initialize the page fields with existing storage data
    initializeStepPage(currentStepKey);

    // Bind footer buttons
    setupWizardNavigation(currentStepKey);
});

function getCurrentStepKey() {
    const path = window.location.pathname;
    for (let step of WIZARD_STEPS) {
        if (path.includes(`/onboarding/${step.key}/`)) {
            return step.key;
        }
    }
    return null;
}

function injectStepIndicator(currentStepKey) {
    const container = document.getElementById("wizard-steps-container");
    if (!container) return;

    let html = "";
    let activeFound = false;
    let index = 1;

    for (let step of WIZARD_STEPS) {
        let stepClass = "";
        if (step.key === currentStepKey) {
            stepClass = "active";
            activeFound = true;
        } else if (!activeFound) {
            stepClass = "completed";
        }

        html += `
            <div class="wizard-step ${stepClass}">
                <div class="wizard-dot">${stepClass === "completed" ? '<i class="fa-solid fa-check"></i>' : index}</div>
                <div class="wizard-label">${step.label}</div>
            </div>
        `;
        index++;
    }
    container.innerHTML = html;
}

function initializeStepPage(stepKey) {
    // Load data from local storage
    const data = getOnboardingData();

    switch (stepKey) {
        case "company":
            // Pre-fill basic company name if registered
            if (!data.company.name) {
                data.company.name = localStorage.getItem("ecocore_pending_company") || "";
                data.company.email = localStorage.getItem("ecocore_pending_email") || "";
                saveOnboardingData(data);
            }
            document.getElementById("comp-name").value = data.company.name || "";
            document.getElementById("comp-email").value = data.company.email || "";
            document.getElementById("comp-industry").value = data.company.industry || "Manufacturing";
            document.getElementById("comp-gst").value = data.company.gst || "";
            document.getElementById("comp-reg").value = data.company.reg || "";
            document.getElementById("comp-web").value = data.company.web || "";
            document.getElementById("comp-address").value = data.company.address || "";
            document.getElementById("comp-fy").value = data.company.fy || "2026-2027";
            break;

        case "locations":
            renderLocationsList(data.locations);
            break;

        case "departments":
            renderDepartmentsList(data.departments);
            break;

        case "users":
            renderUsersList(data.users);
            break;

        case "roles":
            renderRolesPermissions(data.roles);
            break;

        case "review":
            renderReviewPage(data);
            break;
    }
}

function getOnboardingData() {
    const defaultData = {
        company: {
            name: "",
            email: "",
            industry: "Manufacturing",
            gst: "",
            reg: "",
            web: "",
            address: "",
            fy: "2026-2027"
        },
        locations: [
            { id: 1, name: "HQ Corporate Office", type: "Office", city: "Mumbai", address: "Nariman Point" },
            { id: 2, name: "Main Plant", type: "Plant", city: "Pune", address: "Chakan Industrial Area" }
        ],
        departments: [
            { id: 1, name: "Energy & Utilities", head: "Robert Chen", users: 5 },
            { id: 2, name: "Environmental Compliance", head: "Sarah Jenkins", users: 3 },
            { id: 3, name: "Production & Operations", head: "David Miller", users: 12 },
            { id: 4, name: "Finance", head: "Emily Watson", users: 4 }
        ],
        users: [
            { id: 1, email: "sarah.j@company.com", role: "Department Admin", department: "Environmental Compliance" },
            { id: 2, email: "robert.c@company.com", role: "Reviewer", department: "Energy & Utilities" },
            { id: 3, email: "michael.t@company.com", role: "Data Entry Officer", department: "Production & Operations" }
        ],
        roles: {
            admin: ["Dashboard", "Reports", "Users", "Organization", "Data Collection", "Activities", "Settings"],
            reviewer: ["Dashboard", "Reports", "Data Collection", "Activities"],
            officer: ["Dashboard", "Data Collection", "Activities"]
        }
    };

    const stored = localStorage.getItem("ecocore_onboarding_data");
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return defaultData;
        }
    }
    return defaultData;
}

function saveOnboardingData(data) {
    localStorage.setItem("ecocore_onboarding_data", JSON.stringify(data));
}

// --------------------------------------------------------------------
// Step 2: Locations Functions
// --------------------------------------------------------------------
function renderLocationsList(locations) {
    const listEl = document.getElementById("locations-list");
    if (!listEl) return;

    if (locations.length === 0) {
        listEl.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">No locations added yet. Please add a location.</div>`;
        return;
    }

    listEl.innerHTML = locations.map(loc => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid rgba(22, 163, 74, 0.1); border-radius: var(--radius-md); background: rgba(255,255,255,0.5); margin-bottom: 12px;">
            <div>
                <h4 style="font-weight: 700; color: var(--col-primary);">${loc.name}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${loc.type} &bull; ${loc.city}</p>
            </div>
            <button class="btn btn-secondary" onclick="deleteLocation(${loc.id})" style="width: auto; padding: 8px 14px; font-size: 0.8rem; border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

window.addLocation = function() {
    const name = document.getElementById("loc-name").value.trim();
    const type = document.getElementById("loc-type").value;
    const city = document.getElementById("loc-city").value.trim();
    const address = document.getElementById("loc-address").value.trim();

    if (!name || !city) {
        alert("Please enter a Location Name and City.");
        return;
    }

    const data = getOnboardingData();
    const newLoc = {
        id: Date.now(),
        name: name,
        type: type,
        city: city,
        address: address
    };

    data.locations.push(newLoc);
    saveOnboardingData(data);
    renderLocationsList(data.locations);

    // Reset inputs
    document.getElementById("loc-name").value = "";
    document.getElementById("loc-city").value = "";
    document.getElementById("loc-address").value = "";
};

window.deleteLocation = function(id) {
    const data = getOnboardingData();
    data.locations = data.locations.filter(loc => loc.id !== id);
    saveOnboardingData(data);
    renderLocationsList(data.locations);
};

// --------------------------------------------------------------------
// Step 3: Departments Functions
// --------------------------------------------------------------------
function renderDepartmentsList(departments) {
    const listEl = document.getElementById("departments-list");
    if (!listEl) return;

    if (departments.length === 0) {
        listEl.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">No departments added yet.</div>`;
        return;
    }

    listEl.innerHTML = departments.map(dept => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid rgba(22, 163, 74, 0.1); border-radius: var(--radius-md); background: rgba(255,255,255,0.5); margin-bottom: 12px;">
            <div>
                <h4 style="font-weight: 700; color: var(--col-primary);">${dept.name}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Head: ${dept.head || "Not Assigned"}</p>
            </div>
            <button class="btn btn-secondary" onclick="deleteDepartment(${dept.id})" style="width: auto; padding: 8px 14px; font-size: 0.8rem; border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

window.addDepartment = function() {
    const name = document.getElementById("dept-name").value.trim();
    const head = document.getElementById("dept-head").value.trim();

    if (!name) {
        alert("Please enter a Department Name.");
        return;
    }

    const data = getOnboardingData();
    const newDept = {
        id: Date.now(),
        name: name,
        head: head || "Unassigned",
        users: 0
    };

    data.departments.push(newDept);
    saveOnboardingData(data);
    renderDepartmentsList(data.departments);

    document.getElementById("dept-name").value = "";
    document.getElementById("dept-head").value = "";
};

window.deleteDepartment = function(id) {
    const data = getOnboardingData();
    data.departments = data.departments.filter(d => d.id !== id);
    saveOnboardingData(data);
    renderDepartmentsList(data.departments);
};

// --------------------------------------------------------------------
// Step 4: Invite Users Functions
// --------------------------------------------------------------------
function renderUsersList(users) {
    const listEl = document.getElementById("users-list");
    if (!listEl) return;

    // Populate department select options dynamically based on current departments
    const deptSelect = document.getElementById("user-dept");
    if (deptSelect) {
        const data = getOnboardingData();
        deptSelect.innerHTML = data.departments.map(d => `<option value="${d.name}">${d.name}</option>`).join("");
    }

    if (users.length === 0) {
        listEl.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">No users invited yet.</div>`;
        return;
    }

    listEl.innerHTML = users.map(user => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid rgba(22, 163, 74, 0.1); border-radius: var(--radius-md); background: rgba(255,255,255,0.5); margin-bottom: 12px;">
            <div>
                <h4 style="font-weight: 700; color: var(--col-primary);">${user.email}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${user.role} &bull; ${user.department}</p>
            </div>
            <button class="btn btn-secondary" onclick="deleteUser(${user.id})" style="width: auto; padding: 8px 14px; font-size: 0.8rem; border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

window.inviteUser = function() {
    const email = document.getElementById("user-email").value.trim();
    const role = document.getElementById("user-role").value;
    const dept = document.getElementById("user-dept").value;

    if (!email || !dept) {
        alert("Please enter a User Email and select a Department.");
        return;
    }

    const data = getOnboardingData();
    const newUser = {
        id: Date.now(),
        email: email,
        role: role,
        department: dept
    };

    data.users.push(newUser);
    saveOnboardingData(data);
    renderUsersList(data.users);

    document.getElementById("user-email").value = "";
};

window.deleteUser = function(id) {
    const data = getOnboardingData();
    data.users = data.users.filter(u => u.id !== id);
    saveOnboardingData(data);
    renderUsersList(data.users);
};

// --------------------------------------------------------------------
// Step 5: Roles & Permissions Functions
// --------------------------------------------------------------------
function renderRolesPermissions(roles) {
    const container = document.getElementById("permissions-matrix");
    if (!container) return;

    // We can show a list of roles and the checkboxes for their access modules
    const modules = ["Dashboard", "Reports", "Users", "Organization", "Data Collection", "Activities", "Settings"];
    const rolesList = [
        { key: "admin", label: "Department Admin", defaults: roles.admin },
        { key: "reviewer", label: "Reviewer / Approver", defaults: roles.reviewer },
        { key: "officer", label: "Data Entry Officer", defaults: roles.officer }
    ];

    container.innerHTML = rolesList.map(r => `
        <div style="background: white; border: 1px solid rgba(22, 163, 74, 0.08); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px;">
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--col-primary); margin-bottom: 16px;">
                <i class="fa-solid fa-user-shield" style="margin-right: 8px; color: var(--col-accent);"></i> ${r.label}
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px;">
                ${modules.map(mod => {
                    const isChecked = r.defaults.includes(mod) ? "checked" : "";
                    return `
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="perm-${r.key}-${mod.replace(" ", "")}" ${isChecked} style="width:16px; height:16px; accent-color: var(--col-accent);" />
                            <label for="perm-${r.key}-${mod.replace(" ", "")}" style="text-transform:none; margin:0; font-size:0.85rem; font-weight:500; cursor:pointer; color:var(--text-body);">${mod}</label>
                        </div>
                    `;
                }).join("")}
            </div>
        </div>
    `).join("");
}

function savePermissionsState() {
    const data = getOnboardingData();
    const modules = ["Dashboard", "Reports", "Users", "Organization", "Data Collection", "Activities", "Settings"];
    const rolesKeys = ["admin", "reviewer", "officer"];

    rolesKeys.forEach(key => {
        data.roles[key] = [];
        modules.forEach(mod => {
            const cb = document.getElementById(`perm-${key}-${mod.replace(" ", "")}`);
            if (cb && cb.checked) {
                data.roles[key].push(mod);
            }
        });
    });

    saveOnboardingData(data);
}

// --------------------------------------------------------------------
// Step 6: Review Summary Functions
// --------------------------------------------------------------------
function renderReviewPage(data) {
    const container = document.getElementById("review-summary");
    if (!container) return;

    container.innerHTML = `
        <!-- Section 1: Company Profile -->
        <div style="padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 20px;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--col-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-regular fa-building" style="color: var(--col-accent);"></i> Company Profile
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; font-size: 0.9rem;">
                <div><span style="color: var(--text-muted);">Company Name:</span> <strong style="color: var(--text-main);">${data.company.name || "Not Specified"}</strong></div>
                <div><span style="color: var(--text-muted);">Industry:</span> <strong>${data.company.industry || "Not Specified"}</strong></div>
                <div><span style="color: var(--text-muted);">Financial Year:</span> <strong>${data.company.fy || "Not Specified"}</strong></div>
                <div><span style="color: var(--text-muted);">Website:</span> <strong>${data.company.web || "None"}</strong></div>
                <div><span style="color: var(--text-muted);">GSTIN:</span> <strong>${data.company.gst || "None"}</strong></div>
                <div><span style="color: var(--text-muted);">Registration Code:</span> <strong>${data.company.reg || "None"}</strong></div>
            </div>
        </div>

        <!-- Section 2: Locations -->
        <div style="padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 20px;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--col-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-location-dot" style="color: var(--col-accent);"></i> Setup Locations (${data.locations.length})
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${data.locations.map(loc => `
                    <div style="background: rgba(22, 163, 74, 0.05); border: 1px solid rgba(22, 163, 74, 0.1); padding: 8px 16px; border-radius: 50px; font-size: 0.85rem; color: var(--col-primary); font-weight: 600;">
                        ${loc.name} <span style="font-weight:400; color: var(--text-muted);">(${loc.type} - ${loc.city})</span>
                    </div>
                `).join("")}
            </div>
        </div>

        <!-- Section 3: Departments -->
        <div style="padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 20px;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--col-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-sitemap" style="color: var(--col-accent);"></i> Organization Structure (${data.departments.length} Departments)
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${data.departments.map(d => `
                    <div style="background: rgba(22, 163, 74, 0.05); border: 1px solid rgba(22, 163, 74, 0.1); padding: 8px 16px; border-radius: 50px; font-size: 0.85rem; color: var(--col-primary); font-weight: 600;">
                        ${d.name} <span style="font-weight:400; color: var(--text-muted);"> (Head: ${d.head})</span>
                    </div>
                `).join("")}
            </div>
        </div>

        <!-- Section 4: User Invitations -->
        <div style="margin-bottom: 20px;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--col-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-regular fa-paper-plane" style="color: var(--col-accent);"></i> Invited Personnel (${data.users.length} Users)
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
                ${data.users.map(u => `
                    <div style="padding: 10px 14px; border: 1px solid rgba(0,0,0,0.05); border-radius: var(--radius-md); background: white; font-size: 0.85rem;">
                        <p style="font-weight: 700; color: var(--text-main);">${u.email}</p>
                        <p style="color: var(--text-muted); font-size: 0.75rem;">${u.role} &bull; ${u.department}</p>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// --------------------------------------------------------------------
// Navigation Handlers
// --------------------------------------------------------------------
function setupWizardNavigation(stepKey) {
    const prevBtn = document.getElementById("wizard-prev-btn");
    const nextBtn = document.getElementById("wizard-next-btn");
    if (!nextBtn) return;

    const currentStepIndex = WIZARD_STEPS.findIndex(s => s.key === stepKey);

    if (prevBtn) {
        if (currentStepIndex === 0) {
            prevBtn.style.display = "none";
        } else {
            prevBtn.addEventListener("click", function () {
                window.location.href = WIZARD_STEPS[currentStepIndex - 1].path;
            });
        }
    }

    nextBtn.addEventListener("click", function () {
        // Save current step data before navigating
        if (stepKey === "company") {
            const name = document.getElementById("comp-name").value.trim();
            const email = document.getElementById("comp-email").value.trim();
            const industry = document.getElementById("comp-industry").value;
            const gst = document.getElementById("comp-gst").value.trim();
            const reg = document.getElementById("comp-reg").value.trim();
            const web = document.getElementById("comp-web").value.trim();
            const address = document.getElementById("comp-address").value.trim();
            const fy = document.getElementById("comp-fy").value;

            if (!name || !email) {
                alert("Please fill out Company Name and Business Email.");
                return;
            }

            const data = getOnboardingData();
            data.company = { name, email, industry, gst, reg, web, address, fy };
            saveOnboardingData(data);
            
            // Store company name globally for workspace sidebar
            localStorage.setItem("ecocore_org_name", name);
        } else if (stepKey === "roles") {
            savePermissionsState();
        }

        // Navigate
        if (currentStepIndex < WIZARD_STEPS.length - 1) {
            window.location.href = WIZARD_STEPS[currentStepIndex + 1].path;
        } else {
            // Last Step (Review) -> Success Screen
            localStorage.setItem("ecocore_onboarding_completed", "true");
            window.location.href = "/ecocore/onboarding/success.html";
        }
    });
}
