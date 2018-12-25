# WARNING 
apka moze sypac bledy jakby co wysylac logi apki NODE_ENV ustawic na dev oraz USERS_CAN_READ_LOGS na true aby logi bylo dostepne dla wszysktich na roucie /logs

# Jak odpalic
przestawic dockera na linuxowe containery i uruchomic  
```
docker-compose up
```
pierwszy raz trwa okolo 5 min potem juz pare sec (trzeba pobrac imagsy)

# Zmienne srodowiskowe
## Ustawienie zmiennych
Aby zmienic wartosci uzyj pliku .env (dla zmiennych we wszystkich nazwyach srodowiska (NODE_ENV))
lub odpowiedno w pliku .env_\<nazwa-srodowiska\> np dla srodowiska "dev" lub "production" (zmiene te pokryja globalnie ustawione zmienne w pliku .env).
Nazwa zmiennej srodowsiska powinna byc globalnie ustawiona w twoim systemie (lub ide) pod nazwa NODE_ENV. (zalecane nazwy to "dev", "production", "tests")

## Zmienne wymagane
```json
"NODE_ENV",
"PORT",
"PORT_MONGO_ADMIN",
"MONGO_CONNECTION_STRING",
```

## Zmienne opcjonalne
po dwukropku ich domyślne wartości
```json
"APP_PUBLIC": path.join(process.cwd(), `src`, `public`),
"LOG_LEVEL": 'trace', // info, debug, trace
"LOG_BODY": true,
"LOG_TEMPLATE": false /** */|| path.join(process.cwd(), 'src', 'assets', 'log-template.html')/**/,
"SESSION_SECRET": "OaMBtTO1UGw3ZCuPNdYU",
"COOKIE_MAX_AGE": 1000*60*60*24,
"GENERATED_ROUTES_FILE": path.join(process.cwd(), 'routes.txt'),
"TIMERS_DATABASE_NAME": "timers_collection",
"USERSS_DATABASE_NAME": "users_collection",
"PERMISSIONS_DATABASE_NAME": "permissions_collection",
"DOCUMENTS_DATABASE_NAME": "documents_collection",
"SHARES_DATABASE_NAME": "shares_collection",
"CHECK_COMMON_PASSWORDS": true,
"HTTPS": false,
"SSL_CERT_FILE": path.join(process.cwd(), `src`, `assets`, 'ssl-cert.pem'),
"SSL_KEY_FILE": path.join(process.cwd(), `src`, `assets`, 'ssl-key.pem'),
"NO_CACHE": true,
"LIMITER": true,
"CORS": true,
"STORE_SESSION_ON_MONGO": true,
"ADMIN_SECRET": "7jWIWmPkuPBR74yTmdNh",
"REJECT_BLACKLISTED_PASSWORDS": true,
"SERVE_LOGS": false /** */|| path.join(__dirname, '..', 'logs.html'),
"MAX_TIMER_SEC": 60*60*24*365, // one year
"DH_PRIME_LENGTH": 2048,
"CRYPTO_MOCKED": true,
"USERS_CAN_READ_LOGS": true
```

# Routes
Routes sa generowane do pliku routes.txt co uruchomienie. Mozecie je siegnac z dockera dzieki poleceniu dockera exec.

## Jak czytac readme
Przykladowy opis route'a:  
## path
### /path/resource
* metoda
* dostep: listaWarunkow
* request payload
```
...obiekt
```
* opis 
* inne zwroty

Kazdy route moze zwrocic:
* 200 - wykonano pomyślnie
* 401 - brak wymaganej autoryzacji
* 404 - nie znaleziono lub brak dostępu
* 400 - nie właściwy payload lub jego wartości
* 500 - błąd serwera (dla srodowiska 'production' brak opisu bledu)

Admin moze wykonac kazdy request bez wzgledu na jego dostep. Pobiera on tez dokumenty oraz udostepnienia wszystkich uzytkownikow. Dostep noAccess znaczy ze moze tam wejsc tylko admin.

## auth
### /auth
1.
* put
* dostep: notAuthenticated
* body
```
login: schemes.login,
password: schemes.password,
password_confirmation: schemes.password_confirmation,
admin: schemes.isAdmin // tylko jesli chemy utworzyc admina, musi byc rowne zmiennej srodowiskowej ADMIN_SECRET
```
* tworzy nowe konto
* 409 (login zajety) 

