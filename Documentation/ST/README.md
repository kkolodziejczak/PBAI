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

Dane do szyfrowania są informacją, z którą związany jest szyfrogram. Zawierają one szyfrowany dokument i informacje o atrybutach szyfrogramu.

### Atrybuty szyfrowane

Atrybuty szyfrowane są to dane, które zostały szyfrowane w tym samym czasie, co dokument. Atrybuty te dostarczają weryfikatorowi informację odnośnie szyfrogramu oraz okoliczności, w jakich został on zrealizowany.

Atrybuty te muszą być chronione przed utratą integralności lub poufności.

### Rejestr zdarzeń

Informacje zapisane chronologicznie o zdarzeniach i działaniach dotyczących TOE. Wpis w dzienniku zawiera informacje o kodzie błędu, daty i godziny wystąpienia błędu, identyfikator użytkownika i dodatkowe informacje.

### Szyfrogram

Szyfrogram jest zagregowanym zbiorem danych, zawierającym:
* komplet danych do szyfrowania;
* dodatkowe informacje ułatwiające odszyfrowanie szyfrogramu, w tym atrybuty szyfrogramu.

Aktywa te muszą być chronione przez TOE w trakcie ich tworzenia i przed ich przekazaniem podmiotowi szyfrującemu.


### Dane logowania

Informacje możliwe do uwierzytelnienia osoby, które są podawane podczas rejestracji/logowania podmiotu. TOE musi zapewnić ochronę przetwarzanych danych przed ich udostępnieniem osobom nieupoważnionym, zabraniem przez osobę nieuprawnioną. Bezpieczeństwo informacji należy rozumieć jako zachowanie:
* poufności - zapewnia, że informacja nie jest udostępniania lub ujawniana nieautoryzowanym osobom, podmiotom, procesom;
* integralności - zapewnia, że dane nie zostały zmienione lub zniszczone w sposób nieautoryzowany;
* dostępności - zapewnia bycie osiągalnym i możliwym do wykorzystania na żądanie, w założonym czasie, przez autoryzowany podmiot;
* rozliczalności - zapewnia, że działania podmiotu mogą być przypisane w sposób jednoznaczny tylko temu podmiotowi;
* autentyczności - zapewnia, że tożsamość podmiotu lub zasobu jest taka, jak deklarowana;
* niezaprzeczalności - oznacza brak możliwości wyparcia się swojego uczestnictwa w całości lub w części wymiany danych przez jeden z podmiotów uczestniczących w wymianie;
* niezawodności - zapewnia spójność zamierzonych zachowań i skutków.


### Polityka szyfrowania

Polityki szyfrowania definiują reguły, które powinny być stosowane podczas składania szyfrowania danych i ich deszyfrowania. Lista polityk udostępniania, przesyłania klucza deszyfrującego lub szyfrowania przez użytkownika, zarządzana przez administratora TOE, musi być chroniona przed utratą integralności. 

Dane te muszą być chronione przed utratą integralności.

### Zgodność formatu dokumentu z jego przeglądarką
Mechanizmy zaimplementowane w TOE zarządzają parametrami, które pozwalają TOE na uruchomienie właściwej przeglądarki, obsługującej format wskazanego dokumentu i poprawne zaprezentowanie jego treści podmiotowi korzystającemu z systemu, udostępnianemu zasobów, szyfrującemu lub deszyfrującemu. 

Parametry te muszą być chronione przed utratą integralności. 


### Dane uwierzytelniające podmiotu systemu
Są to dane, które pozwalają podmiotowi na uwierzytelnienie się (po zalogowaniu się do systemu za pomocą loginu i hasła). Pomyślnie zakończenie uwierzytelnienia upoważnia do korzystania z zasobów dostępnych w systemie.

Dane te muszą być chronione przed utratą integralności i poufności 


## Podmioty systemu

### Użytkownicy
Podmiot udostępniający zaszyfrowane zasoby do sieci, przekazujący uprawnienia jak i klucz deszyfrujący innym podmiotom do pobrania dzielonych zasobów w systemie, wykonywanych zgodnie z polityką szyfrowania dla jednego lub kilku dokumentów.

