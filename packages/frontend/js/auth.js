function saveSession(token, user) {
  localStorage.setItem("biko_token", token);
  localStorage.setItem("biko_user", JSON.stringify(user));
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("biko_user"));
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return !!localStorage.getItem("biko_token");
}

function logout() {
  localStorage.removeItem("biko_token");
  localStorage.removeItem("biko_user");
  window.location.href = "login.html";
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  if (isLoggedIn()) {
    const user = getUser();
    const fb = document.getElementById("feedback");
    if (fb) {
      fb.innerHTML = `Você já está conectado como <strong>${user?.nome || "usuário"}</strong>. 
        <a href="busca.html">Continuar</a> ou 
        <button class="btn-link" onclick="logout()">Sair e trocar conta</button>`;
      fb.className = "feedback show feedback--success";
    }
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideFeedback();

    if (!validateForm(loginForm)) return;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Entrando...";

    try {
      const data = await api.post("/auth/login", {
        email: loginForm.email.value.trim(),
        senha: loginForm.senha.value,
      });

      saveSession(data.token, data.user);
      showFeedback("Login realizado com sucesso!", "success");

      setTimeout(() => {
        window.location.href = data.user.tipo === "profissional" ? "painel.html" : "busca.html";
      }, 900);
    } catch (err) {
      const msg = err.data?.errors?.[0]?.msg || err.message || "Erro ao fazer login.";
      showFeedback(msg, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Entrar";
    }
  });
}

const registerClientForm = document.getElementById("registerClientForm");
if (registerClientForm) {
  if (isLoggedIn()) { setTimeout(() => window.location.href = "busca.html", 0); }

  registerClientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideFeedback();

    if (!validateForm(registerClientForm)) return;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Criando conta...";

    try {
      const data = await api.post("/auth/register", {
        nome: registerClientForm.nome.value.trim(),
        email: registerClientForm.email.value.trim(),
        senha: registerClientForm.senha.value,
        tipo: "cliente",
      });

      saveSession(data.token, data.user);
      showFeedback("Cadastro realizado com sucesso!", "success");

      setTimeout(() => { window.location.href = "busca.html"; }, 1200);
    } catch (err) {
      const msg = err.data?.errors?.[0]?.msg || err.message || "Erro ao criar conta.";
      showFeedback(msg, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Criar Conta";
    }
  });
}

const registerProfessionalForm = document.getElementById("registerProfessionalForm");
if (registerProfessionalForm) {
  if (isLoggedIn()) { setTimeout(() => window.location.href = "busca.html", 0); }

  registerProfessionalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideFeedback();

    if (!validateForm(registerProfessionalForm)) return;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Criando perfil...";

    try {
      const data = await api.post("/auth/register", {
        nome: registerProfessionalForm.nome.value.trim(),
        email: registerProfessionalForm.email.value.trim(),
        senha: registerProfessionalForm.senha.value,
        tipo: "profissional",
        categoria: registerProfessionalForm.categoria.value,
        bairro: registerProfessionalForm.bairro.value.trim(),
        descricao: registerProfessionalForm.descricao?.value?.trim() || undefined,
        telefone: registerProfessionalForm.telefone?.value?.trim() || undefined,
      });

      saveSession(data.token, data.user);
      showFeedback("Perfil criado com sucesso!", "success");

      setTimeout(() => { window.location.href = "painel.html"; }, 1200);
    } catch (err) {
      const msg = err.data?.errors?.[0]?.msg || err.message || "Erro ao criar perfil.";
      showFeedback(msg, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Criar Perfil Profissional";
    }
  });
}
