ocument.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }
  const user = getUser();
  if (user?.tipo === "cliente") {
    window.location.href = "busca.html";
    return;
  }
  initPainel();
});

let currentFilter = "todas";
let currentRequest = null;
let cachedRequests = [];

function getMessages(requestId) {
  try {
    return JSON.parse(localStorage.getItem("biko_msgs_" + requestId) || "[]");
  } catch { return []; }
}

function saveMessages(requestId, msgs) {
  localStorage.setItem("biko_msgs_" + requestId, JSON.stringify(msgs));
}

async function initPainel() {
  await Promise.all([loadProfile(), loadRequests()]);
  initTabs();
}

async function loadProfile() {
  const user = getUser();
  try {
    const data = await api.get("/professionals");
    const pros = data.professionals || [];
    const myPro = pros.find((p) => p.user?.email === user?.email || p.user_id === user?.id);

    if (!myPro) {
      document.getElementById("profileName").textContent = user?.nome || "Profissional";
      document.getElementById("profileAvatar").textContent = getInitials(user?.nome || "P");
      return;
    }

    document.getElementById("profileAvatar").textContent = getInitials(myPro.user?.nome || user?.nome || "P");
    document.getElementById("profileName").textContent = myPro.user?.nome || user?.nome;
    document.getElementById("profileCategory").textContent = myPro.categoria;
    document.getElementById("profileBairro").textContent = "📍 " + myPro.bairro;

    if (myPro.verified) {
      document.getElementById("profileVerified").innerHTML = `<span class="badge-verified" style="margin:var(--space-2) auto;display:inline-flex;">Verificado Bíko</span>`;
    }
    if (myPro.rating) {
      document.getElementById("profileRating").innerHTML = renderStars(myPro.rating);
      document.getElementById("profileRating").style.display = "flex";
      document.getElementById("profileRating").style.justifyContent = "center";
    }
    if (myPro.descricao) {
      document.getElementById("profileDesc").textContent = myPro.descricao;
    }
  } catch (err) {
    console.error("Erro ao carregar perfil:", err);
  }
}

async function loadRequests() {
  const list = document.getElementById("requestsList");
  list.innerHTML = `<div class="state state--loading"><div class="spinner"></div><p>Carregando...</p></div>`;

  try {
    const data = await api.get("/service-requests");
    cachedRequests = data.serviceRequests || [];

    document.getElementById("statTotal").textContent = cachedRequests.length;
    document.getElementById("statAceito").textContent = cachedRequests.filter(r => r.status === "aceito").length;
    document.getElementById("statConcluido").textContent = cachedRequests.filter(r => r.status === "concluido").length;

    renderRequests(cachedRequests, currentFilter);
  } catch (err) {
    list.innerHTML = `<div class="painel-empty"><div class="painel-empty__icon">⚠️</div><p>Erro ao carregar solicitações.</p></div>`;
  }
}

function renderRequests(requests, filter) {
  const list = document.getElementById("requestsList");

  const filtered = filter === "todas"
    ? requests
    : requests.filter(r => r.status === filter);

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="painel-empty">
        <div class="painel-empty__icon">📭</div>
        <p>Nenhuma solicitação ${filter !== "todas" ? `com status "${filter}"` : ""} por enquanto.</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(r => {
    const clientName = r.cliente?.nome || "Cliente";
    const msgs = getMessages(r.id);
    const hasUnread = msgs.some(m => !m.mine && !m.read);
    return `
      <button class="request-item" onclick="openChat(${r.id})">
        <div class="request-item__avatar">${getInitials(clientName)}</div>
        <div class="request-item__body">
          <div class="request-item__client">${clientName}</div>
          <div class="request-item__desc">${r.descricao}</div>
        </div>
        <div class="request-item__meta">
          <span class="status-badge status-badge--${r.status}">${statusLabel(r.status)}</span>
          <span class="request-item__date">${formatDate(r.createdAt || new Date())}</span>
          ${hasUnread ? `<div class="request-item__unread" title="Nova mensagem"></div>` : ""}
        </div>
      </button>`;
  }).join("");
}

function statusLabel(status) {
  return { pendente: "⏳ Pendente", aceito: "✓ Aceito", concluido: "✅ Concluído", recusado: "✗ Recusado" }[status] || status;
}