### Administrator
Administrator posiada niezbędne środki i jest przeszkolony w zakresie wykonywania wszelkich operacji na TOE, za które jest odpowiedzialny: wykonuje stałą obsługę systemu teleinformatycznego, w tym tworzy kopie zapasowe, zdalnie umieszcza kopie archiwów oraz bieżące kopie zapasowe poza podstawowym obszarem lokalizacji TOE. Podmiot posiada pełne zaufanie w odniesieniu do każdej polityki bezpieczeństwa wdrażanej do systemu. Jednostka jest przeszkolona w zakresie wykonywanych operacji na TOE.


## Założenia

### Konfiguracja TOE
Zakłada się, że TOE jest poprawnie zainstalowany i skonfigurowany (zainstalowana najnowsza wersja systemu operacyjnego, odpowiednio skonfigurowana polityka bezpieczeństwa, aktualna wersja oprogramowania antywirusowego).

### Uwierzytelnienie
Zakłada się, że środowisko związane z TOE umożliwia użytkownikom na uwierzytelnienie się poprzez wprowadzenie indywidualnych danych uwierzytelniających.

### Bezpieczna komunikacja
Zakłada się, że zapewniona jest poufność i integralność przesyłanych danych w komunikacji między serwerem a klientem.

### Rejestracja zdarzeń
Zakłada się, że środowisko TOE rejestruje w dzienniku zdarzeń wszystkie niepoufne zdarzenia istotne z punktu widzenia bezpieczeństwa.

### Ochrona danych
Zakłada się, że dane utworzone przez środowisko są zabezpieczone oraz archiwizowane w sposób ciągły.

### Aktualizacje zabezpieczeń
Zakłada się, że środowisko jest regularnie aktualizowane w celu wyeliminowania defektów w zabezpieczeniach wykrytych w oprogramowaniu wchodzących w skład środowiska.


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

### Atak słownikowy i atak metodą pełnego przeglądu
Atakujący może uzyskać hasło do konta użytkownika serwisu, co pozwoli mu na korzystanie ze wszystkich funkcjonalności TOE bez wiedzy i zgody użytkownika.

### Nieautoryzowane przejęcie sesji użytkownika

Atakujący może uzyskać i przejąć od zalogowanego użytkownika id sesji zalogowania przez co uzyskuje dostęp do udostępnionych plików innym użytkownikom.

### Nieupoważniony dostęp
Atakujący może korzystać ze wszystkich funkcjonalności TOE pomimo braku zalogowania do systemu.

### Słaby zestaw algorytmów
Zastosowanie słabych algorytmów szyfrowych podczas tworzenia szyfrogramu.


### Nieautoryzowany dostęp do prywatnych plików
Atakujący może pobrać prywatne pliki, które nie były dla niego udostępnione.


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


## Polityki bezpieczeństwa
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

### Cele zabezpieczeń dla TOE


### Ochrona kanału komunikacyjnego
TOE zapewnia, że dane przesyłane między serwerem WWW a przeglądarką są chronione przed nieautoryzowanym dostępem. TOE musi zagwarantować, że nie ulegną modyfikacji w trakcie przbywania drobi między węzłami końcowymi kanału komunikacyjnego.

#### Uwierzytelnienie użytkownika
TOE powinien zapewnić, aby użytkownik miał możliwość wprowadzenia danych uwierzytelniających (uwierzytelnienia się) przed uzyskaniem dostępu do prywatnych oraz udostępnionych plików.

#### Integralność danych do szyfrowania

TOE musi zapewnić integralność różnych reprezentacji danych przeznaczonych do zaszyfrowanie od momentu ich sformatowania do momentu utworzenia szyfrogramu.

#### Ochrona procesów
TOE musi zapewnić ochronę przed ingerencją dowolnych niezaufanych procesów, urządzeń peryferyjnych i kanałów komunikacyjnych oraz intruzuów w pracę tych procesów, które wykorzystywane są podczas szyfrowania/deszyfrowania, zgodnie ze wskazaniem zawartym w żądaniu utworzenia szyfrogramu.

