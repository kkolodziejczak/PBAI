# How to generate ssl keys
1. openssl genrsa -out ssl-key.pem 1024
2. openssl req -new -key ssl-key.pem -out certrequest.csr
3. openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem
4. Put path to ssl-key and ssl-cert in config file

# todo - napisac albertowi
jesli ze jesli typ uzytkownika to admin niech doda w menu czy gdzies dodatkowe linki do routow: /logs, /db, oraz wybor logiu uzytkownika dla ktorego zmieniaja sie dane przy formularzu do zmiany danych, czy mozeliwosc usuniecia uzytkownika

# Jak odpalic WSZYSTKO
przestawic dockera na linuxowe containery i uruchomic  
docker-compose up
pierwszy raz trwa okolo 5 min potem juz pare sec (trzeba pobrac imagsy)
lub recznie majac uruchomione mongo i podajac adres w zmeinnej dla mongo
npm i 
cd src/adminMongo
npm i
npm i -g concurently
npm start

# Jak zmieniac zmienne srodowiskowe?
Lista zmiennych srodowiskowych zarowno opcjonalnych jak i wymaganych znajdziesz w src/config/config.js. 
todo opisac zmienne
Aby zmienic wartosci uzyj pliku .env (dla zmiennych we wszystkich nazwyach srodowiska)
lub odpowiedno w pliku .env_<nazwa-srodowiska> np dla srodowiska "dev" lub "production" (zmiene te pokryja globalnie ustawione zmienne w pliku .env dla wszsystkich srodowisk)
Nazwa zmiennej srodowsiska powinna byc globalnie ustawiona w twoim systemie (lub ide) pod nazwa NODE_ENV. (zalecane nazwy to "dev", "production", "tests")

# Routes
Routes sa generowane do pliku routes.txt co uruchomienie.

kazdy route moze dodatkowo zwrocic 500 ze byl error na serwerze lb 404 nie ma routa lub 404 jesli byl zly payload, 404 wraca tez jeli nie masz praw aby wejsc na route, 200 wraca jak wszystko poszlo okay

Opisy zawieraja:
/route 
/path (jesli jest) - metoda
prawa dostepu
{...request payload}
inne responses
opis

Admin moze wejsc wszedzie, noAccess znaczy ze moze tam wejsc tylko admin

## /auth
- put
notAuthenticated
validJoiScheme({
    login: schemes.login,
    password: schemes.password,
    password_confirmation: schemes.password_confirmation,
    admin: schemes.isAdmin // tylko jesli chemy utworzyc admina musi to byc sekretne haslo z configa!!
}, 'body'), + haslo nie jest na liscie czestych hasel
Tworzy nowego usera
409 (login zajety)

- post
notAuthenticated
validJoiScheme({
    login: schemes.login,
    password: schemes.password,
}, 'body')
autentykacja usera

- delete
authenticated
wylogowuje usera

## /db
- get
noAccess
wysyla apke do zarzadzania baza danych

## /documents
- put
authenticated
validJoiScheme({
    content: schemes.documentContent,
    name: schemes.documentName
}, 'body')
dodaje nowy dokument na serwer, content to base64 zakodowany dokument 
zwraca id nowo dodanego dokumentu

/:id - get
authenticated, musi byc tez wlascicielem lub dokument musial zostac udostepniony dla usera
wysyla content, name dokumentu oraz liste userow ktorzy maja dostep jesli jest wlascicielem dokumentu, jesli dokument jest dla uzytkownika tylko udostepniony to na liscie bedzie tylko jego id

## /shares
- put
authenticated, musi byc wlascicielem dokumentu ,
validJoiScheme({
    id: schemes.id,  // id dokumentu
    login: schemes.login
}, 'body')
rozpoczyna udostepnianie dla usera
zwraca 400 jesli login jest zly (nie ma takiego userA) LUB 200 i cos jak to:
{
    "originUser": {
        "id": "5c1fdf543bf50e2fb0d845a1"
    },
    "destinationUser": {
        "id": "5c1fdf3a3bf50e2fb0d845a0"
    },
    "state": 0,
    "_id": "5c1fe111e75e5e54741b84a3",
    "documentId": "5c1fdf743bf50e2fb0d845a2",
    "prime": "r+pGR+exWIBfvd48XIYB16qtXILdw2524DlFB0s7O6R76dxlOnRNYUfF2dS11ZC5nXe4X5DI8VDYrmtAPvc73FTynaNk25kt0Yreh8BCR3JYlJNMQZavalHBJOIPrvNChg31mQGK6SMzD1ECHR/7mt6A75S1vnBFgLuMoYwLDqxpKtDCFhd3j8YUyu8dU4kvFZfCwmqYxqHdqpkLXi06uzsFM0CXvhgaPD9qRpcDh54NjThpt/UfT4Dygm9Uj0Nlxw+Nwr4MmSHlbSDS6lZNOytJXwkiHxNHlE6j16Fe+ZvmJRMX+WUUahaTLdFfE4nbJJ1KGV+PMBA642aj+Ydfkw==",
    "generator": "Ag==",
    "__v": 0,
    "crypted": null
}

