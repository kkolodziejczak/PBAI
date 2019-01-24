# Manual tests

## 1. Rejestracja

<table border="1">
<tbody>
<tr class="odd" style="font-weight: bold;text-align: center;">
<th>Przypadek</td>
<th>Wynik działania</td>
<th>Poprawność działania</td>
</tr>
<tr class="even">
<td><p>Za krótki login (mniej niż 3 znaki)</p>
<p>Poprawna długość hasła (od 3 do 40 znaków)</p>
<p>Hasło to samo w obu polach</p></td>
<td>Niepowodzenie, nie założono konta</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Bardzo długi login (40 znaków)</p>
<p>Poprawna długość hasła (od 3 do 40 znaków)</p>
<p>Hasło to samo w obu polach</p></td>
<td>Powodzenie – brak ograniczeń długości loginu</td>
<td>Poprawnie</td>
</tr>
<tr class="even">
<td><p>Hasło nie zawierające znaków alfanumerycznych (alfabet arabski)</p>
<p>Poprawna długość hasła (od 3 do 40 znaków)</p>
<p>Hasło to samo w obu polach</p></td>
<td>Niepowodzenie, nie założono konta</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Poprawnej długości login</p>
<p>Za krótkie hasło (mniej niż 3 znaki)</p>
<p>Hasło to samo w obu polach</p></td>
<td>Niepowodzenie, nie założono konta</td>
<td>Poprawnie</td>
</tr>
<tr class="even">
<td><p>Poprawnej długości login</p>
<p>Za długie hasło (więcej niż 40 znaków)</p>
<p>Hasło to samo w obu polach</p></td>
<td>Niepowodzenie, nie założono konta</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Poprawnej długości login</p>
<p>Hasło poprawnej długości</p>
<p>Hasło zawierające znaki nie alfanumeryczne</p>
<p>Hasło to samo w obu polach</p></td>
<td>Niepowodzenie, nie założono konta</td>
<td>Poprawnie</td>
</tr>
<tr class="even">
<td><p>Poprawnej długości login</p>
<p>Hasło poprawnej długości</p>
<p>Różne hasło w polach 'Password' i 'Confirm password'</p></td>
<td>Niepowodzenie, nie założono konta</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Poprawnej długości login</p>
<p>Hasło poprawnej długości</p>
<p>Hasło to samo w obu polach</p></td>
<td>Powodzenie – założono konto</td>
<td>Poprawnie</td>
</tr>
<tr class="even">
<td><p>Poprawnej długości login</p>
<p>Użyty login zarejestrowanej osoby</p>
<p>Hasło poprawnej długości</p>
<p>Hasło to samo w obu polach</p></td>
<td>Niepowodzenie, nie założono konta</td>
<td>Poprawnie</td>
</tr>
</tbody>
</table>

## 2. Logowanie

<table border="1">
<tbody>
<tr class="odd" style="font-weight: bold;text-align: center;">
<th>Przypadek</td>
<th>Wynik działania</td>
<th>Poprawność działania</td>
</tr>
<tr class="even">
<td><p>Niepoprawny login</p>
<p>Niepoprawne hasło</p></td>
<td>Niepowodzenie, nie uzyskano dostępu do systemu. 'Incorrect login or password'</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Poprawny login</p>
<p>Niepoprawne hasło</p></td>
<td>Niepowodzenie, nie uzyskano dostępu do systemu. 'Incorrect login or password'</td>
<td>Poprawnie</td>
</tr>
<tr class="even">
<td><p>Niepoprawny login</p>
<p>Poprawne hasło</p></td>
<td>Niepowodzenie, nie uzyskano dostępu do systemu. 'Incorrect login or password'</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Poprawny login</p>
<p>Poprawne hasło</p></td>
<td>Powodzenie, zalogowano do systemu</td>
<td>Poprawnie</td>
</tr>
</tbody>
</table>

## 3.  Testy panelu użytkownika