2.
* post
* dostep: notAuthenticated
* body 
```
login: schemes.login,
password: schemes.password,
```
* loguje usera

3.
* delete
* authenticated
* wylogowuje usera

## db
### /db
1.
* get
* dostep: noAccess
* wysyla apke do zarzadzania baza danych

## logs
### /logs
1.
* get
* dostep: noAccess
* wysyla logi serwera w postaci pliku html, zmienna srodowiskowa USERS_CAN_READ_LOGS moze zapewnic serwowanie dla wszystkich

## documents
### /documents
1.
* put
* dostep: authenticated
* body
```
content: schemes.documentContent,
name: schemes.documentName
```
* dodaje nowy dokument dla uzytkownika. Content oznacza zakodowany juz dokument dokument w postaci base64

### /documents/:id
1.
* get
* dostep: authenticated, documentOwner || documentIsSharedForUser
* query param
```
id: idDokumentu
```
* Przesyła dokument. Jesli uzytkownik jest wlascicielem w polu permissions otrzymuje id wszystkich dostepow do dokumentu. Jesli dokument jest mu tylko udostepniony widzi swoj permission oraz wlasciciela dokumentu.
* response body
```
"_id" : idDokumentu,
"permissions" : [ 
    TablicaDostepow
],
"content" : ZaszyfrowanyDokumentBase64,
"name" : Nazwa
```

## shares
### /shares
1.
* put
* dostep: authenticated, documentOwner
* body
```
id: schemes.id,  // id dokumentu
login: schemes.login // login uzytkownika komu udostepnia dokument
```
* utworzenie obiektu udostepnienia dokumentu
* response body
```
"id": idObiektu,
"originUser": {
    "id": idUsera
},
"destinationUser": {
    "id": IdUseraKtoremuUdostepniamy
},
"state": statusUdostepnieina,
"documentId": idDokumentuUdostpenionego,
"prime": pWalgorytmieDH,
"generator": gWalgorytmieDH
```
2. 
* get
* dostep: authenticated
* zwraca liste id obiektow share uzytkownika
* response body
```
    "shares": [listaIdObiektowShare]
``` 

3.
* delete
* dostep: authenticated, shareOriginUser ||shareDestinationUser
* body
```
id: idShare
```
* Jesli otrzymano od shareOriginUsera usuwa obiekt udostepnienia, jesli shareDestinationUser share zostaje odrzucony (state ustawia sie na -1, udostepniajacy widzi wtedy ze partner go odrzucil)

### /shares/:id
1.
* get
* dostep: authenticated, shareOriginUser ||shareDestinationUser
* query params
```
id: idShare
```
* pobiera obiekt share
* response body
```
"id": idObiektu,
"originUser": {
    "id": idUsera,
    "publicKey": publicznyKluczUdostepniajacego
},
"destinationUser": {
    "id": IdUseraKtoremuUdostepniamy,
    "publicKey": publicznyKluczUzytkownikaKtoremuUdostepniamy
},
"state": statusUdostepnieina,
"documentId": idDokumentuUdostpenionego,
"prime": pWalgorytmieDH,
"generator": gWalgorytmieDH,
"crypted": null
```

2.
* post
* dostep: authenticated, shareOriginUser || shareDestinationUser
* query params
```
id: idShare
```
* przekierowuje request pod odpowiedni post dla state share'a. Requesty zalezne od state moga byc ustawione tylko raz dla udostepnienia. Nie mozna zmeniac ustawionych im wartosci w pozniejszym procesie (ale mozna zaczac udaostepniac dokument od nowa). Uzytkownik moze udostepnic drugiemu okument pare razy - aby  miec do niego wiele hasel.
* 307 redirect

### /shares/:id/0
1.
* post
* dostep: authenticated, shareOriginUser
* query params
```
id: idShare
```
* body
```
publicKey: publicKeyOriginUsera
```
* przyjmuje klucz Publiczny Dla Udostepnienia od uzytkownika ktory udostepnia dokument. Zmienia state na 1

### /shares/:id/1
1.
* post
* dostep: authenticated, shareDestinationUser
* query params
```
id: idShare
```
* body
```
publicKey: publicKeyDestinationUsera
```
* przyjmuje klucz Publiczny Dla Udostepnienia od uzytkownika ktoremu udostepnia dokument. Zmienia state na 2

