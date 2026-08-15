# SimpleMarkmap

Electronowa aplikacja do edycji map Markdown.

## Routing

- bieżący stan i ostatnie buildy: `CONTEXT.md`
- kod Electrona i serwera: `src/`
- interfejs: `public/`
- testy: `tests/`
- skrypty: `scripts/`
- dokumentacja i decyzje: `docs/`
- skill automatyzacji accessibility/DOM: `docs/ui-automation/`
- dane przykładowe: `maps/`

## Zasady przed zmianą

1. Przeczytaj `CONTEXT.md` i sprawdź `git status`.
2. Nie edytuj `dist/` — to artefakt builda.
3. Nie zabijaj procesów na porcie `8765` przez `taskkill`.
4. Nie wpisuj ścieżek użytkownika na stałe.
5. Aplikacja może otwierać pliki Markdown z dowolnych lokalizacji.
6. Po zmianie uruchom `npm test` i build do `C:\sm-build\out`.
7. Aktualizuj `CONTEXT.md` dopiero po zweryfikowanym wyniku.
