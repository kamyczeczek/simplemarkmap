# Build i typowe problemy Windows oraz Historia Poprawek

## Zalecany build
```powershell
npm test
npm run build:safe
```
Wynik instalatora trafia do `C:\sm-build\out`.

## `spawn EPERM` & Port 8765
Najpierw zamknij `SimpleMarkmap.exe` i `electron.exe`. Agenci nie powinni ręcznie używać polecenia `taskkill` do ubijania procesów. Jednak automatyczny skrypt startowy `run.bat` bezpiecznie zarządza zwolnieniem portu 8765 dla powtarzalnych uruchomień.
Jeśli problem z buildem się powtarza, użyj świeżego katalogu wyjściowego poza repozytorium, np. `C:\sm-build\out`, oraz sprawdź blokadę Defendera/OneDrive.

---

## Historia ważniejszych napraw i poprawek

### Naprawa błędu startowego (`ReferenceError: server is not defined`)
- W `src/electron-main.js` serwer HTTP był uruchamiany przez odwołanie do niezdefiniowanej zmiennej `server` (linia 69).
- Moduł `server.js` nie startuje sam w Electronie — wystawia metodę `createServer()`. Poprawka: `const server = serverModule.createServer();`.

### Naprawa opcji "Link to file…" (prawy przycisk)
- `normalizePath` / `basenameOf` / `dirnameOf` / `relPath` dzieliły ścieżki tylko po `/`, a nie po Windows `\`. Dodano `splitPath()` obsługujące oba separatory.
- `openLinkPicker` lokalizuje edytor na nowo po rozwiązaniu asynchronicznego dialogu natywnego.
- Testy: `npm run test:link` oraz `test-relpath.js`.

### Naprawa elementu HTML picker oraz ukrywania menu
- Element `#picker` został domyślnie oznaczony klasą `hidden` w `public/index.html`.
- Dodano jawne wywołania `hidePicker()` w `openLinkPicker()`, `contextmenu` oraz globalnych nasłuchiwaczach kliknięć.