#### Poufność danych uwierzytelniających
TOE musi zapewnić poufność danych uwierzytelniających należących do podmiotu szyfrującego/deszyfrującego.

#### Zatwierdzone algorytmy

TOE powinien zapewnić, aby były stosowane tylko te algorytmy szyfrowe, które należą do zbioru zatwierdzonych algorytmów i parametrów stosowanych podczas tworzenia szyfrogramu; w szczególności, aby format  był zgodny z formatami wskazanymi w Rozporządzeniu Rady Ministrów z dnia 7 sierpnia 2002 r. (Dz. U. Nr 128, poz.1094 z dnia 12 sierpnia 2002 r.). 

#### Zgoda użytkownika

TOE powinien udostępnić podmiotowi szyfrującemu/deszyfrującemu mechanizm umożliwiający mu (w sposób dobrowolny i jednoznaczny) wyrażenie zgody na zainicjowanie procesu wyboru dokumentu w celu utworzenia szyfrogramu bądź pobrania i odszyfrowania.

TOE powinien zażądać od podmiotu szyfrującego/deszyfrującego nietrywialnego zainicjowania procesu, wykluczającego jakąkolwiek przypadkowość tej decyzji; żaden inny proces w systemie nie może zainicjować tego procesu.

#### Udostępnienie pliku innemu użytkownikowi

TOE powinien zapewnić podmiotowi będącemu właścicielem danego pliku na udostępnienie wybranego zasobu odbiorcy wskazanego przez nadawcę.

#### Przesyłanie klucza deszyfrującego

TOE powienien zapewnić bezpieczne przekazanie klucza szyfrującego wskazanemu przez niego odbiorcy. Proces przekazania klucza powinien być uzgadniany pomiędzy nadawcą a odbiorcą algorytmem Diffie-Hellmana, natomiast TOE ma zapewnić bezpieczny kanał transmisyjny.


#### Ustawienie czasu wygaśnięcia pliku

TOE powinien zapewnić uprawnienia właściciela pliku na jednoznaczne wskazanie terminu wygaśnięcia pliku. Po upływie czasu wygaśnięcia TOE powinien przeprowadzić operację trwałego usunięcia pliku.

#### Zbiór dokumentów

Po wyrażeniu przez podmiot szyfrujący zgody na szyfrowanie, TOE musi gwarantować, że przetwarzany dokument rzeczywiście odpowiada dokładnie wybranemu dokumentowi przeznaczonego do szyfrowania.


#### Zgodność uprawnień do dokumentów

TOE musi zapewnić zgodność, która potwierdza uprawnienia użytkownika do pobrania wybranego dokumentu.


### Cele zabezpieczeń dla środowiska

#### Bezpieczna komunikacja
W celu ustanowienia bezpiecznego kanału komunikacji, komunikacja pomiędzy serwerem WWW, a przeglądarką WWW odbywa się z zastosowaniem protokołu HTTPS z TLS.

#### Wiarygodni użytkownicy

Upoważnieni użytkownicy rzetelnie wykonują swoje zadania.

#### Wiarygodni administratorzy

Upoważnieni administratorzy rzetelnie wykonują swoje zadania.


#### Konfiguracja TOE
TOE musi być poprawnie zainstalowany i skonfigurowany tak, aby zaraz po uruchomieniu przechodził w bezpieczny stan.

#### Moduły kryptograficzne
TOE musi korzystać tylko z tych usług kryptograficznych, udostępnianych przez środowisko teleinformatyczne, które spełniają wymagania określone w  Rozporządzeniu Rady Ministrów z dnia 7 sierpnia 2002 r. (Dz. U. Nr 128, poz.1094 z dnia 12 sierpnia 2002 r.) oraz Ustawie z dnia 22 stycznia 1999 r. o ochronie informacji niejawnych (Dz.U. 1999 nr 11 poz. 95, wersja ujednolicona) i zatwierdzone przez odpowiednie instytucje certyfikujące przy wysokim poziomie siły funkcji zabezpieczającej lub przynajmniej zgodne z FIPS 140 poziom 2 lub wyższy. 

