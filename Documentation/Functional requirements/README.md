# Funkcjonalność aplikacji

Aplikacja ma służyć do bezpiecznego dzielenia się między sobą poufnymi plikami. Po wysłaniu na serwer plików zaszyfrowanych za pomocą klucza symetrycznego, użytkownik będzie mógł ustawić datę i godzinę wygaśnięcia pliku oraz zarządzać listą osób uprawnionych do jego odczytu. Służący do tego klucz symetryczny zostanie wtedy zaszyfrowany i przekazany według protokołu Diffiego-Hellmana.

## 1. Audytowanie
Administrator ma dostęp do danych audytowych przechowywanych w bazie danych oraz dostarczanych przez serwer aplikacji w postaci logów systemowych. Logi systemowe są dostępne dla administratora z poziomu aplikacji. Dane audytowe przechowują informacje na temat zdarzeń zachodzących w aplikacji. Zawierają dane o krytycznych funkcjach systemu: logowaniu, wylogowaniu, nieudanych próbach logowania, wyjątkach, wywoływanych metodach, a także o zmianach dokonywanych w bazie danych. Jest to szczególnie ważne w przypadku niniejszej aplikacji ze względu na jej poufny charakter. Dostęp do danych audytowych posiada jedynie administrator .

## 2. Weryfikacja i uwierzytelnienie
System posiada mechanizm kontroli dostępu. Do wykonania jakiejkolwiek akcji, wymaga od użytkownika uwierzytelnienia się poprzez zalogowanie do aplikacji. W systemie zdefiniowane są dwie role - administrator oraz użytkownik. Żaden użytkownik nie posiada uprawnień do otwierania dokumentów dla niego nieprzeznaczonych. Tylko administrator ma prawo do przeglądania wszystkich dokumentów w bazie (bez uprawnień do ich otwierania i wyświetlania - jedynie do pobierania, usuwania, sprawdzenia kto jest właścicielem i kto ma dostęp) oraz dostęp do danych audytowych. W przypadku, gdy system wykryje podejrzane zachowanie, jakim są wielokrotne, nieudane próby zalogowania, blokuje użytkownikowi dostęp do konta na 1 godzinę (dla danej sesji - nie dla danego konta).

### UC1 - Rejestracja
Jeśli użytkownik nie posiada jeszcze konta w systemie, przy pierwszym kontakcie z aplikacją powinien się zarejestrować. Dzięki temu podczas użytkowania aplikacji system będzie mógł dokonać jego identyfikacji i potwierdzić tożsamość.
1. Wymagania: brak
2. Scenariusz główny:
- Przeglądarka wyświetla formularz logowania - obok znajduje się opcja "Zarejestruj się"
- Użytkownik wybiera opcję "Zarejestruj się"
- Przeglądarka ładuje ekran rejestracji z trzema polami - prosi o podanie identyfikatora (adresu e-mail), założenie hasła i powtórzenie go
- Użytkownik wpisuje poprawne dane do formularza logowania
- Użytkownik wybiera opcję "Zatwierdź"
- System tworzy nowe konto i przenosi użytkownika do ekranu logowania
3. Scenariusz alternatywny 1:
- Przeglądarka wyświetla formularz logowania - obok znajduje się opcja "Zarejestruj się"
- Użytkownik wybiera opcję "Zarejestruj się"
- Przeglądarka ładuje ekran rejestracji z trzema polami - prosi o podanie identyfikatora (adresu e-mail), założenie hasła i powtórzenie go
- Użytkownik podaje zajęty lub niepoprawny identyfikator (adres e-mail)
- System wyświetla komunikat o wprowadzeniu błędnych danych
4. Scenariusz alternatywny 2:
- Przeglądarka wyświetla formularz logowania - obok znajduje się opcja "Zarejestruj się"
- Użytkownik wybiera opcję "Zarejestruj się"
- Przeglądarka ładuje ekran rejestracji z trzema polami - prosi o podanie identyfikatora (adresu e-mail), założenie hasła i powtórzenie go
- Użytkownik podaje identyfikator (adres e-mail) i hasło, jednak niepoprawnie je powtarza
- System wyświetla komunikat z prośbą o ponowne powtórzenie hasła

