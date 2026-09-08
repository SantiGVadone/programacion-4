// Episode Tracker Logic
(function () {
    'use strict';

    const STORAGE_KEY = 'peakyBlindersProgress';
    const TOTAL_SEASONS = 6;
    const EPISODES_PER_SEASON = 6;

    // Episode titles for each season
    const episodeTitles = {
        1: [
            "Capítulo 1: El encuentro",
            "Capítulo 2: La redada",
            "Capítulo 3: El plan",
            "Capítulo 4: La traición",
            "Capítulo 5: La guerra",
            "Capítulo 6: La tregua"
        ],
        2: [
            "Capítulo 1: La nueva era",
            "Capítulo 2: El trato",
            "Capítulo 3: La expansión",
            "Capítulo 4: El enemigo",
            "Capítulo 5: La venganza",
            "Capítulo 6: El final"
        ],
        3: [
            "Capítulo 1: El retorno",
            "Capítulo 2: La conspiración",
            "Capítulo 3: El sacrificio",
            "Capítulo 4: La verdad",
            "Capítulo 5: El juicio",
            "Capítulo 6: La redención"
        ],
        4: [
            "Capítulo 1: La amenaza",
            "Capítulo 2: La alianza",
            "Capítulo 3: El espionaje",
            "Capítulo 4: La fuga",
            "Capítulo 5: El enfrentamiento",
            "Capítulo 6: La victoria"
        ],
        5: [
            "Capítulo 1: El parlamento",
            "Capítulo 2: La campaña",
            "Capítulo 3: El chantaje",
            "Capítulo 4: La resistencia",
            "Capítulo 5: La caída",
            "Capítulo 6: El amanecer"
        ],
        6: [
            "Capítulo 1: El final",
            "Capítulo 2: El legado",
            "Capítulo 3: La sangre",
            "Capítulo 4: El fuego",
            "Capítulo 5: La paz",
            "Capítulo 6: By Order of the Peaky Blinders"
        ]
    };

    // Default progress state
    function getDefaultProgress() {
        return {
            watchedEpisodes: {},
            lastWatched: { season: 1, episode: 1 }
        };
    }

    // Load progress from localStorage
    function loadProgress() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Error loading progress:', e);
        }
        return getDefaultProgress();
    }

    // Save progress to localStorage
    function saveProgress(progress) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.warn('Error saving progress:', e);
        }
    }

    // Get watched count
    function getWatchedCount(progress) {
        let count = 0;
        for (let s = 1; s <= TOTAL_SEASONS; s++) {
            if (progress.watchedEpisodes[s]) {
                count += Object.values(progress.watchedEpisodes[s]).filter(v => v).length;
            }
        }
        return count;
    }

    // Update progress indicator
    function updateProgressIndicator(progress) {
        const currentProgressEl = document.getElementById('currentProgress');
        const progressDetailEl = document.getElementById('progressDetail');

        const last = progress.lastWatched;
        const title = episodeTitles[last.season]?.[last.episode - 1] || `Capítulo ${last.episode}`;
        currentProgressEl.textContent = `Temporada ${last.season}, ${title}`;

        const watched = getWatchedCount(progress);
        const total = TOTAL_SEASONS * EPISODES_PER_SEASON;
        const percentage = Math.round((watched / total) * 100);
        progressDetailEl.textContent = `${watched} de ${total} episodios vistos (${percentage}%)`;
    }

    // Render season tabs
    function renderSeasonTabs(currentSeason) {
        const tabsContainer = document.getElementById('seasonTabs');
        tabsContainer.innerHTML = '';

        for (let s = 1; s <= TOTAL_SEASONS; s++) {
            const btn = document.createElement('button');
            btn.className = 'season-btn' + (s === currentSeason ? ' active' : '');
            btn.textContent = `Temporada ${s}`;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', s === currentSeason);
            btn.setAttribute('data-season', s);
            btn.addEventListener('click', () => {
                setCurrentSeason(s);
            });
            tabsContainer.appendChild(btn);
        }
    }

    // Render episodes grid
    function renderEpisodes(season, progress) {
        const grid = document.getElementById('episodesGrid');
        grid.innerHTML = '';

        const watched = progress.watchedEpisodes[season] || {};
        const titles = episodeTitles[season] || [];

        for (let e = 1; e <= EPISODES_PER_SEASON; e++) {
            const isWatched = watched[e] === true;
            const card = document.createElement('div');
            card.className = 'episode-card' + (isWatched ? ' watched' : '');
            card.setAttribute('role', 'listitem');
            card.setAttribute('data-season', season);
            card.setAttribute('data-episode', e);
            card.innerHTML = `
                <div class="episode-number" style="font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--ivory); margin-bottom: 0.25rem;">
                    ${e}
                    <svg class="check-icon" style="width: 1.25rem; height: 1.25rem; margin-left: 0.5rem; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <div style="font-size: 0.75rem; color: rgba(229, 224, 216, 0.7); line-height: 1.4;">${titles[e - 1] || `Capítulo ${e}`}</div>
            `;

            card.addEventListener('click', () => {
                toggleEpisode(season, e, progress);
            });

            // Keyboard support
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    toggleEpisode(season, e, progress);
                }
            });

            grid.appendChild(card);
        }
    }

    // Toggle episode watched state
    function toggleEpisode(season, episode, progress) {
        if (!progress.watchedEpisodes[season]) {
            progress.watchedEpisodes[season] = {};
        }

        const currentlyWatched = progress.watchedEpisodes[season][episode] === true;
        progress.watchedEpisodes[season][episode] = !currentlyWatched;

        // Update last watched to this episode if marking as watched
        if (!currentlyWatched) {
            progress.lastWatched = { season, episode };
        } else {
            // If unwatching, find the latest watched episode
            let latestSeason = 1;
            let latestEpisode = 1;
            for (let s = TOTAL_SEASONS; s >= 1; s--) {
                const eps = progress.watchedEpisodes[s] || {};
                for (let ep = EPISODES_PER_SEASON; ep >= 1; ep--) {
                    if (eps[ep]) {
                        latestSeason = s;
                        latestEpisode = ep;
                        break;
                    }
                }
                if (latestSeason !== 1 || latestEpisode !== 1) break;
            }
            progress.lastWatched = { season: latestSeason, episode: latestEpisode };
        }

        saveProgress(progress);
        renderEpisodes(season, progress);
        updateProgressIndicator(progress);
        updateSeasonTabsProgress(progress);
    }

    // Update season tabs with progress indicators
    function updateSeasonTabsProgress(progress) {
        document.querySelectorAll('.season-btn').forEach(btn => {
            const season = parseInt(btn.dataset.season);
            const watched = progress.watchedEpisodes[season] || {};
            const count = Object.values(watched).filter(v => v).length;
            if (count > 0) {
                btn.textContent = `Temporada ${season} (${count}/${EPISODES_PER_SEASON})`;
            } else {
                btn.textContent = `Temporada ${season}`;
            }
        });
    }

    // Set current season
    function setCurrentSeason(season) {
        const progress = loadProgress();
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.season) === season);
            btn.setAttribute('aria-selected', parseInt(btn.dataset.season) === season);
        });
        renderEpisodes(season, progress);
    }

    // Reset progress
    function resetProgress() {
        if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
            const progress = getDefaultProgress();
            saveProgress(progress);
            setCurrentSeason(1);
            updateProgressIndicator(progress);
            updateSeasonTabsProgress(progress);
        }
    }

    // Initialize
    function init() {
        const progress = loadProgress();
        const lastSeason = progress.lastWatched?.season || 1;

        renderSeasonTabs(lastSeason);
        setCurrentSeason(lastSeason);
        updateProgressIndicator(progress);
        updateSeasonTabsProgress(progress);

        document.getElementById('resetProgress').addEventListener('click', resetProgress);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();