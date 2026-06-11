/* ==========================================
   PSISAÚDE - LAYOUT.JS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSidebar();
    configurarDropdownUsuario();
});

/* USUÁRIO */

function carregarUsuario() {
    const nome = document.getElementById("nomeUsuarioTopo");
    const cargo = document.getElementById("cargoUsuarioTopo");

    if (nome) {
        nome.innerText = localStorage.getItem("usuarioNome") || "Andressa de Sales Fernandes";
    }

    if (cargo) {
        cargo.innerText = localStorage.getItem("usuarioCargo") || "Administrador(a)";
    }
}

/* SIDEBAR */

function carregarSidebar() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar && localStorage.getItem("sidebarClosed") === "true") {
        sidebar.classList.add("closed");
    }
}

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    sidebar.classList.toggle("closed");

    const fechada = sidebar.classList.contains("closed");

    localStorage.setItem("sidebarClosed", fechada);

    if (fechada) {
        document.documentElement.classList.add("sidebar-fechada");
    } else {
        document.documentElement.classList.remove("sidebar-fechada");
    }
}

/* MENU USUÁRIO */

function toggleUserMenu() {
    const dropdown = document.getElementById("dropdownMenu");

    if (dropdown) {
        dropdown.classList.toggle("active");
    }
}

function configurarDropdownUsuario() {
    document.addEventListener("click", function(event) {
        const userMenu = document.querySelector(".user-menu");
        const dropdown = document.getElementById("dropdownMenu");

        if (userMenu && dropdown && !userMenu.contains(event.target)) {
            dropdown.classList.remove("active");
        }
    });
}

/* SAIR */

function sair() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuarioNome");
    localStorage.removeItem("usuarioCargo");
    localStorage.removeItem("usuarioAgenda");

    window.location.href = "login.html";
}