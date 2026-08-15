# Absolute local file paths

## Decyzja

Aplikacja może otwierać i zapisywać pliki Markdown z dowolnych lokalizacji na komputerze.

## Implementacja

Systemowy dialog przekazuje absolutną ścieżkę do serwera. Ścieżki względne nadal są ograniczone do domyślnego katalogu map.

## Konsekwencje

Testy muszą obejmować spacje, Unicode, inne dyski oraz odczyt i zapis poza katalogiem projektu.
