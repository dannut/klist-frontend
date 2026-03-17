const API_URL = '/api/search';

/**
 * Search commands from the backend.
 * @param {string} query  - Search term
 * @param {number} page   - Page number (1-based)
 * @param {number} perPage - Results per page (default 10)
 * @param {AbortSignal} signal - AbortController signal for cancellation
 */
export async function searchCommands(query, page = 1, perPage = 10, signal) {
    const params = new URLSearchParams({
        q:        query,
        page:     page,
        per_page: perPage,
    });
    const res = await fetch(`${API_URL}?${params}`, { signal });
    if (!res.ok) throw new Error('server error');
    return res.json();
}
