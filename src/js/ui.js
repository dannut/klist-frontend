// ---- Navigation ----
export function switchView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const view = document.getElementById(name + '-view');
    const nav  = document.getElementById('nav-' + name);
    if (view) view.classList.add('active');
    if (nav)  nav.classList.add('active');
}

// ---- Render results ----
export function renderResults(data) {
    const list = document.getElementById('resultsList');
    list.innerHTML = '';

    data.forEach(function(cmd) {
        var li = document.createElement('li');
        li.className = 'command-card';
        li.innerHTML =
            '<div class="card-body">' +
                '<div class="cmd-syntax">&gt; ' + esc(cmd.syntax) + '</div>' +
                '<div class="cmd-desc">' + esc(cmd.description) + '</div>' +
                '<span class="cmd-tool">' + esc(cmd.tool) + '</span>' +
            '</div>' +
            '<button class="copy-btn" data-cmd="' + escAttr(cmd.syntax) + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                    '<rect x="9" y="9" width="13" height="13" rx="2"/>' +
                    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
                '</svg>copy' +
            '</button>';
        list.appendChild(li);
    });
}

// ---- States ----
export function showLoading(query) {
    document.getElementById('resultsList').innerHTML = '<li class="hint-state">searching...</li>';
    document.getElementById('resultsTitle').textContent = '> ' + query;
    document.getElementById('resultsCount').textContent = '';
    document.getElementById('pagination').classList.remove('show');
}

export function showError(msg) {
    document.getElementById('resultsList').innerHTML = '<li class="error-state">' + esc(msg) + '</li>';
    document.getElementById('resultsTitle').textContent = '';
    document.getElementById('resultsCount').textContent = '';
}

export function showEmpty(query) {
    document.getElementById('resultsList').innerHTML = '<li class="empty-state">no results found_</li>';
    document.getElementById('resultsTitle').textContent = '> ' + query;
    document.getElementById('resultsCount').textContent = '';
}

// ---- Toast ----
export function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg || 'Copied!';
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 1800);
}

// ---- Helpers (exportate pentru testare) ----
export function esc(s) {
    return String(s || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
export function escAttr(s) {
    return String(s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