### UC2 - Logowanie
Po połączeniu się z serwerem i otwarciu aplikacji w przeglądarce, użytkownik musi się zalogować do systemu. Ma to na celu identyfikację i potwierdzenie tożsamości osoby korzystającej z aplikacji. Zalogowanie się jest konieczne - niezalogowany użytkownik nie może wykonać w systemie żadnych operacji.
1. Wymagania: brak
2. Scenariusz główny:
- Przeglądarka wyświetla formularz logowania
- Użytkownik wpisuje poprawne dane do formularza logowania
- Użytkownik wybiera opcję “Zaloguj”
- System sprawdza poprawność danych i wyświetla główny widok aplikacji
3. Scenariusz alternatywny 1:
- Przeglądarka wyświetla formularz logowania
- Użytkownik wpisuje niepoprawne dane do formularza logowania
- Użytkownik wybiera opcję “Zaloguj”
- System wyświetla komunikat o wprowadzeniu błędnych danych
4. Scenariusz alternatywny 2:
- Przeglądarka wyświetla formularz logowania
- Użytkownik niepoprawnie wpisuje dane do formularza logowania
- Użytkownik wybiera opcję “Zaloguj”
- System wyświetla komunikat o błędnym wypełnieniu formularza
5. Scenariusz alternatywny 3:
- Przeglądarka wyświetla formularz logowania
- Użytkownik wpisuje poprawny login, ale niepoprawne hasło do formularza logowania
- Użytkownik wybiera opcję “Zaloguj”
- System wyświetla komunikat o wprowadzeniu błędnych danych
- Użytkownik 2 razy ponownie wpisuje niepoprawne hasło
- Po 3-krotnej próbie podania niepoprawnego hasła system blokuje użytkownikowi dostęp do konta na 1 godzinę (dla danej sesji - nie dla konta)

### UC3 - Wysyłanie dokumentu
1. Wymagania: użytkownik musi być zalogowany
2. Scenariusz główny:
- Użytkownik wybiera opcję "Wyślij dokument"
- Pojawia się okno wyboru pliku
- Użytkownik wskazuje odpowiedni dokument
- Użytkownik podaje klucz symetryczny, którym zostanie zaszyfrowany dokument
- Użytkownik podaje datę wygaśnięcia pliku
- Użytkownik podaje identyfikatory e-mail osób, którym chce udostępnić dokument
- Użytkownik wybiera opcję "Zatwierdź"
3. Scenariusz alternatywny:
- Użytkownik wybiera opcję "Wyślij dokument"
- Pojawia się okno wyboru pliku
- Użytkownik wskazuje odpowiedni dokument
- Użytkownik podaje klucz symetryczny, którym zostanie zaszyfrowany dokument
- Użytkownik podaje datę wygaśnięcia pliku
- Użytkownik wybiera opcję "Zatwierdź"

### UC4 - Zarządzanie dokumentami
1. Wymagania: użytkownik musi być zalogowany
2. Scenariusz główny:
- Użytkownik wybiera opcję "Zarządzanie dokumentami"
- Wyświetlona zostaje lista dostępnych dokumentów, które zostały udostępnione użytkownikowi po udanej operacji Exchange Keys z nadawcą pliku oraz lista dokumentów, których użytkownik jest właścicielem
- Użytkownik wybiera z listy jeden z udostępnionych mu dokumentów
- Wybrany dokument zostaje otwarty
3. Scenariusz alternatywny 1:
- Użytkownik wybiera opcję "Zarządzanie dokumentami"
- Wyświetlona zostaje lista dostępnych dokumentów, które zostały udostępnione użytkownikowi po udanej operacji Exchange Keys z nadawcą pliku oraz lista dokumentów, których użytkownik jest właścicielem
- Użytkownik wybiera z listy jeden z własnych dokumentów
- Pojawiają się do wyboru opcje "Otwórz dokument", "Udostępnij dokument", "Zmień datę wygaśnięcia" oraz "Usuń dokument"
- Użytkownik wybiera opcję "Otwórz dokument"
- Wybrany dokument zostaje otwarty
4. Scenariusz alternatywny 2:
- Użytkownik wybiera opcję "Zarządzanie dokumentami"
- Wyświetlona zostaje lista dostępnych dokumentów, które zostały udostępnione użytkownikowi po udanej operacji Exchange Keys z nadawcą pliku oraz lista dokumentów, których użytkownik jest właścicielem
- Użytkownik wybiera z listy jeden z własnych dokumentów
- Pojawiają się do wyboru opcje "Otwórz dokument", "Udostępnij dokument", "Zmień datę wygaśnięcia" oraz "Usuń dokument"
- Użytkownik wybiera opcję "Udostępnij dokument"
- Użytkownik podaje identyfikatory e-mail osób, którym chce udostępnić dokument
- Użytkownik wybiera opcję "Zatwierdź"
4. Scenariusz alternatywny 3:
- Użytkownik wybiera opcję "Zarządzanie dokumentami"
- Wyświetlona zostaje lista dostępnych dokumentów, które zostały udostępnione użytkownikowi po udanej operacji Exchange Keys z nadawcą pliku oraz lista dokumentów, których użytkownik jest właścicielem
- Użytkownik wybiera z listy jeden z własnych dokumentów
- Pojawiają się do wyboru opcje "Otwórz dokument", "Udostępnij dokument", "Zmień datę wygaśnięcia" oraz "Usuń dokument"
- Użytkownik wybiera opcję "Zmień datę wygaśnięcia"
- Użytkownik podaje datę wygaśnięcia pliku
- Użytkownik wybiera opcję "Zatwierdź"
5. Scenariusz alternatywny 4:
- Użytkownik wybiera opcję "Zarządzanie dokumentami"
- Wyświetlona zostaje lista dostępnych dokumentów, które zostały udostępnione użytkownikowi po udanej operacji Exchange Keys z nadawcą pliku oraz lista dokumentów, których użytkownik jest właścicielem
- Użytkownik wybiera z listy jeden z własnych dokumentów
- Pojawiają się do wyboru opcje "Otwórz dokument", "Udostępnij dokument", "Zmień datę wygaśnięcia" oraz "Usuń dokument"
- Użytkownik wybiera opcję "Usuń dokument"
- Użytkownik zostaje poproszony o potwierdzenie chęci usunięcia dokumentu
- Wybrany dokument zostaje usunięty z bazy

