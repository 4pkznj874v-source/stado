# STADO - prototyp gry imprezowej

## Pliki
- `index.html` - wejście do gry
- `style.css` - wygląd TV/iPad + telefon
- `app.js` - lobby, połączenia, rundy, punktacja, ustawienia, profile
- `questions.js` - 300 pytań w 10 kategoriach
- `muzyka.mp3` - techniczny loop testowy; możesz podmienić 1:1 własnym plikiem o tej samej nazwie

## Uruchomienie na GitHub Pages
Wgraj wszystkie pliki do katalogu głównego repozytorium i włącz GitHub Pages dla brancha `main`.

Na głównym urządzeniu:
1. Otwórz stronę.
2. Kliknij `UTWÓRZ GRĘ`.
3. Ustaw rundy, poziom i kategorie.
4. Utwórz pokój.
5. Gracze otwierają ten sam adres na telefonach i wpisują kod pokoju (lub korzystają z adresu `?join=KOD`).

## Łączenie telefonów
Prototyp wykorzystuje PeerJS/WebRTC i publiczny serwer sygnalizacyjny PeerJS. Nie wymaga własnego backendu. W restrykcyjnych sieciach firmowych/hotelowych WebRTC może być blokowany - docelowa wersja produkcyjna powinna mieć własny backend pokoju albo własny PeerServer/TURN.

## Tryb testowy
W lobby można dodawać owce testowe. Jeśli Baran jest botem, na ekranie hosta pojawi się przycisk `BARAN DEMO`. W fazie głosowania pojawi się `GŁOSY DEMO`.

## Punktacja
- większość: +2
- samotna Czarna Owca: +4
- dokładnie 2 osoby na opcji niebędącej większością: +1
- skuteczny Baran: +2
- skuteczny Wilk: +3
- trafiony Żeton Wełny: +1

Liczba odpowiedzi:
- 2-5 graczy: 3
- 6-8 graczy: 4
- 9-10 graczy: 5
