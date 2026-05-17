/**
 * ========================================================================
 * CASE STUDY ENGINE V2.0 — DYNAMIC PROJECT DETAIL
 * Mood Designz (2026 Premium Spec)
 * ========================================================================
 */
(function () {
    "use strict";

    const DATA_URL = "data/projects.json";

    // --- DOM REFS ---
    const topCategoryEl = document.getElementById("cs-top-category");
    const titleEl = document.getElementById("cs-title");
    const subtitleEl = document.getElementById("cs-subtitle");
    const clientEl = document.getElementById("cs-client");
    const categoryEl = document.getElementById("cs-category");
    const scopeEl = document.getElementById("cs-scope");
    const yearEl = document.getElementById("cs-year");
    const tagsEl = document.getElementById("cs-tags");
    const heroImgEl = document.getElementById("cs-hero-img");
    const challengeLeadEl = document.getElementById("cs-challenge-lead");
    const challengeDescEl = document.getElementById("cs-challenge-desc");
    const galleryMainEl = document.getElementById("cs-gallery-main");

    // Prev / Next refs
    const prevBtn = document.getElementById("cs-prev-btn");
    const prevLink = document.getElementById("cs-prev-link");
    const prevName = document.getElementById("cs-prev-name");

    const nextBtn = document.getElementById("cs-next-btn");
    const nextLink = document.getElementById("cs-next-link");
    const nextName = document.getElementById("cs-next-name");

    if (!titleEl) return; // Not on the case study page

    // =====================================================================
    // 1. URL PARAMETER PARSING
    // =====================================================================
    function getProjectIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("project");
    }

    // =====================================================================
    // 2. DATA FETCHING
    // =====================================================================
    async function fetchProjects() {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            console.error("[CaseStudyEngine] Failed to load projects:", err);
            return [];
        }
    }

    // =====================================================================
    // 3. CONTENT POPULATION
    // =====================================================================
    function populatePage(project, allProjects) {
        const categoryLabel = project.category.charAt(0).toUpperCase() + project.category.slice(1);

        // --- Dynamic Page Title ---
        document.title = `${project.name} — Case Study | Mood Designz`;

        // --- Populate Details ---
        if (topCategoryEl) topCategoryEl.textContent = `${categoryLabel} Study`;
        if (titleEl) titleEl.textContent = project.name;

        // Split description into lead sentence and body content
        const descText = project.description || "";
        const firstPeriodIdx = descText.indexOf(".");
        let leadSentence = descText;
        let bodySentence = "";

        if (firstPeriodIdx !== -1) {
            leadSentence = descText.substring(0, firstPeriodIdx + 1);
            bodySentence = descText.substring(firstPeriodIdx + 1).trim();
        }

        if (subtitleEl) subtitleEl.textContent = leadSentence;
        if (challengeLeadEl) challengeLeadEl.textContent = leadSentence;
        if (challengeDescEl) challengeDescEl.textContent = bodySentence || descText;

        if (clientEl) clientEl.textContent = "Mood Designz Client";
        if (categoryEl) categoryEl.textContent = categoryLabel;
        if (scopeEl) scopeEl.textContent = project.meta;
        if (yearEl) yearEl.textContent = "2026";

        // Generate outline tags
        if (tagsEl) {
            const tags = [categoryLabel, ...project.meta.split("//").map(s => s.trim())];
            tagsEl.innerHTML = tags.map(tag => `<span class="tag tag-default tag-outline-medium">${tag}</span>`).join("\n");
        }

        // --- Hero Image ---
        if (heroImgEl) {
            heroImgEl.style.backgroundImage = `url('${project.coverImage}')`;
        }

        // --- Main Gallery Image ---
        if (galleryMainEl) {
            galleryMainEl.src = project.caseStudyImage;
            galleryMainEl.alt = `${project.name} — Study Showcase`;
        }

        // --- Prev / Next Navigation ---
        const currentIndex = allProjects.findIndex((p) => p.id === project.id);
        
        // Prev project
        const prevIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
        const prevProject = allProjects[prevIndex];
        if (prevBtn) prevBtn.href = `casestudy.html?project=${prevProject.id}`;
        if (prevLink) prevLink.href = `casestudy.html?project=${prevProject.id}`;
        if (prevName) prevName.textContent = prevProject.name;

        // Next project
        const nextIndex = (currentIndex + 1) % allProjects.length;
        const nextProject = allProjects[nextIndex];
        if (nextBtn) nextBtn.href = `casestudy.html?project=${nextProject.id}`;
        if (nextLink) nextLink.href = `casestudy.html?project=${nextProject.id}`;
        if (nextName) nextName.textContent = nextProject.name;
    }

    // =====================================================================
    // 4. ERROR HANDLING
    // =====================================================================
    function showErrorMessage(msg) {
        const app = document.getElementById("project-app");
        if (app) {
            app.innerHTML = `
                <div class="container" style="text-align: center; padding: 10rem 2rem;">
                    <p class="t-bright" style="text-transform: uppercase; font-size: 14px; letter-spacing: 0.3em; margin-bottom: 2rem;">
                        ${msg}
                    </p>
                    <a href="portfolio.html" class="btn btn-anim btn-default btn-outline" style="padding: 1rem 2rem;">
                        <span class="btn-caption">Back to Showcase</span>
                    </a>
                </div>`;
        }
    }

    // =====================================================================
    // 5. INITIALIZATION
    // =====================================================================
    async function init() {
        const projectId = getProjectIdFromURL();

        if (!projectId) {
            showErrorMessage("No project specified");
            return;
        }

        const allProjects = await fetchProjects();
        if (allProjects.length === 0) {
            showErrorMessage("Unable to load project data");
            return;
        }

        const project = allProjects.find((p) => p.id === projectId);
        if (!project) {
            showErrorMessage("Project not found");
            return;
        }

        populatePage(project, allProjects);
    }

    // --- BOOT ---
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
