# Projekt wysokiego poziomu

# 1. Ogólne właściwości systemu

## 1. Architektura aplikacji

<p align="center">
<img src="../Architecture/Level3-APIApplication-Components.svg">
</p>


Architektura aplikacji składa się z 8 głównych komponentów:

### Web Application
Jest to komponent odpowiedzialny za komunikację użytkownika z systemem. Jest odpowiedzialny za pobieranie danych od użytkownika oraz przekazanie ich do back-endu. Następnie back-end aplikacji na podstawie tych danych wykonuje określone zadanie i przekazuje wynik końcowy z powrotem do Web Application.

### Policies

Do zadań tego komponentu należy walidacja uprawnień użytkownika. Dla każdorazowej próby wykonania akcji przez użytkownika komponent ten sprawdza poziom uprawnień użytkownika. Do głównych zadań tego komponentu należą:

- Czy użytkownik jest zalogowany do systemu;
- Czy użytkownik posiada uprawnienia do pobrania docelowego pliku;
- Czy użytkownik posiada uprawnienia do udostępnienia danego pliku innym użytkownikom system;
- Czy użytkownik posiada wystarczające uprawnienia grupy do określonego zasobu systemu;
- Czy ważność sesji połączeniowej dla użytkownika nie wygasła;



### Key Management

Komponent zapewniający bezpieczne połączenie pomiędzy użytkownikami w celu przekazania klucza dostępu umożliwiającego odszyfrowanie udostępnionego pliku. Klucz dostępu jest szyfrowany kluczem symetrycznym i przekazany według protokołu Diffiego-Hellmana. System nie przechowuje klucza dostępu i jest znany jedynie przez właściciela udostępnianego pliku oraz osobom, którym został on przekazany. 


### User Management

Komponent zarządzający sesją zalogowanego użytkownika w systemie. Zapewnia mechanizmy logowania oraz rejestracji użytkownika do systemu.


### Document Management

Odpowiada za zarządzanie dokumentami, które zostały udostępnione przez użytkowników. Do głównych zadań tego komponentu należą:
- Operacja zapisu zaszyfrowanego dokumentu do serwera bazodanowego wraz z datą wygaśnięcia pliku (timeout przekazywany jest do komponentu Scheduler);
- Operacja usuwania pliku przez jego właściciela bądź osoby uprawnionej (należącej do grupy Administrator);
- Przekazywanie uprawnień innym użytkownikom systemu przez właściciela pliku;
- Pobranie pliku z bazy danych i przekazanie go uprawnionym użytkownikom w przypadku wywołania operacji <i>Pobierz plik</i> przez docelowego użytkownika;
- Uprawnienia do wyświetlenia i pobrania zaszyfrowanych dokumentów są dostępnie jedynie w obrębie właściciela oraz dodanych przez niego osób uprawnionych do pobrania zasobu. 


### Scheduler

Komponent przechowujący znaczniki czasu (timestamp) wygasnięcia dokumentów. W przypadku upłynięcia ważności pliku komponent ten usuwa z serwera bazodanowego dokument.


### Database

Przechowuje rekordy o użytkownikach znajdujących się w systemie wraz z poziomem ich uprawnień, przypisania do grupy użytkowników oraz przypisanym im zasobów (pliki, dokumenty, czy są właścicielem zasobu). Przechowywane hasła dostępu do użytkowników są zabezpieczone hashem: SHA-512. Przechowywane są zaszyfrowane dokumenty ze znacznikiem czasu wygaśnięcia oraz z listą uprawnionych do odczytu użytkowników. Klucze deszyfrujące dokumenty nie są dostępne w systemie bazodanowym.

### Cache Database

Baza danych szybkiego dostępu - przechowuje kopię bazy danych i jest stosowana w celu zwiększenia efektywności i wydajności działania systemu. Pełni rolę pamięci podręcznej bazy danych - pamięć szybkiego dostępu.