/id - get
authenticated, musi byc udostepniajacym albo userem ktoremu udostepniono
odpowiedz jak przy pucie

- get (bez zadnego id po pathu)
authenticated, zwraca wszsytkie rekordy udostepnien 

- delete
authenticated, musi byc udostepniajacym albo userem ktoremu udostepniono
validation: validJoiScheme({
            id: schemes.id
        }, 'body'),
dla udostepniajacego usunie rekord, a dla tego co mu udostepnia odrzuci go (status ustawi na -1 aby udostepniajacy mogl widziec ze drugi go nie chce i usunac rekord)

/:id - post
authenticated, tylko  udostepniajacy/ten komu udostepnia
validJoiScheme({
    id: schemes.id, // id ktore dostalismy z put (id shara)
}, 'params')
przekierowuje na odpowiedni request zgodnie z aktualnym state shara

- /:id/0 post
authenticated, tylko dla uzytkownika co udostepnia dokument
[validJoiScheme({
    publicKey: schemes.publicKey
}, 'body'), validJoiScheme({
    id: schemes.id
}, 'params')]
przyjmuje pubic key od udostepniajacego,

- /:id/1 post
authenticated, tylko dla uzytkownika ktoremu udostepniamy dokument
[validJoiScheme({
    publicKey: schemes.publicKey
}, 'body'), validJoiScheme({
    id: schemes.id
}, 'params')]
przyjmuje pubic key od tego komu udostepniamy,

- /:id/1 post
authenticated, tylko dla uzytkownika ktoremu udostepniamy dokument
[validJoiScheme({
    publicKey: schemes.publicKey
}, 'body'), validJoiScheme({
    id: schemes.id
}, 'params')]
przyjmuje pubic key od tego komu udostepniamy,

- /:id/2 post
authenticated, tylko dla uzytkownika ktory udostepnia dokument
[validJoiScheme({
    publicKey: schemes.publicKey,
    crypted: schemes.crypted 
}, 'body'), validJoiScheme({
    id: schemes.id
}, 'params')]
przyjmuje pubic key oraz zahaslowany secret udostepnienia od uzytkownika co udsotepnia dokument. public key jest przyjmowany w celu potwerdzenia ze krypted jest dobrze zakodowany. zwraca 400 jesli public key sie nie zgasdza z poprzednio wyslanym 


- /:id/3 post
authenticated, tylko dla uzytkownika ktoremu udostepniamy dokmuent
[validJoiScheme({
    publicKey: schemes.publicKey
}, 'body'), validJoiScheme({
    id: schemes.id
}, 'params')]
przyjmuje pubic key od uzytkownika ktoremu udsotepniamy dokument. public key jest przyjmowany w celu potwerdzenia ze podal dobre haslo. zwraca {crypted} ktore moze byc odkodowane wspolnym secretem lub 400 jesli haslo jest zle

## premissions 
-delete
authenticated, hasOwnerPremission
validation: validJoiScheme({
    id: schemes.id
}, 'body'),
tylko owenr moze usunac dostep do dokumentu innemu userowi

-/id? - get
authenicated
bez id pobiera wszystkie dostepy usera , z pobiera tylko jeden obiekt dostepu

## /timer
### /presmission
- put
validation: validJoiScheme({
    id: schemes.id, // id premisi ktorej doyczy timer
    sec: schemes.sec
}, 'body')
policy: [authenticated, hasOwnerPremission],
dziala jak delete na premission ale z opoznieniem o iles tam sec 

/:id -get
authenticated, tylko wlasciciel premisji do ktorego jest przypiety timer lub wlasciciel dokumentu ktorego premisja dotyczy
pobiera info o timerze

-delte
w body oczekuje id timera
authenticated, tylko wlasciciel dokumentu ktorego premisja dotyczy
usuwa timer 

# wazne
1.usuniecie premissji wlasciciela dokumentu usuwa presmisje wszystkim usera ktorzy mogli go czytac
2. apka moze sypac bledy jakby co wysylac do mnie logi apki - NODE_ENV ustawic na dev oraz USERS_CAN_READ_LOGS na true aby logi bylo dostepne dla wszysktich po /logs!!!!!!

## /logs
get dla admina zeby dostac logi

nie zrbilem funckjonalnosci ze jak 3 razy poda zle haslo przy udostepnainiu to udostepnienie zostanie uniewaznione - nie chce mi sie juz

# FAQ
1. Jak utworzyc konto admina?
Do payloadu rejestracji dodac pole admin o wartosci rownej zawartosci zmiennej srodowiskowej ADMIN_SECRET

2. Zmiana typu konta
Nie ma obecnie takiej mozliwosci

# zmienne srodowiskowe

exports.required = [
    "NODE_ENV",
    "PORT",
    "PORT_MONGO_ADMIN",
    "MONGO_CONNECTION_STRING",
]

exports.optional = {
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
}