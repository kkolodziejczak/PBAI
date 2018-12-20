# Wstęp

## Cel

Celem niniejszego dokumentu jest przedstawienie wymagań nakładanych na system przeznaczonego do dzielenia się plikami zabezpieczonymi kluczem symetrycznym. W opracowaniu oparto się na normach,zaleceniach lub ich szkicach w momencie tworzenia tego dokumentu.

# Wprowadzenie
Przedstawiony poniżej profil zabezpieczeń definiuje wymagania bezpieczeństwa dla systemu dzielenia się zabezpieczonymi plikami pomiędzy użytkownikami systemu. Przez "system do dzielenia się zabezpieczonymi plikami" rozumie się system realizujący szyfrowanie/deszyfrowanie pliku z wykorzystaniem do tego celu klucza symetrycznego wygenerowanego przez nadawcę, natomiast proces przekazania klucza jednemu bądź wielu odbiorcom odbywa się z wykorzystaniem protokołu Diffiego-Hellmana. Właściciel współdzielonego pliku w niniejszym systemie może predefiniować jego czas życia — po jego upływie zostaje on usunięty.

## Identyfikacja
<b>Tytuł:</b>
Profil zabezpieczeń - system do dzielenia się zabezpieczonymi plikami<br>
<b>Autorzy:</b>
Krzysztof Kołodziejczak, Patryk Piotrowski, Patryk Prokurat, Jakub Dyba,
Artur Ziemba, Bartosz Gawdzis, Albert Liberski, Mateusz Gnyp<br>
<b>Status głosowania:</b> CC Version: 1.0 (Grudzień 2018)<br>
<b>Ogólny status:</b> Draft<br>
<b>Numer wersji:</b> 1.0<br>
<b>Słowa kluczowe:</b> szyfrowanie/deszyfrowanie danych, współdzielenie danych, klucz symetryczny, klucz asymetryczny, protokół Diffiego-Hellmana.<br>

# Opis przedmiotu oceny

Ta część profilu zabezpieczeń zawiera opis przedmiotu oceny (TOE), rodzaj produktu, który prezentuje, jak również opis ogólnej funkcjonalności TOE. Przedstawiona funkcjonalność, podlegająca ocenie, dotyczy szyfrowania/deszyfrowania danych z wykorzystaniem klucza symetrycznego, przekazania klucza za pomocą protokołu Diffiego-Hellmana i ustanawiania bezpiecznego połączenia klienta z serwerem z wykorzystaniem połączenia HTTPS.

## Opis TOE

Przedmiotem oceny, rozważanym w niniejszym dokumencie, jest pięć komponentów: "Login, Register, My Documents, Upload Document, Exchange Keys", wchodzące w skład Document Exchange System — system dzielenia się zaszyfrowanymi plikami pomiędzy użytkownikami.

<p align="center">
	<img src="../Architecture/Level3-WebApplication-Components.svg">
</p>

### Login - komponent odpowiada za:

- logowanie użytkownika do systemu po poprawnym jego uwierzytelnieniu;
- logowanie z wykorzystaniem protokołu HTTPS.


### Register - komponent odpowiada za:

- rejestrację użytkownika do systemu (użytkownik podaje login, hasło, powtórzone hasło i adres e-mail);
- weryfikację poprawności wprowadzonych danych;
- tworzenie nowego konta użytkownika po uprzednim spełnieniu wymagań dotyczących rejestracji;
- rejestrację z wykorzystaniem protokołu HTTPS.


### My Documents - komponent odpowiada za:

- zarządzanie dokumentami, których właścicielem jest zalogowany użytkownik;
- nadawanie uprawnień dostępu do poszczególnych, zaszyfrowanych dokumentów konkretnym użytkownikom;
- komunikację z użytkownikiem z wykorzystaniem protokołu HTTPS.


### Upload Document - komponent odpowiada za:

- wysyłanie pliku uprzednio zaszyfrowanego kluczem symetrycznym;
- pobranie od użytkownika daty i godziny wygaśnięcia pliku;
- zarządzanie przez użytkownika listą osób uprawnionych do korzystania z pliku;
- komunikację z użytkownikiem z wykorzystaniem protokołu HTTPS.


### Exchange Keys - komponent odpowiada za:

