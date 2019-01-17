# Zgodność reprezentacji
Zgodność pomiędzy specyfikacją funkcjonalną, a projektem wysokiego poziomu i projektem niskiego poziomu

# 1. Audytowanie 

|  Funkcja bezpieczeństwa	| Interfejs  - wysoki poziom | Interfejs - niski poziom|Uzasadnienie |
|---	|---	|--- |--- |
|Dane audytowe przechowywane w bazie danych |Wszystkie metody interfejsu|Wszystkie metody interfejsu|Każda akcja systemu wykonywana przez użytkownika przechowywana jest w bazie danych|
|Przechowywanie danych o działaniach potencjalnie niebezpiecznych dla systemu |Komponent: Policies|Klasy: UserManager, LogsManager, AuthManager|Podczas uwierzytelniania może dojść do naruszenia bezpieczeństwa danych. Szczególna uwaga zwrócona na nieprawidłowości występujące podczas logowania|
|Ograniczenie dostępu do danych audytowych|Brak metod|Brak metod|Brak innej możliwości dostania się do danych audytowych. Dostęp do danych jedynie przez bezpośrednie zalogowanie użytkownika. Brak wystawionych metod umożliwiających dostęp do danych audytowych|
|Tworzenie kopii zapasowej z użyciem specjalistycznego narzędzia|Brak metod|Brak metod|Kopie zapasowe tworzone cyklicznie za pomocą narzędzia do zarządzania bazami danych|

# 2. Weryfikacja

|  Funkcja bezpieczeństwa	| Interfejs  - wysoki poziom | Interfejs - niski poziom|Uzasadnienie |
|---	|---	|--- |--- |
|Działanie wg polityki kontroli dostępu|Komponenty: Policies, RequestValidator,  UserManagement|Klasy: AuthManager, PermissionManager Metody: putUser, postUser, logoutUser, deletePerm, getPerm, getPermID |System pobiera rolę użytkowników i na ich podstawie zezwala na wykonanie pewnych operacji|
|Funkcje systemu dostępne tylko dla ograniczonego grona użytkowników|Komponenty: Policies, UserManagment |Klasa: PermissionManager, Metody: deletePerm, getPerm, getPermID |System pobiera rolę, do których należy użytkownik i na ich podstawie umożliwia dostęp do informacji|
|Dane w bazie danych mają swoich autorów i czas utworzenia|Brak metod|Brak metod|Każde dane tworzone w systemie posiadają swojego autora i ostatnie zmiany i czas utworzenia|

# 3. Uwierzytelnianie

|  Funkcja bezpieczeństwa	| Interfejs  - wysoki poziom | Interfejs - niski poziom|Uzasadnienie |
|---	|---	|--- |--- |
|  Reagowanie na błędy uwierzytelniania	| Komponent: RequestValidator, UserManagement | Klasy: AuthManager, LogsManager, metody: getLogs, postUser | Nieudane wielokrotne próby logowania na jedno z kont prowadzi do wprowadzania blokady - możliwość logowania na to konto zostanie wstrzymana  |
|  Sprawdzenie czy użytkownik jest zalogowany przed wykonaniem operacji| Komponent: UserManagement | Klasy: UserManager, LogsManager, PermissionManager metody: getLogs, getPerms, getUser | Pobieranie informacji czy użytkownik jest zalogowany na podstawie sesji  |
|  Identyfikacja użytkownika, mechanizm uwierzytelniania	| Komponenty: UserManagement, Policies | Klasy: AuthManager, UserManager, LogsManager Metody: putUser, postUser, logoutUser, getUserId| Po zalogowaniu każdy użytkownik otrzymuje swój token, informacja ta jest przechowywana w sesji - daje nam to możliwość sprawdzenia użytkownika|

# 4. Przerwanie procesu

|  Funkcja bezpieczeństwa	| Interfejs  - wysoki poziom | Interfejs - niski poziom|Uzasadnienie |
|---	|---	|--- |--- |
|  Kontrola przepływu informacji między węzłami komunikacyjnymi	| Wszystkie metody interfejsu | Wszystkie metody interfejsu| Działania systemu oparte są na bezpiecznym kanale SSL. |

# 5. Ochrona

|  Funkcja bezpieczeństwa	| Interfejs  - wysoki poziom | Interfejs - niski poziom|Uzasadnienie |
|---	|---	|--- |--- |
|  Prawa przyznawane na podstawie zdefiniowanych ról	|Komponenty: UserManagement, DocumentManagement | Klasy: ShareManager, PermissionManager, UserManager. Metody: getUser, getPerm, getShare, getPermID| Przyznane funkcje dla użytkownika można sprawdzić na podstawie przypisanych do niego ról |
|  Stosowanie znaczników czasu	|Wszystkie metody interfejsu | Wszystkie metody interfejsu | Wszystkim danym przechowywanym w bazie danych przyznawany jest rekord - czas dokonania / czas dokonania zmian, który pobierany jest z systemu. Następnie synchronizuje się z własnym serwerem czasu.|

