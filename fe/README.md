## Wymagania

- zainstalowany NodeJS - https://nodejs.org/en/
- yarn - https://yarnpkg.com/lang/en/docs/install/#windows-stable

## Uruchomienie aplikacji

```
yarn install
yarn start
```

## Flow udostępniania pliku

1. Wgrywamy plik przez formularz na stronie głównej po zalogowaniu.
2. W zakładce /documents są wszystkie wgrane przez nas dokumenty.
3. Klikamy 'share' przy dokumencie, żeby go udostępnić. Wpisujemy tam 'login' odbiorcy.
4. W zakładce /shares widzimy nasze udostępnienia.
5. Odbiorca wchodzi w zakładke /share i wysyła swój klucz publiczny.
6. Nadawca wchodzi w zakładke /share, odbiera klucz publiczny odbiorcy i wysyła zaszyfrowane hasło (takie samo jak przy uploadzie).
7. Odbiorca wchodzi w zakładkę /share, odszyfrowuje hasło i widzi przesłaną wiadomość.
8. Nadawca wchodzi w zakładkę /share i ustawia timer na plik (po tym czasie plik już nie będzie udostępniony).
9. Po upłynięciu czasu timera można udstępnić jeszcze raz ten sam plik.

Żeby to testować można otworzyć 2 przeglądarki (jedna w incognito) i przeładowywać /share z obu kont. Można też przelogowywać się z jednego na drugie konto w jednym oknie.