#### Bezpieczeństwo fizyczne
Środowisko musi zapewniać akceptowalny poziom bezpieczeństwa fizycznego tak, aby nie było możliwe manipulowanie TOE. 

#### Obecność użytkownika
Podmiot szyfrujący/deszyfrujący powinien pozostać obecny między momentem wyrażenia przez niego zamiaru szyfrowania, a momentem kiedy wprowadza dane szyfrujące.

#### Tworzenie danych na potrzeby audytu
Środowisko związane z TOE zapewni możliwość zapisywania zdarzeń związanych z bezpieczeństwem TOE w rejestrze zdarzeń w sposób jednoznacznie wiążący zdarzenie z użytkownikiem, który był przyczyną wystąpienia tego zdarzenia lub zdarzenie nastąpiło podczas korzystania przez niego z TOE.

#### Ochrona danych rejestrowanych na potrzeby audytu
Środowisko związane z TOE zapewni możliwość ochrony informacji gromadzonej na potrzeby audytu.

#### Przeglądanie danych rejestrowanych na potrzeby audytu
Środowisko związane z TOE zapewni możliwość selektywnego przeglądania informacji zgromadzonej w rejestrze zdarzeń.

#### Aktualizacje zabezpieczeń
Środowisko jest automatycznie aktualizowane w celu wyeliminowania defektów w zabezpieczeniach wykrytych w oprogramowaniu wchodzących w skład środowiska.


## Wymagania bezpieczeństwa

### Funkcjonalne wymagania bezpieczeństwa

W niniejszej części dokumentu wymagania funkcjonalne systemu zostały sprecyzowane pod kątem bezpieczeństwa.

### Dane audytowe

#### <b>FAU_GEN</b> - Rejestrowanie zagrożeń bezpieczeństwa

##### <b>FAU_GEN.1</b> - Generowanie danych na temat bezpieczeństwa

##### <b>FAU_GEN.1.1</b> - System musi rejestrować wszystkie potencjalnie niebezpieczne zdarzenia, takich jak nieudane próby logowania, nieoczekiwane wywołania funkcji systemowych, nieobsłużone wyjątki i zapisywać je w postaci logów systemowych.

#### <b>FAU_GEN.2</b> - Przypisywanie zdarzeń do konkretnych podmiotów

##### <b>FAU_GEN.2.1</b> - Każde zdarzenie rejestrowane przez system powinno posiadać znacznik czasu, typ zdarzenia, oraz identyfikator podmiotu, który wywołał dane zdarzenie.


#### <b>FAU_ARP</b> - Powiadomienia systemu w przypadku wykrycia potencjalnych zagrożeń bezpieczeństwa.

##### <b>FAU_ARP.1</b> -  Alarmy bezpieczeństwa.

##### <b>FAU_ARP.1.1</b> - W przypadku wykrycia przez system potencjalnego krytycznego zagrożenia bezpieczeństwa, powinien on powiadomić administratora za pomocą stosownego komunikatu oraz zapisać zdarzenie w rejestrze logów systemowych.

##### <b>FAU_ARP.1.2</b> -  System powinien zablokować dostęp do systemu użytkownikowi, stwarzającemu krytyczne zagrożenie.


#### <b>FAU_SAR</b> -  Wymagania dotyczące narzędzi audytu, dostępnych dla osób uprawnionych w celu przeglądu danych.

##### <b>FAU_SAR.1</b> Przegląd audytu, możliwość odczytywania rejestrowanych danych.

##### <b>FAU_SAR.1.1</b> - System musi zapewnić możliwość odczytu zarejestrowanych danych audytu.

##### <b>FAU_SAR.1.2</b> - System musi zapewnić możliwość odczytu danych w formie możliwej do interpretacji przez użytkownika.

#### <b>FAU_SAR.2</b> - Systemowa kontrola dostępu do danych audytu.

##### <b>FAU_SAR.2.1</b> - System musi zapewnić kontrolę odczytu danych audytu. Dane audytowe mogą być odczytywane tylko przez podmioty do tego uprawnione.


#### <b>FAU_STG</b> - Wymagania System dotyczące przechowywania zbioru rejestrowanych zdarzeń.

