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


### Share Document - komponent odpowiada za:

- wymianę klucza pomiędzy użytkownikami za pomocą protokołu Diffiego-Hellmana;
- pobranie od użytkownika klucza szyfrującego plik;
- pobranie od użytkownika docelowego odbiorcy, któremu zostanie przesłany klucz szyfrujący plik z wykorzystaniem protokołu Diffiego-Hellmana (służy do ustalenia wspólnego tajnego klucza przy użyciu publicznych środków komunikacji);
- zaszyfrowanie klucza do pliku ustalonym wcześniej przez obie strony za pomocą protokołu Diffiego-Hellmana tajnym kluczem;
- odszyfrowanie klucza do pliku w celu skorzystania z udostępnionych zasobów.

### Logs - komponent odpowiada za:

- zapisywanie i przechowywanie logów systemowych dostępnych do podglądu dla użytkownika typu Administrator.


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


## Zagrożenia

Ta sekcja opisuje zagrożenia mające wpływ na TOE.

### Uszkodzenie TOE
Jeszcze przed rozpoczęciem procesu szyfrowania bądź deszyfrowania pliku uszkodzeniu bądź awarii może ulec jedna lub kilka funkcji i/lub jeden lub kilka parametrów TOE.

Przypadkowe uszkodzenie funkcji i/lub parametrów TOE może nastąpić na przykład wtedy, gdy przesłany plik był niekompletny bądź nastąpiła awaria algorytmu odpowiedzialnego za szyfrowanie. Uszkodzenie może prowadzić do:
- uszkodzenia zaszyfrowanego pliku;
- uszkodzenia deszyfrowanych danych;
- modyfikacji zawartości pliku bez zgody i wiedzy użytkownika.

### Nieautoryzowany dostęp do zasobów serwera bazodanowego

Atakujący może uzyskać nieautoryzowany dostęp do zasobów serwera bazodanowego w sposób bezpośredni (poprzez interfejs apache sql) bądź z wykorzystaniem luk w aplikacji serwerowej polegającym na modyfikacji zapytania bazodanowego - sql injection.

### Nieautoryzowane przejęcie sesji użytkownika

Atakujący może uzyskać i przejąć od zalogowanego użytkownika id sesji zalogowania przez co uzyskuje dostęp do udostępnionych plików innym użytkownikom.

### Słaby zestaw algorytmów

Zastosowanie słabych algorytmów szyfrowych podczas tworzenia szyfrogramu.


### Nieautoryzowany dostęp do prywatnych plików

Atakujący może pobrać prywatne pliki, które nie były dla niego udostępnione.

### Przypadkowe udostępnienie pliku użytkownikowi

Użytkownik przypadkowo udostępnia plik i kod deszyfrujący innemu użytkownikowi - na skutek pomyłki bądź popełnienia błędu przy wpisywaniu nazwy docelowego użytkownika.


### Przypadkowe usunięcie pliku

Użytkownik przypadkowo usuwa udostępniany plik, na skutek czego reszta użytkowników traci dostęp do dzielonych zasobów.

### Nieautoryzowane podsłuchanie użytkowników podczas operacji dzielenia się kluczem deszyfrującym

Atakujący podsłuchuje komunikaty pomiędzy użytkownikami, którzy dzielą się kluczem deszyfrującym służącym do odszyfrowania pliku.


### Nieautoryzowane podsłuchiwanie operacji logowania użytkownika do systemu

Atakujący śledzi dane wprowadzane przez użytkownika podczas logowania - login, hasło; które może przechwycić i wykorzystać do nieuprawnionego zalogowania się do systemu.

### Modyfikacja uprawnień do zasobów

Złośliwy użytkownik może w niedozwolony sposób dodać lub usunąć jednego bądź kilku użytkowników uprawnionych do pobrania określonego pliku. 

### Wyciek danych

W wyniku awarii systemu może dojść do wycieku poufnych i wrażliwych danych - dane logowania, udostępniane pliki, itp.

### Przejęcie konta administratora

Atakujący może przejąć konto administracyjne poprzez odgadnięcie danych dostępu, np: za pomocą metody brute-force albo w wyniku działania odkrycia luki systemowej.


## Polityki bezpieczeństwa instytucji
W tym rozdziale określono zasady natury organizacyjnej, mające zastosowanie do TOE.

### Przerwanie procesu
Podmiot szyfrujący/deszyfrujący musi mieć możliwość przerwania procesu szyfrowania/deszyfrowania przed aktywacją klucza szyfrującego/deszyfrującego.

### Integralność danych użytkownika
TOE musi chronić integralność wszystkich danych (lista zaszyfrowanych dokumentów, lista uprawnionych do pobrania zasobów), przychodzących od użytkownika.

### Eksport szyfrogramu
Po zakończeniu procesu szyfrowania powstały w jego wyniku szyfrogram dokumentu musi zostać przekazany przez TOE podmiotowi szyfrującemu/deszyfrującemu.

### Zarządzanie
TOE musi pozwolić podmiotowi szyfrującemu/deszyfrującemu oraz administratorowi na zarządzanie politykami szyfrowania oraz tabelą wiążącą format dokumentu z jego przeglądarką.


### Algorytmy kryptograficzne
Do zarządzania kluczami (tj. generowania, udostępniania, niszczenia, korzystania i przechowywania kluczy) oraz udostępniania algorytmów szyfrowych (funkcji szyfrowania, deszyfrowania, podpisywania, obliczania skrótów, wymiany kluczy oraz generowania liczb losowych) stosowane mogą być tylko te algorytmy kryptograficzne (metody i ich implementacje), które spełniają wymagania określone w Rozporządzeniu Rady Ministrów z dnia 7 sierpnia 2002 r. (Dz. U. Nr 128, poz.1094 z dnia 12 sierpnia 2002 r.) oraz w Ustawie z dnia 22 stycznia 1999 r. o ochronie informacji niejawnych (Dz.U. 1999 nr 11 poz. 95, wersja ujednolicona) i zatwierdzona przez odpowiednie instytucje certyfikujące przy wysokim poziomie siły funkcji zabezpieczającej lub przynajmniej zgodne z FIPS 140 poziom 2 lub wyższy.


## Cele zabezpieczeń
<i>In progress..</i>