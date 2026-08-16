# SimpleMarkmap
Electronowa aplikacja do edycji map Markdown.
### [kamyczek](../../../../kamyczek.md)
## Routing
- bieżący stan i ostatnie buildy: `CONTEXT.md`
- kod Electrona i serwera: `src/`
- interfejs: `public/`
- testy: `tests/`
- skrypty: `scripts/`
- dokumentacja i decyzje: `docs/`
- skill automatyzacji accessibility/DOM: `docs/ui-automation/`
- dane przykładowe: `maps/`
## Commands
- `npm start` – uruchomienie aplikacji w trybie deweloperskim (Electron)
- `npm test` – uruchomienie wszystkich testów jednostkowych i integracyjnych
- `npm run test:link` – test funkcji “Link to file…”
- `npm run build:safe` – bezpieczny build instalatora Windows do `C:\sm-build\out`
- `npm run dist` – standardowy build (domyślny folder wyjściowy)
## Zasady przed zmianą
1. **Myśl przed kodowaniem (Think Before Coding):** Nie zgaduj i jasno przedstawiaj swoje założenia. Jeśli polecenie ma wiele interpretacji lub jest niejasne, zatrzymaj się i poproś o doprecyzowanie. Jeśli istnieje prostsze podejście, poinformuj o nim i wskaż ewentualne kompromisy.
2. **Prostota przede wszystkim (Simplicity First):** Pisz absolutne minimum kodu potrzebne do rozwiązania problemu. Nie dodawaj żadnych funkcji, dodatkowej elastyczności, ani abstrakcji dla jednorazowego kodu, o które użytkownik wyraźnie nie prosił. Jeśli napisałeś 200 linii, a można to zrobić w 50, przepisz to.
3. **Chirurgiczne zmiany (Surgical Changes):** Modyfikuj tylko to, что jest absolutnie konieczne do wykonania zadania. Nie "poprawiaj" formatowania, komentarzy ani nie refaktoryzuj sąsiedniego kodu, jeśli nie jest to częścią błędu. Zawsze dostosowuj się do istniejącego stylu w pliku, nawet jeśli wolałbyś zrobić to inaczej. Usuwaj wyłącznie osierocony kod (np. nieużywane importy czy zmienne), który powstał w wyniku Twoich własnych zmian.
4. **Działanie zorientowane na cel (Goal-Driven Execution):** Przekształcaj ogólne zadania w weryfikowalne cele. Na przykład: zamiast po prostu "naprawić błąd", najpierw napisz test, który go reprodukuje, a następnie spraw, by test przeszedł. Dla zadań wieloetapowych wypisz krótki plan i weryfikuj każdy krok z osobna.
5. Przeczytaj `CONTEXT.md` i sprawdź `git status`.
6. Nie edytuj `dist/` — to artefakt builda.
7. Nie zabijaj procesów na porcie `8765` przez `taskkill`.
8. Nie wpisuj ścieżek użytkownika na stałe.
9. Aplikacja może otwierać pliki Markdown z dowolnych lokalizacji.
10. Po zmianie uruchom `npm test` i build do `C:\sm-build\out`.
11. Aktualizuj `CONTEXT.md` dopiero po zweryfikowanym wyniku.
