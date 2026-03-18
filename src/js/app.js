import { searchCommands } from './api.js';
import * as UI from './ui.js';

const PER_PAGE = 10;

const state = {
    query:       '',
    page:        1,
    hasMore:     false,
};

let currentController = null;

async function doSearch(page = 1) {
    const raw = document.getElementById('searchInput').value.trim();
    if (!raw) return;
    const query = raw.replace(/^tool=/i, '');

    // Cancel any previous in-flight request
    if (currentController) currentController.abort();
    currentController = new AbortController();

    state.query = query;
    state.page  = page;

    UI.showLoading(query);

    try {
        const data = await searchCommands(query, page, PER_PAGE, currentController.signal);
        const results = data || [];

        if (results.length === 0 && page === 1) {
            UI.showEmpty(query);
            updatePaginationButtons(false, false);
            return;
        }

        // If backend returns a full page, assume there might be more
        state.hasMore = results.length === PER_PAGE;

        UI.renderResults(results);
        document.getElementById('resultsTitle').textContent = '> ' + query;
        document.getElementById('resultsCount').textContent = results.length > 0
            ? '(' + ((page - 1) * PER_PAGE + results.length) + '+)'
            : '';

        updatePaginationButtons(page > 1, state.hasMore);

    } catch (e) {
        if (e.name === 'AbortError') return;
        UI.showError("backend offline — run 'go run .' in backend/cmd");
    }
}

function updatePaginationButtons(hasPrev, hasNext) {
    const pag  = document.getElementById('pagination');
    const prev = document.getElementById('btnPrev');
    const next = document.getElementById('btnNext');
    const info = document.getElementById('pageInfo');

    if (hasPrev || hasNext) {
        pag.classList.add('show');
        prev.disabled = !hasPrev;
        next.disabled = !hasNext;
        info.textContent = 'Page ' + state.page;
    } else {
        pag.classList.remove('show');
    }
}

function resetHome() {
    if (currentController) { currentController.abort(); currentController = null; }
    const input = document.getElementById('searchInput');
    input.value = '';
    document.getElementById('clearBtn').classList.remove('visible');
    document.getElementById('resultsList').innerHTML = '<li class="hint-state">$ ready to search_</li>';
    document.getElementById('resultsTitle').textContent = '';
    document.getElementById('resultsCount').textContent = '';
    document.getElementById('pagination').classList.remove('show');
    state.query   = '';
    state.page    = 1;
    state.hasMore = false;
}

function debounce(fn, ms) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}

document.addEventListener('DOMContentLoaded', function () {

    // Search
    document.getElementById('searchBtn').addEventListener('click', () => doSearch(1));
    document.getElementById('searchInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doSearch(1);
    });

    // Clear button
    const input    = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    input.addEventListener('input', debounce(function () {
        clearBtn.classList.toggle('visible', input.value.length > 0);
    }, 50));
    clearBtn.addEventListener('click', function () {
        resetHome();
        input.focus();
    });

    // Pagination — now calls backend with page number
    document.getElementById('btnPrev').addEventListener('click', function () {
        if (state.page > 1) doSearch(state.page - 1);
    });
    document.getElementById('btnNext').addEventListener('click', function () {
        if (state.hasMore) doSearch(state.page + 1);
    });

    // Copy buttons (event delegation)
    document.getElementById('resultsList').addEventListener('click', function (e) {
        const btn = e.target.closest('.copy-btn');
        if (!btn) return;
        const cmd = btn.getAttribute('data-cmd');
        navigator.clipboard.writeText(cmd).then(function () {
            btn.classList.add('copied');
            btn.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                    '<polyline points="20 6 9 17 4 12"/>' +
                '</svg>copied';
            UI.toast('Copied!');
            setTimeout(function () {
                btn.classList.remove('copied');
                btn.innerHTML =
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<rect x="9" y="9" width="13" height="13" rx="2"/>' +
                        '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
                    '</svg>copy';
            }, 2000);
        }).catch(function () { UI.toast('Copy failed'); });
    });

    // Navigation
    document.getElementById('nav-home').addEventListener('click', function (e) {
        e.preventDefault();
        UI.switchView('home');
        resetHome();
    });

    function navClick(id, viewName) {
        document.getElementById(id).addEventListener('click', function (e) {
            e.preventDefault();
            UI.switchView(viewName);
        });
    }
    navClick('nav-about',    'about');
    navClick('nav-get_kli',  'get_kli');
    navClick('nav-releases', 'releases');
});
