import { describe, it, expect } from 'vitest';
import { esc, escAttr } from './ui.js';

// Test 5
// Nume: esc() si escAttr() - sanitizare HTML
// Ce verifica: ca functiile esc() si escAttr() escapeaza corect
//              caracterele HTML periculoase inainte sa fie inserate in DOM
// De ce: renderResults() foloseste esc() pentru syntax, description, tool
//        si escAttr() pentru atributul data-cmd al butonului copy —
//        daca aceste functii nu escapeaza corect, un atacator poate injecta
//        HTML/JavaScript in pagina (XSS)
// Tip: unit test pur, nu necesita browser sau backend
describe('esc()', () => {

    it('escapeaza tag-uri HTML', () => {
        expect(esc('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('escapeaza ampersand', () => {
        expect(esc('docker build & push')).toBe('docker build &amp; push');
    });

    it('escapeaza ghilimele duble', () => {
        expect(esc('echo "hello"')).toBe('echo &quot;hello&quot;');
    });

    it('returneaza string gol pentru valori falsy', () => {
        expect(esc(null)).toBe('');
        expect(esc(undefined)).toBe('');
        expect(esc('')).toBe('');
    });

    it('nu modifica text normal', () => {
        expect(esc('docker ps -a')).toBe('docker ps -a');
    });

});

describe('escAttr()', () => {

    it('escapeaza ghilimele duble din atribute HTML', () => {
        expect(escAttr('docker run --name "myapp"')).toBe('docker run --name &quot;myapp&quot;');
    });

    it('escapeaza ghilimele simple din atribute HTML', () => {
        expect(escAttr("kubectl exec -it 'pod'")).toBe('kubectl exec -it &#39;pod&#39;');
    });

    it('returneaza string gol pentru valori falsy', () => {
        expect(escAttr(null)).toBe('');
        expect(escAttr(undefined)).toBe('');
    });

    it('nu modifica comenzi normale', () => {
        expect(escAttr('kubectl get pods')).toBe('kubectl get pods');
    });

});

// Test 7
// Nume: renderResults - nu insereaza HTML brut in DOM
// Ce verifica: ca esc() aplicata pe date din backend escapeaza
//              tag-urile HTML — acestea nu pot fi interpretate de browser
// Tip: unit test pur — testeaza functia esc() folosita de renderResults()
describe('renderResults() - protectie HTML brut in DOM', () => {

    it('syntax cu tag HTML este escapeat, nu interpretat', () => {
        const syntax = '<img src=x onerror="alert(1)">';
        const result = esc(syntax);
        expect(result).not.toContain('<img');
        expect(result).toContain('&lt;img');
    });

    it('syntax cu script tag este escapeat complet', () => {
        const syntax = '<script>document.cookie</script>';
        const result = esc(syntax);
        expect(result).not.toContain('<script>');
        expect(result).toContain('&lt;script&gt;');
    });

});
