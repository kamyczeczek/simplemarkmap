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

## Ostatni commit zmian

```text
3ab8cd5 Allow opening files from any local folder
```

Zmiany zostały wypchnięte do `origin/master`.
