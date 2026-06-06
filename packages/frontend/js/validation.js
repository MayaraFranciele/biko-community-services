function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  if (input) input.classList.add("error");
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  if (input) input.classList.remove("error");
  if (errorEl) errorEl.textContent = "";
}

function showFeedback(message, type = "error") {
  const el = document.getElementById("feedback");
  if (!el) return;
  el.textContent = (type === "success" ? "✓ " : "✗ ") + message;
  el.className = `feedback show feedback--${type}`;
}

function hideFeedback() {
  const el = document.getElementById("feedback");
  if (el) el.className = "feedback";
}

function validateForm(form) {
  let valid = true;

  form.querySelectorAll(".form__input, .form__select, .form__textarea").forEach((input) => {
    clearFieldError(input.id);
  });

  const nome = form.elements["nome"];
  if (nome) {
    if (!nome.value.trim()) {
      showFieldError("nome", "Nome é obrigatório.");
      valid = false;
    } else if (nome.value.trim().length < 2) {
      showFieldError("nome", "Nome deve ter pelo menos 2 caracteres.");
      valid = false;
    }
  }

  const email = form.elements["email"];
  if (email) {
    if (!email.value.trim()) {
      showFieldError("email", "E-mail é obrigatório.");
      valid = false;
    } else if (!email.value.includes("@") || !email.value.includes(".")) {
      showFieldError("email", "E-mail inválido.");
      valid = false;
    }
  }

  const senha = form.elements["senha"];
  if (senha) {
    if (!senha.value) {
      showFieldError("senha", "Senha é obrigatória.");
      valid = false;
    } else if (senha.value.length < 6) {
      showFieldError("senha", "Senha deve ter no mínimo 6 caracteres.");
      valid = false;
    }
  }

  const confirmarSenha = form.elements["confirmarSenha"];
  if (confirmarSenha && senha) {
    if (!confirmarSenha.value) {
      showFieldError("confirmarSenha", "Confirme sua senha.");
      valid = false;
    } else if (confirmarSenha.value !== senha.value) {
      showFieldError("confirmarSenha", "As senhas não coincidem.");
      valid = false;
    }
  }

  const categoria = form.elements["categoria"];
  if (categoria) {
    const tipo = form.elements["tipo"];
    if (tipo && tipo.value === "profissional" && !categoria.value) {
      showFieldError("categoria", "Selecione uma categoria.");
      valid = false;
    }
  }

  const bairro = form.elements["bairro"];
  if (bairro) {
    const tipo = form.elements["tipo"];
    if (tipo && tipo.value === "profissional" && !bairro.value.trim()) {
      showFieldError("bairro", "Bairro é obrigatório.");
      valid = false;
    }
  }

  const telefone = form.elements["telefone"];
  if (telefone) {
    const digits = telefone.value.replace(/\D/g, "");
    if (!telefone.value.trim()) {
      showFieldError("telefone", "Telefone é obrigatório.");
      valid = false;
    } else if (digits.length < 10 || digits.length > 11) {
      showFieldError("telefone", "Informe um telefone válido com DDD.");
      valid = false;
    }
  }

  const descricao = form.elements["descricao"];
  if (descricao) {
    if (!descricao.value.trim()) {
      showFieldError("descricao", "Descrição é obrigatória.");
      valid = false;
    } else if (descricao.value.trim().length < 20) {
      showFieldError("descricao", "Descrição deve ter pelo menos 20 caracteres.");
      valid = false;
    }
  }

  return valid;
}

function validateServiceRequest(descricao) {
  if (!descricao || !descricao.trim()) {
    showFieldError("descricaoServico", "Descreva o serviço necessário.");
    return false;
  }
  if (descricao.trim().length < 10) {
    showFieldError("descricaoServico", "Descrição deve ter no mínimo 10 caracteres.");
    return false;
  }
  return true;
}

const ICON_EYE = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const ICON_EYE_OFF = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".form__toggle-password").forEach((btn) => {
    const input = document.getElementById(btn.dataset.target);
    if (input) btn.innerHTML = input.type === "password" ? ICON_EYE : ICON_EYE_OFF;

    btn.addEventListener("click", () => {
      if (!input) return;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.innerHTML = isHidden ? ICON_EYE_OFF : ICON_EYE;
      btn.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
    });
  });
});