Poprzez szybkie przełączanie między zkładkami sprawdzałem stabilność
systemu, zakładka 'My documents' po pierwszym kliknięciu zaczeła się
ładować, przełączenie nie przerwało tego procesu i po powrocie do
zakładki uzyskałem poprawną informację "You did not upload any document
yet".

Wielokrotne wylogowywanie i logowanie do systemu nie zmniejszyło jego
stabilności.

## 4.  Załadowywanie dokumentów

<table border="1">
<tbody>
<tr class="odd" style="font-weight: bold;text-align: center;">
<th>Przypadek</td>
<th>Wynik działania</td>
<th>Poprawność działania</td>
</tr>
<tr class="even">
<td>Przenoszenie folderu do pola 'Drag &amp; Drop'</td>
<td>Niepowodzenie, nie przesłano pliku</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td>Przenoszenie pliku *.sql do pola 'Drag &amp; Drop'</td>
<td>Niepowodzenie, nie przesłano pliku</td>
<td>Poprawnie</td>
</tr>
<tr class="even">
<td>Przenoszenie pliku bez rozszerzenia do pola 'Drag &amp; Drop'</td>
<td>Niepowodzenie, nie przesłano pliku</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td>Przenoszenie pliku *.txt do pola 'Drag &amp; Drop'</td>
<td>Powodzenie, plik został przyjęty</td>
<td>Poprawnie</td>
</tr>
<tr class="even">
<td><p>Plik *.txt jest obecny w polu drag and drop</p>
<p>Przenoszenie pliku *.txt do pola 'Drag &amp; Drop'</p></td>
<td>Powodzenie, plik został zamieniony</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Plik *.txt jest obecny w polu drag and drop</p>
<p>Hasło do pliku zostało wpisane</p></td>
<td>Powodzenie, plik został przesłany na serwer, jest on dostępny w zakładce 'My documents'</td>
<td>Poprawnie</td>
</tr>
</tbody>
</table>

## 5.  Sharowanie dokumentu

<table border="1">
<tbody>
<tr class="odd" style="font-weight: bold;text-align: center;">
<th>Przypadek</td>
<th>Wynik działania</td>
<th>Poprawność działania</td>
</tr>
<tr class="even">
<td><p>Co najmnije jeden dokument obecny</p>
<p>Kliknięcie Share document</p>
<p>Wylogowanie</p></td>
<td>Brak zmiany stanu</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Co najmnije jeden dokument obecny</p>
<p>Share document</p>
<p>Podanie za krótkiego loginu</p></td>
<td>Niepowodzenie, błąd 'za krótki login'</td>
<td>Poprawnie</td>
</tr>
<tr class="even">
<td><p>Co najmnije jeden dokument obecny</p>
<p>Share document</p>
<p>Podanie złego loginu</p></td>
<td>Niepowodzenie, brak użytkownika</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Co najmnije jeden dokument obecny</p>
<p>Share document</p>
<p>Podanie poprawnego loginu</p></td>
<td>Powodzenie, plik został udzielony użytkownikowi, znajduje się on w 'Shares'</td>
<td>Poprawnie</td>
</tr>
</tbody>
</table>

W tym momencie zaczyna się semi automatyczny proces, użytkownik któremu
udostępniono plik musi się zalogować, aby kontunuować dzielenie pliku,
przejść do zakłady 'Shares' gdzie zostanie wysłany publiczny klucz do
użytkownika udestępniającego.

Użytkownik który udostępnia plik musi wprowadzić hasło którym został
zaszyfrowany oryginalny plik, ponieważ hasło jest dowolne, a serwer nie
ma informacji o zawartości pliku nie może zajsć żadna walidacja.

