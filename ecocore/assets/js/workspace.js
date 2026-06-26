/* ====================================================================
   PRAN EcoCore - Workspace Scaffolding and Component Loader JS
   ==================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Inject Header & Sidebar components
    injectHeader();
    injectSidebar();

    // 2. Set active sidebar item based on current path
    setActiveSidebarItem();

    // 3. Setup interactive features
    setupNotifications();
    setupProfileDropdown();
    setupWorkspaceSwitcher();
});

function injectHeader() {
    const headerEl = document.getElementById("app-header");
    if (!headerEl) return;

    headerEl.className = "glass-nav";
    headerEl.innerHTML = `
        <a href="/ecocore/dashboard/index.html" class="nav-logo">
            PRΛN <span>EcoCore</span>
        </a>
        <div class="nav-right">
            <!-- Search Bar -->
            <div style="position: relative; display: flex; align-items: center; width: 280px; margin-right: 16px;">
                <input type="text" placeholder="Search activities, assets, reports..." style="width: 100%; padding: 10px 16px 10px 36px; border-radius: 100px; border: 1px solid rgba(22, 163, 74, 0.15); background: rgba(255,255,255,0.6); font-size: 0.85rem; font-family: var(--font-body);" />
                <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; color: var(--text-muted); font-size: 0.85rem;"></i>
            </div>

            <!-- Quick Action Button -->
            <button id="quick-create-btn" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.85rem; width: auto; margin-right: 16px;">
                <i class="fa-solid fa-plus"></i> Quick Create
            </button>

            <!-- Notifications -->
            <div class="nav-notifications" style="position: relative; margin-right: 20px; cursor: pointer; padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(22,163,74,0.05); border: 1px solid rgba(22,163,74,0.1);">
                <i class="fa-regular fa-bell" style="color: var(--col-primary); font-size: 1.1rem;"></i>
                <span class="notification-badge" style="position: absolute; top: 0; right: 0; width: 8px; height: 8px; background: var(--col-error); border-radius: 50%;"></span>
                
                <!-- Dropdown panel -->
                <div id="notifications-panel" class="card" style="display: none; position: absolute; top: 50px; right: 0; width: 320px; z-index: 1010; padding: 20px; margin: 0; box-shadow: var(--shadow-hover);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span style="font-weight: 700; color: var(--col-primary);">Notifications</span>
                        <span style="font-size: 0.75rem; color: var(--col-accent); font-weight: 600; cursor: pointer;">Mark all read</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 12px; max-height: 240px; overflow-y: auto;">
                        <div style="display: flex; gap: 10px; font-size: 0.85rem; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <div style="color: #D97706; padding-top: 2px;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                            <div>
                                <p style="font-weight: 600; color: var(--text-main);">Missing Water Data</p>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">HQ Plant lacks Water utility bills for May 2026.</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; font-size: 0.85rem; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <div style="color: var(--col-accent); padding-top: 2px;"><i class="fa-solid fa-circle-check"></i></div>
                            <div>
                                <p style="font-weight: 600; color: var(--text-main);">Electricity data approved</p>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">Energy consumption records for Plant A approved by Reviewer.</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; font-size: 0.85rem;">
                            <div style="color: #EF4444; padding-top: 2px;"><i class="fa-solid fa-circle-xmark"></i></div>
                            <div>
                                <p style="font-weight: 600; color: var(--text-main);">Expired Document</p>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">ISO 14001 certification expires in 12 days.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Dropdown -->
            <div id="profile-trigger" style="position: relative;" class="nav-profile">
                <div class="avatar">JS</div>
                <div class="profile-name">John Doe</div>
                <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem; color: var(--col-body); margin-left: 2px;"></i>
                
                <!-- Menu -->
                <div id="profile-dropdown" class="card" style="display: none; position: absolute; top: 50px; right: 0; width: 200px; z-index: 1010; padding: 12px 8px; margin: 0; box-shadow: var(--shadow-hover);">
                    <div style="padding: 8px 12px; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 8px;">
                        <p style="font-weight: 700; font-size: 0.9rem; color: var(--text-main);">John Doe</p>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">john.doe@company.com</p>
                    </div>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 4px;">
                        <li><a href="/ecocore/settings/index.html" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 0.85rem; border-radius: 6px; color: var(--col-body);"><i class="fa-regular fa-user" style="width: 16px;"></i> My Profile</a></li>
                        <li><a href="/ecocore/settings/index.html" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 0.85rem; border-radius: 6px; color: var(--col-body);"><i class="fa-solid fa-sliders" style="width: 16px;"></i> Preferences</a></li>
                        <li style="border-top: 1px solid rgba(0,0,0,0.05); margin-top: 4px; padding-top: 4px;">
                            <a href="/ecocore/login/index.html" id="logout-btn" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 0.85rem; border-radius: 6px; color: var(--col-error);"><i class="fa-solid fa-arrow-right-from-bracket" style="width: 16px;"></i> Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function injectSidebar() {
    const sidebarEl = document.getElementById("app-sidebar");
    if (!sidebarEl) return;

    sidebarEl.className = "workspace-sidebar";
    
    // Retrieve workspace logo name and display
    const orgName = localStorage.getItem("ecocore_org_name") || "Acme Industries";
    const orgLogoChar = orgName.charAt(0).toUpperCase();

    sidebarEl.innerHTML = `
        <!-- Org Selector / Branding -->
        <div class="sidebar-org" style="position: relative; cursor: pointer;">
            <div class="sidebar-org-icon">${orgLogoChar}</div>
            <div class="sidebar-org-info">
                <div class="sidebar-org-name">${orgName}</div>
                <div class="sidebar-org-role">Sustainability Admin</div>
            </div>
            <i class="fa-solid fa-sort" style="font-size: 0.8rem; color: var(--text-muted);"></i>
            
            <!-- Switcher Dropdown -->
            <div id="workspace-switcher-menu" class="card" style="display: none; position: absolute; top: 60px; left: 0; width: 230px; z-index: 1010; padding: 12px 8px; margin: 0; box-shadow: var(--shadow-hover);">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 12px 8px 12px; border-bottom: 1px solid rgba(0,0,0,0.05);">Switch Workspace</div>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 4px; margin-top: 8px;">
                    <li>
                        <a href="javascript:void(0)" class="active-ws" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 0.85rem; border-radius: 6px; font-weight: 600; background: rgba(22, 163, 74, 0.05); color: var(--col-accent);">
                            <span style="width: 8px; height: 8px; background: var(--col-accent); border-radius: 50%;"></span> ${orgName}
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" class="switch-ws-opt" data-ws-name="GreenTech Solutions" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 0.85rem; border-radius: 6px; color: var(--col-body);">
                            <span style="width: 8px; height: 8px; background: #64748B; border-radius: 50%;"></span> GreenTech Solutions
                        </a>
                    </li>
                    <li style="border-top: 1px solid rgba(0,0,0,0.05); margin-top: 4px; padding-top: 4px;">
                        <a href="/ecocore/onboarding/company/index.html" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 0.85rem; color: var(--col-accent); font-weight: 600;"><i class="fa-solid fa-plus"></i> New Workspace</a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Sidebar Navigation Menu -->
        <ul class="sidebar-menu">
            <li class="sidebar-item" data-path="dashboard">
                <a href="/ecocore/dashboard/index.html"><i class="fa-solid fa-chart-pie"></i> Dashboard</a>
            </li>
            <li class="sidebar-item" data-path="organization">
                <a href="/ecocore/organization/index.html"><i class="fa-solid fa-building"></i> Organization</a>
            </li>
            <li class="sidebar-item" data-path="users">
                <a href="/ecocore/users/index.html"><i class="fa-solid fa-users"></i> Users</a>
            </li>
            <li class="sidebar-item" data-path="roles">
                <a href="/ecocore/roles/index.html"><i class="fa-solid fa-shield-halved"></i> Roles</a>
            </li>
            <li class="sidebar-item" data-path="departments">
                <a href="/ecocore/departments/index.html"><i class="fa-solid fa-sitemap"></i> Departments</a>
            </li>
            <li class="sidebar-item" data-path="assets">
                <a href="/ecocore/assets/index.html"><i class="fa-solid fa-industry"></i> Assets</a>
            </li>
            <li class="sidebar-item" data-path="data-collection">
                <a href="/ecocore/data-collection/index.html"><i class="fa-solid fa-database"></i> Data Collection</a>
            </li>
            <li class="sidebar-item" data-path="activities">
                <a href="/ecocore/activities/index.html"><i class="fa-solid fa-clock-rotate-left"></i> Activities</a>
            </li>
            <li class="sidebar-item" data-path="evidence">
                <a href="/ecocore/evidence/index.html"><i class="fa-solid fa-file-invoice-dollar"></i> Evidence Repository</a>
            </li>
            <li class="sidebar-item" data-path="reports">
                <a href="/ecocore/reports/index.html"><i class="fa-solid fa-file-contract"></i> Reports</a>
            </li>
            <li class="sidebar-item" data-path="settings">
                <a href="/ecocore/settings/index.html"><i class="fa-solid fa-sliders"></i> Settings</a>
            </li>
        </ul>

        <!-- Sidebar Support Footer -->
        <div class="sidebar-footer">
            <ul class="sidebar-menu">
                <li class="sidebar-item">
                    <a href="javascript:void(0)" id="support-trigger" style="padding: 10px 16px;"><i class="fa-regular fa-circle-question"></i> Support Center</a>
                </li>
            </ul>
        </div>
    `;

    // Bind support click
    document.getElementById("support-trigger").addEventListener("click", function() {
        alert("PRAN EcoCore Support Center:\n\nOur team is here to assist. For urgent inquiries, please email support@pran.eco or consult our documentation.");
    });
}

function setActiveSidebarItem() {
    const path = window.location.pathname;
    const items = document.querySelectorAll(".sidebar-item");
    
    items.forEach(item => {
        const itemPath = item.getAttribute("data-path");
        if (itemPath && path.includes(`/ecocore/${itemPath}`)) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

function setupNotifications() {
    const trigger = document.querySelector(".nav-notifications");
    const panel = document.getElementById("notifications-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        const displayState = panel.style.display;
        panel.style.display = displayState === "none" ? "block" : "none";
        
        // Hide other dropdowns
        const pDropdown = document.getElementById("profile-dropdown");
        const wsMenu = document.getElementById("workspace-switcher-menu");
        if (pDropdown) pDropdown.style.display = "none";
        if (wsMenu) wsMenu.style.display = "none";
    });

    // Close on click outside
    document.addEventListener("click", function () {
        panel.style.display = "none";
    });
}

function setupProfileDropdown() {
    const trigger = document.getElementById("profile-trigger");
    const dropdown = document.getElementById("profile-dropdown");
    if (!trigger || !dropdown) return;

    trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        const displayState = dropdown.style.display;
        dropdown.style.display = displayState === "none" ? "block" : "none";

        // Hide other dropdowns
        const nPanel = document.getElementById("notifications-panel");
        const wsMenu = document.getElementById("workspace-switcher-menu");
        if (nPanel) nPanel.style.display = "none";
        if (wsMenu) wsMenu.style.display = "none";
    });

    document.addEventListener("click", function () {
        dropdown.style.display = "none";
    });

    // Bind quick mock login user display
    const userEmail = localStorage.getItem("ecocore_user_email") || "admin@acme.com";
    const userRole = localStorage.getItem("ecocore_user_role") || "Workspace Owner";
    
    const emailEl = dropdown.querySelector("p[style*='font-size: 0.75rem']");
    if (emailEl && userEmail) {
        emailEl.textContent = userEmail;
        const nameEl = dropdown.querySelector("p[style*='font-weight: 700']");
        if (nameEl) {
            const nameParts = userEmail.split("@")[0].split(".");
            const cleanName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
            nameEl.textContent = cleanName;
            
            const avatarEl = document.querySelector(".avatar");
            if (avatarEl) {
                avatarEl.textContent = nameParts.map(p => p.charAt(0).toUpperCase()).join("").slice(0, 2);
            }
            
            const profileName = document.querySelector(".profile-name");
            if (profileName) profileName.textContent = cleanName;
        }
    }
}

function setupWorkspaceSwitcher() {
    const trigger = document.querySelector(".sidebar-org");
    const menu = document.getElementById("workspace-switcher-menu");
    if (!trigger || !menu) return;

    trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        const displayState = menu.style.display;
        menu.style.display = displayState === "none" ? "block" : "none";

        // Hide other dropdowns
        const nPanel = document.getElementById("notifications-panel");
        const pDropdown = document.getElementById("profile-dropdown");
        if (nPanel) nPanel.style.display = "none";
        if (pDropdown) pDropdown.style.display = "none";
    });

    document.addEventListener("click", function () {
        menu.style.display = "none";
    });

    // Switch selection mock
    const opt = menu.querySelector(".switch-ws-opt");
    if (opt) {
        opt.addEventListener("click", function (e) {
            e.stopPropagation();
            const newWsName = opt.getAttribute("data-ws-name");
            const oldWsName = localStorage.getItem("ecocore_org_name") || "Acme Industries";
            
            localStorage.setItem("ecocore_org_name", newWsName);
            
            // Swap texts
            opt.setAttribute("data-ws-name", oldWsName);
            opt.innerHTML = `<span style="width: 8px; height: 8px; background: #64748B; border-radius: 50%;"></span> ${oldWsName}`;
            
            // Reload page to reflect switch
            window.location.reload();
        });
    }
}