- wymianę klucza pomiędzy użytkownikami za pomocą protokołu Diffiego-Hellmana;
- pobranie od użytkownika klucza szyfrującego plik;
- pobranie od użytkownika docelowego odbiorcy, któremu zostanie przesłany klucz szyfrujący plik z wykorzystaniem protokołu Diffiego-Hellmana (służy do ustalenia wspólnego tajnego klucza przy użyciu publicznych środków komunikacji);
- zaszyfrowanie klucza do pliku ustalonym wcześniej przez obie strony za pomocą protokołu Diffiego-Hellmana tajnym kluczem;
- odszyfrowanie klucza do pliku w celu skorzystania z udostępnionych zasobów.


# Środowisko zabezpieczeń TOE

## Aktywa

W tej sekcji opisano wszystko aktywa chronione przez TOE.

### Dokument
Dokument do szyfrowania/deszyfrowania, który może się składać z:
* pojedynczego dokumentu elektronicznego,
* wielu dokumentów elektronicznych.

Dane zawarte w dokumencie muszą być chronione przed utratą integralności i/lub poufności.

### Dane do szyfrowania

Dane do szyfrowania są informacją, z którą związany jest szyfrogram. Zawierają one szyfrowany dokument i informacje o atrybutach podpisu i szyfrogramu.


### Atrybuty szyfrowane

Atrybuty szyfrowane są to dane, które zostały szyfrowane w tym samym czasie, co dokument. Atrybuty te dostarczają weryfikatorowi informację odnośnie szyfrogramu oraz okoliczności, w jakich został on zrealizowany. Atrybuty zawierają datę i godzinę, miejsce i okoliczności, w której został zrealizowany szyfrogram, format dokumentu itp.

Atrybuty te muszą być chronione przed utratą integralności lub poufności.


### Szyfrogram

Szyfrogram jest zagregowanym zbiorem danych, zawierającym:
* komplet danych do szyfrowania;
* dodatkowe informacje ułatwiające odszyfrowanie szyfrogramu, w tym atrybuty szyfrogramu.

Aktywa te muszą być chronione przez TOE w trakcie ich tworzenia i przed ich przekazaniem podmiotowi szyfrującemu.


### Polityka podpisu lub szyfrowania

Polityki podpisu lub szyfrowania definiują reguły, które powinny być stosowane podczas składania podpisu, jego weryfikacji lub szyfrowania danych i ich deszyfrowania. Lista polityk udostępniania, przesyłania klucza deszyfrującego lub szyfrowania przez użytkownika, zarządzana przez administratora TOE, musi być chroniona przed utratą integralności. 

Dane te muszą być chronione przed utratą integralności.

### Zgodność formatu dokumentu z jego przeglądarką
Mechanizmy zaimplementowane w TOE zarządzają parametrami, które pozwalają TOE na uruchomienie właściwej przeglądarki, obsługującej format wskazanego dokumentu i poprawne zaprezentowanie jego treści podmiotowi korzystającemu z systemu, udostępnianemu zasobów, szyfrującemu lub deszyfrującemu. 

Parametry te muszą być chronione przed utratą integralności. 

### Skrót z danych sformatowanych 
Skrót z danych sformatowanych (podlegający weryfikacji) jest tą wartością, na której bazuje podpis elektroniczny, wykonany dla dokumentu i atrybutów podpisanych. 

Skrót musi być chroniony przed utratą integralności 

### Dane uwierzytelniające podmiotu systemu
Są to dane, które pozwalają podmiotowi na uwierzytelnienie się (po zalogowaniu się do systemu za pomocą loginu i hasła). Pomyślnie zakończenie uwierzytelnienia upoważnia do korzystania z zasobów dostępnych w systemie.

Dane te muszą być chronione przed utratą integralności i poufności 


## Podmioty systemu

### Użytkownicy
Podmiot udostępniający zaszyfrowane zasoby do sieci, przekazujący uprawnienia jak i klucz deszyfrujący innym podmiotom do pobrania dzielonych zasobów w systemie, wykonywanych zgodnie z polityką szyfrowania dla jednego lub kilku dokumentów.

### Administrator
Administrator posiada niezbędne środki i jest przeszkolony w zakresie wykonywania wszelkich operacji na TOE, za które jest odpowiedzialny: wykonuje stałą obsługę systemu teleinformatycznego, w tym tworzy kopie zapasowe, zdalnie umieszcza kopie archiwów oraz bieżące kopie zapasowe poza podstawowym obszarem lokalizacji TOE.