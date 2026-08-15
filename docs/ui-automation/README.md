# Accessibility UI automation skill

## Zakres

Ten moduł jest planem i kontraktem narzędzia automatyzacji UI dla agenta AI. Dla aplikacji webowych używamy Playwright. Dla natywnego Windows UI należy użyć osobnego adaptera UI Automation/PyWinAuto, nie mieszać go ze sterownikiem webowym.

## Narzędzia sterownika

Minimalny, deterministyczny interfejs:

- `get_snapshot()` — widoczne elementy accessibility/DOM,
- `find_element(selector)` — szczegóły elementu,
- `click_element(selector)` — kliknięcie,
- `type_text(selector, text)` — wpisanie tekstu,
- `wait_for_element(selector, timeout)` — oczekiwanie,
- `get_text(selector)` — odczyt tekstu.

`execute_js` pozostaje opcjonalne i wyłączone domyślnie.

## Preferencja selektorów

1. `get_by_role(role, name)`
2. `get_by_label(label)` dla formularzy
3. `get_by_test_id(testId)`
4. selektor CSS tylko jako ostateczność
5. XPath nie jest dozwolony w scenariuszach standardowych

## Ograniczenia

Snapshot DOM nie wykrywa problemów czysto wizualnych, np. zasłonięcia elementu lub błędów layoutu. Do takich przypadków potrzebny jest osobny test wizualny.