### UC5 - Wylogowanie
1. Wymagania: użytkownik musi być zalogowany
2. Scenariusz główny:
- Użytkownik wybiera opcję "Wyloguj się"
- Użytkownik zostaje wylogowany
- System przenosi użytkownika do ekranu logowania

### UC6 - Wyświetlenie logów systemowych
1. Wymagania: użytkownik musi być zalogowany jako administrator
2. Scenariusz główny:
- Użytkownik wybiera opcję "Wyświetl logi systemowe"
- Pojawia się lista logów systemowych

### UC7 - Przeglądanie bazy dokumentów
1. Wymagania: użytkownik musi być zalogowany jako administrator
2. Scenariusz główny:
- Użytkownik wybiera opcję "Wyświetl bazę dokumentów"
- Wyświetlona zostaje lista dostępnych dokumentów
- Użytkownik wybiera z listy jeden z dokumentów
- Pojawiają się do wyboru opcje: "Pobierz dokument", "Usuń dokument" oraz informacje o właścicielu pliku oraz osobach upoważnionych do jego odczytu
3. Scenariusz alternatywny 1:
- Użytkownik wybiera opcję "Wyświetl bazę dokumentów"
- Wyświetlona zostaje lista dostępnych dokumentów
- Użytkownik wybiera z listy jeden z dokumentów
- Pojawiają się do wyboru opcje: "Pobierz dokument", "Usuń dokument" oraz informacje o właścicielu pliku oraz osobach upoważnionych do jego odczytu
- Użytkownik wybiera opcję "Pobierz dokument"
- Wybrany dokument zostaje pobrany
4. Scenariusz alternatywny 2:
- Użytkownik wybiera opcję "Wyświetl bazę dokumentów"
- Wyświetlona zostaje lista dostępnych dokumentów
- Użytkownik wybiera z listy jeden z dokumentów
- Pojawiają się do wyboru opcje: "Pobierz dokument", "Usuń dokument" oraz informacje o właścicielu pliku oraz osobach upoważnionych do jego odczytu
- Użytkownik wybiera opcję "Usuń dokument"
- Użytkownik zostaje poproszony o potwierdzenie chęci usunięcia dokumentu
- Wybrany dokument zostaje usunięty z bazy


# Charakterystyka użytkowników aplikacji

### 1. Użytkownicy
Główna grupa korzystających z systemu. Używają oni aplikacji do dzielenia się plikami, ufając w bezpieczeństwo procesu. Nie mają dokładnej wiedzy na temat mechanizmów, na których oparte jest działanie systemu.

<b>Wykorzystywane funkcje:</b>
- Rejestracja;
- Logowanie;
- Wysyłanie dokumentów (w tym ustalenie daty i godziny wygaśnięcia, nadanie uprawnień dostępu, nadanie symetrycznego klucza szyfrującego);
- Zarządzanie dokumentami (ustalanie daty i godziny wygaśnięcia, nadawanie uprawnień dostępu.

### 2. Administrator
Użytkownik zarządzający systemem. Nadzoruje on pracę systemu oraz działania użytkowników. Czuwa nad bezpieczeństwem. Posiada  szerszą wiedzę na temat specyfiki działania systemu. Wychwytuje niepożądane akcje użytkowników i zachowania aplikacji. Ma dostęp do bazy danych.

<b>Wykorzystywane funkcje:</b>
- Logowanie;
- Wyświetlanie logów systemowych z serwera;
- Przeglądanie bazy dokumentów (bez uprawnień do ich otwierania i wyświetlania - jedynie do pobierania, usuwania, sprawdzenia kto jest właścicielem i kto ma dostęp).


# Wykorzystanie aplikacji

Aplikacja będzie wykorzystywana przez użytkowników na co dzień do dzielenia się między sobą plikami. Ma za zadanie umożliwiać to w sposób bezpieczny i poufny. Główne funkcjonalności systemu to wysyłanie plików na serwer, zarządzanie plikami i dostępem do nich oraz wymiana zaszyfrowanych kluczy dostępu.


# Sposób realizacji aplikacji

<b>Ogólna charakterystyka:</b> Jednostronicowa aplikacja webowa z dostępem przez przeglądarkę</br>
<b>Platforma:</b> chmura Amazon Web Services</br>
<b>Język programowania:</b> JavaScript</br>
<b>Front-end:</b> React.js</br>
<b>Back-end:</b> Node.js</br>
<b>Bazy danych:</b> MongoDB, Redis</br>
<b>Format wymiany danych:</b> JSON</br>
<b>Protokół internetowy:</b> HTTPS</br>

<p align="center">
	<img src="../Architecture/Level2-Containers.svg">
</p>