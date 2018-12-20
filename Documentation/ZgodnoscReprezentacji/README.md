# Zgodność reprezentacji
Zgodność pomiędzy specyfikacją funkcjonalną, a projektem wysokiego poziomu i projektem niskiego poziomu

# 1. Audytowanie 

|  Funkcja bezpieczeństwa	| Interfejs  - wysoki poziom | Interfejs - niski poziom|Uzasadnienie |
|---	|---	|--- |--- |
|Dane audytowe przechowywane w bazie danych |Wszystkie metody interfejsu|Wszystkie metody interfejsu|Każda akcja systemu wykonywana przez użytkownika przechowywana jest w bazie danych|
|Przechowywanie danych o działaniach potencjalnie niebezpiecznych dla systemu |Komponent: Policies, Metody: Auth|Klasy: LoginManager, LoginAuthController, LoginAuthAsync, CreateAccessToken, GetAccessToken|Podczas uwierzytelniania może dojść do naruszenia bezpieczeństwa danych. Szczególna uwaga zwrócona na nieprawidłowości występujące podczas logowania|
|Ograniczenie dostępu do danych audytowych|Brak metod|Brak metod|Brak innej możliwości dostania się do danych audytowych. Dostęp do danych jedynie przez bezpośrednie zalogowanie użytkownika. Brak wystawionych metod umożliwiających dostęp do danych audytowych|
|Tworzenie kopii zapasowej z użyciem specjalistycznego narzędzia|Brak metod|Brak metod|Kopie zapasowe tworzone cyklicznie za pomocą narzędzia do zarządzania bazami danych|

# 2. Weryfikacja

|  Funkcja bezpieczeństwa	| Interfejs  - wysoki poziom | Interfejs - niski poziom|Uzasadnienie |
|---	|---	|--- |--- |
|Działanie wg polityki kontroli dostępu|Komponent: Policies - metody: GetAllPermissions, Komponent: UserManagement - metody: GetRoles|Klasy: RoleUserService, Metody: CreateRole, DeleteRole, GetRoles Klasy: LoginAuthController, LoginAuthAsync, CreateAccessToken, GetAccessToken |System pobiera rolę użytkowników i na ich podstawie zezwala na wykonanie pewnych operacji|
|Funkcje systemu dostępne tylko dla ograniczonego grona użytkowników|Komponent: Policies - metody: GetAllPermissions, Komponent: UserManagement - metody: GetRoles |Klasa: RoleUserService, Metody: GetRoles. Klasa: GetAccessToken |System pobiera rolę, do których należy użytkownik i na ich podstawie umożliwia dostęp do informacji|
|Dane w bazie danych mają swoich autorów i czas utworzenia|Brak metod|Brak metod|Każde dane tworzone w systemie posiadają swojego autora i ostatnie zmiany i czas utworzenia|