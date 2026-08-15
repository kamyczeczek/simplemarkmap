# SimpleMarkmap — kontekst projektu

## Ostatni poprawny build

Aplikacja została poprawnie zrebuildowana w tej sesji poleceniem:

```powershell
npm run dist -- --config.directories.output=C:\sm-build\out
```

Build zakończył się kodem `0`.

Aktualny instalator znajduje się tutaj:

```text
C:\sm-build\out\SimpleMarkmap-Setup-1.0.0.exe
```

Przed instalacją należy zamknąć działającą aplikację SimpleMarkmap, aby instalator nie próbował podmieniać używanych plików.

## Ważna informacja o wcześniejszym błędzie

Wcześniejsza próba:

```powershell
npm run pack
```

zakończyła się błędem `spawn EPERM` podczas uruchamiania procesu pomocniczego Electrona/electron-buildera. Ta próba nie utworzyła aktualnego pakietu i nie należy traktować jej jako źródła najnowszego builda.

Błąd `spawn EPERM` był problemem środowiska/procesu Windows, a nie błędem kodu aplikacji. Najczęstsze przyczyny to działający `SimpleMarkmap.exe`/`electron.exe`, blokada przez Defendera lub OneDrive, pozostały proces poprzedniego builda, zablokowany katalog wyjściowy albo problem z uprawnieniami.

## Reorganizacja ICM

Projekt ma routing w `AGENTS.md`, kod w `src/`, testy w `tests/`, dokumentację w `docs/`,
skrypty w `scripts/` oraz osobne decyzje architektoniczne w `docs/decisions/`.
Build i testy powinny być wykonywane przez `npm test` oraz `npm run build:safe`.

## Skill automatyzacji UI

Kontrakt narzędzia accessibility/DOM znajduje się w `docs/ui-automation/`.
Dla aplikacji webowych docelowym adapterem jest Playwright; selektory bazują
na role/name/label/testId. `execute_js` jest wyłączone domyślnie, a scenariusze
powstają z `docs/ui-automation/scenarios/scenario.template.md`.

## Ostatni commit zmian

```text
3ab8cd5 Allow opening files from any local folder
```

Zmiany zostały wypchnięte do `origin/master`.

## Błąd startowy naprawiony (ReferenceError: server is not defined)

W `src/electron-main.js` serwer HTTP był uruchamiany przez odwołanie do
niezdefiniowanej zmiennej `server`, które powodowało przy starcie:
`Uncaught Exception: ReferenceError: server is not defined` (linia 69).
Moduł `server.js` nie startuje sam w Electronie — wystawia metodę
`createServer()`. Naprawa: `const server = serverModule.createServer();`.

Zbudowano do `C:\sm-build\out` poleceniem `npm run build:safe` (kod 0).
Nowy instalator:

```text
C:\sm-build\out\SimpleMarkmap-Setup-1.0.0.exe
```

Przed instalacją zamknąć działające instancje SimpleMarkmap.

## Naprawa opcji "Link to file…" (prawy przycisk)

Objaw: dialog systemowy otwiera się, ale po wyborze pliku link nie powstaje.

Przyczyny (w `public/index.html`):
1. Pomocniki ścieżek (`normalizePath`/`basenameOf`/`dirnameOf`/`relPath`)
   dzieliły tylko po `/`, nie po Windows `\`. Absolutna ścieżka `C:\...`
   stawała się jednym segmentem i generowała śmieciowe/niepoprawne linki.
   Dodano `splitPath()` obsługujące oba separatory.
2. `openLinkPicker` trzymał referencję do elementu edytora **przed**
   asynchronicznym dialogiem; po zamknięciu natywnego dialogu (focus/commit)
   edytor bywał odpięty od DOM i wstawienie cicho znikało. Teraz edytor jest
   lokalizowany na nowo po rozwiązaniu promise, a edycja wznawiana przez
   `startEdit` jeśli została przerwana — bez ponownego otwierania pickera.

Nowy test: `npm run test:link` (makiuje natywny dialog w rendererze i weryfikuje
wstawienie dokładnie jednego względnego linku). Aktualizacja pomocyków objęta
testem `test-relpath.js` (przypadki backslash).

Zbudowano do `C:\sm-build\out` (`npm run build:safe`, kod 0).

```text
C:\sm-build\out\SimpleMarkmap-Setup-1.0.0.exe
```
