# Funkcjonalność aplikacji

Aplikacja ma służyć do bezpiecznego dzielenia się między sobą poufnymi plikami. Po wysłaniu na serwer plików zaszyfrowanych za pomocą klucza symetrycznego, użytkownik będzie mógł ustawić datę i godzinę wygaśnięcia pliku oraz zarządzać listą osób uprawnionych do jego odczytu. Służący do tego klucz symetryczny zostanie wtedy zaszyfrowany i przekazany według protokołu Diffiego-Hellmana.

# Charakterystyka użytkowników aplikacji

### 1. Użytkownicy
Główna grupa korzystających z systemu. Używają oni aplikacji do dzielenia się plikami, ufając w bezpieczeństwo procesu. Nie mają dokładnej wiedzy na temat mechanizmów, na których oparte jest działanie systemu.

<b>Wykorzystywane funkcje:</b>
- Rejestracja;
- Logowanie;
- Wysyłanie dokumentów (w tym ustalenie daty i godziny wygaśnięcia, nadanie uprawnień dostępu, nadanie symetrycznego klucza szyfrującego);
- Zarządzanie dokumentami (ustalanie daty i godziny wygaśnięcia, nadawanie uprawnień dostępu.

### 2. Administrator
Użytkownik zarządzający systemem. Nadzoruje on pracę systemu oraz działania użytkowników. Czuwa nad bezpieczeństwem. Posiada  szerszą wiedzę na temat specyfiki działania systemu. Wychwytuje niepożądane akcje użytkowników i zachowania aplikacji.

<b>Wykorzystywane funkcje:</b>
- Logowanie;
- Zarządzanie użytkownikami;
- Wyświetlanie logów systemowych;
- Przeglądanie bazy dokumentów (bez uprawnień do ich otwierania i wyświetlania).


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