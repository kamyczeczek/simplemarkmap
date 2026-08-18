# SimpleMarkmap

> **Twoje centrum dowodzenia myślami. Pisz w Markdown, myśl w strukturze mapy.**

SimpleMarkmap to potężne, a zarazem proste narzędzie desktopowe (Electron), które eliminuje barierę między pisaniem notatek a ich wizualizacją. Nie musisz wybierać między linearnym tekstem a chaotycznym rysowaniem – tutaj jedno wynika z drugiego.

---

## 🛠 Co możesz robić w SimpleMarkmap?

Aplikacja została zaprojektowana tak, abyś mógł przejść od pomysłu do pełnej struktury projektu w kilka minut. Oto główne możliwości:

### 1. Błyskawiczne tworzenie map przez pisanie
Zapomnij o ręcznym rysowaniu bąbelków i kresek. 
*   **Struktura z nagłówków:** Użyj `#` dla głównych tematów i `##`, `###` dla podpunktów. 
*   **Listy punktowe:** Twórz gałęzie za pomocą zwykłych myślników `-`. Aplikacja inteligentnie rozpozna głębokość wcięć i zamieni je w poziomy mapy.
*   **Podgląd w czasie rzeczywistym:** Każda litera dopisana w edytorze natychmiast pojawia się na wizualnej mapie.

### 2. Interaktywne zarządzanie strukturą (Drag & Drop)
Mapa w SimpleMarkmap nie jest tylko statycznym obrazkiem – to żywy edytor:
*   **Przesuwanie gałęzi:** Chwyć dowolny węzeł i przeciągnij go w inne miejsce. Możesz podpiąć całą gałąź pod inny temat lub zmienić jej kolejność (Before/After/Child).
*   **Automatyczna aktualizacja tekstu:** Gdy zmienisz układ wizualnie, aplikacja sama przeredaguje Twój plik Markdown, dbając o poprawne wcięcia i poziomy nagłówków.
*   **Zwijanie i rozwijanie:** Kliknij dwukrotnie w węzeł, aby ukryć jego dzieci. Pozwala to skupić się na konkretnym fragmencie projektu, bez rozpraszania się resztą mapy.

### 3. Budowanie osobistej bazy wiedzy (Zettelkasten / Obsidian-style)
Aplikacja pozwala na tworzenie sieci powiązanych dokumentów:
*   **Szybkie linkowanie `[[`:** Wystarczy wpisać dwa nawiasy kwadratowe, aby uruchomić inteligentne wyszukiwanie plików na Twoim dysku.
*   **Tworzenie plików "w locie":** Jeśli wpiszesz tytuł notatki, która jeszcze nie istnieje, SimpleMarkmap zaproponuje jej stworzenie i automatycznie wstawi link.
*   **Nawigacja jak w przeglądarce:** Korzystaj z przycisków "Wstecz" i "Dalej", aby przemieszczać się między powiązanymi mapami bez gubienia wątku.

### 4. Praca na Twoich zasadach (Local-First)
Twoje dane nie są uwięzione w chmurze ani wewnątrz bazy danych aplikacji:
*   **Otwieraj dowolne pliki:** Możesz edytować pliki Markdown z dowolnego miejsca na komputerze – z pulpitu, pendrive'a czy folderu Dropbox.
*   **Edytuj zewnętrznie:** Jednym kliknięciem możesz otworzyć aktualną notatkę w swoim ulubionym edytorze systemowym (np. VS Code czy Notepad++), a SimpleMarkmap odświeży widok po zapisaniu zmian.
*   **Bezpieczeństwo pracy:** Aplikacja posiada funkcję **autozapisu**, więc nie musisz pamiętać o klikaniu "Save". Każda zmiana jest bezpieczna.

---

## ⌨️ Skróty klawiszowe, które ułatwiają życie

*   **Enter** – dodaj nowy element na tym samym poziomie.
*   **Tab** – dodaj podpunkt (dziecko).
*   **Shift + Tab** – wyciągnij element poziom wyżej (unindent).
*   **Del / Backspace** – usuń węzeł (lub edytuj jego treść).
*   **Ctrl + Z** – cofnij ostatnią zmianę.
*   **Alt + Drag** – przesuwanie całej mapy (panoramowanie).

---

## 🏗 Inżynieria i Stabilność (Harness Engineering)

Projekt nie jest tylko prostym narzędziem – pod spodem kryje się zaawansowana metodologia **ICM (Interpretable Context Methodology)**:
*   **Gwarancja jakości:** Każda funkcja, od linkowania plików po przesuwanie gałęzi, jest pokryta testami automatycznymi (Playwright), co zapewnia brak błędów przy aktualizacjach.
*   **Transparentność:** Aplikacja prowadzi dziennik operacyjny (Logbook), który dokumentuje każdą ważną decyzję projektową i naprawiony błąd.
*   **Weryfikacja Harness:** Przed każdym wydaniem system automatycznie sprawdza reguły bezpieczeństwa (np. zakaz twardego kodowania ścieżek użytkownika), co czyni aplikację bezpieczną i przenośną.

---

## 🚀 Jak zacząć?

1.  Pobierz instalator `SimpleMarkmap-Setup-x.x.x.exe` z sekcji Releases.
2.  Uruchom i otwórz swój pierwszy plik `.md`.
3.  Zacznij pisać – Twoja mapa myśli stworzy się sama.

---
*Stworzone z pasją do czystego kodu i efektywnego myślenia.*
