function getInitials(nome) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function renderStars(rating) {
  if (!rating) return "";
  const value = parseFloat(rating);
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const stars = "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  return `
    <div class="rating">
      <span class="rating__stars">${stars}</span>
      <span class="rating__value">${value.toFixed(1)}</span>
    </div>
  `;
}

function renderProfessionalCard(professional, showRequest = true) {
  const { user, categoria, bairro, descricao, rating, verified, id } = professional;
  const nome = user?.nome || "Profissional";

  const verifiedBadge = verified
    ? `<span class="badge-verified">Verificado Bíko</span>`
    : "";

  const ratingHtml = rating ? renderStars(rating) : "";

  const requestBtn = showRequest
    ? `<button
         class="btn btn--primary btn--full"
         onclick="openRequestModal(${id}, '${nome.replace(/'/g, "\\'")} — ${categoria}')"
       >
         Solicitar Serviço
       </button>`
    : "";

  return `
    <article class="professional-card">
      <div class="professional-card__header">
        <div class="professional-card__avatar">${getInitials(nome)}</div>
        <div class="professional-card__info">
          <h3 class="professional-card__name">${nome}</h3>
          <p class="professional-card__category">${categoria}</p>
          ${ratingHtml}
        </div>
        <div>${verifiedBadge}</div>
      </div>

      <p class="professional-card__bairro">📍 ${bairro}</p>

      ${descricao ? `<p class="professional-card__desc">${descricao}</p>` : ""}

      <div class="professional-card__footer">
        ${requestBtn}
      </div>
    </article>
  `;
}

function renderCategoryCard(category) {
  return `
    <a href="busca.html?categoria=${encodeURIComponent(category.nome)}" class="category-card">
      <div class="category-card__icon">${category.icone}</div>
      <div class="category-card__name">${category.nome}</div>
    </a>
  `;
}

function setListState(state) {
  const loading = document.getElementById("loadingState");
  const empty   = document.getElementById("emptyState");
  const error   = document.getElementById("errorState");
  const container = document.getElementById("stateContainer");

  if (!loading) return;

  loading.classList.add("hidden");
  empty.classList.add("hidden");
  error.classList.add("hidden");

  if (state === "loading") {
    loading.classList.remove("hidden");
    container.classList.remove("hidden");
  } else if (state === "empty") {
    empty.classList.remove("hidden");
    container.classList.remove("hidden");
  } else if (state === "error") {
    error.classList.remove("hidden");
    container.classList.remove("hidden");
  } else {
    container.classList.add("hidden");
  }
}