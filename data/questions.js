/*
  STADO - baza pytań
  Wygenerowana na podstawie:
  - Co robi stado.docx
  - Pewna owca....docx
  - Która owca.docx

  Typy:
  herd / target / which_sheep
  Źródła:
  prepared / players / sheep
*/

const STADO_QUESTIONS = {
  herdPrepared: [
    {
      id: "herd_p_001",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec zdradza stadu wielki sekret i mówi: „Tylko nikomu nie mówcie”. Co dzieje się dalej?",
      answers: [
        "Stado milczy jak grób. Czasem potrafi.",
        "Zaczyna się przesłuchanie. Sekret ma zdecydowanie za mało szczegółów.",
        "Stado natychmiast sprawdza social media. Coś musi potwierdzać tę historię.",
        "Przy następnym spotkaniu wszyscy wiedzą, o czym nie wolno mówić. Robi się niezręcznie.",
        "Po tygodniu sekret wraca do stada z zupełnie nowymi szczegółami.",
      ]
    },
    {
      id: "herd_p_002",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Stado zostaje wyrzucone z klubu za wszczęcie awantury. Co robi?",
      answers: [
        "Wskazuje najbardziej pijaną owcę. 🐑 Winny znaleziony.",
        "Próbuje negocjować z ochroną. Przecież to było nieporozumienie.",
        "Jedna owca wraca po kurtki. Wraca godzinę później.",
        "Przenosi imprezę gdzie indziej. Noc jest młoda.",
        "Stado idzie po kebaba. Są rzeczy ważniejsze niż honor.",
      ]
    },
    {
      id: "herd_p_003",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Na wspólnym wyjeździe jedna owca oznajmia: „Mam plan na cały dzień”. Jak reaguje stado?",
      answers: [
        "Bez dyskusji idzie za nią. Jedna owca planuje, reszta korzysta.",
        "Natychmiast pyta, o której jest czas na nicnierobienie.",
        "Każda owca chce iść gdzie indziej. Demokracja okazuje się błędem.",
        "Zaczyna negocjować wykreślenie połowy atrakcji. Trzy muzea to przesada.",
        "Stado gdzieś się rozprasza. Dwie owce są w kawiarni, reszty brak.",
      ]
    },
    {
      id: "herd_p_004",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec przychodzi na imprezę w stroju zdecydowanie niepasującym do okazji. Co robi stado?",
      answers: [
        "Zaczyna ploteczki, zanim owca zdąży zdjąć płaszcz.",
        "Pyta, skąd ma ten strój. Z ciekawości… oczywiście.",
        "Robi wspólne zdjęcie. Ten moment trzeba zachować.",
        "Udaje, że niczego dziwnego nie zauważyło. Pełen profesjonalizm.",
        "Jedna owca nie wytrzymuje i pyta: „Ale wiedziałaś, gdzie idziemy?”",
      ]
    },
    {
      id: "herd_p_005",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec zaczyna nagle mówić tekstami swojego nowego partnera. Co robi stado?",
      answers: [
        "Nic. Czeka, aż sama się zorientuje.",
        "Zaczyna liczyć, ile razy powie „my uważamy”.",
        "Bezpośrednio pyta: „A TY co właściwie uważasz?”.",
        "Przyjmuje nową osobowość owcy bez komentarza. Na razie.",
        "Robi z tego drinking game. Każde „my” = łyk.",
      ]
    },
    {
      id: "herd_p_006",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Stado wynajmuje wspólnie domek na weekend. Został jeden najlepszy pokój. Kto go dostaje?",
      answers: [
        "Owca, która wszystko zorganizowała. Sprawiedliwość istnieje.",
        "Najstarsza owca. Starszeństwo ma swoje przywileje.",
        "Para. Bo zaraz zaczną argumentować, że „potrzebują prywatności”.",
        "Nikt. Najlepszy pokój zostaje rozlosowany.",
        "Najszybsza owca. To stado, nie demokracja.",
      ]
    },
    {
      id: "herd_p_007",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec wraca do ex. Tego ex. Co robi stado?",
      answers: [
        "Milczy. Wszystko zostało powiedziane za pierwszym razem.",
        "Robi interwencję. Nie po to analizowaliśmy to przez pół roku.",
        "Wspiera decyzję. Serce nie sługa, niestety.",
        "Udaje zaskoczenie, choć wszyscy wiedzieli, że tak będzie.",
        "Otwiera stare screeny. Materiał dowodowy nadal aktualny.",
      ]
    },
    {
      id: "herd_p_008",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec nie pojawia się na umówionym spotkaniu i nie odpisuje. Co robi stado?",
      answers: [
        "Zamawia bez niej. Miała swoją szansę.",
        "Wysyła serię wiadomości: „ŻYJESZ?”.",
        "Zakłada najgorsze i zaczyna akcję poszukiwawczą.",
        "Daje jej spokój. Dorosła owca, poradzi sobie.",
        "Jest bardziej obrażone niż zmartwione. Szanujmy swój czas.",
      ]
    },
    {
      id: "herd_p_009",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec oznajmia, że poznała „miłość swojego życia”. Znają się od tygodnia. Co robi stado?",
      answers: [
        "Już planuje wesele. Skoro miłość, to miłość.",
        "Żąda zdjęcia. Trzeba wiedzieć, z czym mamy do czynienia.",
        "Zachowuje ostrożność. Tydzień to nawet nie okres próbny.",
        "Robi internetowy research nowej miłości. Dla bezpieczeństwa stada.",
        "Zaczyna obstawiać, ile to potrwa.",
      ]
    },
    {
      id: "herd_p_010",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec nagle zaczyna zarabiać dużo więcej niż reszta stada. Jak reaguje stado?",
      answers: [
        "Jest dumne i kibicuje. Nasza owca robi karierę!",
        "Gratuluje, ale zazdrość lekko skubie.",
        "Uznaje, że od teraz bogata owca stawia.",
        "Szuka haczyka. Taki sukces nie bierze się znikąd.",
        "Nie robi z tego afery. Owca jak owca, tylko bogatsza.",
      ]
    },
    {
      id: "herd_p_011",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec oznajmia, że rzuca pracę i zamierza „odnaleźć siebie”. Jak reaguje stado?",
      answers: [
        "Wspiera bez pytań. Niech biegnie za marzeniami!",
        "Zazdrości odwagi i zaczyna kwestionować własne życie.",
        "Próbuje przemówić jej do rozsądku. Rachunki same się nie zapłacą.",
        "Zakłada, że to chwilowy kryzys. Przejdzie jej.",
        "Zaczyna obstawiać, kiedy owca wróci do pracy.",
      ]
    },
    {
      id: "herd_p_012",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec przypadkiem wysyła na grupę wiadomość, która zdecydowanie miała trafić do jednej konkretnej owcy. Co robi stado?",
      answers: [
        "Zapada cisza. Wszyscy przeczytali, nikt „nie widział”.",
        "Natychmiast zaczyna się śledztwo: o kim była mowa?!",
        "Jedna owca próbuje zmienić temat i ratować sytuację.",
        "Stado robi z tego żart, który będzie żył latami.",
        "Ktoś robi screena. Tak na wszelki wypadek.",
      ]
    },
    {
      id: "herd_p_013",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec oznajmia, że chce przeprowadzić się za granicę. Co robi stado?",
      answers: [
        "Stado zaczyna ustalać grafik odwiedzin, zanim owca zdąży się przeprowadzić.",
        "Stado zakłada, że to plan na trzy dni.",
        "Po godzinie wszystkie owce zaczynają rozważać emigrację.",
        "Jedna owca już deklaruje, że przyjedzie na miesiąc. Bez pytania.",
        "Ktoś pyta, czy w nowym kraju łatwo założyć bar. Rozmowa szybko wymyka się spod kontroli.",
      ]
    },
    {
      id: "herd_p_014",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec ogłasza, że usuwa wszystkie social media. Co robi stado?",
      answers: [
        "Stado robi jej „pakiet offline”: memy wydrukowane na kartkach.",
        "Ktoś zaczyna wysyłać jej screeny własnych stories. „Żebyś wiedziała, co tracisz.”",
        "Jedna owca zapisuje jej wszystkie rolki „na później”. Po tygodniu ma 486 linków.",
        "Stado uznaje, że to podejrzane i rozpoczyna własne śledztwo.",
        "Ktoś zaczyna dzwonić do niej za każdym razem, gdy wydarzy się coś „ważnego w internecie”.",
        "Jedna owca jest pod wrażeniem. „Ja bym nie wytrzymała dwóch godzin.”",
        "Stado zaczyna obstawiać prawdziwy powód: drama, kryzys, romans czy nagłe oświecenie.",
        "Ktoś stwierdza, że za tym na pewno stoi nowy partner. Reszta stada natychmiast chce wiedzieć więcej.",
      ]
    },
    {
      id: "herd_p_015",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Jedna z owiec mówi, że ma dość randek i „teraz skupia się tylko na sobie”. Co robi stado?",
      answers: [
        "Podsuwa jej najlepszych kandydatów, aby ją złamać.",
        "Jedna owca zakłada się o 100 zł, że przed końcem miesiąca wydarzy się „ktoś”.",
        "Stado robi wszystko, żeby ją wesprzeć… ale przy każdym wyjściu wypatruje kandydatów.",
        "Stado uznaje, że to idealny moment na wspólny wyjazd bez randkowych dram.",
        "Stado robi drinking game: każde „nie szukam nikogo” = łyk.",
        "Jedna owca zaczyna ją pilnować na imprezach jak ochroniarz: „Nie patrz w lewo.”",
        "Ktoś pyta: „A jak poznasz miłość życia jutro, to też odmówisz?” i rozpoczyna trzydziestominutową debatę.",
      ]
    },
    {
      id: "herd_p_016",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Stado dostaje stolik tuż obok celebryty. Co robi?👀🐑",
      answers: [
        "Nic. Pełna kultura.",
        "Udaje, że nie patrzy. Patrzy.",
        "Próbuje dyskretnie zrobić zdjęcie.",
        "Rozpoznaje go dopiero po wyjściu.",
        "Zaczyna googlować, czy to na pewno on.",
        "Jedna z owiec zaczyna randomowo zagadywać jak gdyby nigdy nic.",
      ]
    }
  ],
  herdFreestyle: [
    {
      id: "herd_f_001",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec zdradza stadu wielki sekret i mówi: „Tylko nikomu nie mówcie”. Co dzieje się dalej?"
    },
    {
      id: "herd_f_002",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado zostaje wyrzucone z klubu za wszczęcie awantury. Co robi?"
    },
    {
      id: "herd_f_003",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Na wspólnym wyjeździe jedna owca oznajmia: „Mam plan na cały dzień”. Jak reaguje stado?"
    },
    {
      id: "herd_f_004",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec przychodzi na imprezę w stroju zdecydowanie niepasującym do okazji. Co robi stado?"
    },
    {
      id: "herd_f_005",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec zaczyna nagle mówić tekstami swojego nowego partnera. Co robi stado?"
    },
    {
      id: "herd_f_006",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado wynajmuje wspólnie domek na weekend. Został jeden najlepszy pokój. Kto go dostaje?"
    },
    {
      id: "herd_f_007",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec wraca do ex. Tego ex. Co robi stado?"
    },
    {
      id: "herd_f_008",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec nie pojawia się na umówionym spotkaniu i nie odpisuje. Co robi stado?"
    },
    {
      id: "herd_f_009",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec oznajmia, że poznała „miłość swojego życia”. Znają się od tygodnia. Co robi stado?"
    },
    {
      id: "herd_f_010",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec nagle zaczyna zarabiać dużo więcej niż reszta stada. Jak reaguje stado?"
    },
    {
      id: "herd_f_011",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec oznajmia, że rzuca pracę i zamierza „odnaleźć siebie”. Jak reaguje stado?"
    },
    {
      id: "herd_f_012",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec przypadkiem wysyła na grupę wiadomość, która zdecydowanie miała trafić do jednej konkretnej owcy. Co robi stado?"
    },
    {
      id: "herd_f_013",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec oznajmia, że chce przeprowadzić się za granicę. Co robi stado?"
    },
    {
      id: "herd_f_014",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec ogłasza, że usuwa wszystkie social media. Co robi stado?"
    },
    {
      id: "herd_f_015",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado dostaje stolik tuż obok celebryty. Co robi?👀🐑"
    },
    {
      id: "herd_f_016",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Jedna z owiec mówi, że ma dość randek i „teraz skupia się tylko na sobie”. Co robi stado?"
    },
    {
      id: "herd_f_017",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado wynajmuje wspólnie domek na odludziu. Pierwszego wieczoru zaczynają dziać się dziwne rzeczy. Co robi stado?"
    },
    {
      id: "herd_f_018",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia urządzić wspólną kolację, na którą każdy ma coś przynieść. Co mogło pójść nie tak?"
    },
    {
      id: "herd_f_019",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado trafia do miasta, którego kompletnie nie zna, a wszystkie telefony są prawie rozładowane. Co dzieje się dalej?"
    },
    {
      id: "herd_f_020",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado dostaje zaproszenie na bardzo eleganckie wydarzenie. Jak kończy się ten wieczór?"
    },
    {
      id: "herd_f_021",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia wspólnie zrobić coś „spontanicznego”. Co z tego wychodzi?"
    },
    {
      id: "herd_f_022",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado wybiera się na weekendowy wyjazd bez żadnego planu. Jak wygląda drugi dzień?"
    },
    {
      id: "herd_f_023",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado jedzie razem samochodem przez kilka godzin. Co jest pierwszym źródłem konfliktu?"
    },
    {
      id: "herd_f_024",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia zrobić jedno idealne wspólne zdjęcie. Co dzieje się po 40 minutach?"
    },
    {
      id: "herd_f_025",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado trafia przypadkiem na imprezę, na którą właściwie nie było zaproszone. Co robi?"
    },
    {
      id: "herd_f_026",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado próbuje wspólnie ugotować danie, którego nikt wcześniej nie robił. Co powstaje?"
    },
    {
      id: "herd_f_027",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado ma wspólnie wybrać jedną restaurację. Jak długo trwa decyzja i czym się kończy?"
    },
    {
      id: "herd_f_028",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado orientuje się, że zgubiło drogę podczas wyjazdu. Jak wygląda dalsza część wyprawy?"
    },
    {
      id: "herd_f_029",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia spędzić cały dzień bez telefonów. Co mogło pójść nie tak?"
    },
    {
      id: "herd_f_030",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado znajduje bardzo dziwny przedmiot w wynajętym apartamencie. Co dzieje się dalej?"
    },
    {
      id: "herd_f_031",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado dostaje wspólnie nieoczekiwany prezent. Co z nim robi?"
    },
    {
      id: "herd_f_032",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado bierze udział w escape roomie. Po 20 minutach sytuacja zaczyna wymykać się spod kontroli. Co się dzieje?"
    },
    {
      id: "herd_f_033",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia zrobić wspólne zakupy „tylko na chwilę”. Z czym wraca?"
    },
    {
      id: "herd_f_034",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado wybiera się na jednodniową wycieczkę. Na miejscu okazuje się, że wszystko jest zamknięte. Co robi?"
    },
    {
      id: "herd_f_035",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado ma godzinę na przygotowanie niespodzianki dla znajomego. Jak wygląda efekt końcowy?"
    },
    {
      id: "herd_f_036",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado próbuje wspólnie złożyć mebel bez instrukcji. Co dzieje się po dwóch godzinach?"
    },
    {
      id: "herd_f_037",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado trafia na karaoke i ustala, że „tylko popatrzy”. Jak kończy się wieczór?"
    },
    {
      id: "herd_f_038",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia wspólnie zacząć nowe hobby. Jak długo trwa entuzjazm?"
    },
    {
      id: "herd_f_039",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado organizuje grilla. Pogoda nagle całkowicie się psuje. Co robi?"
    },
    {
      id: "herd_f_040",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado znajduje świetną promocję na coś, czego absolutnie nie potrzebuje. Co dzieje się dalej?"
    },
    {
      id: "herd_f_041",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado ma wspólnie wybrać prezent dla osoby, której prawie nie zna. Co kupuje?"
    },
    {
      id: "herd_f_042",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado jedzie na wakacje i okazuje się, że rezerwacja wygląda zupełnie inaczej niż na zdjęciach. Co robi?"
    },
    {
      id: "herd_f_043",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado zaczyna grać w planszówkę, która miała być „luźną zabawą”. Jak wygląda atmosfera godzinę później?"
    },
    {
      id: "herd_f_044",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado orientuje się po wyjściu z restauracji, że nikt nie pamięta, kto zapłacił rachunek. Co się dzieje?"
    },
    {
      id: "herd_f_045",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado ma wspólnie zdecydować, co robić w sobotni wieczór. Do czego ostatecznie dochodzi?"
    },
    {
      id: "herd_f_046",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado trafia na lokalną atrakcję, która okazuje się dużo dziwniejsza, niż sugerował opis. Co dzieje się dalej?"
    },
    {
      id: "herd_f_047",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado kupuje coś wspólnie „na później”. Po pół roku nikt nie pamięta, po co. Co to było?"
    },
    {
      id: "herd_f_048",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia zrobić sobie spokojny wieczór. Co sprawia, że przestaje być spokojny?"
    },
    {
      id: "herd_f_049",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado ma dotrzeć na ważne wydarzenie punktualnie. Co mogło pójść nie tak?"
    },
    {
      id: "herd_f_050",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado wybiera się na spacer, który miał trwać 20 minut. Gdzie jest trzy godziny później?"
    },
    {
      id: "herd_f_051",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia zrobić wspólną kapsułę czasu. Co do niej trafia?"
    },
    {
      id: "herd_f_052",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado znajduje w domku starą księgę gości z bardzo dziwnymi wpisami. Co robi dalej?"
    },
    {
      id: "herd_f_053",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado zamawia jedzenie dla wszystkich. Dostawa przyjeżdża, ale kompletnie nie zgadza się z zamówieniem. Co robi?"
    },
    {
      id: "herd_f_054",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado ma jedno popołudnie, żeby wydać 1000 zł na coś kompletnie niepraktycznego. Na co je wydaje?"
    },
    {
      id: "herd_f_055",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado dostaje możliwość wystąpienia w telewizji. Co mogłoby pójść nie tak?"
    },
    {
      id: "herd_f_056",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Stado postanawia urządzić tematyczną imprezę. Jak temat wymyka się spod kontroli?"
    }
  ],
  targetPrepared: [
    {
      id: "target_p_001",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado jedzie razem na wakacje. Na lotnisku okazuje się, że lot został odwołany. Co robi [PLAYER]? ✈️🐑",
      answers: [
        "Już stoi w kolejce do obsługi. Nie wie, po co, ale inni stoją.",
        "Otwiera laptopa. „Dobra, ja to ogarnę.”",
        "Idzie coś zjeść. Kryzys kryzysem, ale są priorytety.",
        "Znajduje alternatywny lot z trzema przesiadkami. Jest tańszy o 14 zł.",
        "Zaprzyjaźnia się z obsługą. Po godzinie zna powód odwołania lotu i dwie afery z pracy.",
        "Zaczyna robić ranking najgorzej ubranych ludzi na terminalu. Stado szybko się angażuje. 😂",
      ]
    },
    {
      id: "target_p_002",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado budzi się rano po imprezie i odkrywa, że brakuje jednej owcy. Gdzie jest [PLAYER]? 🐑",
      answers: [
        "W innym mieście. Szczegóły są niejasne.",
        "Na kanapie u obcych ludzi. Zna już całą ich historię rodzinną.",
        "W całodobowym sklepie. Pilnuje czyjegoś psa.",
        "Na spacerze z psem. Nie ma psa.",
        "W pokoju obok. Stado po prostu źle szukało. 😂",
        "Na siłowni. Stado zaczyna się jej bać.",
      ]
    },
    {
      id: "target_p_003",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado organizuje wspólną kolację. Każdy miał coś przynieść. [PLAYER] pojawia się z… 🍕🐑",
      answers: [
        "Trzema butelkami wina. Jedzenia brak.",
        "Niczym. Ale za to z ogromnym apetytem.",
        "Sześcioma różnymi serami i absolutnie żadnym planem, co z nimi zrobić.",
        "Dwoma opakowaniami pierogów z marketu.",
        "Wielkim garnkiem czegoś, czego nikt nie potrafi rozpoznać. „Spróbujcie najpierw.”",
        "Ostrym sosem. To wszystko. „Reszta była chyba po waszej stronie.”",
        "Lodami. Kolacja jeszcze się nie zaczęła, ale [IMIĘ OWCY] już otworzyła pudełko.",
      ]
    },
    {
      id: "target_p_004",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Wspólny wyjazd. Każdy ma spakować się do jednej walizki. Jak wygląda bagaż [PLAYER]? 🧳🐑",
      answers: [
        "Wszystko w organizerach i opisanych woreczkach.",
        "Pięć minut przed wyjazdem nadal wrzuca rzeczy do torby.",
        "Ma cztery pary butów na trzy dni.",
        "Ma więcej kabli niż ubrań.",
        "Przez cały wyjazd chodzi w jednym zestawie.",
        "Zabiera suszarkę, prostownicę, lokówkę i sprzęt, którego nikt nie potrafi nazwać.",
        "Zabiera własny czajnik. Nikt nie pyta dlaczego.",
      ]
    },
    {
      id: "target_p_005",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado ma wspólnie ugotować kolację według przepisu. Co robi [PLAYER]? 👩‍🍳🐑",
      answers: [
        "Obiera jedną cebulę przez 25 minut.",
        "Znika w tajemniczych okolicznościach. Pojawia się, kiedy kolacja jest gotowa.",
        "Wyjada składniki potrzebne do przepisu.",
        "Udaje, że się krząta, ale w zasadzie nie robi nic.",
        "Odmierza wszystkie składniki co do grama.",
        "Pyta o wszystko ChatGPT.",
        "Postanawia „ulepszyć” przepis i dodaje składnik, którego absolutnie nie powinno tam być.",
        "Robi sobie drinka „do gotowania” i po 20 minutach jest bardziej zaangażowana w drinka niż w kolację.",
      ]
    },
    {
      id: "target_p_006",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado jedzie pociągiem. Ktoś siedzi na miejscu [PLAYER]. Co się dzieje? 🚆🐑",
      answers: [
        "Grzecznie pokazuje bilet. Sprawa zamknięta w 15 sekund.",
        "Boi się zwrócić uwagę. Postanawia stać. Całe trzy godziny.",
        "Pyta konduktora. Nie będzie negocjować.",
        "Robi z tego wydarzenie dla całego wagonu. Po chwili trzy osoby próbują ustalić, kto właściwie gdzie siedzi.",
        "Stoi obok siedzenia w milczeniu, licząc, że człowiek sam się domyśli.",
        "Wchodzi w 20-minutową dyskusję o numeracji miejsc, systemie rezerwacji i sensie istnienia wagonów.",
      ]
    },
    {
      id: "target_p_007",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado ma rano wymeldować się z hotelu o 10:00. Jest 9:48. Co robi [PLAYER]? ⏰🐑",
      answers: [
        "Pyta wszystkich, czy mogą jej coś dopakować„ bo ma jeszcze trochę rzeczy”. Tych rzeczy jest dużo.",
        "Zdezorientowana pyta: To my dzisiaj wyjeżdżamy?!",
        "Jest spakowana od 8:30 i czeka przy drzwiach.",
        "Mówi: „Spokojnie, mamy jeszcze 12 minut”, tonem osoby, która nie rozumie sytuacji.",
        "Szuka ładowarki. Potem telefonu. Potem znowu ładowarki.",
      ]
    },
    {
      id: "target_p_008",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado jedzie na wesele. [PLAYER] dowiaduje się, że siedzi przy stole z kompletnie obcymi ludźmi. Co robi? 💍🐑",
      answers: [
        "Po 10 minutach zna już wszystkich po imieniu.",
        "Próbuje się zamienić miejscem.",
        "Siedzi grzecznie i czeka, aż ktoś pierwszy zagada.",
        "Po drugim drinku jest już duszą stołu.",
        "Zaczyna analizować, kto jest z czyjej strony rodziny.",
        "Wraca do swojego stada co siedem minut.",
      ]
    },
    {
      id: "target_p_009",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "[PLAYER] przypadkiem słyszy, jak ktoś obok plotkuje o kimś znajomym. Co robi? 👀🐑",
      answers: [
        "Udaje, że nie słyszy. Słyszy każde słowo.",
        "Natychmiast pisze na grupie: „MAM INFO”.",
        "Próbuje dyskretnie dowiedzieć się więcej.",
        "Odchodzi, bo nie chce się mieszać.",
        "Zapamiętuje wszystko. Na później.",
        "Po chwili przypadkiem włącza się do rozmowy.",
      ]
    },
    {
      id: "target_p_010",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado ma zrobić wspólne zdjęcie z samowyzwalacza. Co robi [PLAYER]? 📸🐑",
      answers: [
        "Ustawia telefon idealnie za pierwszym razem.",
        "Biegnie i przewraca coś po drodze.",
        "Za każdym razem stoi w złym miejscu.",
        "Ma zamknięte oczy na wszystkich zdjęciach.",
        "Po 20 próbach mówi: „Dobra, mamy.” Nie mamy.",
        "Robi jedno przypadkowe zdjęcie, które wychodzi najlepiej.",
      ]
    },
    {
      id: "target_p_011",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "[PLAYER] ma wolną sobotę bez żadnych planów. Co robi? 🛋️🐑",
      answers: [
        "Ma już listę 12 rzeczy do załatwienia.",
        "Nie robi absolutnie nic i jest z tego dumna.",
        "Idzie „tylko na kawę” i wraca wieczorem.",
        "Zaczyna sprzątać jedną szufladę i kończy na przemeblowaniu mieszkania.",
        "Otwiera Netflixa i przez godzinę wybiera.",
        "Robi spontaniczne zakupy.",
      ]
    },
    {
      id: "target_p_012",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado idzie na koncert. [PLAYER] nagle znika. Gdzie jest? 🎤🐑",
      answers: [
        "Pod samą sceną.",
        "W kolejce po drinka.",
        "Rozmawia z obcymi ludźmi.",
        "Szuka toalety od 20 minut.",
        "Na scenie z główną gwiazdą. Nikt nie pyta.",
        "Stoi dokładnie tam, gdzie była. To reszta stada się zgubiła.",
      ]
    },
    {
      id: "target_p_013",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado trafia do bardzo eleganckiej restauracji. Co robi [PLAYER]? 🍷🐑",
      answers: [
        "Zachowuje się, jakby jadała tam co tydzień.",
        "Googluje pod stołem, jak używać którego widelca.",
        "Zamawia coś, czego nie potrafi wymówić.",
        "Pyta, czy mają frytki.",
        "Fotografuje każdy talerz.",
        "Po wyjściu mówi: „Dobre, ale kebab też by zrobił robotę.”",
      ]
    },
    {
      id: "target_p_014",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "[PLAYER] przypadkiem wygrywa konkurs, do którego zgłosiła się dla żartu. Co robi? 🏆🐑",
      answers: [
        "Zachowuje się, jakby od początku wierzyła w zwycięstwo.",
        "Jest przekonana, że zaszła pomyłka.",
        "Natychmiast robi z tego wydarzenie roku.",
        "Nie pamięta nawet, jaka była nagroda.",
        "Dzwoni do całego stada.",
        "Zaczyna się zastanawiać, czy jednak ma ukryty talent.",
      ]
    },
    {
      id: "target_p_015",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado postanawia przez miesiąc oszczędzać. Po czterech dniach [PLAYER]…",
      answers: [
        "Sprzedała pół szafy. Teraz chodzi w tych samych trzech rzeczach i ma więcej pieniędzy niż całe stado.",
        "Założyła „mały biznes na boku”. Cztery dni później ma logo, cennik, klientów i plany ekspansji.",
        "Poszła do kasyna „tylko zobaczyć”. Wróciła z wygraną i niebezpiecznie wysoką samooceną.",
        "Wyciąga spod łóżka reklamówkę pełną gotówki. Odmawia odpowiedzi na dalsze pytania.",
        "Wzięła dodatkową robotę na weekend. W poniedziałek układa już grafik pozostałym pracownikom.",
        "Kupiła coś za 20 zł na pchlim targu i sprzedała za",
      ]
    },
    {
      id: "target_p_016",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Stado robi generalne porządki. Co znajduje [PLAYER], przez co sprzątanie natychmiast się kończy?",
      answers: [
        "Stary album ze zdjęciami. Po chwili nikt już nie sprząta, bo trwa ranking najgorszych fryzur w historii stada.",
        "Pudełko z pamiątkami po byłych. W pięć minut powstaje tablica dowodowa i trzy nowe teorie.",
        "Kopertę z pieniędzmi, o której kompletnie zapomniała. Uznaje to za przychód i natychmiast idzie to uczcić zakupami.",
        "Starą konsolę do gier. „Tylko sprawdzimy, czy działa.” Trzy godziny później dalej sprawdzają.",
        "Pamiętnik z czasów szkoły. Po pierwszej stronie stado wie, że dziś nic więcej nie zostanie posprzątane.",
        "Torbę ubrań sprzed dziesięciu lat. Zaczyna się pokaz mody, a część stylizacji niespodziewanie wraca do szafy.",
        "Stary telefon. 847 zdjęć, 63 notatki i jedno nazwisko, po którym wszyscy nagle milkną. 😭",
      ]
    },
    {
      id: "target_p_017",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Trafiacie na pchli targ. Z czym wraca [PLAYER]?",
      answers: [
        "Z mieczem dekoracyjnym. Od tej pory otwiera nim paczki.",
        "Z wypchanym bażantem. Nikt nie pamięta momentu, w którym zapadła ta decyzja.",
        "Z dzwonem okrętowym. Teraz dzwoni nim, kiedy chce zwrócić uwagę stada.",
        "Z pudełkiem 80 starych kluczy. Twierdzi, że „przydadzą się do projektu artystycznego”.",
        "Z rogiem myśliwskim. Testuje go jeszcze na parkingu.",
      ]
    },
    {
      id: "target_p_018",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Jedziecie na weekend do domku w lesie. Po godzinie znika [PLAYER]. Gdzie ją znajdują?",
      answers: [
        "W jeziorze. Morsuje, bo przeczytała, że „to dobrze robi na odporność”.",
        "Na wzgórzu z telefonem nad głową. Szuka jednej kreski Wi-Fi.",
        "Śpi w hamaku. Wyjazd integracyjny zakończył się dla niej po 17 minutach.",
        "Trzy kilometry dalej. Zaczęła „tylko spacer”, a teraz zwiedza kapliczkę, młyn i lokalne muzeum.",
        "W lesie z kozą na smyczy.",
        "U sąsiadów. Poszła zapytać o drewno, wraca z ciastem i zaproszeniem na kolację.",
        "Na pomoście z lornetką. Od pół godziny obserwuje coś, czego nikt poza nią nie widzi.",
        "Przy tablicy z mapą szlaków. Już zaplanowała trasę na 26 km i nie rozumie, czemu stado protestuje",
        "W lokalnym sklepie 5 km dalej. Poszła po jedną rzecz i „jakoś tak wyszło”.",
      ]
    }
  ],
  targetFreestyle: [
    {
      id: "target_f_001",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado jedzie razem na wakacje. Na lotnisku okazuje się, że lot został odwołany. Co robi [PLAYER]? ✈️🐑"
    },
    {
      id: "target_f_002",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado budzi się rano po imprezie i odkrywa, że brakuje jednej owcy. Gdzie jest [PLAYER]? 🐑"
    },
    {
      id: "target_f_003",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado organizuje wspólną kolację. Każdy miał coś przynieść. [PLAYER] pojawia się z… 🍕🐑"
    },
    {
      id: "target_f_004",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Wspólny wyjazd. Każdy ma spakować się do jednej walizki. Jak wygląda bagaż [PLAYER]? 🧳🐑"
    },
    {
      id: "target_f_005",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado ma wspólnie ugotować kolację według przepisu. Co robi [PLAYER]? 👩‍🍳🐑"
    },
    {
      id: "target_f_006",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado jedzie pociągiem. Ktoś siedzi na miejscu [PLAYER]. Co się dzieje? 🚆🐑"
    },
    {
      id: "target_f_007",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado ma rano wymeldować się z hotelu o 10:00. Jest 9:48. Co robi [PLAYER]? ⏰🐑"
    },
    {
      id: "target_f_008",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado jedzie na wesele. [PLAYER] dowiaduje się, że siedzi przy stole z kompletnie obcymi ludźmi. Co robi? 💍🐑"
    },
    {
      id: "target_f_009",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] przypadkiem słyszy, jak ktoś obok plotkuje o kimś znajomym. Co robi? 👀🐑"
    },
    {
      id: "target_f_010",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado ma zrobić wspólne zdjęcie z samowyzwalacza. Co robi [PLAYER]? 📸🐑"
    },
    {
      id: "target_f_011",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma wolną sobotę bez żadnych planów. Co robi? 🛋️🐑"
    },
    {
      id: "target_f_012",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado idzie na koncert. [PLAYER] nagle znika. Gdzie jest? 🎤🐑"
    },
    {
      id: "target_f_013",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado trafia do bardzo eleganckiej restauracji. Co robi [PLAYER]? 🍷🐑"
    },
    {
      id: "target_f_014",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] przypadkiem wygrywa konkurs, do którego zgłosiła się dla żartu. Co robi? 🏆🐑"
    },
    {
      id: "target_f_015",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado postanawia przez miesiąc oszczędzać. Po czterech dniach [PLAYER]…"
    },
    {
      id: "target_f_016",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado robi generalne porządki. Co znajduje [PLAYER], przez co sprzątanie natychmiast się kończy?"
    },
    {
      id: "target_f_017",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Trafiacie na pchli targ. Z czym wraca [PLAYER]?"
    },
    {
      id: "target_f_018",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Jedziecie na weekend do domku w lesie. Po godzinie znika [PLAYER]. Gdzie ją znajdują?"
    },
    {
      id: "target_f_019",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado ma godzinę wolnego w galerii handlowej. Gdzie idzie [PLAYER]? 🛍️🐑"
    },
    {
      id: "target_f_020",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje przez pomyłkę paczkę, której nie zamawiała. Co robi? 📦🐑"
    },
    {
      id: "target_f_021",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado wybiera się na plażę. Co [PLAYER] zabiera ze sobą? 🏖️🐑"
    },
    {
      id: "target_f_022",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje do ręki mikrofon podczas karaoke. Co dzieje się dalej? 🎤🐑"
    },
    {
      id: "target_f_023",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado idzie do escape roomu. Jaką rolę przejmuje [PLAYER]? 🔐🐑"
    },
    {
      id: "target_f_024",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] znajduje na ulicy 100 zł. Co robi? 💸🐑"
    },
    {
      id: "target_f_025",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado jedzie na jednodniową wycieczkę. Po 20 minutach zaczyna padać ulewny deszcz. Co robi [PLAYER]? 🌧️🐑"
    },
    {
      id: "target_f_026",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma przygotować prezent dla osoby, której prawie nie zna. Co kupuje? 🎁🐑"
    },
    {
      id: "target_f_027",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado dostaje dostęp do hotelowego bufetu „jesz, ile chcesz”. Jak zachowuje się [PLAYER]? 🥐🐑"
    },
    {
      id: "target_f_028",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma pięć minut, żeby opuścić mieszkanie. Co jeszcze robi przed wyjściem? 🚪🐑"
    },
    {
      id: "target_f_029",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado jedzie samochodem przez sześć godzin. Czym zajmuje się [PLAYER]? 🚗🐑"
    },
    {
      id: "target_f_030",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje możliwość kupienia jednej kompletnie niepotrzebnej rzeczy bez patrzenia na cenę. Co wybiera? 💳🐑"
    },
    {
      id: "target_f_031",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado nocuje w hotelu, w którym podobno straszy. Co robi [PLAYER]? 👻🐑"
    },
    {
      id: "target_f_032",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] orientuje się w restauracji, że zamówiła coś zupełnie innego, niż myślała. Co robi? 🍽️🐑"
    },
    {
      id: "target_f_033",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado trafia na imprezę tematyczną, ale [PLAYER] źle zrozumiała motyw przewodni. Jak wygląda? 🎭🐑"
    },
    {
      id: "target_f_034",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma przez jeden dzień opiekować się cudzym psem. Jak kończy się ten dzień? 🐕🐑"
    },
    {
      id: "target_f_035",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma przez godzinę zajmować się dzieckiem znajomych. Jak wygląda ta godzina? 🧸🐑"
    },
    {
      id: "target_f_036",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje voucher na dowolne nowe hobby. Co wybiera? 🎨🐑"
    },
    {
      id: "target_f_037",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado ma wspólnie złożyć mebel. Co robi [PLAYER]? 🪛🐑"
    },
    {
      id: "target_f_038",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] przez przypadek zostaje sama z telefonem całego stada i możliwością puszczania muzyki. Co włącza? 🎶🐑"
    },
    {
      id: "target_f_039",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje zaproszenie na imprezę z motywem „przyjdź przebrany za coś, czego się boisz”. Jak przychodzi? 👻🐑"
    },
    {
      id: "target_f_040",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] zostaje wpuszczona do sklepu pięć minut przed zamknięciem. Z czym wychodzi? 🛒🐑"
    },
    {
      id: "target_f_041",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado ma wspólnie stworzyć hasło reklamowe. Co proponuje [PLAYER]? 📣🐑"
    },
    {
      id: "target_f_042",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma przygotować playlistę na wspólny wyjazd. Jak wygląda ta playlista? 🎧🐑"
    },
    {
      id: "target_f_043",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado wybiera się do aquaparku. Gdzie po godzinie jest [PLAYER]? 🌊🐑"
    },
    {
      id: "target_f_044",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] przez przypadek trafia na warsztaty, na które wcale się nie zapisywała. Co robi? 🧶🐑"
    },
    {
      id: "target_f_045",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado ma wspólnie wybrać film. Co proponuje [PLAYER]? 🍿🐑"
    },
    {
      id: "target_f_046",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] znajduje w szafie ubranie, którego nie widziała od dziesięciu lat. Co robi? 👗🐑"
    },
    {
      id: "target_f_047",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado zatrzymuje się na stacji benzynowej „tylko na chwilę”. Z czym wraca [PLAYER]? ⛽🐑"
    },
    {
      id: "target_f_048",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] budzi się rano i odkrywa w telefonie 37 zdjęć z poprzedniego wieczoru, których nie pamięta. Co jest na zdjęciach? 📱🐑"
    },
    {
      id: "target_f_049",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado idzie na targ staroci. [PLAYER] znajduje rzecz, którą „musi mieć”. Co to jest? 🗝️🐑"
    },
    {
      id: "target_f_050",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje możliwość nazwania nowego drinka w barze. Jak go nazywa? 🍸🐑"
    },
    {
      id: "target_f_051",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado trafia do ogromnego sklepu meblowego. Gdzie po godzinie znajduje się [PLAYER]? 🛋️🐑"
    },
    {
      id: "target_f_052",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje możliwość prowadzenia audycji radiowej przez 15 minut. O czym mówi? 📻🐑"
    },
    {
      id: "target_f_053",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] znajduje na ulicy bardzo dziwny przedmiot bez właściciela. Co to jest i co z nim robi? 👀🐑"
    },
    {
      id: "target_f_054",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma urządzić pokój za 500 zł. Na co wydaje większość budżetu? 🪑🐑"
    },
    {
      id: "target_f_055",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado trafia na lokalny konkurs talentów. Z czym zgłasza się [PLAYER]? 🎭🐑"
    },
    {
      id: "target_f_056",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado jedzie na grzyby. Co po dwóch godzinach ma w koszyku [PLAYER]? 🍄🐑"
    },
    {
      id: "target_f_057",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma przez jeden dzień pracować w zupełnie innym zawodzie. Jaki wybiera? 💼🐑"
    },
    {
      id: "target_f_058",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado bierze udział w kursie pierwszej pomocy. Jak radzi sobie [PLAYER]? 🚑🐑"
    },
    {
      id: "target_f_059",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "IMIĘ OWCY] dostaje możliwość zaprojektowania własnego banknotu. Co się na nim znajduje? 💸🐑"
    },
    {
      id: "target_f_060",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma wybrać jedną rzecz, którą zabierze na bezludną wyspę. Co wybiera? 🏝️🐑"
    },
    {
      id: "target_f_061",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje możliwość stworzenia własnego programu telewizyjnego. O czym jest? 📺🐑"
    },
    {
      id: "target_f_062",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado znajduje automat z losowymi nagrodami. Co trafia się [PLAYER]? 🎁🐑"
    },
    {
      id: "target_f_063",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado trafia do sklepu z kostiumami. W czym wychodzi [PLAYER]? 🎩🐑"
    },
    {
      id: "target_f_064",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje dostęp do wielkiego magazynu pełnego przypadkowych rzeczy. Co zabiera? 📦🐑"
    },
    {
      id: "target_f_065",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma stworzyć własne święto. Jak się nazywa i jak się je obchodzi? 🎉🐑"
    },
    {
      id: "target_f_066",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma stworzyć własny smak lodów. Co wymyśla? 🍦🐑"
    },
    {
      id: "target_f_067",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje na jeden dzień dostęp do luksusowego samochodu. Co robi jako pierwsze? 🏎️🐑"
    },
    {
      id: "target_f_068",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado trafia na wystawę sztuki współczesnej. Przy której pracy zatrzymuje się [PLAYER]? 🖼️🐑"
    },
    {
      id: "target_f_069",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje możliwość wymyślenia nowej dyscypliny sportowej. Na czym polega? 🏅🐑"
    },
    {
      id: "target_f_070",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma wymyślić hasło na koszulkę dla całego stada. Co proponuje? 👕🐑"
    },
    {
      id: "target_f_071",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje możliwość spędzenia jednej nocy w dowolnym nietypowym miejscu. Gdzie wybiera? 🌙🐑"
    },
    {
      id: "target_f_072",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado bierze udział w kursie barmańskim. Jaki drink tworzy [PLAYER]? 🍸🐑"
    },
    {
      id: "target_f_073",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma zaprojektować własny znak drogowy. Co oznacza? 🚧🐑"
    },
    {
      id: "target_f_074",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] wygrywa możliwość spędzenia dnia jako VIP na dowolnym wydarzeniu. Co wybiera? 🎟️🐑"
    },
    {
      id: "target_f_075",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma stworzyć własny produkt, którego nikt jeszcze nie wymyślił. Co to jest? 💡🐑"
    },
    {
      id: "target_f_076",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] przypadkiem zostaje bohaterem lokalnych wiadomości. Co zrobiła? 📺🐑"
    },
    {
      id: "target_f_077",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] ma wymyślić nową atrakcję do parku rozrywki. Na czym polega?"
    },
    {
      id: "target_f_078",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje możliwość stworzenia własnej restauracji. Co jest jej specjalnością? 🍽️🐑"
    },
    {
      id: "target_f_079",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje jedną supermoc. Jaką wybiera? ⚡🐑"
    },
    {
      id: "target_f_080",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado budzi się i odkrywa, że trafiło do średniowiecza. Co jako pierwsze robi [PLAYER]? 🏰🐑"
    },
    {
      id: "target_f_081",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje własnego smoka. Jak go nazywa i do czego go wykorzystuje? 🐉🐑"
    },
    {
      id: "target_f_082",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado trafia na bezludną wyspę. Jaką rolę spontanicznie przejmuje [PLAYER]? 🏝️🐑"
    },
    {
      id: "target_f_083",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] znajduje lampę z dżinem i dostaje trzy życzenia. Jakie jest pierwsze? 🧞🐑"
    },
    {
      id: "target_f_084",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado odkrywa portal prowadzący do innego świata. Co robi [PLAYER]? 🌀🐑"
    },
    {
      id: "target_f_085",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] zostaje monarchą niewielkiego królestwa na jeden dzień. Jaka jest jej pierwsza decyzja? 👑🐑"
    },
    {
      id: "target_f_086",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado zostaje załogą statku pirackiego. Jakie stanowisko zajmuje [PLAYER]? 🏴‍☠️🐑"
    },
    {
      id: "target_f_087",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] dostaje możliwość podróży w czasie, ale tylko raz. Dokąd leci? ⏳🐑"
    },
    {
      id: "target_f_088",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado ląduje na obcej planecie. Co najbardziej interesuje [PLAYER]? 👽🐑"
    },
    {
      id: "target_f_089",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] znajduje magiczny przedmiot. Jaką ma moc? ✨🐑"
    },
    {
      id: "target_f_090",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado zostaje zamknięte w ogromnym muzeum na całą noc. Gdzie idzie [PLAYER]? 🏛️🐑"
    },
    {
      id: "target_f_091",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] zostaje czarodziejem i może nauczyć się tylko jednego zaklęcia. Jakiego? 🪄🐑"
    },
    {
      id: "target_f_092",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado dowiaduje się, że za godzinę nastąpi koniec świata. Co robi [PLAYER]? ☄️🐑"
    },
    {
      id: "target_f_093",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] może przenieść się na jeden dzień do dowolnej epoki historycznej. Którą wybiera? 🕰️🐑"
    },
    {
      id: "target_f_094",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Stado trafia do świata, w którym wszystkie zwierzęta potrafią mówić. Z kim jako pierwszym zaprzyjaźnia się [PLAYER]? 🦊🐑"
    },
    {
      id: "target_f_095",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "[PLAYER] znajduje przycisk z napisem „NIE NACISKAĆ”. Co robi? 🔴🐑"
    }
  ],
  whichSheep: [
    {
      id: "which_001",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Zostaliście wyrzuceni z klubu. Która owca mogła zrobić przypał? 🪩🐑"
    },
    {
      id: "which_002",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś wrócił do hotelu z obcym psem. Kto mógł to zrobić?"
    },
    {
      id: "which_003",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś przekonał całe stado, że „jeszcze jeden drink” to dobry pomysł. Która owca tak powiedziała?"
    },
    {
      id: "which_004",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś zaczął tańczyć z kompletnie obcą grupą i po godzinie był już częścią ich ekipy. Kogo obstawiacie?"
    },
    {
      id: "which_005",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna z owiec mówiła, że przyjedzie na imprezę o piątej. Jest siódma a jej nadal nie ma. O którą owcę chodzi?"
    },
    {
      id: "which_006",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś przez przypadek zabrał cudzą walizkę z taśmy na lotnisku. Która owca mogła to zrobić? ✈️"
    },
    {
      id: "which_007",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna z owiec upiera się, że „to tylko 10 minut spacerem”. Po 45 minutach nadal idziecie. Kto to powiedział?"
    },
    {
      id: "which_008",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś wyszedł tylko po mleko i wrócił z zakupami za 600 zł. Która owca? 🛒"
    },
    {
      id: "which_009",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś zamówił jedzenie z restauracji oddalonej o 200 metrów od domu. Kto mógł to zrobić?"
    },
    {
      id: "which_010",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna owca kupiła sprzęt do nowego hobby za tysiąc złotych, zanim w ogóle spróbowała tego hobby. Która?"
    },
    {
      id: "which_011",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś ma 37 nieprzeczytanych wiadomości i twierdzi, że „odpisze później”. O którą owcę chodzi?"
    },
    {
      id: "which_012",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna z owiec odkłada jedno zadanie od trzech miesięcy, choć zajęłoby jej pięć minut. Kto to?"
    },
    {
      id: "which_013",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś położył telefon w „bezpiecznym miejscu” i teraz nikt nie może go znaleźć. Która owca?"
    },
    {
      id: "which_014",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Na parkingu ktoś dostał mandat, mimo że parkomat stał dwa metry dalej. Która owca mogła to zrobić? 🚗"
    },
    {
      id: "which_015",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś mówi, że nie jest głodny, a potem wyjada połowę frytek wszystkim przy stole. Kto to?"
    },
    {
      id: "which_016",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna owca fotografuje jedzenie tak długo, że reszta zaczyna jeść zimne. O którą owcę chodzi?"
    },
    {
      id: "which_017",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś zamawia deser „na stół”, ale zjada większość sam. Która owca?"
    },
    {
      id: "which_018",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Od trzech lat wybiera idealne auto. Ma 27 zapisanych modeli, 14 porównań i nadal nic nie kupiła. Która owca? 🚗🐑"
    },
    {
      id: "which_019",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś wchodzi do sklepu „tylko popatrzeć” i wychodzi z trzema torbami. O którą owcę chodzi? 🛍️"
    },
    {
      id: "which_020",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna z owiec ma w telefonie przypałowe zdjęcia praktycznie każdego ze stada. Która? 📸"
    },
    {
      id: "which_021",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś zawsze mówi „już jadę”, będąc jeszcze w ręczniku. Która owca?"
    },
    {
      id: "which_022",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna owca zna kaloryczność rzeczy, o które nikt nigdy nie pytał. O kogo chodzi?"
    },
    {
      id: "which_023",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś zaczyna się śmiać podczas poważnej rozmowy i nie potrafi już przestać. Która owca?"
    },
    {
      id: "which_024",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś kupuje bilety, rezerwuje stolik i ogarnia logistykę, zanim reszta zdąży odpowiedzieć na grupie. Która owca?"
    },
    {
      id: "which_025",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "edna z owiec ma 183 otwarte zakładki w przeglądarce i twierdzi, że każda jest potrzebna. Kto?"
    },
    {
      id: "which_026",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś potrafi znaleźć promocję, kod rabatowy i cashback do rzeczy, której nikt nie planował kupować. Która owca?"
    },
    {
      id: "which_027",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś ustawia pięć budzików i ignoruje wszystkie. Która owca?"
    },
    {
      id: "which_028",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś pamięta każdą kompromitującą historię stada z ostatnich dziesięciu lat. Która owca"
    },
    {
      id: "which_029",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna owca potrafi zrobić 30 tysięcy kroków, wejść na punkt widokowy i jeszcze zaproponować zachód słońca po drugiej stronie miasta. Kto to?"
    },
    {
      id: "which_030",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś zawsze ma przy sobie leki, plaster, ładowarkę, chusteczki i coś do jedzenia. Która owca?"
    },
    {
      id: "which_031",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby pewnego dnia okazało się, że jedna owca z Waszego stada dostała Nagrodę Nobla, którą obstawiacie? 🏆🐑"
    },
    {
      id: "which_032",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby jedna owca została gwiazdą internetu przez kompletny przypadek, kto to byłby?"
    },
    {
      id: "which_033",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby jedna owca została zawodowym negocjatorem, kto nadawałby się idealnie?"
    },
    {
      id: "which_034",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby jedna owca miała przeżyć miesiąc sama w dziczy, kto wróciłby w najlepszym stanie? 🌲"
    },
    {
      id: "which_035",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby jedna owca została detektywem, kto rozwiązałby sprawę najszybciej? 🔎"
    },
    {
      id: "which_036",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby jedna owca mogła żyć bez pracy do końca życia, kto odnalazłby się w tym najlepiej?"
    },
    {
      id: "which_037",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby jedna owca została trenerem motywacyjnym, kto miałby najwięcej do powiedzenia?"
    },
    {
      id: "which_038",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby jedna owca dostała medal za robienie przypału w miejscach publicznych, kto wygrałby bez konkurencji? 😂"
    },
    {
      id: "which_039",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby przyznawano nagrodę za największą liczbę kroków na wakacjach, która owca zgarnęłaby złoto?"
    },
    {
      id: "which_040",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby była nagroda za odkładanie wszystkiego na ostatnią chwilę, kto wygrałby bez walki?"
    },
    {
      id: "which_041",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby rozdawano medal za najlepszy research przed zakupem, która owca miałaby kolekcję medali?"
    },
    {
      id: "which_042",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby przyznawano nagrodę za najwięcej absurdalnych zdjęć znajomych w telefonie, kto by wygrał? 📸"
    },
    {
      id: "which_043",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby przyznawano medal za umiejętność wdania się w dyskusję z absolutnie każdym, która owca byłaby mistrzem?"
    },
    {
      id: "which_044",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby jedna owca miała zostać zawodowym testerem hoteli, restauracji i spa, kto znalazłby swoje powołanie?"
    },
    {
      id: "which_045",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna z owiec zawsze wie, gdzie jest najlepsza kawa, nawet jeśli jest w mieście pierwszy raz. Kto? ☕"
    },
    {
      id: "which_046",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś uparcie wybiera schody zamiast windy. Nawet na ósme piętro. Która owca?"
    },
    {
      id: "which_047",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś zna wszystkie plotki, ale nigdy nie wiadomo, skąd je ma. O którą owcę chodzi?"
    },
    {
      id: "which_048",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś mówi „daj, ja zadzwonię”, gdy reszta stada boi się załatwić coś przez telefon. Która owca?"
    },
    {
      id: "which_049",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna owca potrafi wynegocjować późniejsze wymeldowanie, lepszy stolik i darmowy deser w jeden dzień. Kto?"
    },
    {
      id: "which_050",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś pyta o zniżkę nawet wtedy, gdy żadnej zniżki nie ma. Która owca?"
    },
    {
      id: "which_051",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna z owiec czyta regulamin. Naprawdę cały. O kogo chodzi?"
    },
    {
      id: "which_052",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Gdyby trzeba było wybrać jedną owcę do reprezentowania stada w teleturnieju, kogo wysyłacie?"
    },
    {
      id: "which_053",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Ktoś próbował wejść do pokoju hotelowego piętro niżej, bo numer się zgadzał. Która owca?"
    },
    {
      id: "which_054",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna owca czyta menu przed wyjściem z domu. Kto?"
    },
    {
      id: "which_055",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Stado wystawia jedną owcę do teleturnieju. Od jej wiedzy zależy milion. Komu ufacie najbardziej? 💰"
    },
    {
      id: "which_056",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Jedna z owiec ma dużą wiedzę z totalnie randomowych kategorii. Która to owca? 🧠🐑"
    },
    {
      id: "which_057",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Poszła na wydarzenie, na którym nikogo nie znała. Wróciła z trzema nowymi kontaktami i zaproszeniem na kolejne. Kogo obstawiacie?"
    },
    {
      id: "which_058",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Wyszła po chleb. Wróciła z nowym kontaktem biznesowym i pomysłem na startup. Która owca?"
    },
    {
      id: "which_059",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Poszła tylko na spacer. Wróciła z zaproszeniem za granicę i nowym biznesowym kontaktem. Która owca mogła tak skończyć zwykły spacer?"
    }
  ]
};

if (typeof window !== "undefined") {
  window.STADO_QUESTIONS = STADO_QUESTIONS;
}
