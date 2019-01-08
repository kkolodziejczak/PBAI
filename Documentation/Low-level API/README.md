# Projekt niskiego poziomu

## Opis klas i metod odpowiedzialnych za bezpieczeństwo w aplikacji

|  Klasa	|   Opis	| 
|---	|---	|
| LoginManager  	|   Kontroler, który pozwala na kontrolę dostępu użytkownika, wykorzystując tokeny	|
| LoginAuthController  	|Kontroler, który pozwala na kontrolę dostępu użytkownika, wykorzystując tokeny.    	|  
| LoginAuthAsync  	| Klasa, która dokonuje próby zalogowania użytkownika i zwraca wynik  	|
| CreateAccessToken  	|  Klasa która tworzy token dostępu. 	|  
|  GetAccessToken 	| Klasa która pobiera zaszyfrowany token dostępu.  	|
|RegisterUserData| Klasa pobierająca dane nowego użytkownika (login, hasło, e-mail), która pozwala na ich przesłanie.|
|RegisterCheckData|Klasa weryfikująca dane nowego użytkownika (login, hasło, e-mail).|
|RegisterUserService|Klasa, która implementuje akcje związane z użytkownikami, łącznie z akcjami CRUD.|
|CreateUser| tworzy nowego użytkownika|
|UpdateUser| aktualizuje istniejącego użytkownika
|DeleteUser| usuwa istniejącego użytkownika
|GetRolesUser| pobiera istniejącą rolę
|SetPermissions| Klasa, która ustawia uprawnienia dla użytkownika.
|RegisterAsync|Klasa rejestrująca nowego użytkownika.
|RegisterManager|Klasa zarządzająca rejestracją użytkownika.
|RoleUserService|Klasa, która implementuje akcje związane z kontrolą dostępu konkretnego użytkownika do zaszyfrowanych dokumentów, łącznie z akcjami CRUD.
|CreateRule| tworzy nową rolę
|DeleteRule| usuwa istniejącą rolę
|GetRoles| pobiera listę istniejących ról
|DocumentUser|Klasa, która zarządza dokumentami zalogowanego użytkownika.
|DocumentConnect|Klasa, komunikująca zalogowanego użytkownika z dokumentem
 |UploadDocument|Klasa, pozwalająca na przesłanie pliku, uprzednio zaszyfrowanego kluczem.
| GetInfoDocument|Klasa, pozwalająca na pobranie od zalogowanego użytkownika daty i godziny wygaśnięcia tworzonego pliku.
 |RoleDocument|Klasa, pozwalająca na pobranie listy użytkowników uprawnionych do korzystania z pliku.
|CreatePerm| przyznaje uprawnienia
|DeletePerm| usuwa uprawnienia
|GetPerms| pobiera listę użytkowników z dostępem
|UploadConnect|Klasa, komunikująca zalogowanego użytkownika z dokumentem
|ExchangeKeyConnect|Klasa, pozwalająca na wymianę klucza pomiędzy użytkownikami za pomocą protokołu Diffiego-Hellmana.
|GetExchangeKey|Klasa, pozwalająca na pobranie od użytkownika klucza szyfrującego plik.
|GetConsumer|Klasa, pozwalająca na pobranie od użytkownika docelowego odbiorcy.
|EncodeKey|Klasa, pozwalająca na zaszyfrowanie klucza do pliku.
|DecodeKey|Klasa, pozwalająca na odszyfrowanie klucza do pliku w celu skorzystania z udostępnionych zasobów.




## Architektura bazodanowa

### Documents

|  Typ pola	|   Nazwa	|   Dodatkowe informacje  |
|---	|---	|---
| String  	|   Name	|   wymagane
| Base-64   |   Content |   wymagane
| Reference |   Permissions | PERMISSIONS_DATABASE

### Permissions
|  Typ pola	|   Nazwa	|   Dodatkowe informacje  |
|---	|---	|---
| Reference | UserID    | USERS_DATABASE
| Reference | DocumentID    |   DOCUMENTS_DATABASE
| Reference | ShareID   |   SHARE_DATABASE
| String    | Type      | enum(o,r), wymagane
| Reference | Timer     | TIMERS_DATABASE


### Shares

|  Typ pola	|   Nazwa	|   Dodatkowe informacje  |
|---	|---	|---
| Reference | DocumentID | DOCUMENTS_DATABASE
| Reference | PermissionID | PERMISSIONS_DATABASE
| String    | Prime | wymagane
| String    | Generator | wymagane
| String    | Crypted
| Number    | State | Default: 0


#### Origin User

|  Typ pola	|   Nazwa	|   Dodatkowe informacje  |
|---	|---	|---
|String | PublicKey |
|Reference | Id | USERS_DATABASE

#### Destination User
|  Typ pola	|   Nazwa	|   Dodatkowe informacje  |
|---	|---	|---
|String | PublicKey |
|Reference | Id | USERS_DATABASE


### Timers
|  Typ pola	|   Nazwa	|   Dodatkowe informacje  |
|---	|---	|---
| String | Type | wymagane
| Object    | Params
| Date  | When  | wymagane
| String | ObjectModelName  | wymagane


### Users
|  Typ pola	|   Nazwa	|   Dodatkowe informacje  |
|---	|---	|---
| String | Login    | wymagane, ilość znaków (3-20)
| String | Password | wymagane, ilość znaków (4,40)???? <color="red">A NIE JEST HASHOWANE???</color>