##### <b>FAU_STG.1</b> - Miejsce przechowywania rejestrowanych danych.

##### <b>FAU_STG.1.1</b> - System musi być w stanie wykonać kopię zapasową oraz ewentualne przywrócenie danych audytu.

##### <b>FAU_STG.2</b> - Gwarancja dostępności rejestrowanych danych przez system.

##### <b>FAU_STG.2.1</b> - System musi zapewnić kopiowanie danych (w ramach kopii zapasowej) do innej części TOE.


### Weryfikacja

#### <b>FDP_ACC</b> - Polityka kontroli dostępu.

##### <b>FDP_ACC.1</b> - kontrola dostępu do poszczególnych funkcjonalności TOE.

##### <b>FDP_ACC.1.1</b> - System na podstawie kontroli dostępu SFP (ang. Security. Function Policies, zbiór zasad bezpieczeństwa które muszą być przestrzegane w ramach TOE) musi egzekwować kontrolę dostępu do poszczególnych funkcji oraz zasobów TOE zdefiniowanych w SFP.

#### <b>FDP_ACF</b> - funkcje kontroli dostępu.

##### <b>FDP_ACF.1</b> - atrybuty kontroli dostępu.

##### <b>FDP_ACF.1.1</b> - System musi wymuszać kontrolę dostępu zdefiniowaną w SFP bazującą na rolach przypisanych do poszczególnych podmiotów w ramach TOE.

##### <b>FDP_ACF.1.2</b> - System musi egzekwować poniższe zasady w celu weryfikacji czy dany podmiot powinien uzyskać dostęp do wybranej funkcjonalności:
- podmiot musi być autoryzowanym podmiotem występującym w ramach
TOE,
 - System musi zweryfikować rolę danego podmiotu,
 - na podstawie atrybutów dostępu przypisanych do poszczególnych ról,
System powinien udzieli lub odmówić dostępu do danej funkcji TOE dla
danego podmiotu.


### Uwierzytelnianie i identyfikacja

#### <b>FIA_AFL</b> - błędy uwierzytelniania.

##### <b>FIA_AFL.1</b> - obsługa błędów uwierzytelniania.

##### <b>FIA_AFL.1.1</b> - System musi wykrywać błędne próby logowania użytkowników
 (w ilości zdefiniowanej przez administratora).

##### <b>FIA_AFL.1.2</b> - w przypadku wykrycia zdefiniowanej ilości niepoprawnych prób logowania danego użytkownika, system musi wykonać następujące czynności:
 - zapisać dokładne informacje na temat adresu logowania, ilości niepoprawnych
prób logowania, oraz podmiotu którego dotyczyły zdarzenie
w logach systemu,
 - zablokować możliwość logowania dla danego użytkownika na określony,
zdefiniowany przez administratora okres czasu,
 - poinformować podmiot o nieudanych próbach logowania.

#### <b>FIA_UAU</b> - uwierzytelnianie użytkowników.

##### <b>FIA_UAU.1</b> - uwierzytelnianie użytkowników przed każdym działaniem.

##### <b>FIA_UAU.1.1</b> - System wymaga, aby każdy użytkownik aplikacji klienckiej i serwer został pomyślnie uwierzytelniony, zanim zdecyduje się na inne operacje związane z systemem w imieniu tego użytkownika.

##### <b>FIA_UAU.1.2</b> - System wymaga, aby każdy użytkownik aplikacji klienckiej i serwer został zidentyfikowany przed umożliwieniem w imieniu tego użytkownika jakichkolwiek innych działań z udziałem systemu.

#### <b>FIA_UID</b> - identyfikacja użytkowników.

##### <b>FIA_UID.1</b> - identyfikacja użytkownika przed jakimkolwiek działaniem.

##### <b>FIA_UID.1.1</b> - System wymaga, aby każdy użytkownik aplikacji został zidentyfikowany przed umożliwieniem w imieniu tego użytkownika jakichkolwiek innych działań z udziałem systemu.


#### Ochrona


##### <b>FMT_MSA</b> - zarządzanie atrybutami bezpieczeństwa.

