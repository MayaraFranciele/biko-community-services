document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadCategories(), loadFeaturedProfessionals()]);
  initStatsAnimation();
});

function initStatsAnimation() {
  const stats = document.querySelectorAll(".hero__stat-value[data-count]");
  if (!stats.length) return;

  const countUp = (el) => {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals || "0");
    const duration = 1400;
    const start    = performance.now();

    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const tick = (now) => {
      const elapsed  = Math.min(now - start, duration);
      const progress = ease(elapsed / duration);
      const value    = (target * progress).toFixed(decimals);
      el.textContent = value + suffix;
      if (elapsed < duration) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.closest(".hero__stats")
          ?.querySelectorAll(".hero__stat-value[data-count]")
          .forEach((el, i) => {
            setTimeout(() => countUp(el), i * 120);
          });
        observer.disconnect();
      });
    },
    { threshold: 0.5 }
  );

  const container = document.querySelector(".hero__stats");
  if (container) observer.observe(container);
}

async function loadCategories() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  try {
    const data = await api.get("/categories");
    grid.innerHTML = data.categories.map(renderCategoryCard).join("");
  } catch {
    grid.innerHTML = `<p style="color:var(--color-text-secondary);grid-column:1/-1;text-align:center">
      Não foi possível carregar as categorias.
    </p>`;
  }
}

async function loadFeaturedProfessionals() {
  const grid = document.getElementById("featuredProfessionals");
  if (!grid) return;

  try {
    const data = await api.get("/professionals?verified=true");
    const featured = (data.professionals || []).slice(0, 3);

    if (featured.length === 0) {
      grid.innerHTML = `<p style="color:var(--color-text-secondary);grid-column:1/-1;text-align:center">
        Nenhum profissional em destaque ainda.
      </p>`;
      return;
    }

    grid.innerHTML = featured.map((p) => renderProfessionalCard(p, false)).join("");
  } catch {
    grid.innerHTML = `<p style="color:var(--color-text-secondary);grid-column:1/-1;text-align:center">
      Não foi possível carregar os destaques.
    </p>`;
  }
}