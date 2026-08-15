# Electron desktop test

## Wynik

Test `npm run test:desktop` nie zakończył się poprawnie.

- Playwright Electron API nie uzyskał okna w spakowanym procesie.
- Próba przez persistent Chromium przekroczyła limit 120 sekund.
- `pywinauto` nie jest zainstalowane w środowisku.
- W systemie były już uruchomione procesy `SimpleMarkmap`, więc nie zabijano ich automatycznie.

## Wniosek

Headless DOM test działa, ale natywny dialog Windows wymaga aktywnej sesji desktopowej oraz dedykowanego adaptera Windows UI Automation. Nie należy uznawać tego testu za zaliczony.