<b>FMT_MSA.1</b> - inicjowanie atrybutu statycznego

<b>FMT_MSA.1.1</b> - TSF musi egzekwować wirtualny i rozproszony przełącznik sterowania przepływem informacji SFP do ograniczania możliwości
dodawania, modyfkowania i usuwania atrybutów bezpieczeństwa. TSF będzie wymuszać politykę wirtualnej i rozproszonej zasady kontroli przepływu informacji.




##### <b>FMT_SMR</b> - podział na role

<b>FMT_SMR.1</b> - role bezpieczeństwa

<b>FMT_SMR.1.1</b> - system musi przechowywać następujące role użytkowników aplikacji:
- użytkownik
- administrator

<b>FMT_SMR.1.2</b> - system musi zachowywać role użytkowników aplikacji takie ja:
- administrator,
- użytkownik.


<b>FMT_SMR.2</b> - ograniczenia bezpieczeństwa dla ról.

<b>FMT_SMR.2.1</b> - system musi być w stanie powiązać użytkowników aplikacji z wyżej wymienionymi rolami.

<b>FMR_SMR.2.1</b> - system musi być w stanie powiązać użytkownika serwera z wyżej wymienionymi rolami.

<b>FMR_SMR.2.2</b> - system musi być w stanie powiązać użytkowników aplikacji klienckiej z wyżej wymienionymi rolami.

<b>FPT_STM</b> - znaczniki czasu.

<b>FPT_STM.1</b> - niezawodność znaczników czasu.

<b>FPT_STM.1.1</b> - system musi niezawodnie generować znaczniki czasu.
2.2. System powinien rejestrować wszystkie akcje użytkowników w postaci logów systemowych i przypisywać im znaczniki czasu.


<b>FCS_CKM</b> - zarządzanie klucza kryptograficznego.

<b>FCS_CKM.1</b> - generowanie kluczy kryptograficznych; wymaga wygenerowanie klucza kryptograficznego zgodnie z określonym algorytmem i rozmiarem klucza zgodnie ze standardami.

<b>FCS_CKM.2</b> - dostarczanie klucza kryptograficznego; wymaga klucza kryptograficznego, który będzie dostarczony zgodnie z określoną metodą przesyłu zgodną z przyjętymi standardami.

<b>FCS_CKM.3</b> -  dostęp do klucza kryptograficznego; wymagany dostęp do klucza zgodnego z określoną metodą dostępu zgodną z przyjętymi standardami.

<b>FCS_CKM.4</b> - usuwanie klucza kryptograficznego; wymagane niszczenie klucza kryptograficznego zgodnej z przyjętymi standarami.

<b>FCS_COP</b> Operacja szyfrowania

<b>FCS_COP.1</b> - TSF powinien zapewnić zgodnie z określonym algorytmem kryptograficznym i rozmiaru klucza operację szyfrowania zgodną z przyjętymi standardami.


## Specyfikacja funkcjonalna TOE

W tym rozdziale zawarto opis funkcji TOE spełniających wymagania zdefiniowane w poprzednich rozdziałach dokumentu.


### Funkcje bezpieczeństwa TOE

Każde wymaganie bezpieczeństwa i związane z nimi opisy odpowiadają funkcjom bezpieczeństwa. Każda funkcja jest opisywana przez to, w jaki sposób spełnia swoje wymagania.


|  Funkcja bezpieczeństwa TOE	|   SFR ID	| Opis
|---	|---	|---	|
| Alarm bezpieczeństwa	|		| Automatyczna odpowiedź systemu na zdarzenia
| Audyt bezpieczeństwa  |		| 
| Idetyfikacja i uwierzytelnianie 
| Ochrona danych użytkownika
| Zarządzanie bezpieczeństwem




## Uzasadnienie celów zabezpieczenia
W niniejszym rozdziale zawarto uzasadnienie, dlaczego zidentyfikowane cele zabezpieczeń są odpowiednie do przeciwdziałania zidentyfikowanym zagrożeniom i spełniają określone polityki bezpieczeństwa.

### Odwzorowanie zagrożeń TOE na cele zabezpieczeń

