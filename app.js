/* ============================================================================
   APP — renders the catalog, handles filters, populates meta info
   Reads `projects` array from projects.js (loaded before this file).
   ============================================================================ */

(function () {
  const catalog = document.getElementById("catalog");
  const emptyState = document.getElementById("empty-state");
  const countEl = document.getElementById("project-count");
  const todayEl = document.getElementById("today");
  const yearEl = document.getElementById("year");
  const filterButtons = document.querySelectorAll(".filter");

  // --- meta: today's date + current year in footer -------------------------
  const now = new Date();
  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  todayEl.textContent =
    `${String(now.getDate()).padStart(2, "0")} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  yearEl.textContent = now.getFullYear();

  // --- helpers -------------------------------------------------------------
  const statusLabel = {
    live: "Live",
    wip: "In Progress",
    archived: "Archived",
  };

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  function entryHTML(project, index) {
    const status = project.status || "live";
    const num = String(index + 1).padStart(2, "0");

    const tagsHTML = (project.tech || [])
      .map((t) => `<span class="entry__tag">${escapeHTML(t)}</span>`)
      .join("");

    // Links — if a URL is "#" or empty, render a muted, non-clickable link
    const githubIsReal = project.github && project.github !== "#";
    const demoIsReal = project.demo && project.demo !== "#";

    const githubLink = githubIsReal
      ? `<a class="entry__link" href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">
           Source <span class="entry__link-arrow">→</span>
         </a>`
      : `<span class="entry__link entry__link--muted">Source —</span>`;

    const demoLink = demoIsReal
      ? `<a class="entry__link" href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer">
           Live Demo <span class="entry__link-arrow">→</span>
         </a>`
      : `<span class="entry__link entry__link--muted">Live Demo —</span>`;

    return `
      <article class="entry" data-status="${status}">
        <div class="entry__num">№ ${num}</div>
        <div class="entry__body">
          <div class="entry__head">
            <h2 class="entry__title">${escapeHTML(project.title)}</h2>
            <span class="entry__status entry__status--${status}">${statusLabel[status] || status}</span>
          </div>
          <p class="entry__desc">${escapeHTML(project.description)}</p>
          <div class="entry__tags">${tagsHTML}</div>
          <div class="entry__links">
            ${githubLink}
            ${demoLink}
          </div>
        </div>
        <div class="entry__year">${project.year ? escapeHTML(project.year) : ""}</div>
      </article>
    `;
  }

  // --- render --------------------------------------------------------------
  function render(list) {
    catalog.innerHTML = list.map(entryHTML).join("");
    emptyState.hidden = list.length > 0;
  }

  // --- initial render ------------------------------------------------------
  if (typeof projects === "undefined" || !Array.isArray(projects)) {
    catalog.innerHTML = "";
    emptyState.hidden = false;
    emptyState.textContent = "Could not load projects.js";
    countEl.textContent = "0";
    return;
  }

  countEl.textContent = String(projects.length).padStart(2, "0");
  render(projects);

  // --- filters -------------------------------------------------------------
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;
      const filtered =
        filter === "all"
          ? projects
          : projects.filter((p) => (p.status || "live") === filter);

      render(filtered);
    });
  });
})();
