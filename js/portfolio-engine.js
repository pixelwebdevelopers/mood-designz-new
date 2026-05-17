/**
 * ========================================================================
 * PORTFOLIO ENGINE V2.0 — DYNAMIC GRID + INFINITE SCROLL
 * Mood Designz (2026 Premium Spec)
 * ========================================================================
 */
(function () {
    "use strict";

    const BATCH_SIZE = 6;
    const DATA_URL = "data/projects.json";

    // --- STATE ---
    let allProjects = [];
    let filteredProjects = [];
    let displayedCount = 0;
    let currentFilter = "all";
    let isLoading = false;
    let allLoaded = false;

    // --- DOM REFS ---
    const grid = document.getElementById("portfolio-grid");
    const bottomLoader = document.getElementById("bottom-loader");
    const sentinel = document.getElementById("load-more-sentinel");
    const endOfList = document.getElementById("end-of-list");
    const countEl = document.getElementById("portfolio-count");

    if (!grid) return; // Not on the portfolio page

    // =====================================================================
    // 1. DATA FETCHING
    // =====================================================================
    async function fetchProjects() {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            allProjects = await response.json();
            return allProjects;
        } catch (err) {
            console.error("[PortfolioEngine] Failed to load projects:", err);
            grid.innerHTML = `
                <div class="col-12 text-center" style="padding: 6rem 2rem;">
                    <p class="t-bright" style="text-transform: uppercase; font-size: 13px; letter-spacing: 0.3em; opacity: 0.5;">
                        Unable to load projects at this moment.
                    </p>
                </div>`;
            return [];
        }
    }

    // =====================================================================
    // 2. CARD RENDERING
    // =====================================================================
    function createCardHTML(project, index) {
        const categoryLabel = project.category.charAt(0).toUpperCase() + project.category.slice(1);
        const tags = [categoryLabel, ...project.meta.split("//").map(s => s.trim())];
        const tagsHTML = tags.map(tag => `<span class="tag tag-default tag-permanent">${tag}</span>`).join("\n");
        
        return `
            <div class="col-12 col-xl-6 mxd-project-item mxd-projects-masonry__item card-enter active anim-uni-in-up" 
                 data-category="${project.category}" 
                 data-index="${index}"
                 style="transition-delay: ${(index % BATCH_SIZE) * 80}ms;">
              <a class="mxd-project-item__media masonry-media" href="casestudy.html?project=${project.id}">
                <div class="mxd-project-item__preview masonry-preview parallax-img-small" style="background-image: url('${project.coverImage}'); background-size: cover; background-position: center; transition: transform 0.8s ease;"></div>
                <div class="mxd-project-item__tags">
                  ${tagsHTML}
                </div>
              </a>
              <div class="mxd-project-item__promo">
                <div class="mxd-project-item__name">
                  <a class="anim-uni-in-up" href="casestudy.html?project=${project.id}"><span>${project.name}</span> — ${project.meta}</a>
                </div>
              </div>
            </div>`;
    }

    function renderBatch(projects, startIndex) {
        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement("div");

        projects.forEach((project, i) => {
            tempContainer.innerHTML = createCardHTML(project, startIndex + i);
            const card = tempContainer.firstElementChild;
            fragment.appendChild(card);
        });

        grid.appendChild(fragment);

        // Re-trigger scroll parallax / entrance animations if custom scripts are listening
        if (window.Ukiyo) {
            setTimeout(() => {
                try {
                    const ukiyoImages = grid.querySelectorAll(".parallax-img-small:not(.ukiyo-activated)");
                    ukiyoImages.forEach(img => {
                        img.classList.add("ukiyo-activated");
                        new Ukiyo(img, { scale: 1.15, speed: 1.5 });
                    });
                } catch (e) {
                    console.log("Ukiyo initialization skipped or handled globally.");
                }
            }, 100);
        }
    }

    // =====================================================================
    // 3. INFINITE SCROLL ENGINE
    // =====================================================================
    function loadNextBatch() {
        if (isLoading || allLoaded) return;

        const remaining = filteredProjects.slice(displayedCount, displayedCount + BATCH_SIZE);
        if (remaining.length === 0) {
            allLoaded = true;
            if (bottomLoader) bottomLoader.style.display = "none";
            if (endOfList) endOfList.style.display = "block";
            return;
        }

        isLoading = true;
        if (bottomLoader) bottomLoader.style.display = "flex";

        setTimeout(() => {
            renderBatch(remaining, displayedCount);
            displayedCount += remaining.length;
            isLoading = false;
            if (bottomLoader) bottomLoader.style.display = "none";
            updateCount();

            // Check if we've loaded everything
            if (displayedCount >= filteredProjects.length) {
                allLoaded = true;
                if (endOfList) endOfList.style.display = "block";
            }
        }, 300);
    }

    function setupInfiniteScroll() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isLoading && !allLoaded) {
                        loadNextBatch();
                    }
                });
            },
            {
                root: null, // viewport
                rootMargin: "200px",
                threshold: 0,
            }
        );

        if (sentinel) observer.observe(sentinel);
    }

    // =====================================================================
    // 4. CATEGORY FILTERING
    // =====================================================================
    function applyFilter(filter) {
        currentFilter = filter;
        displayedCount = 0;
        allLoaded = false;
        if (endOfList) endOfList.style.display = "none";

        // Update active tab styles
        document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(`[data-filter="${filter}"]`).forEach((t) => t.classList.add("active"));

        // Clear grid and render from index 0
        grid.innerHTML = "";

        filteredProjects =
            filter === "all"
                ? [...allProjects]
                : allProjects.filter((p) => p.category === filter);

        loadNextBatch();
    }

    function setupFilterListeners() {
        document.addEventListener("click", (e) => {
            const tab = e.target.closest(".filter-tab");
            if (!tab) return;

            e.preventDefault();
            const filter = tab.getAttribute("data-filter");
            if (filter && filter !== currentFilter) {
                applyFilter(filter);
            }
        });
    }

    // =====================================================================
    // 5. COUNT DISPLAY
    // =====================================================================
    function updateCount() {
        if (!countEl) return;
        countEl.innerHTML = `
            Showing <span style="color: var(--additional); font-weight: bold;">${displayedCount}</span> 
            of <span style="color: var(--additional); font-weight: bold;">${filteredProjects.length}</span> Projects`;
    }

    // =====================================================================
    // 6. INITIALIZATION
    // =====================================================================
    async function init() {
        const projects = await fetchProjects();
        if (projects.length === 0) return;

        filteredProjects = [...projects];

        // Load first batch
        loadNextBatch();

        // Setup infinite scroll
        setupInfiniteScroll();

        // Setup filter click listeners
        setupFilterListeners();
    }

    // --- BOOT ---
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
