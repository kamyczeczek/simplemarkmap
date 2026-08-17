# SimpleMarkmap — kontekst projektu

## Cel projektu
Lekka aplikacja desktopowa w Electronie do edycji plików Markdown z wizualizacją Markmap.

## Architektura
- Proces główny Electrona: `src/electron-main.js`
- Serwer HTTP (dla rendereru/API): `src/server.js`
- Interfejs użytkownika (Renderer): `public/index.html`
- Most preload: `src/preload.js`

## Aktualny stan
Stabilny; naprawiono start przeciągania poddrzew przez podłączenie `mousedown` do `dragState.mousedown`; `npm run harness` kończy się `PASS — 0 issues`.

## Ważne reguły i ograniczenia
- Aplikacja może otwierać pliki Markdown z dowolnych lokalizacji.
- Artefakty builda trafiają do `C:\sm-build\out`.
- Nie zabijaj procesów na porcie `8765` przez `taskkill`.
- Nie edytuj katalogu `dist/`.

## Nawigacja i odniesienia
- Zasady i polecenia → `AGENTS.md`
- Decyzje architektoniczne → `docs/decisions/`
- Rozwiązywanie problemów z buildem i historia poprawek → `docs/build-troubleshooting.md`
- Automatyzacja UI → `docs/ui-automation/`
- Przykładowe mapy → `maps/`