<table border="1">
<tbody>
<tr class="odd" style="font-weight: bold;text-align: center;">
<th>Przypadek</td>
<th>Wynik działania</td>
<th>Poprawność działania</td>
</tr>
<tr class="even">
<td><p>Plik został udzielony</p>
<p>Podanie złego, nieoryginalnego hasła do pliku</p></td>
<td>Brak zgodności hasła, odszyfrowany plik po stronie użytkownika któremu udostępniany jest plik jest niepoprawny</td>
<td>Poprawnie</td>
</tr>
<tr class="odd">
<td><p>Plik został udzielony</p>
<p>Podanie poprawnego hasła do pliku</p></td>
<td>Powodzenie, plik został poprawnie odszyfrowany po stronie drugiego użytkownika</td>
<td>Poprawnie</td>
</tr>
</tbody>
</table>

Następnie użytkownik udostępniający plik ustala czas po którym plik
wygasa. Wpis zostaje usunięty dla obu użytkowników. Użytkownik któremu
został udostępniony plik może wykorzystać ten czas, aby odczytać jego
zawartość plik pozostanie tam do czasu odświeżenia strony.

## 6. Przeprowadzone ataki
<table border="1">
  <tr class="odd" style="font-weight: bold;text-align: center;">
    <th>Przypadek</th>
    <th>Wynik działania</th>
    <th>Poprawność działania</th>
  </tr>
  <tr>
    <td>Losowy akceptowalny login<br>Losowe akceptowalne hasło<br></td>
    <td>Po trzech próbach dostajemy jednogodzinny timeout<br></td>
    <td>Poprawne</td>
  </tr>
  <tr>
    <td><br>Prawidłowy login<br>Złe hasło<br></td>
    <td>Po trzech próbach dostajemy jednogodzinny timeout</td>
    <td>Poprawne</td>
  </tr>
  <tr>
    <td><br>Zły login<br>Prawidłowe hasło<br></td>
    <td>Po trzech próbach dostajemy jednogodzinny timeout</td>
    <td>Poprawne</td>
  </tr>
  <tr>
    <td><br>Atak słownikowy<br>1. administrator:administrator<br><br>2. user:user<br>3. root:root<br></td>
    <td>Po trzech próbach dostajemy jednogodzinny timeout</td>
    <td>Poprawne</td>
  </tr>
</table>

# Flow dzielenia dokumentu

## Założenia:

-   Dwóch użytkowników (Alice i Bob) zalogowanych na dwóch systemach.
-   Użytkownik Alice posiada jeden unikatowy dokument, parametry:

    -   Nazwa pliku: "file.txt"
    -   Zawartość pliku: "content"
    -   Hasło pliku: "password"
    -   Id pliku: 5c3e17a67683cb0018d55d79

![Flow](diag.png)

# Diagram przypadków użycia

![Use case](diag2.png)