function formatDate(date) {
  const d = new Date(date);
  return isNaN(d) ? "Agora" : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function initTabs() {
  document.querySelectorAll(".painel-tab").forEach(tab => {
    tab.addEventListener("click", async () => {
      document.querySelectorAll(".painel-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      const data = await api.get("/service-requests");
      cachedRequests = data.serviceRequests || [];
      renderRequests(cachedRequests, currentFilter);
    });
  });
}

function openChat(requestId) {
  const panelRequests = document.getElementById("panelRequests");
  const panelChat     = document.getElementById("panelChat");

  const req = cachedRequests.find(r => r.id === requestId);
  if (!req) return;

  currentRequest = req;

  const clientName = req.cliente?.nome || "Cliente";
  document.getElementById("chatTitle").textContent = `${clientName} — ${req.professional?.categoria || "Serviço"}`;
  document.getElementById("chatStatusBadge").innerHTML = `<span class="status-badge status-badge--${req.status}">${statusLabel(req.status)}</span>`;
  document.getElementById("chatContext").innerHTML = `<strong>Solicitação:</strong> ${req.descricao}`;

  const actionsEl = document.getElementById("chatActions");
  if (req.status === "pendente") {
    actionsEl.innerHTML = `
      <button class="btn btn--primary btn--sm" onclick="updateStatus(${req.id}, 'aceito')">✓ Aceitar</button>
      <button class="btn btn--outline btn--sm" onclick="updateStatus(${req.id}, 'recusado')" style="border-color:var(--color-error);color:var(--color-error)">✗ Recusar</button>
    `;
  } else if (req.status === "aceito") {
    actionsEl.innerHTML = `
      <button class="btn btn--primary btn--sm" onclick="updateStatus(${req.id}, 'concluido')">✅ Marcar concluído</button>
    `;
  } else {
    actionsEl.innerHTML = "";
  }

  if (getMessages(requestId).length === 0) {
    const initial = [{ system: true, text: "Solicitação recebida em " + formatDate(req.createdAt || new Date()) }];
    saveMessages(requestId, initial);
  }

  renderMessages(requestId);

  panelRequests.classList.add("hidden");
  panelChat.classList.remove("hidden");

  setTimeout(() => {
    const msgs = document.getElementById("chatMessages");
    msgs.scrollTop = msgs.scrollHeight;
  }, 50);
}

function renderMessages(requestId) {
  const msgs = getMessages(requestId);
  const container = document.getElementById("chatMessages");

  if (msgs.length === 0) {
    container.innerHTML = `
      <div class="chat-msg chat-msg--system">
        <div class="chat-msg__bubble">Nenhuma mensagem ainda. Inicie a conversa!</div>
      </div>`;
    return;
  }

  container.innerHTML = msgs.map(m => {
    if (m.system) {
      return `<div class="chat-msg chat-msg--system"><div class="chat-msg__bubble">${m.text}</div></div>`;
    }
    const side = m.mine ? "mine" : "other";
    return `
      <div class="chat-msg chat-msg--${side}">
        ${!m.mine ? `<div class="chat-msg__sender">${m.sender}</div>` : ""}
        <div class="chat-msg__bubble">${m.text}</div>
        <div class="chat-msg__time">${m.time}</div>
      </div>`;
  }).join("");
}

async function updateStatus(requestId, newStatus) {
  try {
    await api.patch(`/service-requests/${requestId}/status`, { status: newStatus });

    const req = cachedRequests.find(r => r.id === requestId);
    if (req) req.status = newStatus;

    const label = { aceito: "Solicitação aceita pelo profissional.", concluido: "Serviço marcado como concluído.", recusado: "Solicitação recusada." }[newStatus];
    const msgs = getMessages(requestId);
    msgs.push({ system: true, text: label });
    saveMessages(requestId, msgs);

    openChat(requestId);
  } catch (err) {
    alert("Erro ao atualizar status: " + err.message);
  }
}

document.getElementById("chatBack")?.addEventListener("click", () => {
  document.getElementById("panelChat").classList.add("hidden");
  document.getElementById("panelRequests").classList.remove("hidden");
  currentRequest = null;
});

document.getElementById("chatInputForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text || !currentRequest) return;

  const user = getUser();
  const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const msgs = getMessages(currentRequest.id);
  msgs.push({ mine: true, sender: user?.nome || "Você", text, time, read: true });
  saveMessages(currentRequest.id, msgs);

  input.value = "";
  renderMessages(currentRequest.id);

  const msgsEl = document.getElementById("chatMessages");
  msgsEl.scrollTop = msgsEl.scrollHeight;
});