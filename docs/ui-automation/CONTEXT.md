# UI automation — kontrakt modułu

## Cel

Moduł opisuje przygotowanie bezpiecznego narzędzia dla agenta AI, które steruje interfejsem przez drzewo accessibility/DOM, bez zależności od analizy obrazu.

## Wejścia

- aplikacja webowa uruchomiona pod testowym adresem,
- selektory accessibility: `role`, `name`, `label`, `testId`,
- scenariusz użytkownika zapisany w `scenarios/`.

## Proces

1. Uruchom Playwright w środowisku testowym.
2. Pobierz ograniczony snapshot widocznych elementów.
3. Wybieraj elementy przez role/nazwy/etykiety lub stabilny `data-testid`.
4. Wykonuj tylko dozwolone akcje sterownika.
5. Po każdej akcji sprawdź wynik i zapisz artefakt scenariusza.

## Wyjścia

- JSON/text snapshotu,
- wynik akcji (`clicked`, `typed`, `waited`, `read`),
- raport scenariusza z błędami i krokami.

## Kontrola człowieka

Przed użyciem na realnych danych człowiek zatwierdza adres aplikacji, listę narzędzi i scenariusz. `execute_js` jest wyłączone domyślnie.

## Status

To jest kontrakt i dokumentacja. Implementacja drivera może zostać dodana później jako osobny pakiet/skrypt.
