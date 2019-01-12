# Projekt niskiego poziomu

## Opis klas i metod odpowiedzialnych za bezpieczeństwo w aplikacji


### AuthManager
Klasa odpowiedzialna jest za kontrolę dostępu użytkownika, podejmuje próby logowania, rejestracji i zwraca wynik. Odpowiedzialna za pobranie danych nowego użytkownika (login, hasło) i weryfikuje je. Implementuje akcje związane z użytkownikami, łącznie z akcjami CRUD. 

|  Metoda	|   Opis metody	| 
|---	|---	|
|  putUser	|  Dostęp tylko dla niezalogowanego użytkownika. Pobiera login, hasło, potwierdzenie hasła następnie tworzy nowego użytkownika. Gdy login jest zajęty zwraca błąd 409. Gdy chcemy utworzyć admina podajemy również zmienną środowiskową ADMIN_SECRET.	| 
|  postUser	|     Dostęp tylko dla niezalogowanego użytkownika. Pobiera login, hasło, a nastepnie loguje użytkownika.	| 
|  deleteUser	|     Dostęp tylko dla zalogowanego użytkownika.  Usuwa użytkownika	| 
|  logoutUser	|     Dostęp tylko dla zalogowanego użytkownika.  Wylogowuje użytkownika	| 

### DocumentManager
Klasa odpowiedzialna jest za zarządzanie dokumentami użytkownika. Podejmuje akcje związane z dodaniem nowego dokumentu dla użytkownika.  
|  Metoda	|   Opis metody	| 
|---	|---	|
|  putDocument	|  Dostęp tylko dla zalogowanego użytkownika. Dodaje nowy dokument dla wskazanego użytkownika. Tworzy id danego dokumentu	| 
|  getDocumentID	| Dostęp tylko dla zalogowanego użytkownika, właściciela dokumentu lub użytkownik któremu został przydzielony dostęp.  Przesyła dokument, jeśli użytkownik jest właścicielem otrzymuje id wszystkich dostępów do dokumentu. Jeśli użytkownikowi jest tylko udostępniony dokument widzis swój dostęp oraz właściciela dokumentu.	| 
|  getRoleDocument	| pozwala na pobranie listy użytkowników uprawnionych do korzystania z pliku.	| 
|  EncodeKey	|  pozwala na zaszyfrowanie klucza do pliku.	| 
|  DecodeKey	| pozwalaa na odszyfrowanie klucza do pliku w celu skorzystania z udostępnionych zasobów.	| 




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
| HASH(bcrypt) | Password | wymagane
| Boolean | IsAdmin | Default: false
| Reference | Permissions | PERMISSIONS_DATABASE
| Reference | Shares    | SHARES_DATABASE
