/* ============================================================================
   APP — Project Index
   Loads projects.json, renders entries, handles search + status filters.
   ============================================================================ */

(function () {
  "use strict";

  // --- DOM references ------------------------------------------------------
  const $catalog       = document.getElementById("catalog");
  const $emptyState    = document.getElementById("empty-state");
  const $loadingState  = document.getElementById("loading-state");
  const $resultLine    = document.getElementById("result-line");
  const $count         = document.getElementById("project-count");
  const $today         = document.getElementById("today");
  const $year          = document.getElementById("year");
  const $search        = document.getElementById("search");
  const $searchClear   = document.getElementById("search-clear");
  const $filters       = document.querySelectorAll(".filter");

  // --- app state -----------------------------------------------------------
  const state = {
    projects: [],   // loaded from projects.json
    filter: "all",  // "all" | "live" | "wip" | "archived"
    query: "",      // current search text
  };

  const STATUS_LABEL = {
    live: "Live",
    wip: "In Progress",
    archived: "Archived",
  };

  // --- meta: today's date + current year in footer -------------------------
  const now = new Date();
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  $today.textContent = `${String(now.getDate()).padStart(2,"0")} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  $year.textContent = now.getFullYear();

  // --- helpers -------------------------------------------------------------
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Wrap search-term matches in <mark> tags for visual highlighting.
   * Works on already-escaped HTML, so we only need to be careful about regex
   * special characters in the query itself.
   */
  function highlight(text, query) {
    const escaped = escapeHTML(text);
    if (!query) return escaped;
    const pattern = new RegExp(`(${escapeRegExp(query)})`, "gi");
    return escaped.replace(pattern, "<mark>$1</mark>");
  }

  /**
   * Decide whether a project matches the current search + filter state.
   * Search checks title, description, and tech tags (case-insensitive).
   */
  function matches(project) {
    const status = project.status || "live";
    if (state.filter !== "all" && status !== state.filter) return false;

    if (!state.query) return true;
    const q = state.query.toLowerCase();
    const haystack = [
      project.title || "",
      project.description || "",
      ...(project.tech || []),
    ].join(" ").toLowerCase();

    return haystack.includes(q);
  }

  // --- render --------------------------------------------------------------
  function entryHTML(project, displayIndex) {
    const status = project.status || "live";
    const num = String(displayIndex + 1).padStart(2, "0");
    const q = state.query;

    const tagsHTML = (project.tech || [])
      .map((t) => `<span class="entry__tag">${highlight(t, q)}</span>`)
      .join("");

    const githubIsReal = project.github && project.github !== "#";
    const demoIsReal   = project.demo   && project.demo   !== "#";

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
            <h2 class="entry__title">${highlight(project.title || "Untitled", q)}</h2>
            <span class="entry__status entry__status--${status}">${STATUS_LABEL[status] || status}</span>
          </div>
          <p class="entry__desc">${highlight(project.description || "", q)}</p>
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

  function render() {
    const visible = state.projects.filter(matches);

    if (visible.length === 0) {
      $catalog.innerHTML = "";
      $emptyState.hidden = false;
    } else {
      $catalog.innerHTML = visible.map(entryHTML).join("");
      $emptyState.hidden = true;
    }

    // Result line — communicates current filter/search state
    const total = state.projects.length;
    const showing = visible.length;
    if (state.query || state.filter !== "all") {
      $resultLine.textContent = `Showing ${showing} of ${total}`;
    } else {
      $resultLine.textContent = "";
    }
  }

  // --- data loading --------------------------------------------------------
  /**
   * Fetch projects.json. Handles both http(s) and file:// — when opened
   * directly via file://, fetch() fails with a CORS-style error in most
   * browsers. We show a clear message pointing the user to serve the folder.
   */
  function loadProjects() {
    return fetch("projects.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
  }

  function showFatalError(message) {
    $loadingState.hidden = true;
    $emptyState.hidden = false;
    $emptyState.innerHTML = `
      <p class="empty-state__title">Could not load projects.json</p>
      <p class="empty-state__hint">${escapeHTML(message)}</p>
    `;
  }

  // --- event wiring --------------------------------------------------------
  function bindControls() {
    // Filters
    $filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        $filters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.filter = btn.dataset.filter;
        render();
      });
    });

    // Search — debounced input for perceived snappiness without re-rendering
    // on every keystroke (matters if project list grows to hundreds of items)
    let searchTimer = null;
    $search.addEventListener("input", (e) => {
      const value = e.target.value.trim();
      $searchClear.hidden = value.length === 0;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.query = value;
        render();
      }, 120);
    });

    // Keyboard UX: Esc clears the search input
    $search.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $search.value = "";
        state.query = "";
        $searchClear.hidden = true;
        render();
      }
    });

    $searchClear.addEventListener("click", () => {
      $search.value = "";
      state.query = "";
      $searchClear.hidden = true;
      $search.focus();
      render();
    });
  }

  // --- boot ----------------------------------------------------------------
  bindControls();

  loadProjects()
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error("projects.json must contain a JSON array");
      }
      state.projects = data;
      $count.textContent = String(data.length).padStart(2, "0");
      $loadingState.hidden = true;
      render();
    })
    .catch((err) => {
      const hint = location.protocol === "file:"
        ? "Opened via file:// — browsers block fetch() here. Serve the folder with a local server (see README)."
        : err.message;
      showFatalError(hint);
    });
})();
