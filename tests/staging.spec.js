import { test, expect } from '@playwright/test';

// Test UI 1
// Nume: Pagina se incarca corect
// Ce verifica: ca pagina principala se incarca, titlul este corect
//              si input-ul de search exista si este vizibil
// De ce: verifica integrarea de baza frontend → nginx → pagina HTML livrata corect
//        Daca nginx nu porneste sau fisierele statice lipsesc, testul pica
// Tip: UI integration test — necesita frontend live la https://test.kli.st
test('pagina se incarca si input-ul de search exista', async ({ page }) => {
    await page.goto('https://test.kli.st');

    await expect(page).toHaveTitle(/kli\.st/i);

    const searchInput = page.locator('input[type="text"], input[type="search"], #searchInput, #query');
    await expect(searchInput.first()).toBeVisible();
});

// Test UI 2
// Nume: Search returneaza rezultate reale de la backend
// Ce verifica: ca utilizatorul scrie "docker" in search, apasa Enter
//              si rezultatele apar in pagina cu date reale de la backend
// De ce: verifica integrarea completa frontend → /api/search → PostgreSQL → UI
//        Aceasta este integrarea critica a aplicatiei — daca oricare componenta
//        din lant pica, testul esueaza
// Tip: UI integration test — necesita frontend + backend + PostgreSQL live
test('search docker returneaza rezultate reale', async ({ page }) => {
    await page.goto('https://test.kli.st');

    const searchInput = page.locator('input[type="text"], input[type="search"], #searchInput, #query');
    await searchInput.first().fill('docker');
    await searchInput.first().press('Enter');

    // Asteptam rezultatele sa apara in pagina
    const results = page.locator('#resultsList li, .command-card, .result-item');
    await expect(results.first()).toBeVisible({ timeout: 10000 });

    // Verificam ca sunt rezultate reale (nu mesaj de eroare)
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
});

// Test UI 3
// Nume: Search fara rezultate afiseaza mesaj corespunzator
// Ce verifica: ca un query care nu exista in DB afiseaza mesajul "no results"
//              si nu o eroare de server sau pagina alba
// De ce: verifica ca integrarea frontend → backend gestioneaza corect
//        cazul de "no results" — un raspuns valid de la backend (array gol)
//        trebuie sa produca o stare UI corecta, nu o eroare
// Tip: UI integration test — necesita frontend + backend + PostgreSQL live
test('search inexistent afiseaza mesaj no results', async ({ page }) => {
    await page.goto('https://test.kli.st');

    const searchInput = page.locator('input[type="text"], input[type="search"], #searchInput, #query');
    await searchInput.first().fill('xyzabcnonexistent123');
    await searchInput.first().press('Enter');

    // Asteptam raspunsul de la backend
    const emptyState = page.locator('.empty-state, #emptyState, [data-state="empty"]');
    await expect(emptyState.first()).toBeVisible({ timeout: 10000 });
});
