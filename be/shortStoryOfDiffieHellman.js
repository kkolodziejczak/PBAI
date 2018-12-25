const crypto = require('crypto')
const btoa = require('btoa')
// btoa - stirng to base64 - na froncie powinno byc dostepne pod window

const hasloDoPliku = "pass"
// algorytm polega na bezpiecznym 
// przekazaniu hasla od u1 do u2
// przebieg algorymtu dh
// u1 - udostepniajacy plik
// u2 - odbierajacy udostepnienie
// be -serwer 
// [<method>]{...payload}-> - wysylanie na serwer
// <-{...payload} odpowiedz z serwera  
// dane w ktorym etapie jest user i co powinienem
// odeslac rozpoznaje sie po state

// sztuczne utworzenie pamieci kazdego z entity
const u1 = {}, u2 = {}, be = {}

// serwer
// startup serwera
be.dh = crypto.createDiffieHellman(2048)

// user1
// user1 postanawia udostepnic plik
u1.idDokumentu = '0001'

// [put]{idDokumentu}->

// serwer
be.idDokumentu = u1.idDokumentu
be.p = be.dh.getPrime("base64")
be.g = be.dh.getGenerator('base64')
be.state = 0

// <-{p, g, status: 0}

// user1
u1.p = be.p
u1.g = be.g

u1.dh = crypto.createDiffieHellman(u1.p, u1.g)
// user podaje haslo do udostepnienia ktore musi
// zapamietac jeszcze na troche
u1.password = "secret1"
u1.passwordBase64 = btoa(u1.password)
u1.dh.setPrivateKey(u1.passwordBase64, 'base64')
u1.dh.generateKeys('base64')
u1.publicKey = u1.dh.getPublicKey('base64')

// [post]{publicKey}->

// serwer
be.u1Key = u1.publicKey
be.state = 1

// user2 loguje sie na apke otrzymuje swoje dokumenty 
// i informajc o udostepnieniach miedzy innymi o dokumencieID...
// <-{p, g, status: 1}

// user2 

// user1
u2.p = be.p
u2.g = be.g

u2.dh = crypto.createDiffieHellman(u2.p, u2.g)
// user podaje haslo do udostepnienia ktore musi
// zapamietac jeszcze na troche
u2.password = "secret2"
u2.passwordBase64 = btoa(u2.password)
u2.dh.setPrivateKey(u2.passwordBase64, 'base64')
u2.dh.generateKeys('base64')
u2.publicKey = u2.dh.getPublicKey('base64')

// [post]{publicKey}->

// serwer
be.u2Key = u2.publicKey
be.state = 2

// user1 wraca na apke otrzymuje info o udostepnieniach
// <-{p,g,u2Key,state}

u1.p = be.p 
u1.g = be.g
u1.partnerKey = be.u2Key

u1.dh = crypto.createDiffieHellman(u1.p, u1.g)
// uzytkownik musi podac jeszcze raz to samo haslo
u1.password = "secret1"
// uzytkownik moze zapomniec juz to haslo, do odkodowania pliku ma wlasne
u1.passwordBase64 = btoa(u1.password)
u1.dh.setPrivateKey(u1.passwordBase64, 'base64')
u1.dh.generateKeys('base64')
u1.publicKey = u1.dh.getPublicKey('base64')
u1.commonSecret = u1.dh.computeSecret(u1.partnerKey, 'base64')

// kodowanie hasla - ten same 3 linijki powinny 
// zostac uzyte rowniez do kodowania calego dokumentu uzytkownika
// jego prywatnym haslem przed wyslaniem go na serwer
u1.cipher = crypto.createCipher('aes-256-ctr', u1.commonSecret)
u1.crypted = u1.cipher.update(hasloDoPliku, 'utf8', 'hex')
u1.crypted += u1.cipher.final('hex')

// [post]{publicKey, crypted}->

// serwer
// serwer sprawdza czy publicKey jest takie same
// jak to przeslane poprzednio
// tylko wtedy podniesie state
// jesli haslo bylo by inne odpowidz na tego posta 
// miala by status 400 a uzytkownik bedzie musial powtorzyc ostatni krok
// jesli nie uda sie 3 razy to udostepnienie otrzyma state -2 
// co bedzie oznaczalo ze zostalo anulowane

if (be.u1Key !== u1.publicKey){
    // send400
}
be.crypted = u1.crypted
be.state = 3

// user 2 wraca na apke
// otrzymuje dane z serwera 
// <-{p, g, state}

u2.p = be.p 
u2.g = be.g
u2.partnerKey = be.u1Key
u2.crypted = be.crypted

// te kroki musza zostac powtorzone za kazdym 
// razem kiedy user probuje odczytac udostepniony dokument
u2.dh = crypto.createDiffieHellman(u2.p, u2.g)
// uzytkownik musi podac jeszcze raz to samo haslo
// to haslo jest uznawane jako haslo odkodowania pliku dla uzytkownika2
u2.password = "secret2"
u2.passwordBase64 = btoa(u2.password)
u2.dh.setPrivateKey(u2.passwordBase64, 'base64')
u2.dh.generateKeys('base64')
u2.publicKey = u2.dh.getPublicKey('base64')

// post{publicKey}->

// serwer
// serwer sprawdza czy publicKey uzytkownika2 sie zgadza
// z wyslanym poprzednio
// jesli nie uzytkownik dostanie status 400 co bedzie oznaczalo ze wpisal
// zle haslo
// jesli jest dobrze wysle mu zakryptowane haslo do dokumenty id ktory bedzie mogl pobrac

if (be.u2Key !== u2.publicKey){
    // send400
}
// serwer nie podnosi sate bo juz zawse bedzie odpowiadal porpzednimi informacjami 

// <-{u1Key, crypted, p, g, state, u2Key}

u2.p = be.p 
u2.g = be.g
u2.partnerKey = be.u1Key
u2.publicKey = be.u2Key
u2.crypted = be.crypted

u2.dh = crypto.createDiffieHellman(u2.p, u2.g)
// mozna wykorzystac haslo z poprzedniego wpisania - wiec nie trzeba ponowaine pobierac od usera
// a nawet nie mozna mu na to pozwolic aby miec pewnosc ze dobrze odkodujemy dokument
// u2.password = "secret2"
u2.passwordBase64 = btoa(u2.password)
u2.dh.setPrivateKey(u2.passwordBase64, 'base64')
u2.dh.setPublicKey(u2.publicKey, 'base64')

u2.commonSecret = u2.dh.computeSecret(u2.partnerKey, 'base64')

// odkodowywanie - tych samych 3 linijek powinnismy uzyc
// przy odbieraniu zakodowanego dokumentu z serwera
u2.decipher = crypto.createDecipher('aes-256-ctr', u2.commonSecret)
u2.deciphered = u2.decipher.update(u2.crypted, 'hex','utf8')
u2.deciphered += u2.decipher.final('utf8')
// u2.deciphered zawiera tajna przeslana informacje 
// tzn haslo do odkodowania dokumentu

// uzytkownik teraz moze pobrac dokument: dokumentID z serwera
// i poprawnie je odkodowac poprzez u2.deciphered

console.log(`dziala? = ${u2.deciphered === hasloDoPliku}`)