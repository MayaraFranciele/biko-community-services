const grid         = document.getElementById("professionalsGrid");
const resultsCount = document.getElementById("resultsCount");
const searchForm   = document.getElementById("searchForm");

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("categoria")) {
    const sel = document.getElementById("filterCategoria");
    if (sel) sel.value = params.get("categoria");
  }
  if (params.get("bairro")) {
    const inp = document.getElementById("filterBairro");
    if (inp) inp.value = params.get("bairro");
  }
  loadProfessionals();
});

async function loadProfessionals() {
  const categoria = document.getElementById("filterCategoria")?.value || "";
  const bairro    = document.getElementById("filterBairro")?.value?.trim() || "";
  const verified  = document.getElementById("filterVerified")?.checked;

  const params = new URLSearchParams();
  if (categoria) params.set("categoria", categoria);
  if (bairro)    params.set("bairro", bairro);
  if (verified)  params.set("verified", "true");

  setListState("loading");
  grid.innerHTML = "";

  try {
    const data = await api.get(`/professionals?${params.toString()}`);
    const professionals = data.professionals || [];

    if (professionals.length === 0) {
      setListState("empty");
      resultsCount.textContent = "Nenhum resultado encontrado";
      return;
    }

    setListState("results");
    resultsCount.textContent = `${professionals.length} profissional${professionals.length !== 1 ? "is" : ""} encontrado${professionals.length !== 1 ? "s" : ""}`;
    grid.innerHTML = professionals.map((p) => renderProfessionalCard(p, true)).join("");
  } catch (err) {
    console.error(err);
    setListState("error");
    resultsCount.textContent = "Erro ao buscar";
  }
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loadProfessionals();
  });
}

document.getElementById("clearFilters")?.addEventListener("click", () => {
  if (searchForm) searchForm.reset();
  loadProfessionals();
});

document.getElementById("retryBtn")?.addEventListener("click", loadProfessionals);

const modalOverlay = document.getElementById("modalOverlay");
const modalClose   = document.getElementById("modalClose");
const serviceRequestForm = document.getElementById("serviceRequestForm");
const modalFeedback = document.getElementById("modalFeedback");

function openRequestModal(professionalId, professionalName) {
  if (!isLoggedIn()) {
    window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
    return;
  }

  const user = getUser();
  if (user?.tipo === "profissional") {
    alert("Apenas clientes podem solicitar serviços.");
    return;
  }

  document.getElementById("professionalId").value = professionalId;
  document.getElementById("modalProfessional").textContent = `Profissional: ${professionalName}`;

  if (serviceRequestForm) serviceRequestForm.reset();
  if (modalFeedback) modalFeedback.className = "feedback";

  modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

modalClose?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

if (serviceRequestForm) {
  serviceRequestForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFieldError("descricaoServico");

    const descricao = serviceRequestForm.descricao.value;
    if (!validateServiceRequest(descricao)) return;

    const submitBtn = serviceRequestForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
      await api.post("/service-request", {
        profissional_id: parseInt(document.getElementById("professionalId").value),
        descricao: descricao.trim(),
      });

      const fb = document.getElementById("modalFeedback");
      fb.textContent = "✓ Solicitação enviada com sucesso!";
      fb.className = "feedback show feedback--success";

      setTimeout(closeModal, 1800);
    } catch (err) {
      const fb = document.getElementById("modalFeedback");
      fb.textContent = "✗ " + (err.message || "Erro ao enviar solicitação.");
      fb.className = "feedback show feedback--error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar Solicitação";
    }
  });
}