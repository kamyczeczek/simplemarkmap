# Accessibility/DOM smoke test

## Zakres

Test renderera SimpleMarkmap przez Playwright/DOM. Native Electron file dialog nie jest dostępny w headless browserze, więc test używa URL `?file=` do załadowania mapy i sprawdza elementy GUI przez DOM oraz accessibility snapshot.

## Wynik

- `npm test`: **13 passed, 0 failed**
- `node tests/test-e2e.js`: **passed**
- serwer testowy uruchomiony na losowym porcie loopback,
- załadowano `sample.md`,
- załadowano `new.md`,
- snapshot accessibility zawiera nazwę aplikacji i kontrolkę `Open`,
- obecne są przyciski nawigacji Back/Forward z tytułami accessibility,
- proces testowego serwera został zamknięty po teście.

## Ograniczenie

Nie przetestowano natywnego okna Electrona (`dialog.showOpenDialog`) w tym headless smoke teście. Wymaga to uruchomienia spakowanej aplikacji w sesji desktopowej Windows i osobnego scenariusza UI Automation.