|  Zagrożenie	|   Cele zabezpieczeń TOE	| 
|---	|---	|
|Uszkodzenie TOE				| Konfiguracja TOE, Bezpieczeństwo fizyczne, Aktualizacje zabezpieczeń
|Nieautoryzowany dostęp do zasobów serwera bazodanowego		| Ochrona procesów, Aktualizacje zabezpieczeń
|Nieautoryzowane przejęcie sesji użytkownika		| Wiarygodni administratorzy, Wiarygodni użytkownicy, Uwierzytelnienie użytkownika
|Nieupoważniony dostęp							|Uwierzytelnienie użytkownika, Ochrona procesów
|Słaby zestaw algorytmów						|Integralność danych do szyfrowania, Zatwierdzone algorytmy, Moduły kryptograficzne
|Nieautoryzowany dostęp do prywatnych plików	|Uwierzytelnienie użytkownika, Zgodność uprawnień do dokumentów
|Przypadkowe usunięcie pliku					| Zgoda użytkownika, Obecność użytkownika
|Nieautoryzowane podsłuchanie użytkowników podczas operacji dzielenia się kluczem deszyfrującym	|Ochrona kanału komunikacyjnego, Uwierzytelnienie użytkownika
|Nieautoryzowane podsłuchiwanie operacji logowania użytkownika do systemu |Ochrona kanału komunikacyjnego
|Modyfikacja uprawnień do zasobów		| Konfiguracja TOE, Bezpieczeństwo fizyczne, Aktualizacje zabezpieczeń
|Wyciek danych							| Ochrona procesów, Aktualizacje zabezpieczeń
|Przejęcie konta administratora			| Wiarygodni administratorzy, Uwierzytelnienie użytkownika, Aktualizacje zabezpieczeń


### Odwzorowanie polityki zabezpieczeń TOE na cele zabezpieczeń
|  Polityka	|   Cele zabezpieczeń TOE	| 
|---	|---	|
| Przerwanie procesu								|	Ochrona procesów, Konfiguracja TOE, Bezpieczeństwo fizyczne
| Integralność danych użytkownika					|	Zgodność uprawnień do dokumentów, Wiarygodni użytkownicy, Zbiór dokumentów 
| Eksport szyfrogramu								|	Poufność danych uwierzytelniających, Bezpieczeństwo fizyczne, Obecność użytkownika,
| Zarządzanie										|	Ochrona kanału komunikacyjnego, Udostępnienie pliku innemu użytkownikowi, Ustawienie czasu wygaśnięcia pliku, Zbiór dokumentów, Tworzenie danych na potrzeby audytu, Ochrona danych rejestrowanych na potrzeby audytu, Przeglądanie danych rejestrowanych na potrzeby audytu, Aktualizacje zabezpieczeń
| Algorytmy kryptograficzne							|	Zatwierdzone algorytmy, Moduły kryptograficzne