<table border="1">
<tbody>
<tr>
<th>Przypadek użycia</th>
<td>Stwórz konto</td>
</tr>
<tr>
<th>Opis</th>
<td>Rejestracja użytkownika w systemie do udostępniania plików</td>
</tr>
<tr>
<th>Warunki początkowe</th>
<td>Brak, nowy użytkownik</td>
</tr>
<tr>
<th>Aktor</th>
<td>Niezarejestrowany użytkownik</td>
</tr>
<tr>
<th>Procedura</th>
<td><p>1.Przejdź do strony głównej</p>
<p>2.Kliknij "Register"</p>
<p>3.Wpisz login</p>
<p>4.Wpisz hasło</p>
<p>5.Powtórz hasło</p>
<p>6.Kliknij 'Submit'</p>
<p></p></td>
</tr>
<tr>
<th>Warunki porażki</th>
<td>
<p>Login nie spełnia wymagań</p>
<p>Hasło nie spełnia wymagać</p>
<p>Hasła nie zgadzają się w obu polach</p>
</td>
</tr>
<tr>
<th>Warunki sukcesu</th>
<td>
<p>Login spełnia wymagania</p>
<p>Hasło spełnia wymagania</p>
<p>Hasła zgadzają się w obu polach</p>
</td>
</tr>
</tbody>
</table>
<p></p><p></p><table border="1">
<tbody>
<tr>
<th>Przypadek użycia</th>
<td>Zaloguj</td>
</tr>
<tr>
<th>Opis</th>
<td>Procedura zalogowania użytkownika do systemu</td>
</tr>
<tr>
<th>Warunki początkowe</th>
<td>Użytkownik musi powiadać konto</td>
</tr>
<tr>
<th>Aktor</th>
<td>Zarejestrowany użytkownik</td>
</tr>
<tr>
<th>Procedura</th>
<td><p>1.Przejdź do strony głównej</p>
<p>2.Wpisz login</p>
<p>3.Wpisz hasło</p>
<p>4.Kliknij submit</p></td>
</tr>
<tr>
<th>Warunki porażki</th>
<td>
<p>Zły login</p>
<p>Złe hasło</p>
</td>
</tr>
<tr>
<th>Warunki sukcesu</th>
<td>
<p>Poprawny login</p>
<p>Poprawne hasło</p>
</td>
</tr>
</tbody>
</table>
<p></p>
<p></p>
<table border="1">
<tbody>
<tr>
<th>Przypadek użycia</th>
<td>Wyloguj</td>
</tr>
<tr>
<th>Opis</th>
<td>Procedura wylogowania użytkownika z sytemu</td>
</tr>
<tr>
<th>Warunki początkowe</th>
<td>Użytkownik musi być zalogowany do systemu</td>
</tr>
<tr>
<th>Aktor</th>
<td>Zarejestrowany użytkownik</td>
</tr>
<tr>
<th>Procedura</th>
<td><p>1.Przejdź do strony głównej</p>
<p>2.Kliknij 'Log Out'</p></td>
</tr>
<tr>
<th>Warunki porażki</th>
<td>Brak</td>
</tr>
<tr>
<th>Warunki sukcesu</th>
<td>Brak</td>
</tr>
</tbody>
</table>
<p></p>
<p></p>
<table border="1">
<tbody>
<tr>
<th>Przypadek użycia</th>
<td>Przeglądnij własne dokumenty</td>
</tr>
<tr>
<th>Opis</th>
<td>Wyświetl wszystkie dokumenty które zostały przesłane do systemu</td>
</tr>
<tr>
<th>Warunki początkowe</th>
<td>Użytkownik musi być zalogowany do systemu</td>
</tr>
<tr>
<th>Aktor</th>
<td>Zarejestrowany użytkownik</td>
</tr>
<tr>
<th>Procedura</th>
<td><p>1.Przejdź do strony głównej</p>
<p>2.Kliknij 'My Documents'</p></td>
</tr>
<tr>
<th>Warunki porażki</th>
<td>Brak</td>
</tr>
<tr>
<th>Warunki sukcesu</th>
<td>Brak</td>
</tr>
</tbody>
</table>
<p></p>
<p></p>
<table border="1">
<tbody>
<tr>
<th>Przypadek użycia</th>
<td>Przeglądnij udostępnione dokumenty</td>
</tr>
<tr>
<th>Opis</th>
<td>Wyświetlenie wszystkich udostępnionych dokumentów prze danego użytkownika oraz wyświetlenie dokumentów które zostały udostępnione danemu użytkownikowi</td>
</tr>
<tr>
<th>Warunki początkowe</th>
<td>Użytkownik musi być zalogowany do systemu</td>
</tr>
<tr>
<th>Aktor</th>
<td>Zarejestrowany użytkownik</td>
</tr>
<tr>
<th>Procedura</th>
<td><p>1.Przejdź do strony głównej</p>
<p>2.Kliknij 'Shares'</p></td>
</tr>
<tr>
<th>Warunki porażki</th>
<td>Brak</td>
</tr>
<tr>
<th>Warunki sukcesu</th>
<td>Brak</td>
</tr>
</tbody>
</table>
<p></p>
<p></p>
<table border="1">
<tbody>
<tr>
<th>Przypadek użycia</th>
<td>Prześlij dokumenty</td>
</tr>
<tr>
<th>Opis</th>
<td>Wysłanie plików do systemu</td>
</tr>
<tr>
<th>Warunki początkowe</th>
<td>Użytkownik musi być zalogowany do systemu</td>
</tr>
<tr>
<th>Aktor</th>
<td>Zarejestrowany użytkownik</td>
</tr>
<tr>
<th>Procedura</th>
<td><p>1.Przejdź do strony głównej</p>
<p>2.Kliknij 'DOCUMENTS SHARING APP'</p>
<p>3.Drag &amp; Drop plik do wysłania</p>
<p>4.Wpisz hasło do pliku</p>
<p>5.Kliknij "Save and continue"</p></td>
</tr>
<tr>
<th>Warunki porażki</th>
<td>
<p>Plik za duży</p>
<p>Złe rozszerzenie pliku</p>
</td>
</tr>
<tr>
<th>Warunki sukcesu</th>
<td>
<p>Plik odpowiedniej wielkości</p>
<p>Plik z rozszerzeniem *.txt</p>
</td>
</tr>
</tbody>
</table>
<p></p>
<p></p>
<p></p>
<p></p>
<table border="1">
<tbody>
<tr>
<th>Przypadek użycia</th>
<td>Udostępnij dokument</td>
</tr>
<tr>
<th>Opis</th>
<td>Udostępnianie dokumentów które posiada dany użytkownik</td>
</tr>
<tr>
<th>Warunki początkowe</th>
<td>
<p>Użytkownik musi być zalogowany do systemu</p>
<p>Użytkownik musi posiadać co najmniej jeden plik</p>
</td>
</tr>
<tr>
<th>Aktor</th>
<td>Zarejestrowany użytkownik</td>
</tr>
<tr>
<th>Procedura</th>
<td><p>1.Przejdź do strony głównej</p>
<p>2.Kliknij 'My documents'</p>
<p>3.Kliknij w przycisk "Share document" który należy do pliku który chcesz udostępnić</p>
<p>4.Wpisz login użytkownika któremu chcesz udostępnić plik</p>
<p>5.Kliknij "Share"</p></td>
</tr>
<tr>
<th>Warunki porażki</th>
<td>Użytkownik o danym loginie nie istnieje</td>
</tr>
<tr>
<th>Warunki sukcesu</th>
<td>Użytkownik istnieje</td>
</tr>
</tbody>
</table>
<p></p>
<p></p>
<table border="1">
<tbody>
<tr>
<th>Przypadek użycia</th>
<td>Przejdź do kolejnego stanu udostępniania dokumentu</td>
</tr>
<tr>
<th>Opis</th>
<td>Proces pół-automatyczny który służy do bezpiecznego udostępniania dokumentu innym użytkowniką, poprzez obecność w zakładce "Shares" proces przechodzi do kolejnych stanów</td>
</tr>
<tr>
<th>Warunki początkowe</th>
<td>
<p>Użytkownik musi być zalogowany do systemu</p>
<p>Użytkownik musi być w trakcie przyjmowania lub udzielania pliku</p>
</td>
</tr>
<tr>
<th>Aktor</th>
<td>Zarejestrowany użytkownik</td>
</tr>
<tr>
<th>Procedura</th>
<td><p>1.Przejdź do strony głównej</p>
<p>2.Kliknij 'Shares'</p>
<p>3.Poczekaj aż stan zostanie automatycznie zmieniony lub:</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;1.(State 2) Wprowadź hasło</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;2.(State 3) Wprowadź czas po którym plik przestanie być udostępniany</p></td>
</tr>
<tr>
<th>Warunki porażki</th>
<td>
<p>Timeout udostępniania</p>
<p>Podanie niepoprawnego hasła co spowoduje błędne odszyfrowanie pliku</p>
</td>
</tr>
<tr>
<th>Warunki sukcesu</th>
<td>
<p>Wykonanie procedury zanim udostępnianie zostanie unieważnione</p>
<p>Podanie prawidłowego hasła które posłużyło do zaszyfrowania pliku</p>
</td>
</tr>
</tbody>
</table>
