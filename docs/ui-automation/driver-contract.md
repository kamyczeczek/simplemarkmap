# Kontrakt sterownika

## Selector

Selektor jest obiektem JSON:

```json
{"role":"button","name":"Open"}
```

Dozwolone pola: `role`, `name`, `label`, `testId`. Wymagaj co najmniej jednego pola i odrzucaj nieznane pola.

## Wynik

Każde narzędzie zwraca JSON z `status`, `action`, selektorem i — jeśli dotyczy — ograniczonym wynikiem. Błąd zawiera kod, komunikat i informację, czy można ponowić akcję.

## Snapshot

Snapshot zawiera tylko widoczne i interaktywne elementy oraz ich role, nazwy, etykiety, test-id i tag. Nie umieszczaj w nim haseł, tokenów ani pełnej zawartości pól wrażliwych.

## Bezpieczeństwo

- allowlista domen i adresów,
- timeouty i limit rozmiaru snapshotu,
- brak dowolnego JavaScriptu,
- maskowanie danych wrażliwych,
- logowanie każdej akcji,
- człowiek zatwierdza działania destrukcyjne lub wysłanie formularza.
