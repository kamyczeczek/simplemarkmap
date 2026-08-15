# Build i typowe problemy Windows

## Zalecany build

```powershell
npm test
npm run build:safe
```

Wynik instalatora trafia do `C:\sm-build\out`.

## `spawn EPERM`

Najpierw zamknij `SimpleMarkmap.exe` i `electron.exe`. Nie zabijaj procesów
na podstawie samego portu `8765`, bo może należeć do innej instancji.

Jeśli problem się powtarza, użyj świeżego katalogu wyjściowego poza repozytorium,
np. `C:\sm-build\out`, oraz sprawdź blokadę Defendera/OneDrive.