### /shares/:id/2
1.
* post
* dostep: authenticated, shareOriginUser
* query params
```
id: idShare
```
* body
```
publicKey: publicKeyOriginUsera,
crypted: zakodowane haslo wspolnym sekretem
```
* sprawdza poprawnosc ponownie wyslanego klucza publiczegnego od uzytkownika udostepniajcego dokument. Jesli zgadza sie z poprzednio wyslanym ustaia crypted jako zakodowane haslo do dokumentu.

### /shares/:id/3
1.
* post
* dostep: authenticated, shareDestinationUser
* query params
```
id: idShare
```
* body
```
publicKey: publicKeyDestinationUsera
```
* sprawdza poprawnosc klucza uzytkownika ktoremu udostepniamy dokument. jesli sie zgadza wysyla crypted oraz dostep do dokumentu. 
* response body
```
crypted: zahaslowanySekret,
permissionId: id
```

## permissions 
### /permissions 
1.
* delete
* dostep: authenticated, hasOwnerPeemission
* body
```
id: idDostepu
```
* usuwa dostep po id oraz obiekt share jesli premission dotyczy udostepnienia. jesli dostep jest dostepem wlasciciela usunie on wszysktie dostepy do dokumentu.

2.
* get
* dostep: authenticated
* zwraca wszystkie dostepy dla uzytkownika
* response body
```
permissions: [tablicaIdDostepow]
```

### /permissions/:id
1.
* get
* dostep: authenicated, dostep nalezy do uzytkownika lub wlasiciela dokumentu ktory go dotyczy
* query params
```
id: idDostepu
```
* zwraca obiekt dostepu dla usera
* response body
```
"_id" : idDostepu,
"timer" : idTimera jesli istnieje,
"userId" : idUsera,
"documentId" : idDokumentu,
"type" : "o" || "r"
```

## timer
### /timer/permissions
1.
* put
* dostep: authenticated, hasOwnerPermission
* body
```
id: schemes.id, // id dostepu ktorego dotyczy timer
sec: schemes.sec // ilosc sekund za ile aktywowac
```
* ustawia timer ktory na aktywacji usunie dostep dla uzytkownika
* zwraca 409 jesli timer jest juz ustawiony dla tego dostepu

* delete
* dostep: authenticated, hasOwnerPermissionToDocumentOfTimer
* body
```
id: idTimer
```
* Usuwa timer

### /timer/permissions/:id
1.
* get
* dostep: authenticated, wlasciciel dostepu ktorego totyczy timer lub dokumentu ktorego tytyczy dostep timera
* query params
```
id: idTimera
```
* zwraca obket timera
* response body
```
type: "deletePermission"
params: {sec: IloscCzasuNaKtoraTimerZostalUstawiony}
when: KiedyTimerBedzieAktywowanyWSec //( to ta ilsoc od ktoregos tam roku 1981??)
object: idDostepu,
objectModelName: nazwaKolekcjiDostepow 
```
## user
### /users
1.
* get
* dostep: authenticated
* zwraca informacje o uzytkowniku
* response body
```
login: user.login,
isAdmin: user.isAdmin,
permissions: [user.permissions],
shares: [user.shares]
```
2.
* post
* dostep: authenticated, jesliZminiaCzyjesDaneMusiBycAdminem
* body
```
login: schemes.loginNotRequired, // tylko dla admina aby zminic kogos dane
newLogin: schemes.loginNotRequired,
newPassword: schemes.passwordNotRequired
```
* zmieia dane uzytkownika login/lub wlasne - mozna zmienic login lub/i haslo
3.
* delete
* dostep: noAccess
* body
```
login: loginUsera
```
* usuwa uzytkownika

# FAQ
## Jak utworzyc konto admina?
Do payloadu rejestracji dodac pole "admin" o wartosci rownej zawartosci zmiennej srodowiskowej ADMIN_SECRET

## Zmiana typu konta
Nie ma obecnie takiej mozliwosci

## Jak ustawic certyfikat i klucz dla https
Generacja kluczy:
```
openssl genrsa -out ssl-key.pem 1024
openssl req -new -key ssl-key.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem
```
Ustawic odpowiednie sciezki w configu