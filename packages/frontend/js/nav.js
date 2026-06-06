document.addEventListener("DOMContentLoaded", () => {
  const toggle   = document.getElementById("navToggle");
  const dropdown = document.getElementById("navDropdown");

  if (toggle && dropdown) {
    toggle.addEventListener("click", () => {
      const isOpen = dropdown.classList.toggle("open");
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    dropdown.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        dropdown.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  updateNavAuth();
});

function updateNavAuth() {
  const navActions  = document.getElementById("navActions");
  const navDropdown = document.getElementById("navDropdown");

  if (!isLoggedIn()) return;

  const user = getUser();
  const firstName = user?.nome?.split(" ")[0] || "Você";
  const isPro = user?.tipo === "profissional";
  const painelLink = isPro ? `<a href="painel.html" class="btn btn--outline btn--sm">Meu Painel</a>` : "";

  if (navActions) {
    navActions.innerHTML = `
      ${painelLink}
      <span class="nav__user">Olá, ${firstName}</span>
      <button class="btn btn--ghost btn--sm" onclick="logout()">Sair</button>
    `;
  }

  if (navDropdown) {
    navDropdown.querySelectorAll('a[href="login.html"], a[href="cadastro-cliente.html"]').forEach(el => el.remove());
    if (isPro && !navDropdown.querySelector('a[href="painel.html"]')) {
      const painelEl = document.createElement("a");
      painelEl.href = "painel.html";
      painelEl.textContent = "Meu Painel";
      navDropdown.prepend(painelEl);
    }
    if (!navDropdown.querySelector(".nav__logout")) {
      const sairLink = document.createElement("button");
      sairLink.className = "nav__logout";
      sairLink.textContent = "Sair da conta";
      sairLink.onclick = logout;
      navDropdown.appendChild(sairLink);
    }
  }
}
