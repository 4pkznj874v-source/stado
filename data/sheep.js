const SHEEP = [
  {
    id: "beczna",
    name: "Najbardziej Beczna Owca",
    description: "Nie pomaga. Ale przynajmniej jest śmiesznie.",
    smallAvatar: "assets/avatars/small/beczna1.png",
    bigAvatar: "assets/avatars/big/beczna2.png",
    selectable: true
  },
  {
    id: "biznes",
    name: "Owca Biznesu",
    description: "Stado widzi owce. Ona widzi zasoby.",
    smallAvatar: "assets/avatars/small/biznes1.png",
    bigAvatar: "assets/avatars/big/biznes2.png",
    selectable: true
  },
  {
    id: "bot",
    name: "BOT",
    description: "",
    smallAvatar: "assets/avatars/small/bot1.png",
    bigAvatar: "assets/avatars/big/bot2.png",
    selectable: false,
    testOnly: true
  },
  {
    id: "chmurka",
    name: "Owca Chmurka",
    description: "Ma najładniejszą wełnę i doskonale o tym wie.",
    smallAvatar: "assets/avatars/small/chmurka1.png",
    bigAvatar: "assets/avatars/big/chmurka2.png",
    selectable: true
  },
  {
    id: "czarna",
    name: "Czarna Owca",
    description: "Widać, nie widać.",
    smallAvatar: "assets/avatars/small/czarna1.png",
    bigAvatar: "assets/avatars/big/czarna2.png",
    selectable: true
  },
  {
    id: "fantazyjna",
    name: "Fantazyjna Owca",
    description: "Po drugiej stronie snu.",
    smallAvatar: "assets/avatars/small/fantazyjna1.png",
    bigAvatar: "assets/avatars/big/fantazyjna2.png",
    selectable: true
  },
  {
    id: "glamour",
    name: "Diamentowa Owca Glamour",
    description: "Nie robi wejścia. Robi premierę.",
    smallAvatar: "assets/avatars/small/glamour1.png",
    bigAvatar: "assets/avatars/big/glamour2.png",
    selectable: true
  },
  {
    id: "hodowca",
    name: "Owca Hodowca",
    description: "Dogląda stada. Nikt go o to nie prosił.",
    smallAvatar: "assets/avatars/small/hodowca1.png",
    bigAvatar: "assets/avatars/big/hodowca2.png",
    selectable: true
  },
  {
    id: "incognito",
    name: "Owca Incognito",
    description: "Zna wszystkich. Nikt nie zna jej.",
    smallAvatar: "assets/avatars/small/incognito1.png",
    bigAvatar: "assets/avatars/big/incognito2.png",
    selectable: true
  },
  {
    id: "karnawal",
    name: "Karnawałowa Owca",
    description: "Nikt nie wie kim jest, nawet ona sama…",
    smallAvatar: "assets/avatars/small/karnawal1.png",
    bigAvatar: "assets/avatars/big/karnawal2.png",
    selectable: true
  },
  {
    id: "klebek",
    name: "Kłębek",
    description: "Najbardziej zakręcona owca w stadzie.",
    smallAvatar: "assets/avatars/small/klebek1.png",
    bigAvatar: "assets/avatars/big/klebek2.png",
    selectable: true
  },
  {
    id: "npc",
    name: "Owca",
    description: "NPC stada.",
    smallAvatar: "assets/avatars/small/npc1.png",
    bigAvatar: "assets/avatars/big/npc2.png",
    selectable: true
  },
  {
    id: "premium",
    name: "Owca Premium",
    description: "Docenia tylko najwyższą jakość.",
    smallAvatar: "assets/avatars/small/premium1.png",
    bigAvatar: "assets/avatars/big/premium2.png",
    selectable: true
  },
  {
    id: "prosecco",
    name: "Królowa Prosecco",
    description: "Jej kieliszek jest zawsze do połowy pełny.",
    smallAvatar: "assets/avatars/small/prosecco1.png",
    bigAvatar: "assets/avatars/big/prosecco2.png",
    selectable: true
  },
  {
    id: "przesladowca",
    name: "Owca Prześladowca",
    description: "Czujesz jej oddech na plecach.",
    smallAvatar: "assets/avatars/small/przesladowca1.png",
    bigAvatar: "assets/avatars/big/przesladowca2.png",
    selectable: true
  },
  {
    id: "przypal",
    name: "Król Przypału",
    description: "Plan był dobry. Wykonanie legendarne.",
    smallAvatar: "assets/avatars/small/przypal1.png",
    bigAvatar: "assets/avatars/big/przypal2.png",
    selectable: true
  },
  {
    id: "puchata",
    name: "Puchata Różowa Owca",
    description: "Wygląda niewinnie. To tylko marketing.",
    smallAvatar: "assets/avatars/small/puchata1.png",
    bigAvatar: "assets/avatars/big/puchata2.png",
    selectable: true
  },
  {
    id: "research",
    name: "Owca Researchu",
    description: "Ma 27 otwartych zakładek. Nadal się zastanawia.",
    smallAvatar: "assets/avatars/small/research1.png",
    bigAvatar: "assets/avatars/big/research2.png",
    selectable: true
  },
  {
    id: "stalker",
    name: "Owca Stalker",
    description: "Wie o tobie więcej, niż Twoja mama.",
    smallAvatar: "assets/avatars/small/stalker1.png",
    bigAvatar: "assets/avatars/big/stalker2.png",
    selectable: true
  },
  {
    id: "stealth",
    name: "Owca Stealth",
    description: "Nie wykryje jej żaden wilk.",
    smallAvatar: "assets/avatars/small/stealth1.png",
    bigAvatar: "assets/avatars/big/stealth2.png",
    selectable: true
  },
  {
    id: "strateg",
    name: "Owca Strateg",
    description: "Ma swój plan. I plan do planu.",
    smallAvatar: "assets/avatars/small/strateg1.png",
    bigAvatar: "assets/avatars/big/strateg2.png",
    selectable: true
  },
  {
    id: "wstyd",
    name: "Owca Zero Wstydu",
    description: "Nie pyta, czy wypada.",
    smallAvatar: "assets/avatars/small/wstyd1.png",
    bigAvatar: "assets/avatars/big/wstyd2.png",
    selectable: true
  },
  {
    id: "ying",
    name: "Owca Yin-Yang",
    description: "W każdej owcy drzemie trochę wilka.",
    smallAvatar: "assets/avatars/small/ying1.png",
    bigAvatar: "assets/avatars/big/ying2.png",
    selectable: true
  }
];

if (typeof window !== "undefined") {
  window.STADO_SHEEP = SHEEP;
}
