/*
  STADO - baza pytań

  Typy pytań:
  1) herd        - "Co robi Stado?"
  2) target      - "Co robi konkretna Owca?"; [PLAYER] jest podmieniane na losowego gracza
  3) which_sheep - "Która Owca?"; odpowiedziami są wszyscy gracze

  Źródła odpowiedzi:
  - prepared - odpowiedzi są zapisane w bazie; gra losuje z tablicy answers tyle,
               ile ustawiono odpowiedzi (3-5), jeśli w bazie jest ich więcej.
  - players  - odpowiedzi przygotowują wybrane Owce w trakcie rundy.
  - sheep    - odpowiedziami są wszyscy gracze biorący udział w grze.

  Tryby:
  - warmup    = Rozgrzewka / Delikatne
  - freestyle = Tryb standardowy / Po 2 drinkach

  Hardcore nie korzysta z tej bazy.
*/

const STADO_QUESTIONS = {
  // 1. CO ROBI STADO - gotowe pytania i odpowiedzi.
  // Dostępne w Rozgrzewce i Trybie standardowym.
  herdPrepared: [
    /*
    {
      id: "herd_p_001",
      modes: ["warmup", "freestyle"],
      type: "herd",
      answerSource: "prepared",
      question: "Treść pytania...",
      answers: [
        "Odpowiedź A",
        "Odpowiedź B",
        "Odpowiedź C",
        "Odpowiedź D",
        "Odpowiedź E"
      ]
    }
    */
  ],

  // 1. CO ROBI STADO - same pytania.
  // Dostępne wyłącznie w Trybie standardowym; odpowiedzi tworzą gracze.
  herdFreestyle: [
    /*
    {
      id: "herd_f_001",
      modes: ["freestyle"],
      type: "herd",
      answerSource: "players",
      question: "Treść pytania..."
    }
    */
  ],

  // 2. PEWNA OWCA / CO ROBI OWCA - gotowe pytania i odpowiedzi.
  // [PLAYER] jest w każdej rundzie zastępowane imieniem losowo wybranego gracza.
  // Dostępne w Rozgrzewce i Trybie standardowym.
  targetPrepared: [
    /*
    {
      id: "target_p_001",
      modes: ["warmup", "freestyle"],
      type: "target",
      answerSource: "prepared",
      question: "Co zrobi [PLAYER], gdy...?",
      answers: [
        "Odpowiedź A",
        "Odpowiedź B",
        "Odpowiedź C",
        "Odpowiedź D",
        "Odpowiedź E"
      ]
    }
    */
  ],

  // 2. PEWNA OWCA / CO ROBI OWCA - same pytania.
  // [PLAYER] jest zastępowane imieniem losowo wybranego gracza.
  // Dostępne wyłącznie w Trybie standardowym; odpowiedzi tworzą gracze.
  targetFreestyle: [
    /*
    {
      id: "target_f_001",
      modes: ["freestyle"],
      type: "target",
      answerSource: "players",
      question: "Co zrobi [PLAYER], gdy...?"
    }
    */
  ],

  // 3. KTÓRA OWCA - same pytania.
  // Odpowiedziami są wszyscy gracze (3-12), niezależnie od ustawienia 3-5 odpowiedzi.
  // Dostępne w Rozgrzewce i Trybie standardowym.
  whichSheep: [
    /*
    {
      id: "which_001",
      modes: ["warmup", "freestyle"],
      type: "which_sheep",
      answerSource: "sheep",
      question: "Która Owca najprawdopodobniej...?"
    }
    */
  ]
};

// Udostępnienie bazy dla app.js w zwykłym <script> bez bundlera.
if (typeof window !== "undefined") {
  window.STADO_QUESTIONS = STADO_QUESTIONS;
}