### Odwzorowanie celów zabezpieczń TOE na politykę i zagrożenie
|  Cele zabezpieczeń TOE	|  Polityka/Zagrożenia  	| 
|---	|---	|
| Ochrona kanału komunikacyjnego								|	Zarządzanie; Nieautoryzowane podsłuchiwanie operacji logowania użytkownika do systemu, Nieautoryzowane podsłuchanie użytkowników podczas operacji dzielenia się kluczem deszyfrującym, Przejęcie konta administratora
| Uwierzytelnienie użytkownika									|	Integralność danych użytkownika; Nieautoryzowane przejęcie sesji użytkownika, Nieupoważniony dostęp, Przejęcie konta administratora
| Integralność danych do szyfrowania							| Algorytmy kryptograficzne, Integralność danych użytkownika, Eksport szyfrogramu; Uszkodzenie TOE, Słaby zestaw algorytmów, Przypadkowe usunięcie pliku, Wyciek danych 
| Ochrona procesów												| Przerwanie procesu; Uszkodzenie TOE, Nieautoryzowany dostęp do zasobów serwera bazodanowego, Nieupoważniony dostęp, Nieautoryzowany dostęp do prywatnych plików, Przypadkowe usunięcie pliku, Wyciek danych
| Poufność danych uwierzytelniających							|	Algorytmy kryptograficzne, Zarządzanie; Nieautoryzowane przejęcie sesji użytkownika, Nieupoważniony dostęp, Przypadkowe usunięcie pliku, Wyciek danych
| Zatwierdzone algorytmy										|	Algorytmy kryptograficzne; Uszkodzenie TOE 
| Ochrona procesów												|	Integralność danych danych użytkownika, Zarządzanie; Modyfikacja uprawnień do zasobów, Wyciek danych, Przypadkowe usunięcie pliku
| Zgoda użytkownika												| Integralność danych użytkownika, Zarządzanie; Przypadkowe usunięcie pliku, Przejęcie konta administratora
| Udostępnienie pliku innemu użytkownikowi						| Eksport szyfrogramu, Integralność danych użytkownika; Nieautoryzowane przejęcie sesji użytkownika, Nieupoważniony dostęp, Nieautoryzowany dostęp do prywatnych plików, Przypadkowe usunięcie pliku, Nieautoryzowane podsłuchanie użytkowników podczas operacji dzielenia się kluczem deszyfrującym, Wyciek danych 
| Przesyłanie klucza deszyfrującego								| Eksport szyfrogramu; Nieautoryzowane podsłuchanie użytkowników podczas operacji dzielenia się kluczem, Modyfikacja uprawnień do zasobów
| Ustawienie czasu wygaśnięcia pliku							| Zarządzanie; Przypadkowe usunięcie pliku, Nieupoważniony dostęp, Nieautoryzowany dostęp do prywatnych plików, Modyfikacja uprawnień do zasobów
| Zbiór dokumentów												| Zarządzanie, Integralność danych użytkownika; Wyciek danych, Przypadkowe usunięcie pliku, Nieupoważniony dostęp 
| Zgodność uprawnień do dokumentów								| Zarządzanie, Integralność danych użytkownika;  Nieupoważniony dostęp, Nieautoryzowany dostęp do prywatnych plików, Przypadkowe usunięcie pliku 
| Bezpieczna komunikacja										| Zarządzanie, Eksport szyfrogramu; Nieautoryzowane przejęcie sesji użytkownika, Nieautoryzowane podsłuchanie użytkowników podczas operacji dzielenia się kluczem deszyfrującym, Nieautoryzowane podsłuchiwanie operacji logowania użytkownika do systemu
| Wiarygodni użytkownicy										| Integralność danych użytkownika; Nieautoryzowane przejęcie sesji użytkownika, Nieautoryzowane podsłuchiwanie operacji logowania użytkownika do systemu
| Wiarygodni administratorzy									| Integralność danych użytkownika; Nieautoryzowane przejęcie sesji użytkownika, Nieautoryzowane podsłuchiwanie operacji logowania użytkownika do systemu
| Konfiguracja TOE												| Zarządzanie; Uszkodzenie TOE
| Moduły kryptograficzne										| Algorytmy kryptograficzne; Słaby zestaw algorytmów; Nieautoryzowane podsłuchanie użytkowników podczas operacji dzielenia się kluczem deszyfrującym 
| Bezpieczeństwo fizyczne										| Zarządzanie; Wyciek danych, Modyfikacja uprawnień do zasobów
| Obecność użytkownika											| Integralność danych użytkownika, Zarządzanie; Nieupoważniony dostęp, Nieautoryzowany dostęp do prywatnych plików, Nieautoryzowane przejęcie sesji użytkownika
| Tworzenie danych na potrzeby audytu							| Zarządzanie, Integralność danych użytkownika; Uszkodzenie TOE, Nieautoryzowany dostęp do zasobów serwera bazodanowego, Nieupoważniony dostęp
| Ochrona danych rejestrowanych na potrzeby audytu				| Zarządzanie; Uszkodzenie TOE, Wyciek danych
| Przeglądanie danych rejestrowanych na potrzeby audytu			| Zarządzanie; Nieautoryzowany dostęp do prywatnych plików
| Aktualizacje zabezpieczeń										| Zarządzanie; Uszkodzenie TOE, Modyfikacja uprawnień do zasobów, Wyciek danych