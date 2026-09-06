(() => {
"use strict";

const APP_VERSION = "1.1.6";
const PROTOCOL_VERSION = "stado-v1";
const SCHEMA_VERSION = 1;
const MAX_PLAYERS = 12;
const MIN_PLAYERS = 3;
const QUESTION_LIMIT = 200;
const NAME_LIMIT = 20;
const COLORS = [
  {letter:"A", key:"a", hex:"#ff4f91"},
  {letter:"B", key:"b", hex:"#39c6e9"},
  {letter:"C", key:"c", hex:"#ffc83d"},
  {letter:"D", key:"d", hex:"#9c55db"},
  {letter:"E", key:"e", hex:"#61d69b"}
];
const MODE = {
  warmup: {label:"Rozgrzewka", short:"Na trzeźwo", music:2, desc:"Gotowe pytania i odpowiedzi"},
  freestyle: {label:"Freestyle", short:"Po dwóch drinkach", music:3, desc:"Pytania z gry, odpowiedzi od Was"},
  hardcore: {label:"Sandbox", short:"Hardcore", music:4, desc:"Sami tworzycie pytania i odpowiedzi"},
  quiz: {label:"Quiz", short:"Quiz", music:2, desc:"Wiedza • 3 poziomy • 10 kategorii"}
};
const QUIZ_DIFFICULTIES = [
  {key:"easy",label:"Łatwe",icon:"🙂"},
  {key:"medium",label:"Średnie",icon:"🧠"},
  {key:"hard",label:"Trudne",icon:"🔥"}
];
const QUIZ_CATEGORIES = [
  {key:"world",label:"Świat i geografia",icon:"🌍",aliases:["Świat i geografia","Geografia"]},
  {key:"science",label:"Nauka i natura",icon:"🔬",aliases:["Nauka i natura","Nauka"]},
  {key:"space",label:"Kosmos",icon:"🚀",aliases:["Kosmos"]},
  {key:"tech_ai",label:"Technologia i AI",icon:"💻",aliases:["Technologia i AI","Technologia","AI"]},
  {key:"history",label:"Historia i cywilizacje",icon:"🏛️",aliases:["Historia i cywilizacje","Historia"]},
  {key:"film_pop",label:"Film, seriale i popkultura",icon:"🎬",aliases:["Film, seriale i popkultura","Filmy","Film i seriale","Popkultura"]},
  {key:"art_culture",label:"Muzyka, sztuka i kultura",icon:"🎨",aliases:["Muzyka, sztuka i kultura","Sztuka i kultura","Muzyka","Kultura"]},
  {key:"sport",label:"Sport",icon:"⚽",aliases:["Sport"]},
  {key:"bible_myth",label:"Biblia, religie i mitologie",icon:"📖",aliases:["Biblia, religie i mitologie","Biblia","Religie","Mitologie"]},
  {key:"adult",label:"18+ / tabu i mocniejsze fakty",icon:"🔥",aliases:["18+ / tabu i mocniejsze fakty","18+","Tabu","Mocniejsze fakty","Inne"]}
];
const ALL_QUIZ_CATEGORY_KEYS = QUIZ_CATEGORIES.map(x=>x.key);
const CONFIG_HELP = {
  timer: "Każda faza gry dostaje własny pełny limit czasu od 10 do 120 sekund. Jeśli gracz nie odda głosu w czasie, w tej rundzie dostaje 0 pkt. W fazie pisania po upływie czasu brakująca odpowiedź nie trafia do głosowania.",
  answers: "Rekomendacja: 3–4 Owce → 3 odpowiedzi, 5–8 → 4, 9–12 → 5. Jeżeli graczy jest mniej niż wybrana liczba odpowiedzi, gra automatycznie ogranicza liczbę odpowiedzi do liczby aktywnych Owiec.",
  wolf: "Wilk to opcjonalna tajna minigra po oddaniu głosu w zwykłych rundach. Nie występuje w Quizie ani w rundach „Która Owca?”. Trafienie daje +1 Wilkowi i może odebrać do 2 pkt celowi; pudło kosztuje Wilka 1 pkt; rezygnacja = 0.",
  quiz: "Quiz ma zawsze 5 odpowiedzi i dokładnie jedną poprawną. Minimum 2 graczy. Nie ma Czarnej Owcy, Barana ani pisania odpowiedzi. Każdy zaczyna z 2 Żetonami Wełny.",
  quizCategories: "Domyślnie aktywne są wszystkie 10 kategorii. Możesz zostawić pełny miks albo wybrać dowolny zestaw kategorii. Gra losuje wyłącznie pytania pasujące jednocześnie do wybranego poziomu i kategorii."
};
const PROLOGUE = [
  "Każde Stado gdzieś zmierza.",
  "Niektóre Owce wiedzą dokąd, inne po prostu jadą z resztą.",
  "Po drodze zawsze znajdzie się ktoś z genialnym planem i ktoś, kto właśnie go zepsuje.",
  "Za chwilę przekonacie się, kto naprawdę myśli tak jak Stado.",
  "A kto przy pierwszej okazji pójdzie zupełnie własną drogą.",
  "Zapnijcie pasy. Stado rusza."
];

const pathKey = location.pathname.replace(/[^a-z0-9]/gi,"_");
const HOST_STORAGE_KEY = `stado:${pathKey}:host`;
const PLAYER_STORAGE_KEY = `stado:${pathKey}:player`;
const AUDIO_STORAGE_KEY = `stado:${pathKey}:audio`;
const TAB_STORAGE_KEY = `stado:${pathKey}:hosttab`;
const LOCK_STORAGE_KEY = `stado:${pathKey}:hostlock`;

const NETWORK = Object.assign({
  peerOptions: {},
  // Direct WebRTC first, then TURN relay fallback. The TLS/TCP 443 endpoint is
  // important for restrictive mobile-carrier NAT/firewalls where Wi-Fi works
  // but cellular data cannot establish a peer-to-peer route.
  iceServers: [
    {urls:["stun:stun.l.google.com:19302","stun:stun1.l.google.com:19302"]},
    {urls:"stun:stun.relay.metered.ca:80"},
    {urls:"turn:openrelay.metered.ca:80",username:"openrelayproject",credential:"openrelayproject"},
    {urls:"turn:openrelay.metered.ca:80?transport=tcp",username:"openrelayproject",credential:"openrelayproject"},
    {urls:"turn:openrelay.metered.ca:443",username:"openrelayproject",credential:"openrelayproject"},
    {urls:"turn:openrelay.metered.ca:443?transport=tcp",username:"openrelayproject",credential:"openrelayproject"},
    {urls:"turns:openrelay.metered.ca:443?transport=tcp",username:"openrelayproject",credential:"openrelayproject"}
  ],
  heartbeatMs: 5000,
  offlineAfterMs: 16000,
  connectionOpenTimeoutMs: 6500,
  resumeOpenTimeoutMs: 6500,
  resumeWelcomeTimeoutMs: 7000,
  resumeRetryDelays: [0,700,1600,3000,5000,8000],
  resumeConnectionModes: ["all","relay","relay","all","relay","relay"],
  joinWelcomeTimeoutMs: 8000,
  joinRetryDelays: [350,900,1800,3200,5000],
  joinConnectionModes: ["all","relay","relay","all","relay","relay"]
}, window.STADO_NETWORK_CONFIG || {});

const appEl = document.getElementById("app");
const toastRoot = document.getElementById("toast-root");
const sheepData = Array.isArray(window.STADO_SHEEP) ? window.STADO_SHEEP : [];
const rawQuestions = window.STADO_QUESTIONS;
const rawQuizQuestions = window.STADO_QUIZ;
const sheepMap = new Map(sheepData.map(s => [String(s.id), s]));

const runtime = {
  role: "start",
  modal: null,
  configDraft: {mode:"freestyle", roundsPlanned:15, answerCountRequested:4, wolfEnabled:false, responseTimeSec:60,
    quizDifficulty:"medium", quizCategories:[...ALL_QUIZ_CATEGORY_KEYS]},
  host: {
    peer:null, conns:new Map(), playerConns:new Map(), room:null, pendingRecoveries:new Map(),
    prologueTimer:null, phaseTimer:null, lockTimer:null, wakeLock:null, storageOK:true, creating:false
  },
  player: {
    peer:null, conn:null, snapshot:null, roomInfo:null, identity:null, connected:false,
    lastPong:0, reconnectTimer:null, reconnectAttempt:0, resumeOpenTimer:null, resumeWelcomeTimer:null, resumeConnectionMode:"all", heartbeat:null, pending:new Map(),
    joinDraft:{roomCode:"", name:"", sheepId:"", recover:false}, pendingJoin:null,
    joinAttemptToken:"", joining:false, joinRetryAttempt:0, joinRetryTimer:null, joinWelcomeTimer:null, joinOpenTimer:null,
    joinConnectionMode:"all", joinFailed:false, lastJoinError:"",
    drafts:{question:"", answer:"", hardcoreType:"open", voteOptionId:"", useToken:false, huntTargetId:"", huntOptionId:""},
    waitingRecovery:false, reconnecting:false, lastAttemptId:null
  },
  audio: {track:0, volume:.35, muted:false, pausedByGame:false, pendingTrack:0, lastError:""},
  data: normalizeQuestionData(rawQuestions),
  quizData: normalizeQuizData(rawQuizQuestions),
  diagnostics: []
};

init();

function init(){
  loadAudioPrefs();
  validateStaticData();
  bindGlobalEvents();
  const params = new URLSearchParams(location.search);
  const qCode = cleanRoomCode(params.get("room") || params.get("join") || "");
  const qRoomId = params.get("roomId") || "";
  const savedPlayer = readJSON(PLAYER_STORAGE_KEY);
  if(qCode){
    runtime.role = "player";
    runtime.player.joinDraft.roomCode = qCode;
    if(qRoomId) runtime.player.joinDraft.roomId = qRoomId;
    if(savedPlayer && savedPlayer.roomCode === qCode && savedPlayer.playerId && savedPlayer.resumeKey && savedPlayer.status !== "closed"){
      runtime.player.identity = savedPlayer;
      if(savedPlayer.drafts) runtime.player.drafts = {...runtime.player.drafts,...savedPlayer.drafts};
      runtime.player.lastAttemptId = savedPlayer.lastAttemptId || null;
      render();
      startPlayerResume();
      return;
    }
    render();
    setTimeout(() => previewRoom(qCode), 80);
    return;
  }
  const savedHost = readJSON(HOST_STORAGE_KEY)?.room;
  const hostLock = readJSON(LOCK_STORAGE_KEY);
  const sameTab = hostLock?.tabId === getTabId();
  const otherFreshTab = hostLock && !sameTab && Date.now() - hostLock.ts < 9000;
  if(savedHost && !savedHost.closed && !otherFreshTab){
    restoreHostSnapshot();
    return;
  }
  render();
}

function bindGlobalEvents(){
  document.addEventListener("click", handleClick);
  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleChange);
  window.addEventListener("resize",()=>requestAnimationFrame(()=>{fitHostAnswerText();fitWhichSheepCards();fitHostInfoText();updateCountdownNodes();}));
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)kickPlayerReconnect();});
  window.addEventListener("pageshow",()=>kickPlayerReconnect());
  window.addEventListener("online",()=>kickPlayerReconnect());
  setInterval(updateCountdownNodes,250);
  document.addEventListener("keydown", e => {
    if(e.key === "Escape" && runtime.modal){ runtime.modal = null; render(); }
  });
  window.addEventListener("beforeunload", () => {
    if(runtime.role === "host" && runtime.host.room) persistHost();
    if(runtime.role === "player") persistPlayer();
  });
  window.addEventListener("storage", e => {
    if(e.key === LOCK_STORAGE_KEY && runtime.role === "host" && runtime.host.room){
      const lock = readJSON(LOCK_STORAGE_KEY);
      const tabId = getTabId();
      if(lock && lock.tabId !== tabId && Date.now() - lock.ts < 9000){
        toast("Inna karta prowadzi ten sam pokój.", "error");
      }
    }
  });
}

function handleClick(e){
  const el = e.target.closest("[data-action]");
  if(!el) return;
  // Safari/iPadOS may block a later soundtrack switch unless the media element
  // was activated by a user gesture. Retry any blocked track on the next host click.
  if(runtime.role === "host" && runtime.audio.pendingTrack){
    playMusic(runtime.audio.pendingTrack, true);
  }
  const a = el.dataset.action;
  const id = el.dataset.id;
  const value = el.dataset.value;
  const p = runtime.player;

  if(a === "create-game"){
    runtime.role = "host";
    setBodyMode();
    playMusic(1);
    render();
    return;
  }
  if(a === "join-game"){
    runtime.role = "player";
    setBodyMode();
    pauseAllMusic();
    render();
    return;
  }
  if(a === "how"){ runtime.modal = {type:"how"}; render(); return; }
  if(a === "back-start"){
    if(runtime.host.room) return;
    runtime.role = "start"; pauseAllMusic(); render(); return;
  }
  if(a === "open-settings"){ runtime.modal = {type:"settings"}; render(); return; }
  if(a === "close-modal"){ runtime.modal = null; render(); return; }

  if(a === "settings-new-game"){
    if(!runtime.host.room) return;
    const inProgress = !!runtime.host.room.match && !runtime.host.room.match.finalized;
    confirmModal(
      "Ustawić grę od nowa?",
      inProgress
        ? "Bieżąca rozgrywka zostanie przerwana. Punkty, żetony i postęp meczu zostaną wyzerowane, ale obecny pokój i dołączone Owce pozostaną. Wrócisz do ustawień gry."
        : "Punkty, żetony i poprzedni wynik zostaną wyzerowane. Pokój i dołączone Owce pozostaną. Wrócisz do ustawień gry.",
      hostNewGame
    );
    return;
  }

  if(a === "settings-exit-menu"){
    if(!runtime.host.room){
      runtime.modal=null;
      runtime.role="start";
      pauseAllMusic();
      render();
      return;
    }
    confirmModal(
      "Wyjść do menu głównego?",
      "Pokój zostanie zamknięty, telefony graczy zostaną rozłączone i bieżąca gra zostanie zakończona. Potem możesz utworzyć całkiem nową grę.",
      hostCloseRoom
    );
    return;
  }

  if(a === "help-info"){
    const key=String(id||value||"");
    const text=CONFIG_HELP[key];
    if(text){runtime.modal={type:"help-info",helpKey:key,text};render();}
    return;
  }
  if(a === "quiz-categories-open"){
    ensureQuizConfig(runtime.configDraft);
    runtime.modal={type:"quiz-categories"};
    render(); return;
  }

  if(a === "mode"){
    runtime.configDraft.mode = value;
    ensureQuizConfig(runtime.configDraft);
    if(value === "quiz") runtime.configDraft.wolfEnabled = false;
    render(); return;
  }
  if(a === "answer-count"){ runtime.configDraft.answerCountRequested = +value; render(); return; }
  if(a === "quiz-difficulty"){
    runtime.configDraft.quizDifficulty = normalizeQuizDifficulty(value);
    render(); return;
  }
  if(a === "quiz-category"){
    ensureQuizConfig(runtime.configDraft);
    const key=String(value||"");
    if(!ALL_QUIZ_CATEGORY_KEYS.includes(key))return;
    const selected=new Set(runtime.configDraft.quizCategories);
    // Gdy aktywny jest pełny miks 10 kategorii, pierwsze kliknięcie wybiera
    // tylko tę jedną kategorię. Potem można dowolnie dodawać/odejmować kolejne.
    if(selected.size===ALL_QUIZ_CATEGORY_KEYS.length){
      runtime.configDraft.quizCategories=[key];
      render(); return;
    }
    if(selected.has(key)){
      if(selected.size===1){toast("W Quizie musi pozostać wybrana co najmniej jedna kategoria.","error");return;}
      selected.delete(key);
    }else selected.add(key);
    runtime.configDraft.quizCategories=ALL_QUIZ_CATEGORY_KEYS.filter(k=>selected.has(k));
    render(); return;
  }
  if(a === "quiz-category-all"){
    runtime.configDraft.quizCategories=[...ALL_QUIZ_CATEGORY_KEYS];
    render(); return;
  }
  if(a === "wolf-toggle"){
    if(runtime.configDraft.mode === "quiz")return;
    runtime.configDraft.wolfEnabled = !runtime.configDraft.wolfEnabled;
    if(runtime.host.room) runtime.host.room.config.wolfEnabled = runtime.configDraft.wolfEnabled;
    render(); return;
  }
  if(a === "create-room"){ createOrApplyRoom(); return; }

  if(a === "add-bot"){ hostAddBot(); return; }
  if(a === "remove-player"){ hostRemovePlayer(id); return; }
  if(a === "start-match"){ hostStartMatch(); return; }
  if(a === "back-config"){
    if(runtime.host.room){
      runtime.host.room.status = "CONFIG";
      runtime.configDraft = ensureQuizConfig({...runtime.host.room.config});
      commitHost("Powrót do konfiguracji");
    }
    return;
  }

  if(a === "skip-prologue"){ hostFinishPrologue(); return; }
  if(a === "next-prologue"){ hostAdvancePrologue(true); return; }
  if(a === "show-results"){ hostSettleRound(); return; }
  if(a === "next-round"){ hostNextRound(); return; }
  if(a === "show-final"){ hostFinalize(false); return; }
  if(a === "pause"){ hostTogglePause(); return; }
  if(a === "abort-round"){ confirmModal("Pominąć pytanie?", "Bieżąca próba nie da punktów i nie zużyje żetonów.", () => hostAbortAttempt("Pominięto pytanie.")); return; }
  if(a === "end-game"){ confirmModal("Zakończyć grę?", "Nierozliczona runda nie będzie punktowana. Pozostałe żetony zostaną wymienione po 1 pkt.", () => hostFinalize(true)); return; }
  if(a === "replay"){ hostReplay(); return; }
  if(a === "new-game"){ hostNewGame(); return; }
  if(a === "close-room"){ confirmModal("Zamknąć pokój?", "Telefony zostaną rozłączone, a pokój nie będzie już aktywny.", hostCloseRoom); return; }

  if(a === "demo-question"){ demoQuestion(); return; }
  if(a === "demo-answers"){ demoAnswers(); return; }
  if(a === "demo-votes"){ demoVotes(); return; }
  if(a === "demo-hunt"){ demoHunt(); return; }

  if(a === "approve-recovery"){ hostResolveRecovery(id, true); return; }
  if(a === "reject-recovery"){ hostResolveRecovery(id, false); return; }

  if(a === "select-sheep"){
    if(el.classList.contains("taken")) return;
    p.joinDraft.sheepId = id;
    render(); return;
  }
  if(a === "submit-join"){ playerSubmitJoin(); return; }
  if(a === "submit-join-relay"){ playerSubmitJoin(true); return; }
  if(a === "toggle-recover"){ p.joinDraft.recover = !p.joinDraft.recover; render(); return; }
  if(a === "submit-recover"){ playerRequestRecovery(); return; }
  if(a === "player-menu"){ playerExitToMenu(); return; }
  if(a === "player-reconnect"){ startPlayerResume(true); return; }

  if(a === "hardcore-type"){ p.drafts.hardcoreType = value; render(); return; }
  if(a === "submit-question"){ playerSubmitQuestion(); return; }
  if(a === "submit-answer"){ playerSubmitAnswer(); return; }
  if(a === "select-vote"){ p.drafts.voteOptionId = id; render(); return; }
  if(a === "submit-vote"){ playerSubmitVote(); return; }
  if(a === "select-hunt-target"){ p.drafts.huntTargetId = id; render(); return; }
  if(a === "select-hunt-option"){ p.drafts.huntOptionId = id; render(); return; }
  if(a === "submit-hunt"){ playerSubmitHunt(false); return; }
  if(a === "skip-hunt"){ playerSubmitHunt(true); return; }
  if(a === "replay-ready"){ playerSendAction("REPLAY_READY",{}); return; }

  if(a === "music-enable"){ playMusic(runtime.audio.track || 1, true); runtime.modal=null; render(); return; }
}

function handleInput(e){
  const t = e.target;
  if(t.id === "rounds"){
    runtime.configDraft.roundsPlanned = clamp(+t.value,3,30);
    const v=document.querySelector("#roundValue"); if(v) v.textContent=runtime.configDraft.roundsPlanned;
  }
  if(t.id === "responseTime"){
    runtime.configDraft.responseTimeSec = clamp(+t.value,10,120);
    const v=document.querySelector("#responseTimeValue"); if(v) v.textContent=formatTimeSetting(runtime.configDraft.responseTimeSec);
  }
  if(t.dataset.field === "roomCode"){
    runtime.player.joinDraft.roomCode = cleanRoomCode(t.value);
    t.value = runtime.player.joinDraft.roomCode;
    if(runtime.player.joinDraft.roomCode.length === 6) debouncePreview(runtime.player.joinDraft.roomCode);
  }
  if(t.dataset.field === "playerName" || t.dataset.field === "recoverName"){
    runtime.player.joinDraft.name = t.value;
  }
  if(t.dataset.draft === "question"){
    runtime.player.drafts.question = t.value;
    updateCharCount(t, "questionCount");
    persistPlayer();
  }
  if(t.dataset.draft === "answer"){
    runtime.player.drafts.answer = t.value;
    updateCharCount(t, "answerCount");
    persistPlayer();
  }
  if(t.dataset.hostvolume) setAudioVolume(+t.value/100);
}

function handleChange(e){
  const t=e.target;
  if(t.id === "responseTimeSelect"){
    runtime.configDraft.responseTimeSec = clamp(+t.value,10,120);
    const v=document.querySelector("#responseTimeValue");if(v)v.textContent=formatTimeSetting(runtime.configDraft.responseTimeSec);
    return;
  }
  if("tokenToggle" in t.dataset){
    runtime.player.drafts.useToken = !!t.checked;
    persistPlayer();
    render();
    return;
  }
  if("mute" in t.dataset) setMuted(!!t.checked);
}

function updateCharCount(input, id){
  const n=graphemeCount(input.value);
  const el=document.getElementById(id);
  if(el){el.textContent=`${n}/${QUESTION_LIMIT}`; el.classList.toggle("error-text", n>QUESTION_LIMIT);}
}

/* -------------------- DATA -------------------- */

function normalizeQuestionData(raw){
  const empty={herdPrepared:[],herdFreestyle:[],targetPrepared:[],targetFreestyle:[],whichSheep:[],legacy:false};
  if(!raw) return empty;
  if(Array.isArray(raw)){
    empty.legacy=true;
    empty.herdPrepared = raw.map((q,i)=>({
      id:String(q.id ?? `legacy_${i}`), type:"herd", question:String(q.question||""),
      answers:Array.isArray(q.answers)?q.answers.map(a=>typeof a==="string"?a:String(a?.text||"")):[],
      modes:["warmup","freestyle"], answerSource:"prepared", sourceSection:"legacy"
    }));
    return empty;
  }
  for(const key of ["herdPrepared","herdFreestyle","targetPrepared","targetFreestyle","whichSheep"]){
    const arr=Array.isArray(raw[key])?raw[key]:[];
    empty[key]=arr.map((q,i)=>({
      id:String(q.id ?? `${key}_${i}`),
      type:q.type || (key.startsWith("target")?"target":key==="whichSheep"?"which_sheep":"herd"),
      question:String(q.question||""),
      answers:Array.isArray(q.answers)?q.answers.map(a=>typeof a==="string"?a:String(a?.text||"")):[],
      modes:Array.isArray(q.modes)?q.modes:[],
      answerSource:q.answerSource || (key.includes("Prepared")?"prepared":key==="whichSheep"?"sheep":"players"),
      sourceSection:key
    }));
  }
  return empty;
}

function normalizeQuizDifficulty(value){
  const v=normalizeText(value).replace(/[ąćęłńóśźż]/g,c=>({"ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ó":"o","ś":"s","ź":"z","ż":"z"}[c]||c));
  if(["easy","latwe","latwy","proste"].includes(v))return "easy";
  if(["hard","trudne","trudny"].includes(v))return "hard";
  return "medium";
}
function quizDifficultyLabel(key){return QUIZ_DIFFICULTIES.find(x=>x.key===normalizeQuizDifficulty(key))?.label||"Średnie";}
function quizCategoryKey(value){
  const v=normalizeText(value);
  if(!v)return "";
  const direct=QUIZ_CATEGORIES.find(c=>c.key===String(value));if(direct)return direct.key;
  const found=QUIZ_CATEGORIES.find(c=>c.aliases.some(a=>normalizeText(a)===v));
  return found?.key||"";
}
function quizCategoryLabel(key){return QUIZ_CATEGORIES.find(x=>x.key===key)?.label||key;}
function sanitizeQuizCategorySelection(value){
  const arr=Array.isArray(value)?value:[];
  const out=ALL_QUIZ_CATEGORY_KEYS.filter(k=>arr.includes(k));
  return out.length?out:[...ALL_QUIZ_CATEGORY_KEYS];
}
function ensureQuizConfig(cfg){
  if(!cfg)return cfg;
  cfg.quizDifficulty=normalizeQuizDifficulty(cfg.quizDifficulty||"medium");
  cfg.quizCategories=sanitizeQuizCategorySelection(cfg.quizCategories);
  cfg.responseTimeSec=clamp(+(cfg.responseTimeSec??60),10,120);
  return cfg;
}
function normalizeQuizData(raw){
  const source=Array.isArray(raw)?raw:(Array.isArray(raw?.questions)?raw.questions:[]);
  return source.map((q,i)=>{
    const answers=Array.isArray(q?.answers)?q.answers.map(a=>cleanText(typeof a==="string"?a:(a?.text||""))):[];
    let correctIndex=Number.isInteger(q?.correctIndex)?q.correctIndex:-1;
    if(correctIndex<0 && Number.isInteger(q?.correct) && q.correct>=0 && q.correct<answers.length) correctIndex=q.correct;
    if(correctIndex<0 && typeof q?.correctAnswer==="string") correctIndex=answers.findIndex(a=>normalizeText(a)===normalizeText(q.correctAnswer));
    const category=cleanText(q?.category||q?.categoryKey||"");
    return {
      id:String(q?.id??`quiz_${i+1}`),question:cleanText(q?.question||""),answers,correctIndex,
      category,categoryKey:quizCategoryKey(q?.categoryKey||category),difficulty:normalizeQuizDifficulty(q?.difficulty||"medium")
    };
  });
}
function validQuizRecords(){
  return (runtime.quizData||[]).filter(q=>{
    if(!q.id||!cleanText(q.question)||graphemeCount(q.question)>QUESTION_LIMIT)return false;
    if(!Array.isArray(q.answers)||q.answers.length!==5||q.correctIndex<0||q.correctIndex>4)return false;
    const cleaned=q.answers.map(cleanText);
    if(cleaned.some(a=>!a||graphemeCount(a)>QUESTION_LIMIT))return false;
    if(new Set(cleaned.map(normalizeText)).size!==5)return false;
    if(!["easy","medium","hard"].includes(q.difficulty)||!ALL_QUIZ_CATEGORY_KEYS.includes(q.categoryKey))return false;
    return true;
  });
}
function quizQuestionKey(q){return `quiz|${normalizeText(q.question)}`;}
function eligibleQuizQuestions(room,includeUsed=false){
  const seen=new Set(),cfg=ensureQuizConfig({...runtime.configDraft,...(room?.config||{})});
  const selected=new Set(cfg.quizCategories),difficulty=cfg.quizDifficulty;
  return validQuizRecords().filter(q=>{
    const key=quizQuestionKey(q);if(seen.has(key))return false;seen.add(key);
    if(q.difficulty!==difficulty||!selected.has(q.categoryKey))return false;
    if(!includeUsed&&room?.match?.usedQuestionKeys?.includes(key))return false;
    return true;
  });
}
function chooseQuizQuestion(room){
  const pool=eligibleQuizQuestions(room,false);if(!pool.length)return null;
  const q=pick(pool),key=quizQuestionKey(q);room.match.usedQuestionKeys.push(key);
  return {record:q,questionId:q.id,questionKey:key,type:"quiz",text:q.question,targetPlayerId:null};
}

function validateStaticData(){
  runtime.diagnostics=[];
  if(typeof window.Peer === "undefined") runtime.diagnostics.push({level:"error",text:"Nie załadowano biblioteki PeerJS."});
  if(!sheepData.length) runtime.diagnostics.push({level:"error",text:"Brak data/sheep.js lub window.STADO_SHEEP."});
  const ids=new Set();
  for(const s of sheepData){
    if(!s.id || ids.has(String(s.id))) runtime.diagnostics.push({level:"error",text:`Nieprawidłowe lub zduplikowane id Owcy: ${s.id}`});
    ids.add(String(s.id));
    if(!s.name || !s.smallAvatar || !s.bigAvatar) runtime.diagnostics.push({level:"error",text:`Niekompletny rekord Owcy: ${s.id}`});
  }
  const allQ=allQuestionRecords(),qids=new Set();
  for(const q of allQ){
    if(!q.id || qids.has(q.id)) runtime.diagnostics.push({level:"error",text:`Zduplikowane id pytania: ${q.id}`});
    qids.add(q.id);
    if(!["herd","target","which_sheep"].includes(q.type)) runtime.diagnostics.push({level:"error",text:`Pytanie ${q.id}: nieznany type ${q.type}`});
    if(!cleanText(q.question)) runtime.diagnostics.push({level:"error",text:`Pytanie ${q.id}: pusta treść`});
    if(q.type==="target" && !hasPlayerToken(q.question)) runtime.diagnostics.push({level:"warn",text:`Pytanie ${q.id}: target bez [PLAYER] / [IMIĘ OWCY]`});
    if(q.sourceSection?.includes("Prepared") && q.type!=="which_sheep" && q.answers.filter(a=>cleanText(a)).length<5){
      runtime.diagnostics.push({level:"warn",text:`Pytanie ${q.id}: mniej niż 5 gotowych odpowiedzi — wyłączone w Rozgrzewce.`});
    }
  }
  if(runtime.data.legacy) runtime.diagnostics.push({level:"warn",text:"Wykryto starszy tablicowy format questions.js. Adapter traktuje rekordy jako pytania herd; zalecana jest baza pięciosekcyjna."});
}

function allQuestionRecords(){
  return ["herdPrepared","herdFreestyle","targetPrepared","targetFreestyle","whichSheep"].flatMap(k=>runtime.data[k]||[]);
}
function hasPlayerToken(t){ return /\[PLAYER\]|\[IMIĘ OWCY\]/i.test(t||""); }
function questionKey(q){ return `${q.type}|${normalizeText(q.question.replace(/\[IMIĘ OWCY\]/gi,"[PLAYER]"))}`; }

function eligibleQuestions(mode, room, includeUsed=false){
  if(mode==="hardcore") return [];
  let list=mode==="warmup"
    ? [...runtime.data.herdPrepared,...runtime.data.targetPrepared,...runtime.data.whichSheep]
    : [...runtime.data.herdPrepared,...runtime.data.herdFreestyle,...runtime.data.targetPrepared,...runtime.data.targetFreestyle,...runtime.data.whichSheep];
  const seen=new Set(), active=room?activePlayers(room):[], K=room?actualAnswerCount(room):runtime.configDraft.answerCountRequested;
  return list.filter(q=>{
    const key=questionKey(q);
    if(seen.has(key)) return false; seen.add(key);
    if(!["herd","target","which_sheep"].includes(q.type)) return false;
    if(graphemeCount(cleanText(q.question))>QUESTION_LIMIT) return false;
    if(q.type==="target" && !hasPlayerToken(q.question)) return false;
    if(mode==="warmup" && q.type!=="which_sheep"){
      const validAnswers=(q.answers||[]).map(cleanText).filter(Boolean).filter(a=>graphemeCount(a)<=QUESTION_LIMIT);
      if(validAnswers.length < Math.max(5,K)) return false;
    }
    if(active.length && q.type==="target"){
      const okTarget=active.some(p=>graphemeCount(applyTarget(q.question,p.name))<=QUESTION_LIMIT);
      if(!okTarget) return false;
    }
    if(!includeUsed && room?.match?.usedQuestionKeys?.includes(key)) return false;
    return true;
  });
}

function preflight(room){
  const errors=[], warnings=[];
  if(sheepData.filter(s=>s.selectable!==false).length < 12) warnings.push("Baza ma mniej niż 12 wybieralnych avatarów.");
  if(room.config.mode==="quiz"){
    ensureQuizConfig(room.config);
    const rawCount=(runtime.quizData||[]).length,valid=validQuizRecords(),pool=eligibleQuizQuestions(room,true);
    if(!rawCount) errors.push("Brak bazy Quiz: dodaj plik data/quiz.js z window.STADO_QUIZ.");
    else if(valid.length!==rawCount) warnings.push(`Quiz: poprawnych rekordów ${valid.length}/${rawCount}. Rekordy bez prawidłowej kategorii, poziomu, 5 odpowiedzi lub klucza odpowiedzi zostaną pominięte.`);
    const catCount=room.config.quizCategories?.length||0;
    if(!catCount) errors.push("Quiz: wybierz co najmniej jedną kategorię pytań.");
    if(pool.length < room.config.roundsPlanned) errors.push(`Quiz (${quizDifficultyLabel(room.config.quizDifficulty)}, ${catCount} kat.): dostępnych pytań ${pool.length}, zaplanowanych rund ${room.config.roundsPlanned}.`);
    if(pool.length < 3) errors.push("Quiz wymaga co najmniej 3 pytań pasujących do wybranego poziomu i kategorii.");
  }else if(room.config.mode!=="hardcore"){
    const pool=eligibleQuestions(room.config.mode, room, true);
    if(pool.length < room.config.roundsPlanned) errors.push(`Dostępnych unikalnych pytań: ${pool.length}, zaplanowanych rund: ${room.config.roundsPlanned}.`);
    if(pool.length < 3) errors.push("Tryb wymaga co najmniej 3 prawidłowych pytań.");
  }
  const fatal=runtime.diagnostics.filter(d=>d.level==="error");
  if(fatal.length) errors.push(...fatal.map(x=>x.text));
  return {errors,warnings};
}

function chooseQuestion(room){
  const pool=eligibleQuestions(room.config.mode, room, false);
  if(!pool.length) return null;
  let candidates=pool;
  const hist=room.match.typeHistory||[];
  if(hist.length>=3 && hist.slice(-3).every(t=>t===hist.at(-1))){
    const alt=pool.filter(q=>q.type!==hist.at(-1));
    if(alt.length) candidates=alt;
  }
  const q=pick(candidates), key=questionKey(q);
  room.match.usedQuestionKeys.push(key);
  let targetPlayerId=null, text=cleanText(q.question);
  if(q.type==="target"){
    const aps=activePlayers(room).filter(p=>graphemeCount(applyTarget(q.question,p.name))<=QUESTION_LIMIT);
    const min=Math.min(...aps.map(p=>room.match.targetPickCounts[p.playerId]||0));
    const target=pick(aps.filter(p=>(room.match.targetPickCounts[p.playerId]||0)===min));
    targetPlayerId=target.playerId;
    text=applyTarget(q.question,target.name);
  }
  return {record:q, questionId:q.id, questionKey:key, type:q.type, text, targetPlayerId};
}

function applyTarget(text,name){
  return String(text||"").replace(/\[PLAYER\]|\[IMIĘ OWCY\]/gi,name);
}


/* -------------------- HOST STATE -------------------- */

function makeRoom(config, roomCode, roomId){
  return {
    schemaVersion:SCHEMA_VERSION, appVersion:APP_VERSION, protocolVersion:PROTOCOL_VERSION,
    roomId, roomCode, hostPeerId:`stado-${roomCode}`, status:"LOBBY", revision:0, closed:false,
    config:{...config}, players:[], match:null, paused:false, actionLog:{}, createdAt:Date.now(), updatedAt:Date.now()
  };
}

function makePlayer({name,sheepId,isBot=false,peerId="",joinToken=""}){
  return {
    playerId:uid("p"), name:cleanText(name), normalizedName:normalizeName(name),
    sheepId:String(sheepId), isBot, active:true, removed:false, connected:isBot||!!peerId, peerId,
    joinToken:isBot?"":String(joinToken||""),
    resumeKey:isBot?"":randomToken(24), sessionGeneration:0, joinedAt:Date.now(),
    points:0, tokens:1, replayReady:false, stats:makeStats()
  };
}
function makeStats(){
  return {
    roundsPlayed:0,votesCast:0,herdWins:0,blackSheepWins:0,outsideHerd:0,zeroBaseRounds:0,quizCorrect:0,quizWrong:0,whichHits:0,whichMisses:0,whichJudgeRounds:0,
    tokensUsed:0,tokensSuccessful:0,tokensEarned:0,tokenBonusPoints:0,tokensRedeemed:0,
    answerOpportunities:0,answersWritten:0,answersWon:0,targetRounds:0,ramRounds:0,
    wolfRounds:0,wolfHits:0,wolfMisses:0,wolfSkipped:0,wolfPointsGained:0,wolfPointsLost:0,
    actualStolen:0,pointsLostToWolf:0,wolfTargets:[],scoreBeforeRedemption:0,finalScore:0,finalPlace:null
  };
}

function startNewMatchState(room){
  const act=activePlayers(room);
  const ramOrder=shuffle(act.map(p=>p.playerId));
  const answerAssignCounts={}, wolfAssignCounts={}, targetPickCounts={}, whichJudgeCounts={};
  act.forEach(p=>{answerAssignCounts[p.playerId]=0;wolfAssignCounts[p.playerId]=0;targetPickCounts[p.playerId]=0;whichJudgeCounts[p.playerId]=0;});
  return {
    matchId:uid("m"), plannedRounds:room.config.roundsPlanned, settledRounds:0, roundNumber:0,
    phase:"PROLOGUE", prologueIndex:0, ramOrder, ramCursor:0, typeHistory:[], usedQuestionKeys:[],
    answerAssignCounts,wolfAssignCounts,targetPickCounts,whichJudgeCounts, history:[], current:null,
    finalized:false, finalResult:null, earlyEnded:false
  };
}

function activePlayers(room=runtime.host.room){ return room?.players?.filter(p=>p.active&&!p.removed) || []; }
function classifiedPlayers(room=runtime.host.room){ return activePlayers(room); }
function minPlayersForMode(mode){return mode==="quiz"?2:MIN_PLAYERS;}
function minPlayersForRoom(room=runtime.host.room){return minPlayersForMode(room?.config?.mode||runtime.configDraft.mode);}
function actualAnswerCount(room=runtime.host.room){ return Math.min(room.config.answerCountRequested, activePlayers(room).length); }
function startingTokens(room=runtime.host.room){return ["warmup","quiz"].includes(room?.config?.mode)?2:1;}
function playerById(id,room=runtime.host.room){ return room?.players?.find(p=>p.playerId===id); }
function sheepById(id){ return sheepMap.get(String(id)) || {id:"missing",name:"Owca",description:"",smallAvatar:"",bigAvatar:""}; }
function currentAttempt(room=runtime.host.room){ return room?.match?.current || null; }

function createOrApplyRoom(){
  const cfg=ensureQuizConfig({...runtime.configDraft, roundsPlanned:clamp(+runtime.configDraft.roundsPlanned,3,30), answerCountRequested:clamp(+runtime.configDraft.answerCountRequested,3,5), responseTimeSec:clamp(+(runtime.configDraft.responseTimeSec||60),10,120)});
  if(cfg.mode==="quiz"){cfg.wolfEnabled=false;cfg.answerCountRequested=5;}
  runtime.configDraft=cfg;
  if(runtime.host.room){
    runtime.host.room.config={...cfg};
    runtime.host.room.status="LOBBY";
    activePlayers(runtime.host.room).forEach(p=>{p.tokens=startingTokens(runtime.host.room);});
    commitHost("Zapisano konfigurację");
    return;
  }
  if(typeof window.Peer==="undefined"){ toast("Nie można utworzyć pokoju: PeerJS nie został załadowany.","error"); return; }
  acquireHostLock();
  runtime.host.creating=true;
  render();
  createHostPeerNew(cfg,0);
}

function createHostPeerNew(cfg,tries){
  if(tries>7){ runtime.host.creating=false; toast("Nie udało się zarejestrować pokoju. Spróbuj ponownie.","error"); render(); return; }
  const code=randomRoomCode(), roomId=uid("room"), room=makeRoom(cfg,code,roomId);
  const peer=createPeer(room.hostPeerId);
  runtime.host.peer=peer;
  let opened=false;
  peer.on("open",()=>{
    opened=true; runtime.host.creating=false; runtime.host.room=room; setupHostPeerHandlers(peer); persistHost();
    playMusic(1); requestWakeLock(); commitHost("Pokój gotowy");
  });
  peer.on("error",err=>{
    if(!opened && err?.type==="unavailable-id"){ try{peer.destroy();}catch{} createHostPeerNew(cfg,tries+1); }
    else { runtime.host.creating=false; toast(`PeerJS: ${err?.type||"błąd połączenia"}`,"error"); render(); }
  });
}

function createPeer(id,transportPolicy="all"){
  const overrideConfig=NETWORK.peerOptions?.config||{};
  const config={iceServers:NETWORK.iceServers,iceTransportPolicy:"all",iceCandidatePoolSize:2,...overrideConfig};
  // A retry in relay mode deliberately forbids direct/STUN-only pairs. This
  // forces TURN (including TURNS over TCP/443) on restrictive cellular links.
  if(transportPolicy==="relay"){
    config.iceTransportPolicy="relay";
    config.iceCandidatePoolSize=4;
  }
  const opts={...NETWORK.peerOptions,config};
  return id ? new Peer(id,opts) : new Peer(opts);
}
function setupHostPeerHandlers(peer){
  peer.on("connection",acceptHostConnection);
  peer.on("disconnected",()=>{
    toast("Chwilowo utracono serwer połączeń. Próbuję wznowić przyjmowanie Owiec…","error");
    // Existing WebRTC data channels may keep working after signalling drops,
    // but new players cannot join until the host reconnects to PeerServer.
    let tries=0;
    const retry=()=>{
      if(runtime.host.peer!==peer || peer.destroyed || !peer.disconnected)return;
      tries++;
      try{peer.reconnect();}catch{}
      if(peer.disconnected && tries<6)setTimeout(retry,Math.min(5000,500*tries));
    };
    setTimeout(retry,350);
  });
  peer.on("open",()=>{ if(runtime.host.room) render(); });
  peer.on("error",err=>toast(`Połączenie hosta: ${err?.type||err?.message||"błąd"}`,"error"));
}

function acceptHostConnection(conn){
  runtime.host.conns.set(conn.peer,conn);
  conn.__playerId=null;
  conn.on("data",msg=>hostHandleMessage(conn,msg));
  conn.on("close",()=>hostConnectionClosed(conn));
  conn.on("error",()=>hostConnectionClosed(conn));
}

function hostConnectionClosed(conn){
  runtime.host.conns.delete(conn.peer);
  const pid=conn.__playerId;
  if(!pid)return;
  // Gdy nowe połączenie zastępuje stare, zamknięcie STAREGO kanału nie może
  // oznaczyć gracza jako offline. To był główny powód chwilowego statusu offline
  // zaraz po poprawnym powrocie telefonu do gry.
  if(runtime.host.playerConns.get(pid)!==conn)return;
  runtime.host.playerConns.delete(pid);
  const pl=playerById(pid);
  if(pl && !pl.isBot){ pl.connected=false; pl.peerId=""; commitHost("Gracz offline"); }
}

function hostHandleMessage(conn,msg){
  if(!msg || typeof msg!=="object") return;
  if(msg.type==="PING"){ send(conn,{type:"PONG",ts:Date.now()}); return; }
  if(msg.protocolVersion && msg.protocolVersion!==PROTOCOL_VERSION){
    send(conn,{type:"REJECT",code:"VERSION",message:"Wersja gry jest niezgodna. Odśwież stronę."}); return;
  }
  if(msg.type==="HELLO"){ send(conn,roomInfoMessage()); return; }
  if(msg.type==="JOIN"){ hostJoin(conn,msg); return; }
  if(msg.type==="RESUME"){ hostResume(conn,msg); return; }
  if(msg.type==="RECOVER_REQUEST"){ hostRecoveryRequest(conn,msg); return; }
  if(!conn.__playerId){ send(conn,{type:"REJECT",code:"NOT_BOUND",message:"Połączenie nie jest przypisane do Owcy."}); return; }
  if(msg.type==="REPLAY_READY"){ hostAction(conn,msg,()=>{ const pl=playerById(conn.__playerId); pl.replayReady=true; return {message:"Gotowość do rewanżu zapisana."};}); return; }
  if(msg.type==="SUBMIT_QUESTION"){ hostAction(conn,msg,()=>handleSubmitQuestion(conn.__playerId,msg.payload||{})); return; }
  if(msg.type==="SUBMIT_ANSWER"){ hostAction(conn,msg,()=>handleSubmitAnswer(conn.__playerId,msg.payload||{})); return; }
  if(msg.type==="SUBMIT_VOTE"){ hostAction(conn,msg,()=>handleSubmitVote(conn.__playerId,msg.payload||{})); return; }
  if(msg.type==="SUBMIT_HUNT"){ hostAction(conn,msg,()=>handleSubmitHunt(conn.__playerId,msg.payload||{},false)); return; }
  if(msg.type==="SKIP_HUNT"){ hostAction(conn,msg,()=>handleSubmitHunt(conn.__playerId,msg.payload||{},true)); return; }
}

function roomInfoMessage(){
  const r=runtime.host.room;
  return {type:"ROOM_INFO",protocolVersion:PROTOCOL_VERSION,appVersion:APP_VERSION,roomId:r.roomId,roomCode:r.roomCode,status:r.status,
    occupiedSheep:activePlayers(r).filter(p=>!p.isBot).map(p=>p.sheepId), occupiedNames:activePlayers(r).map(p=>p.name), count:activePlayers(r).length, max:MAX_PLAYERS};
}

function sendWelcome(conn,pl,resumed=false){
  const r=runtime.host.room;if(!r||!pl)return;
  send(conn,{type:"WELCOME",resumed,identity:{playerId:pl.playerId,roomId:r.roomId,roomCode:r.roomCode,resumeKey:pl.resumeKey,sessionGeneration:pl.sessionGeneration},snapshot:buildPlayerSnapshot(pl.playerId)});
}

function hostJoin(conn,msg){
  const r=runtime.host.room;
  const payload=msg.payload||msg;
  if(!r || r.closed){send(conn,{type:"REJECT",code:"ROOM",message:"Pokój nie jest aktywny."});return;}
  if(payload.roomId && payload.roomId!==r.roomId){send(conn,{type:"REJECT",code:"ROOM_ID",message:"Ten link prowadzi do nieaktualnego pokoju."});return;}
  const name=cleanText(payload.name), nn=normalizeName(name), sid=String(payload.sheepId||""), joinToken=String(payload.joinToken||"");

  // A flaky phone may have reached the host, been added to the room and then
  // missed WELCOME. The same joinToken lets the retry reclaim that exact sheep
  // instead of getting stuck on NAME_TAKEN / SHEEP_TAKEN.
  if(joinToken){
    const existing=activePlayers(r).find(x=>!x.isBot&&x.joinToken===joinToken);
    if(existing){
      if(existing.normalizedName!==nn || existing.sheepId!==sid){send(conn,{type:"REJECT",code:"JOIN_MISMATCH",message:"Ta próba dołączenia dotyczy już innej Owcy. Odśwież stronę i spróbuj ponownie."});return;}
      bindConnToPlayer(conn,existing);
      sendWelcome(conn,existing,true);
      commitHost("Ponowiono dołączenie Owcy");
      return;
    }
  }

  if(r.status!=="LOBBY"){send(conn,{type:"REJECT",code:"STARTED",message:"Gra już się rozpoczęła. Możesz tylko wrócić do istniejącej Owcy."});return;}
  if(!name || graphemeCount(name)>NAME_LIMIT){send(conn,{type:"REJECT",code:"NAME",message:"Podaj prawidłowe imię (maks. 20 znaków)."});return;}
  const sh=sheepById(sid);
  if(!sh || sh.id==="missing" || sh.selectable===false){send(conn,{type:"REJECT",code:"SHEEP",message:"Wybierz dostępną Owcę."});return;}
  if(activePlayers(r).length>=MAX_PLAYERS){send(conn,{type:"REJECT",code:"FULL",message:"To Stado jest już pełne — maksymalnie 12 Owiec."});return;}
  if(activePlayers(r).some(x=>x.normalizedName===nn)){send(conn,{type:"REJECT",code:"NAME_TAKEN",message:"Ta nazwa jest już zajęta."});return;}
  if(activePlayers(r).some(x=>!x.isBot&&x.sheepId===sid)){send(conn,{type:"REJECT",code:"SHEEP_TAKEN",message:"Ta Owca jest już zajęta — wybierz inną."});return;}
  const pl=makePlayer({name,sheepId:sid,isBot:false,peerId:conn.peer,joinToken});
  pl.tokens=startingTokens(r);r.players.push(pl); bindConnToPlayer(conn,pl);
  // Send identity first. If a network hiccup follows, the phone already has
  // enough data to resume; commitHost then refreshes everyone in the lobby.
  sendWelcome(conn,pl,false);
  commitHost("Nowa Owca dołączyła");
}

function bindConnToPlayer(conn,pl,rotateKey=true){
  const old=runtime.host.playerConns.get(pl.playerId);
  // Najpierw ustawiamy nowy kanał jako aktywny, a dopiero potem zamykamy stary.
  // Dzięki temu callback starego kanału jest rozpoznawany jako nieaktualny.
  pl.connected=true;pl.peerId=conn.peer;pl.sessionGeneration=(pl.sessionGeneration||0)+1;
  if(rotateKey)pl.resumeKey=randomToken(24);
  conn.__playerId=pl.playerId;conn.__generation=pl.sessionGeneration;
  runtime.host.playerConns.set(pl.playerId,conn);
  if(old && old!==conn){ try{old.close();}catch{} }
}

function hostResume(conn,msg){
  const r=runtime.host.room,payload=msg.payload||msg;
  if(!r || r.closed || payload.roomId!==r.roomId){send(conn,{type:"REJECT",code:"ROOM",message:"Pokój nie jest już dostępny."});return;}
  const pl=playerById(payload.playerId);
  if(!pl || !pl.active || pl.removed || pl.isBot){send(conn,{type:"REJECT",code:"PLAYER",message:"Ta Owca nie jest aktywna w pokoju."});return;}
  if(payload.resumeKey!==pl.resumeKey){send(conn,{type:"REJECT",code:"KEY",message:"Ten klucz powrotu nie jest już aktualny. Użyj „Wróć do swojej Owcy”."});return;}
  // Przy zwykłym reconnect nie obracamy resumeKey. Jeżeli pakiet WELCOME
  // zginie, kolejna automatyczna próba nadal może użyć tego samego klucza.
  bindConnToPlayer(conn,pl,false);
  persistHost(); broadcastSnapshots();
  sendWelcome(conn,pl,true);
}

function hostRecoveryRequest(conn,msg){
  const r=runtime.host.room,payload=msg.payload||msg;
  if(!r || r.closed){send(conn,{type:"REJECT",code:"ROOM",message:"Pokój nie jest aktywny."});return;}
  if(payload.roomId && payload.roomId!==r.roomId){send(conn,{type:"REJECT",code:"ROOM_ID",message:"Nieaktualny identyfikator pokoju."});return;}
  const nn=normalizeName(payload.name||"");
  const pl=activePlayers(r).find(x=>x.normalizedName===nn && !x.isBot);
  if(!pl){send(conn,{type:"REJECT",code:"PLAYER",message:"Nie znaleziono aktywnej Owcy o takim imieniu."});return;}
  const rid=uid("recovery");
  runtime.host.pendingRecoveries.set(rid,{id:rid,conn,playerId:pl.playerId,name:pl.name,createdAt:Date.now()});
  send(conn,{type:"RECOVERY_PENDING",requestId:rid,message:"Prośba wysłana do prowadzącego."});
  render();
}

function hostResolveRecovery(id,approve){
  const req=runtime.host.pendingRecoveries.get(id);
  if(!req)return;
  runtime.host.pendingRecoveries.delete(id);
  const pl=playerById(req.playerId);
  if(!approve || !pl || !pl.active || pl.removed){
    send(req.conn,{type:"RECOVERY_RESULT",ok:false,message:"Prowadzący odrzucił prośbę o odzyskanie Owcy."});render();return;
  }
  bindConnToPlayer(req.conn,pl);
  commitHost("Odzyskano połączenie gracza");
  send(req.conn,{type:"RECOVERY_RESULT",ok:true,identity:{playerId:pl.playerId,roomId:runtime.host.room.roomId,roomCode:runtime.host.room.roomCode,resumeKey:pl.resumeKey,sessionGeneration:pl.sessionGeneration},snapshot:buildPlayerSnapshot(pl.playerId)});
}

function hostAction(conn,msg,handler){
  const r=runtime.host.room;
  if(r.paused && !["REPLAY_READY"].includes(msg.type)){ sendAck(conn,msg,false,"Gra jest wstrzymana.","PAUSED"); return; }
  const aid=String(msg.actionId||"");
  if(!aid){sendAck(conn,msg,false,"Brak identyfikatora akcji.","ACTION");return;}
  if(r.actionLog[aid]){
    const prev=r.actionLog[aid];
    send(conn,{type:"ACK",actionId:aid,...prev});
    return;
  }
  if(msg.roomId!==r.roomId){sendAck(conn,msg,false,"Nieaktualny pokój.","ROOM");return;}
  const match=r.match;
  if(msg.matchId && match && msg.matchId!==match.matchId){sendAck(conn,msg,false,"Nieaktualny mecz.","MATCH");return;}
  if(msg.attemptId && match?.current && msg.attemptId!==match.current.attemptId){sendAck(conn,msg,false,"Ta akcja dotyczy poprzedniej rundy.","ATTEMPT");return;}
  try{
    const result=handler()||{};
    const out={ok:true,message:result.message||"Zapisano."};
    r.actionLog[aid]=out; pruneActionLog(r);
    send(conn,{type:"ACK",actionId:aid,...out});
    commitHost("Akcja gracza");
  }catch(err){
    const out={ok:false,message:err.message||"Nie udało się zapisać akcji.",code:err.code||"INVALID"};
    r.actionLog[aid]=out; pruneActionLog(r);
    send(conn,{type:"ACK",actionId:aid,...out});
  }
}
function sendAck(conn,msg,ok,message,code=""){send(conn,{type:"ACK",actionId:msg.actionId||"",ok,message,code});}
function pruneActionLog(r){const keys=Object.keys(r.actionLog);if(keys.length>400)keys.slice(0,keys.length-300).forEach(k=>delete r.actionLog[k]);}

function hostAddBot(){
  const r=runtime.host.room;if(!r||r.status!=="LOBBY")return;
  if(activePlayers(r).length>=MAX_PLAYERS){toast("Maksymalnie 12 Owiec.","error");return;}
  const botSheep=sheepData.find(s=>s.testOnly)||sheepData.find(s=>s.id==="bot");
  if(!botSheep){toast("Brak avatara BOT w data/sheep.js.","error");return;}
  let n=1,name; do{name=`BOT ${n++}`;}while(activePlayers(r).some(x=>normalizeName(x.name)===normalizeName(name)));
  const bot=makePlayer({name,sheepId:botSheep.id,isBot:true});bot.tokens=startingTokens(r);r.players.push(bot);
  commitHost("Dodano BOT-a");
}
function hostRemovePlayer(id){
  const r=runtime.host.room,pl=playerById(id);if(!pl||!pl.active)return;
  const during=!!r.match && !r.match.finalized && ["PROLOGUE","ROUND"].includes(r.status);
  const text=during?"Usunięcie gracza anuluje bieżącą nierozliczoną próbę. Gracz nie wróci do tego meczu.":"Usunąć tę Owcę z pokoju?";
  confirmModal("Usunąć gracza?",text,()=>{
    if(r.status==="LOBBY"||r.status==="CONFIG"){
      pl.active=false;pl.removed=true;pl.connected=false;
      const conn=runtime.host.playerConns.get(pl.playerId);if(conn){send(conn,{type:"REMOVED",message:"Prowadzący usunął Twoją Owcę z pokoju."});try{conn.close();}catch{}}
      runtime.host.playerConns.delete(pl.playerId);
    }else{
      pl.active=false;pl.removed=true;pl.connected=false;
      const conn=runtime.host.playerConns.get(pl.playerId);if(conn){send(conn,{type:"REMOVED",message:"Prowadzący usunął Twoją Owcę z tej gry."});try{conn.close();}catch{}}
      runtime.host.playerConns.delete(pl.playerId);
      removeFromRamOrder(r,pl.playerId);
      if(r.match?.current && !r.match.current.settlement) hostAbortAttempt("Usunięto gracza.",true);
      if(activePlayers(r).length<minPlayersForRoom(r) && r.match && !r.match.finalized) hostFinalize(true);
    }
    commitHost("Usunięto gracza");
  });
}

function removeFromRamOrder(r,pid){
  const m=r.match;if(!m)return;
  const idx=m.ramOrder.indexOf(pid); if(idx<0)return;
  if(idx<m.ramCursor) m.ramCursor=Math.max(0,m.ramCursor-1);
  m.ramOrder.splice(idx,1);
  if(m.ramOrder.length) m.ramCursor%=m.ramOrder.length; else m.ramCursor=0;
}


function configuredResponseSeconds(r=runtime.host.room){
  return clamp(+(r?.config?.responseTimeSec ?? runtime.configDraft.responseTimeSec ?? 60),10,120);
}
function isTimedPhase(phase){return ["QUESTION_INPUT","ANSWER_INPUT","VOTING"].includes(phase);}
function clearPhaseTimer(){if(runtime.host.phaseTimer){clearTimeout(runtime.host.phaseTimer);runtime.host.phaseTimer=null;}}
function armPhaseTimer(r,c,reset=true){
  clearPhaseTimer();
  if(!r||!c||!isTimedPhase(c.phase))return;
  const now=Date.now(),duration=configuredResponseSeconds(r)*1000;
  if(reset||!c.phaseDeadlineAt){c.phaseStartedAt=now;c.phaseDeadlineAt=now+duration;c.phaseRemainingMs=null;}
  if(r.paused){c.phaseRemainingMs=Math.max(0,(c.phaseDeadlineAt||now)-now);c.phaseDeadlineAt=0;return;}
  const attemptId=c.attemptId,phase=c.phase,delay=Math.max(20,(c.phaseDeadlineAt||now)-now+20);
  runtime.host.phaseTimer=setTimeout(()=>handlePhaseTimeout(attemptId,phase),delay);
}
function pausePhaseTimer(r){
  const c=currentAttempt(r);clearPhaseTimer();
  if(!c||!isTimedPhase(c.phase))return;
  if(c.phaseDeadlineAt)c.phaseRemainingMs=Math.max(0,c.phaseDeadlineAt-Date.now());
  c.phaseDeadlineAt=0;
}
function resumePhaseTimer(r){
  const c=currentAttempt(r);if(!c||!isTimedPhase(c.phase))return;
  const remaining=Number.isFinite(c.phaseRemainingMs)?c.phaseRemainingMs:configuredResponseSeconds(r)*1000;
  c.phaseDeadlineAt=Date.now()+Math.max(250,remaining);c.phaseRemainingMs=null;armPhaseTimer(r,c,false);
}
function handlePhaseTimeout(attemptId,phase){
  const r=runtime.host.room,c=currentAttempt(r);
  if(!r||!c||c.attemptId!==attemptId||c.phase!==phase||r.paused||c.settlement)return;
  clearPhaseTimer();c.phaseDeadlineAt=0;c.phaseRemainingMs=0;c.phaseTimedOut=true;c.timeoutPhase=phase;
  if(phase==="QUESTION_INPUT"){
    c.timedOutPlayerIds=[c.ramPlayerId].filter(Boolean);
    hostAbortAttempt("Baran nie zdążył przygotować pytania — losujemy kolejną próbę.");
    return;
  }
  if(phase==="ANSWER_INPUT"){
    const submitted=(c.assignedAuthorIds||[]).filter(pid=>c.answers?.[pid]);
    c.timedOutAuthorIds=(c.assignedAuthorIds||[]).filter(pid=>!c.answers?.[pid]);
    if(submitted.length<2){
      hostAbortAttempt("Za mało odpowiedzi wpłynęło w czasie — losujemy kolejną próbę.");
      return;
    }
    c.options=shuffle(submitted.map(id=>({optionId:uid("opt"),text:c.answers[id].text,authorPlayerId:id,candidatePlayerId:null})))
      .map((o,i)=>({...o,order:i,letter:COLORS[i]?.letter||String(i+1),colorKey:COLORS[i]?.key||"a"}));
    c.phase="VOTING";armPhaseTimer(r,c,true);commitHost("Minął czas na wpisanie odpowiedzi");
    return;
  }
  if(phase==="VOTING"){
    c.timedOutPlayerIds=activePlayers(r).filter(pl=>!c.votes[pl.playerId]).map(pl=>pl.playerId);
    if(c.wolfPlayerId&&c.votes[c.wolfPlayerId]&&!c.wolfDecision)c.wolfDecision={skip:true,timedOut:true,actionAt:Date.now()};
    c.phase="READY_TO_REVEAL";commitHost("Minął czas na głosowanie");scheduleAutoSettle(c);
  }
}
function hostStartMatch(){
  const r=runtime.host.room;if(!r||r.status!=="LOBBY")return;
  clearPhaseTimer();
  // Unlock the selected mode soundtrack during the START button gesture.
  // This is important on Safari/iPadOS because the automatic end of the prologue
  // happens later from a timer and may otherwise be denied by autoplay policy.
  primeMusicTrack(MODE[r.config.mode]?.music || 2);
  const aps=activePlayers(r);
  const minPlayers=minPlayersForRoom(r);
  if(aps.length<minPlayers){toast(`Potrzeba minimum ${minPlayers} Owiec.`,"error");return;}
  const offline=aps.filter(x=>!x.isBot&&!x.connected);
  if(offline.length){toast(`Czekamy na połączenie: ${offline.map(x=>x.name).join(", ")}`,"error");return;}
  const pf=preflight(r);
  if(pf.errors.length){runtime.modal={type:"preflight",errors:pf.errors,warnings:pf.warnings};render();return;}
  aps.forEach(x=>{x.points=0;x.tokens=startingTokens(r);x.stats=makeStats();x.replayReady=false;});
  r.match=startNewMatchState(r);r.status="PROLOGUE";r.paused=false;
  commitHost("Start meczu"); startPrologueTimer();
}

function startPrologueTimer(){
  stopPrologueTimer();
  runtime.host.prologueTimer=setInterval(()=>hostAdvancePrologue(false),4000);
}
function hostAdvancePrologue(manual=false){
  const r=runtime.host.room;if(!r||r.status!=="PROLOGUE"||r.paused)return;
  if(r.match.prologueIndex < PROLOGUE.length-1){
    r.match.prologueIndex++;
    commitHost("Prolog");
    // Po ręcznym kliknięciu daj pełne 4 sekundy na przeczytanie następnego tekstu.
    if(manual)startPrologueTimer();
  }else hostFinishPrologue();
}
function stopPrologueTimer(){if(runtime.host.prologueTimer){clearInterval(runtime.host.prologueTimer);runtime.host.prologueTimer=null;}}
function hostFinishPrologue(){
  const r=runtime.host.room;if(!r||r.status!=="PROLOGUE")return;
  stopPrologueTimer();r.status="ROUND";playMusic(MODE[r.config.mode].music);prepareRound();
}

function prepareRound(){
  const r=runtime.host.room,m=r.match;if(!r||!m||m.finalized)return;
  if(activePlayers(r).length<minPlayersForRoom(r)){hostFinalize(true);return;}
  if(m.settledRounds>=m.plannedRounds)return;
  m.roundNumber=m.settledRounds+1;
  const cur={
    roundId:uid("round"),attemptId:uid("attempt"),number:m.roundNumber,phase:"ROUND_PREPARE",
    type:null,questionId:null,questionKey:null,questionText:"",targetPlayerId:null,ramPlayerId:null,whichJudgePlayerId:null,
    assignedAuthorIds:[],answers:{},options:[],votes:{},tokenReservations:{},timedOutPlayerIds:[],timedOutAuthorIds:[],
    phaseStartedAt:0,phaseDeadlineAt:0,phaseRemainingMs:null,phaseTimedOut:false,timeoutPhase:null,
    wolfPlayerId:null,wolfDecision:null,settlement:null,createdAt:Date.now(),aborted:false
  };
  if(r.config.mode==="hardcore"){
    cur.ramPlayerId=getCurrentRam(r);
    cur.phase="QUESTION_INPUT";
  }else if(r.config.mode==="quiz"){
    const q=chooseQuizQuestion(r);
    if(!q){cur.phase="NO_QUESTIONS";m.current=cur;commitHost("Brak pytań Quiz");return;}
    cur.type="quiz";cur.questionId=q.questionId;cur.questionKey=q.questionKey;cur.questionText=q.text;cur.targetPlayerId=null;
    cur.options=shuffle(q.record.answers.map((text,i)=>({optionId:uid("opt"),text,authorPlayerId:null,candidatePlayerId:null,isCorrect:i===q.record.correctIndex})))
      .map((o,i)=>({...o,order:i,letter:COLORS[i]?.letter||String(i+1),colorKey:COLORS[i]?.key||"a"}));
    cur.correctOptionId=cur.options.find(o=>o.isCorrect)?.optionId||null;
    cur.phase="VOTING";
  }else{
    const q=chooseQuestion(r);
    if(!q){cur.phase="NO_QUESTIONS";m.current=cur;commitHost("Brak pytań");return;}
    cur.type=q.type;cur.questionId=q.questionId;cur.questionKey=q.questionKey;cur.questionText=q.text;cur.targetPlayerId=q.targetPlayerId;
    if(r.config.mode==="warmup"){
      if(q.type==="which_sheep") publishSheepOptions(r,cur);
      else{
        const cnt=actualAnswerCount(r);
        const ans=shuffle(q.record.answers.map(cleanText).filter(Boolean).filter(a=>graphemeCount(a)<=QUESTION_LIMIT)).slice(0,cnt);
        if(ans.length<cnt){cur.phase="NO_QUESTIONS";m.current=cur;commitHost("Brak odpowiedzi");return;}
        cur.options=makeTextOptions(ans,null);
        cur.phase="VOTING";
      }
    }else{
      if(q.type==="which_sheep") publishSheepOptions(r,cur); else beginAnswerInput(r,cur);
    }
  }
  assignWolf(r,cur);
  m.current=cur;
  armPhaseTimer(r,cur,true);
  commitHost("Nowa runda");
}

function getCurrentRam(r){
  const m=r.match;if(!m.ramOrder.length)return null;
  m.ramCursor%=m.ramOrder.length;
  return m.ramOrder[m.ramCursor];
}
function beginAnswerInput(r,cur){
  const n=actualAnswerCount(r);
  const eligible=activePlayers(r).filter(pl=>{
    if(r.config.mode!=="hardcore")return true;
    return n===activePlayers(r).length || pl.playerId!==cur.ramPlayerId;
  });
  cur.assignedAuthorIds=selectFairAuthors(r,eligible,n);
  cur.phase="ANSWER_INPUT";
}
function selectFairAuthors(r,eligible,count){
  const chosen=[], remaining=[...eligible];
  while(chosen.length<count && remaining.length){
    const min=Math.min(...remaining.map(pl=>r.match.answerAssignCounts[pl.playerId]||0));
    const group=shuffle(remaining.filter(pl=>(r.match.answerAssignCounts[pl.playerId]||0)===min));
    while(group.length && chosen.length<count){
      const pl=group.shift();chosen.push(pl.playerId);remaining.splice(remaining.findIndex(x=>x.playerId===pl.playerId),1);
    }
  }
  return chosen;
}
function publishSheepOptions(r,cur){
  const aps=activePlayers(r);
  r.match.whichJudgeCounts=r.match.whichJudgeCounts||{};
  aps.forEach(pl=>{if(!Number.isFinite(r.match.whichJudgeCounts[pl.playerId]))r.match.whichJudgeCounts[pl.playerId]=0;});
  if(!cur.whichJudgePlayerId){
    const min=Math.min(...aps.map(pl=>r.match.whichJudgeCounts[pl.playerId]||0));
    const candidates=aps.filter(pl=>(r.match.whichJudgeCounts[pl.playerId]||0)===min);
    cur.whichJudgePlayerId=pick(candidates)?.playerId||null;
  }
  cur.options=shuffle(aps).map((pl,i)=>({optionId:uid("opt"),order:i,candidatePlayerId:pl.playerId,text:"",authorPlayerId:null}));
  cur.phase="VOTING";
}
function makeTextOptions(texts,authorIds){
  return shuffle(texts.map((text,i)=>({optionId:uid("opt"),text,authorPlayerId:authorIds?authorIds[i]:null,candidatePlayerId:null})))
    .map((o,i)=>({...o,order:i,letter:COLORS[i]?.letter||String(i+1),colorKey:COLORS[i]?.key||"a"}));
}
function assignWolf(r,cur){
  if(r.config.mode==="quiz"||cur.type==="which_sheep"||!r.config.wolfEnabled){cur.wolfPlayerId=null;return;}
  const aps=activePlayers(r);if(!aps.length)return;
  const min=Math.min(...aps.map(pl=>r.match.wolfAssignCounts[pl.playerId]||0));
  let low=aps.filter(pl=>(r.match.wolfAssignCounts[pl.playerId]||0)===min);
  if(cur.ramPlayerId) low=low.filter(pl=>pl.playerId!==cur.ramPlayerId);
  cur.wolfPlayerId=low.length?pick(low).playerId:null;
}

function handleSubmitQuestion(pid,payload){
  const r=runtime.host.room,c=currentAttempt(r);
  ensurePhase(c,"QUESTION_INPUT"); if(c.ramPlayerId!==pid) throw gameErr("Tylko Baran tej rundy może wysłać pytanie.","ROLE");
  const type=payload.questionType==="which_sheep"?"which_sheep":"open";
  const text=validateUserText(payload.text,"Pytanie");
  c.questionText=text;c.type=type;c.questionId=null;c.questionKey=null;
  if(type==="which_sheep") publishSheepOptions(r,c); else beginAnswerInput(r,c);
  armPhaseTimer(r,c,true);
  return {message:"Pytanie zapisane."};
}
function handleSubmitAnswer(pid,payload){
  const r=runtime.host.room,c=currentAttempt(r);ensurePhase(c,"ANSWER_INPUT");
  if(!c.assignedAuthorIds.includes(pid)) throw gameErr("Nie jesteś autorem odpowiedzi w tej rundzie.","ROLE");
  if(c.answers[pid]) throw gameErr("Odpowiedź jest już zapisana.","DUPLICATE");
  const text=validateUserText(payload.text,"Odpowiedź");c.answers[pid]={text,actionAt:Date.now()};
  if(c.assignedAuthorIds.every(id=>c.answers[id])){
    c.options=shuffle(c.assignedAuthorIds.map(id=>({optionId:uid("opt"),text:c.answers[id].text,authorPlayerId:id,candidatePlayerId:null})))
      .map((o,i)=>({...o,order:i,letter:COLORS[i].letter,colorKey:COLORS[i].key}));
    c.phase="VOTING";
    armPhaseTimer(r,c,true);
  }
  return {message:"Odpowiedź zapisana."};
}
function handleSubmitVote(pid,payload){
  const r=runtime.host.room,c=currentAttempt(r);ensurePhase(c,"VOTING");
  if(c.votes[pid]) throw gameErr("Głos jest już zapisany.","DUPLICATE");
  const option=c.options.find(o=>o.optionId===payload.optionId);if(!option)throw gameErr("Ta odpowiedź nie jest już dostępna.","OPTION");
  const pl=playerById(pid),isWhichJudge=c.type==="which_sheep"&&c.whichJudgePlayerId===pid;
  const useToken=isWhichJudge?false:!!payload.useToken;
  if(useToken && pl.tokens<1) throw gameErr("Nie masz dostępnego Żetonu Wełny.","TOKEN");
  c.votes[pid]={optionId:option.optionId,useToken,actionAt:Date.now()};
  if(useToken)c.tokenReservations[pid]=1;
  checkReady(r,c);
  return {message:isWhichJudge?"Twój wybór został zapisany — reszta Stada próbuje go przewidzieć.":useToken?"Głos i Żeton Wełny zapisane.":"Głos zapisany."};
}
function handleSubmitHunt(pid,payload,skip){
  const r=runtime.host.room,c=currentAttempt(r);
  if(c.phase!=="VOTING" && c.phase!=="READY_TO_REVEAL") throw gameErr("Polowanie nie jest dostępne.","PHASE");
  if(c.wolfPlayerId!==pid) throw gameErr("Nie jesteś Wilkiem tej rundy.","ROLE");
  if(!c.votes[pid]) throw gameErr("Najpierw zatwierdź swój głos.","VOTE");
  if(c.wolfDecision) throw gameErr("Decyzja Wilka jest już zapisana.","DUPLICATE");
  if(skip){c.wolfDecision={skip:true,actionAt:Date.now()};}
  else{
    const targetId=String(payload.targetPlayerId||""),optionId=String(payload.optionId||"");
    if(targetId===pid) throw gameErr("Wilk nie może polować na siebie.","TARGET");
    if(!activePlayers(r).some(pl=>pl.playerId===targetId))throw gameErr("Wybrana Owca nie jest aktywna.","TARGET");
    if(!c.options.some(o=>o.optionId===optionId))throw gameErr("Nieprawidłowy typ odpowiedzi.","OPTION");
    c.wolfDecision={skip:false,targetPlayerId:targetId,optionId,actionAt:Date.now()};
  }
  checkReady(r,c);return {message:skip?"Wilk odpuścił polowanie.":"Polowanie zapisane."};
}
function checkReady(r,c){
  const ids=activePlayers(r).map(pl=>pl.playerId);
  const ready=ids.every(id=>{
    if(!c.votes[id])return false;
    if(c.wolfPlayerId===id)return !!c.wolfDecision;
    return true;
  });
  if(ready){
    clearPhaseTimer();c.phaseDeadlineAt=0;c.phaseRemainingMs=null;
    c.phase="READY_TO_REVEAL";
    scheduleAutoSettle(c);
  }
}
function scheduleAutoSettle(c){
  const attemptId=c?.attemptId;
  if(!attemptId)return;
  setTimeout(()=>{
    const r=runtime.host.room,current=currentAttempt(r);
    if(!r||!current||current.attemptId!==attemptId)return;
    if(current.phase!=="READY_TO_REVEAL"||current.settlement)return;
    hostSettleRound();
  },120);
}
function ensurePhase(c,phase){if(!c||c.phase!==phase)throw gameErr("Ta akcja nie jest dostępna w obecnej fazie.","PHASE");if(c.phaseDeadlineAt&&Date.now()>c.phaseDeadlineAt)throw gameErr("Czas na tę akcję już minął.","TIMEOUT");}
function gameErr(msg,code){const e=new Error(msg);e.code=code;return e;}
function validateUserText(raw,label){
  const t=cleanText(raw);if(!t)throw gameErr(`${label} nie może być puste.`,"TEXT");
  if(graphemeCount(t)>QUESTION_LIMIT)throw gameErr(`${label} może mieć maksymalnie ${QUESTION_LIMIT} znaków.`,"TEXT");
  return t;
}


/* -------------------- ROUND SETTLEMENT / FINAL -------------------- */

function hostSettleRound(){
  const r=runtime.host.room,c=currentAttempt(r);
  if(!r||!c||c.phase!=="READY_TO_REVEAL"){toast("Najpierw wszystkie Owce muszą zakończyć swoje działania.","error");return;}
  if(c.settlement){toast("Ta runda została już rozliczona.","error");return;}
  clearPhaseTimer();c.phaseDeadlineAt=0;c.phaseRemainingMs=null;
  const aps=activePlayers(r),isWhich=c.type==="which_sheep",whichJudgePlayerId=isWhich?c.whichJudgePlayerId:null;
  const whichJudgeVote=whichJudgePlayerId?c.votes[whichJudgePlayerId]:null;
  const whichCorrectOptionId=isWhich?(whichJudgeVote?.optionId||null):null;
  const counts={}; c.options.forEach(o=>counts[o.optionId]=0);
  // W „Która Owca?” licznik pokazuje przewidywania pozostałych graczy; wybór Owcy odniesienia jest kluczem odpowiedzi.
  aps.forEach(pl=>{if(isWhich&&pl.playerId===whichJudgePlayerId)return;const v=c.votes[pl.playerId];if(v&&counts[v.optionId]!==undefined)counts[v.optionId]++;});
  const maxVotes=Math.max(0,...Object.values(counts));
  const topIds=Object.keys(counts).filter(id=>counts[id]===maxVotes && maxVotes>0);
  const tiedTop=topIds.length>1;
  const singletonIds=Object.keys(counts).filter(id=>counts[id]===1);
  const correctOptionId=c.type==="quiz"?c.correctOptionId:null;
  const blackOptionId=(c.type==="quiz"||isWhich)?null:(singletonIds.length===1?singletonIds[0]:null);
  const ledger={};
  aps.forEach(pl=>ledger[pl.playerId]={playerId:pl.playerId,before:pl.points,base:0,voteAward:"none",tokenUsed:false,tokenDelta:0,authorToken:0,wolfDelta:0,lostToWolf:0,timedOut:(c.timedOutPlayerIds||[]).includes(pl.playerId),after:pl.points});

  // 1) Base voting result + 2) Wool Token multiplier.
  aps.forEach(pl=>{
    const v=c.votes[pl.playerId],L=ledger[pl.playerId]; if(!v)return;
    let base=0,award="outside";
    if(c.type==="quiz"){
      const correct=!!correctOptionId&&v.optionId===correctOptionId;base=correct?2:0;award=correct?"quiz_correct":"quiz_wrong";
    }else if(isWhich){
      if(pl.playerId===whichJudgePlayerId){base=0;award="which_judge";}
      else if(!whichCorrectOptionId){base=0;award="which_no_key";}
      else{const correct=v.optionId===whichCorrectOptionId;base=correct?2:0;award=correct?"which_correct":"which_wrong";}
    }else if(blackOptionId && v.optionId===blackOptionId){base=3;award="black";}
    else if(topIds.includes(v.optionId)){base=tiedTop?1:2;award=tiedTop?"tie":"herd";}
    const tokenCounts=!!v.useToken && !(isWhich&&(pl.playerId===whichJudgePlayerId||!whichCorrectOptionId));
    L.base=base;L.voteAward=award;L.tokenUsed=tokenCounts;
    const votePoints=tokenCounts?base*2:base;
    L.votePoints=votePoints;
    pl.points+=votePoints;
    pl.stats.roundsPlayed++;pl.stats.votesCast++;
    if(award==="quiz_correct")pl.stats.quizCorrect++;
    else if(award==="quiz_wrong")pl.stats.quizWrong++;
    else if(award==="which_correct")pl.stats.whichHits=(pl.stats.whichHits||0)+1;
    else if(award==="which_wrong")pl.stats.whichMisses=(pl.stats.whichMisses||0)+1;
    else if(award==="which_judge")pl.stats.whichJudgeRounds=(pl.stats.whichJudgeRounds||0)+1;
    else if(award==="herd"||award==="tie")pl.stats.herdWins++;
    else if(award==="black")pl.stats.blackSheepWins++;
    else if(award!=="which_no_key"){pl.stats.outsideHerd++; if(base===0)pl.stats.zeroBaseRounds++;}
    if(tokenCounts){
      pl.tokens=Math.max(0,pl.tokens-1);pl.stats.tokensUsed++;
      if(base>0)pl.stats.tokensSuccessful++;
      L.tokenDelta=-1;
    }
  });

  // 3) Reward authors of the most-voted player-written answer(s).
  if(!["warmup","quiz"].includes(r.config.mode) && c.type!=="which_sheep"){
    topIds.forEach(oid=>{
      const opt=c.options.find(o=>o.optionId===oid); if(!opt?.authorPlayerId)return;
      const author=playerById(opt.authorPlayerId,r); if(!author||!author.active||author.removed)return;
      author.tokens++;author.stats.tokensEarned++;author.stats.answersWon++;
      if(ledger[author.playerId])ledger[author.playerId].authorToken++;
    });
  }

  // Count settled author opportunities only now; aborted attempts never count.
  (c.assignedAuthorIds||[]).forEach(pid=>{
    const pl=playerById(pid,r);if(!pl||!pl.active||pl.removed)return;
    pl.stats.answerOpportunities++; if(c.answers?.[pid])pl.stats.answersWritten++;
    r.match.answerAssignCounts[pid]=(r.match.answerAssignCounts[pid]||0)+1;
  });
  if(c.targetPlayerId){
    const target=playerById(c.targetPlayerId,r);if(target&&target.active&&!target.removed){target.stats.targetRounds++;r.match.targetPickCounts[target.playerId]=(r.match.targetPickCounts[target.playerId]||0)+1;}
  }
  if(c.ramPlayerId){
    const ram=playerById(c.ramPlayerId,r);if(ram&&ram.active&&!ram.removed)ram.stats.ramRounds++;
  }

  // 4) Wolf resolution.
  let wolfResult=null;
  if(c.wolfPlayerId){
    const wolf=playerById(c.wolfPlayerId,r);
    if(wolf&&wolf.active&&!wolf.removed){
      wolf.stats.wolfRounds++;r.match.wolfAssignCounts[wolf.playerId]=(r.match.wolfAssignCounts[wolf.playerId]||0)+1;
      const d=c.wolfDecision;
      if(!d || d.skip){
        wolf.stats.wolfSkipped++;
        wolfResult={wolfPlayerId:wolf.playerId,skip:true,timedOut:!!d?.timedOut,hit:false,delta:0};
      }else{
        const target=playerById(d.targetPlayerId,r),targetVote=c.votes[d.targetPlayerId];
        wolf.stats.wolfTargets.push(d.targetPlayerId);
        // Jeżeli cel nie zagłosował przed końcem czasu, polowanie jest neutralne:
        // bez +1 dla Wilka, bez -1 za pudło i bez -2 dla celu.
        if(!targetVote){
          wolf.stats.wolfSkipped++;
          wolfResult={wolfPlayerId:wolf.playerId,skip:false,neutral:true,reason:"target_timeout",hit:false,targetPlayerId:d.targetPlayerId,predictedOptionId:d.optionId,targetOptionId:null,delta:0,targetLoss:0};
        }else{
          const hit=targetVote.optionId===d.optionId;
          if(hit){
            wolf.points+=1;wolf.stats.wolfHits++;wolf.stats.wolfPointsGained++;
            const before=target?target.points:0,loss=target?Math.min(2,target.points):0;
            if(target){target.points-=loss;target.stats.pointsLostToWolf+=loss;}
            wolf.stats.actualStolen+=loss;
            if(ledger[wolf.playerId])ledger[wolf.playerId].wolfDelta+=1;
            if(target&&ledger[target.playerId]){ledger[target.playerId].wolfDelta-=loss;ledger[target.playerId].lostToWolf+=loss;}
            wolfResult={wolfPlayerId:wolf.playerId,skip:false,hit:true,targetPlayerId:d.targetPlayerId,predictedOptionId:d.optionId,targetOptionId:targetVote.optionId,delta:1,targetLoss:loss,targetBefore:before};
          }else{
            const loss=Math.min(1,wolf.points);wolf.points-=loss;wolf.stats.wolfMisses++;wolf.stats.wolfPointsLost+=loss;
            if(ledger[wolf.playerId])ledger[wolf.playerId].wolfDelta-=loss;
            wolfResult={wolfPlayerId:wolf.playerId,skip:false,hit:false,targetPlayerId:d.targetPlayerId,predictedOptionId:d.optionId,targetOptionId:targetVote.optionId,delta:-loss,targetLoss:0};
          }
        }
      }
    }
  }

  aps.forEach(pl=>{if(ledger[pl.playerId])ledger[pl.playerId].after=pl.points;});
  const voterMap={};c.options.forEach(o=>voterMap[o.optionId]=aps.filter(pl=>(!isWhich||pl.playerId!==whichJudgePlayerId)&&c.votes[pl.playerId]?.optionId===o.optionId).map(pl=>pl.playerId));
  if(isWhich&&whichJudgePlayerId&&whichCorrectOptionId){
    r.match.whichJudgeCounts=r.match.whichJudgeCounts||{};
    r.match.whichJudgeCounts[whichJudgePlayerId]=(r.match.whichJudgeCounts[whichJudgePlayerId]||0)+1;
  }
  c.settlement={
    settledAt:Date.now(),counts,topOptionIds:topIds,tiedTop,blackOptionId,correctOptionId,whichJudgePlayerId,whichCorrectOptionId,voterMap,ledger,wolfResult,
    optionResults:c.options.map(o=>({optionId:o.optionId,text:o.text,candidatePlayerId:o.candidatePlayerId,authorPlayerId:o.authorPlayerId,count:counts[o.optionId]||0,letter:o.letter,colorKey:o.colorKey}))
  };
  c.phase="RESULT";
  r.match.settledRounds++;
  r.match.typeHistory.push(c.type);
  r.match.history.push(makeHistoryEntry(r,c));
  if(c.ramPlayerId && r.config.mode==="hardcore" && r.match.ramOrder.length){r.match.ramCursor=(r.match.ramCursor+1)%r.match.ramOrder.length;}
  commitHost("Rozliczono rundę");
}

function makeHistoryEntry(r,c){
  const s=c.settlement;
  if(c.type==="quiz"){
    const correct=optionLabel(c,c.options.find(o=>o.optionId===s.correctOptionId),true);
    return {round:c.number,type:c.type,question:c.questionText,top:correct,correctAnswer:correct,blackPlayerId:null,wolfResult:s.wolfResult||null,at:Date.now()};
  }
  if(c.type==="which_sheep"){
    const correct=optionLabel(c,c.options.find(o=>o.optionId===s.whichCorrectOptionId),true);
    const judge=playerById(s.whichJudgePlayerId,r);
    const hits=s.whichCorrectOptionId?(s.voterMap[s.whichCorrectOptionId]||[]).length:0;
    return {round:c.number,type:c.type,question:c.questionText,top:correct,correctAnswer:correct,whichJudgePlayerId:s.whichJudgePlayerId||null,whichHits:hits,blackPlayerId:null,wolfResult:null,at:Date.now()};
  }
  const topNames=s.topOptionIds.map(id=>optionLabel(c,c.options.find(o=>o.optionId===id),true));
  const blackVoter=s.blackOptionId?(s.voterMap[s.blackOptionId]||[])[0]:null;
  return {
    round:c.number,type:c.type,question:c.questionText,top:topNames.join(" / "),
    blackPlayerId:blackVoter||null,wolfResult:s.wolfResult||null,at:Date.now()
  };
}

function hostNextRound(){
  const r=runtime.host.room,m=r?.match,c=m?.current;
  if(!r||!m||!c||c.phase!=="RESULT")return;
  if(m.settledRounds>=m.plannedRounds){hostFinalize(false);return;}
  prepareRound();
}

function hostAbortAttempt(reason="Pominięto pytanie.",fromRemoval=false){
  const r=runtime.host.room,m=r?.match,c=m?.current;if(!r||!m||m.finalized)return;
  clearPhaseTimer();
  if(c?.settlement){toast("Rozliczonej rundy nie można anulować.","error");return;}
  if(c){c.aborted=true;c.abortReason=reason;c.phase="ABORTED";c.tokenReservations={};}
  m.current=null;
  commitHost(reason);
  if(activePlayers(r).length>=minPlayersForRoom(r))setTimeout(()=>prepareRound(),80);
}

function hostFinalize(early=false){
  const r=runtime.host.room,m=r?.match;if(!r||!m||m.finalized)return;
  clearPhaseTimer();
  if(m.current && !m.current.settlement){m.current.aborted=true;m.current.tokenReservations={};m.current=null;}
  stopPrologueTimer();
  if(m.settledRounds===0){
    m.finalized=true;m.earlyEnded=!!early;r.status="FINAL";
    m.finalResult={noWinner:true,reason:"Gra zakończona przed rozegraniem pierwszej rundy.",rankings:[],podium:[],awards:{herd:[],black:[],quiz:[],allIn:[]}};
    commitHost("Gra zakończona przed rozpoczęciem");return;
  }
  const aps=classifiedPlayers(r);
  aps.forEach(pl=>{
    pl.stats.scoreBeforeRedemption=pl.points;
    const bonus=pl.tokens;pl.points+=bonus;pl.stats.tokenBonusPoints=bonus;pl.stats.tokensRedeemed=bonus;pl.stats.finalScore=pl.points;
  });
  const result=buildFinalResult(r);
  m.finalized=true;m.earlyEnded=!!early;m.finalResult=result;r.status="FINAL";r.paused=false;
  commitHost("Finał gry");
}

function buildFinalResult(r){
  const players=classifiedPlayers(r).slice().sort((a,b)=>b.points-a.points||a.joinedAt-b.joinedAt);
  const levels=[...new Set(players.map(p=>p.points))].sort((a,b)=>b-a);
  const rankByScore=new Map(levels.map((score,i)=>[score,i+1]));
  players.forEach(p=>{p.stats.finalPlace=rankByScore.get(p.points);});
  const podium=players.filter(p=>p.stats.finalPlace<=3).map(p=>p.playerId);
  const award=(field)=>{
    const max=Math.max(0,...players.map(p=>p.stats[field]||0));
    return max>0?players.filter(p=>(p.stats[field]||0)===max).map(p=>p.playerId):[];
  };
  return {
    noWinner:false,rankings:players.map(p=>({playerId:p.playerId,points:p.points,place:p.stats.finalPlace})),podium,
    awards:{herd:award("herdWins"),black:award("blackSheepWins"),quiz:award("quizCorrect"),allIn:award("tokensUsed")},finishedAt:Date.now()
  };
}

function hostReplay(){
  const r=runtime.host.room;if(!r||r.status!=="FINAL")return;
  clearPhaseTimer();
  const aps=activePlayers(r),minPlayers=minPlayersForRoom(r);if(aps.length<minPlayers){toast(`Do rewanżu potrzeba minimum ${minPlayers} Owiec.`,"error");return;}
  aps.forEach(p=>{p.points=0;p.tokens=startingTokens(r);p.stats=makeStats();p.replayReady=false;});
  r.match=startNewMatchState(r);r.status="PROLOGUE";r.paused=false;r.actionLog={};
  playMusic(1);commitHost("Rewanż");startPrologueTimer();
}

function hostNewGame(){
  const r=runtime.host.room;if(!r)return;
  clearPhaseTimer();
  stopPrologueTimer();
  activePlayers(r).forEach(p=>{p.points=0;p.tokens=startingTokens(r);p.stats=makeStats();p.replayReady=false;});
  r.match=null;r.status="CONFIG";r.paused=false;r.actionLog={};runtime.configDraft=ensureQuizConfig({...r.config});
  playMusic(1);commitHost("Nowa gra — konfiguracja");
}

function hostCloseRoom(){
  const r=runtime.host.room;if(!r)return;
  clearPhaseTimer();
  r.closed=true;r.status="CLOSED";broadcast({type:"ROOM_CLOSED",message:"Prowadzący zamknął pokój."});
  stopPrologueTimer();releaseWakeLock();releaseHostLock();
  try{runtime.host.peer?.destroy();}catch{}
  localStorage.removeItem(HOST_STORAGE_KEY);runtime.host.room=null;runtime.host.peer=null;runtime.host.conns.clear();runtime.host.playerConns.clear();
  runtime.role="start";runtime.modal=null;pauseAllMusic();render();
}

function hostTogglePause(){
  const r=runtime.host.room;if(!r||!["ROUND","PROLOGUE"].includes(r.status))return;
  const willPause=!r.paused;
  if(willPause)pausePhaseTimer(r);
  r.paused=willPause;
  if(r.paused){pauseCurrentMusic();runtime.audio.pausedByGame=true;}else{runtime.audio.pausedByGame=false;playMusic(r.status==="PROLOGUE"?1:MODE[r.config.mode].music);resumePhaseTimer(r);}
  commitHost(r.paused?"Pauza":"Wznowiono grę");
}

/* -------------------- DEMO BOTS -------------------- */

function bots(){return activePlayers(runtime.host.room).filter(p=>p.isBot);}
function hasBots(){return bots().length>0;}
function demoQuestion(){
  const r=runtime.host.room,c=currentAttempt(r);if(!r||!c||c.phase!=="QUESTION_INPUT")return;
  const ram=playerById(c.ramPlayerId);if(!ram?.isBot){toast("Baran tej rundy nie jest BOT-em.","error");return;}
  const type=Math.random()<.25?"which_sheep":"open";
  handleSubmitQuestion(ram.playerId,{questionType:type,text:type==="which_sheep"?"Która Owca jako pierwsza zrobiłaby z tego większy problem niż trzeba?":"Stado trafia w sytuację, której nikt nie planował. Co robicie?"});
  commitHost("BOT przygotował pytanie");
}
function demoAnswers(){
  const r=runtime.host.room,c=currentAttempt(r);if(!r||!c||c.phase!=="ANSWER_INPUT")return;
  const samples=["Najpierw udajemy, że wszystko jest pod kontrolą.","Ktoś mówi: „mam plan”, więc zaczynamy się martwić.","Idziemy po jedzenie. Priorytety są priorytetami.","Robimy dokładnie to, czego nie było w planie.","Pytamy obcą osobę i uznajemy ją za eksperta."];
  let n=0;
  for(const pid of c.assignedAuthorIds){const pl=playerById(pid);if(pl?.isBot&&!c.answers[pid]){handleSubmitAnswer(pid,{text:samples[n++%samples.length]});}}
  commitHost("BOT-y przygotowały odpowiedzi");
}
function demoVotes(){
  const r=runtime.host.room,c=currentAttempt(r);if(!r||!c||c.phase!=="VOTING")return;
  for(const pl of bots()){
    if(!c.votes[pl.playerId]&&c.options.length){const opt=pick(c.options);handleSubmitVote(pl.playerId,{optionId:opt.optionId,useToken:pl.tokens>0&&Math.random()<.15});}
  }
  commitHost("BOT-y zagłosowały");
}
function demoHunt(){
  const r=runtime.host.room,c=currentAttempt(r);if(!r||!c||!c.wolfPlayerId)return;
  const wolf=playerById(c.wolfPlayerId);if(!wolf?.isBot||c.wolfDecision||!c.votes[wolf.playerId])return;
  const targets=activePlayers(r).filter(p=>p.playerId!==wolf.playerId);if(!targets.length)return;
  const target=pick(targets),opt=pick(c.options);
  handleSubmitHunt(wolf.playerId,{targetPlayerId:target.playerId,optionId:opt.optionId},Math.random()<.12);
  commitHost("BOT-Wilk zakończył polowanie");
}

/* -------------------- SNAPSHOTS / PERSISTENCE -------------------- */

function commitHost(_reason=""){
  const r=runtime.host.room;if(!r)return;
  r.revision=(r.revision||0)+1;r.updatedAt=Date.now();persistHost();broadcastSnapshots();render();
}

function broadcastSnapshots(){
  const r=runtime.host.room;if(!r)return;
  runtime.host.playerConns.forEach((conn,pid)=>{if(conn?.open)send(conn,{type:"SNAPSHOT",snapshot:buildPlayerSnapshot(pid)});});
  // Keep people who are still on the join screen up to date. This avoids
  // several phones selecting an avatar that another player has just taken.
  runtime.host.conns.forEach(conn=>{if(conn?.open&&!conn.__playerId)send(conn,roomInfoMessage());});
}
function broadcast(msg){runtime.host.conns.forEach(conn=>{if(conn?.open)send(conn,msg);});}

function buildPublicPlayers(r){
  return activePlayers(r).map(p=>({playerId:p.playerId,name:p.name,sheepId:p.sheepId,points:p.points,tokens:p.tokens,connected:p.connected||p.isBot,isBot:p.isBot}));
}
function publicOption(c,o,reveal=false){
  const out={optionId:o.optionId,order:o.order,letter:o.letter||COLORS[o.order]?.letter,colorKey:o.colorKey||COLORS[o.order]?.key};
  if(c.type==="which_sheep")out.candidatePlayerId=o.candidatePlayerId;else out.text=o.text;
  if(reveal&&o.authorPlayerId)out.authorPlayerId=o.authorPlayerId;
  return out;
}
function buildPlayerSnapshot(pid){
  const r=runtime.host.room,pl=playerById(pid,r);if(!r||!pl)return null;
  const m=r.match,c=m?.current;
  const snap={
    schemaVersion:SCHEMA_VERSION,appVersion:APP_VERSION,protocolVersion:PROTOCOL_VERSION,revision:r.revision,
    roomId:r.roomId,roomCode:r.roomCode,status:r.status,paused:r.paused,config:{...r.config},
    self:{playerId:pl.playerId,name:pl.name,sheepId:pl.sheepId,points:pl.points,tokens:pl.tokens,replayReady:pl.replayReady,stats:{...pl.stats}},
    players:buildPublicPlayers(r),match:null
  };
  if(!m)return snap;
  snap.match={matchId:m.matchId,plannedRounds:m.plannedRounds,settledRounds:m.settledRounds,roundNumber:m.roundNumber,phase:m.phase,prologueIndex:m.prologueIndex,finalized:m.finalized,finalResult:null,current:null};
  if(m.finalized){
    snap.match.finalResult=JSON.parse(JSON.stringify(m.finalResult));
    snap.match.personalSummary=buildPersonalFinalSummary(r,pl);
    return snap;
  }
  if(!c)return snap;
  const reveal=!!c.settlement;
  snap.match.current={
    attemptId:c.attemptId,number:c.number,phase:c.phase,type:c.type,questionText:c.questionText,
    phaseDeadlineAt:c.phaseDeadlineAt||0,timedOutPlayerIds:[...(c.timedOutPlayerIds||[])],timedOutAuthorIds:[...(c.timedOutAuthorIds||[])],
    targetPlayerId:c.targetPlayerId,ramPlayerId:c.ramPlayerId,whichJudgePlayerId:c.whichJudgePlayerId||null,
    isRam:c.ramPlayerId===pid,isAuthor:c.assignedAuthorIds.includes(pid),isWolf:c.wolfPlayerId===pid,isWhichJudge:c.type==="which_sheep"&&c.whichJudgePlayerId===pid,
    myAnswer:c.answers?.[pid]?.text||"",myVote:c.votes?.[pid]||null,myWolfDecision:c.wolfPlayerId===pid?c.wolfDecision||null:null,
    authorProgress:{done:Object.keys(c.answers||{}).length,total:(c.assignedAuthorIds||[]).length},
    votingProgress:{done:Object.keys(c.votes||{}).length,total:activePlayers(r).length},
    options:(c.options||[]).map(o=>publicOption(c,o,reveal)),settlement:reveal?personalSettlementView(r,c,pid):null
  };
  return snap;
}

function personalSettlementView(r,c,pid){
  const s=c.settlement,L=s.ledger[pid]||null;
  return {
    counts:{...s.counts},topOptionIds:[...s.topOptionIds],tiedTop:s.tiedTop,blackOptionId:s.blackOptionId,correctOptionId:s.correctOptionId||null,
    whichJudgePlayerId:s.whichJudgePlayerId||null,whichCorrectOptionId:s.whichCorrectOptionId||null,
    voterMap:JSON.parse(JSON.stringify(s.voterMap)),
    optionResults:s.optionResults.map(x=>({...x})),wolfResult:s.wolfResult?{...s.wolfResult}:null,ledger:L?{...L}:null
  };
}

function persistHost(){
  try{if(runtime.host.room)localStorage.setItem(HOST_STORAGE_KEY,JSON.stringify({savedAt:Date.now(),room:runtime.host.room}));}
  catch(e){runtime.host.storageOK=false;console.warn("STADO host persistence",e);}
}
function restoreHostSnapshot(){
  const saved=readJSON(HOST_STORAGE_KEY);if(!saved?.room||saved.room.closed)return false;
  const r=saved.room;if(r.protocolVersion!==PROTOCOL_VERSION)return false;
  ensureQuizConfig(r.config);if(r.config.mode==="quiz")r.config.wolfEnabled=false;
  runtime.role="host";runtime.host.room=r;runtime.configDraft=ensureQuizConfig({responseTimeSec:60,quizDifficulty:"medium",quizCategories:[...ALL_QUIZ_CATEGORY_KEYS],...r.config});
  const restoredCurrent=r.match?.current;
  if(restoredCurrent&&isTimedPhase(restoredCurrent.phase)&&restoredCurrent.phaseDeadlineAt){
    restoredCurrent.phaseRemainingMs=Math.max(1000,restoredCurrent.phaseDeadlineAt-(saved.savedAt||Date.now()));
    restoredCurrent.phaseDeadlineAt=0;
  }
  r.paused=true;
  r.players.forEach(p=>{if(!p.isBot){p.connected=false;p.peerId="";}});
  acquireHostLock();render();
  const peer=createPeer(r.hostPeerId);runtime.host.peer=peer;
  peer.on("open",()=>{setupHostPeerHandlers(peer);persistHost();broadcastSnapshots();render();toast("Pokój odzyskany. Gra została wstrzymana dla bezpieczeństwa.");});
  peer.on("error",err=>toast(`Nie udało się odzyskać identyfikatora pokoju: ${err?.type||"błąd"}. Zamknij poprzednią kartę lub spróbuj ponownie.`,"error"));
  requestWakeLock();playMusic(r.status==="ROUND"?MODE[r.config.mode].music:1);pauseCurrentMusic();runtime.audio.pausedByGame=true;
  return true;
}
function discardHostSnapshot(){localStorage.removeItem(HOST_STORAGE_KEY);releaseHostLock();runtime.host.room=null;runtime.host.peer=null;runtime.role="start";runtime.modal=null;render();}

function getTabId(){let id=sessionStorage.getItem(TAB_STORAGE_KEY);if(!id){id=uid("tab");sessionStorage.setItem(TAB_STORAGE_KEY,id);}return id;}
function acquireHostLock(){
  const tabId=getTabId(),cur=readJSON(LOCK_STORAGE_KEY);
  if(cur&&cur.tabId!==tabId&&Date.now()-cur.ts<9000){toast("Uwaga: inna karta może już prowadzić ten pokój.","error");}
  try{localStorage.setItem(LOCK_STORAGE_KEY,JSON.stringify({tabId,ts:Date.now()}));}catch{}
  if(runtime.host.lockTimer)clearInterval(runtime.host.lockTimer);
  runtime.host.lockTimer=setInterval(()=>{if(runtime.role==="host"&&runtime.host.room)try{localStorage.setItem(LOCK_STORAGE_KEY,JSON.stringify({tabId,ts:Date.now()}));}catch{}},4000);
}
function releaseHostLock(){if(runtime.host.lockTimer)clearInterval(runtime.host.lockTimer);runtime.host.lockTimer=null;const cur=readJSON(LOCK_STORAGE_KEY);if(cur?.tabId===getTabId())localStorage.removeItem(LOCK_STORAGE_KEY);}

/* -------------------- PLAYER NETWORK -------------------- */

let previewDebounce=null;
function debouncePreview(code){clearTimeout(previewDebounce);previewDebounce=setTimeout(()=>previewRoom(code),250);}
function previewRoom(code){
  code=cleanRoomCode(code);if(code.length!==6||typeof window.Peer==="undefined")return;
  closePlayerNetwork(false);
  const peer=createPeer();runtime.player.peer=peer;runtime.player.reconnecting=false;
  peer.on("open",()=>{
    const conn=peer.connect(`stado-${code}`,{reliable:true,serialization:"json"});runtime.player.conn=conn;
    setupPlayerConn(conn,{preview:true});
  });
  peer.on("error",()=>{});
}
function setupPlayerConn(conn,opts={}){
  conn.on("open",()=>{
    const p=runtime.player;
    if(p.conn===conn){clearTimeout(p.joinOpenTimer);p.joinOpenTimer=null;}
    p.connected=true;p.lastPong=Date.now();
    if(opts.connectionMode)p.joinConnectionMode=opts.connectionMode;
    startHeartbeat();
    send(conn,{type:"HELLO",protocolVersion:PROTOCOL_VERSION,appVersion:APP_VERSION});
    if(opts.resume){
      send(conn,{type:"RESUME",protocolVersion:PROTOCOL_VERSION,appVersion:APP_VERSION,payload:{...p.identity}});
      clearTimeout(p.resumeWelcomeTimer);
      p.resumeWelcomeTimer=setTimeout(()=>{if(p.identity&&p.reconnecting&&p.conn===conn)failResumeConnection(conn,"resume-welcome-timeout");},NETWORK.resumeWelcomeTimeoutMs||7000);
    }
    if(opts.join&&p.pendingJoin)sendPendingJoin(conn);
    if(opts.recover)send(conn,{type:"RECOVER_REQUEST",protocolVersion:PROTOCOL_VERSION,appVersion:APP_VERSION,payload:opts.recover});
    render();
  });
  conn.on("data",playerHandleMessage);
  // Do not permanently mark a connection as "preview". The same DataConnection
  // can now be promoted to the real player connection when DOŁĄCZ is pressed.
  conn.on("close",()=>playerDisconnected(conn));
  conn.on("error",err=>{if(runtime.player.joining)runtime.player.lastJoinError=err?.type||err?.message||"data-error";playerDisconnected(conn);});

  // PeerJS can occasionally leave a DataConnection in a silent "connecting"
  // state on carrier networks. React to an explicit ICE failure immediately.
  const pc=conn.peerConnection;
  if(pc?.addEventListener){
    let disconnectedTimer=null;
    pc.addEventListener("iceconnectionstatechange",()=>{
      const state=pc.iceConnectionState,p=runtime.player;
      if(p.conn!==conn)return;
      if(state==="connected"||state==="completed"){clearTimeout(disconnectedTimer);p.lastPong=Date.now();}
      if((state==="failed"||state==="closed")&&p.joining&&!p.identity)failJoinConnection(conn,`ice-${state}`);
      else if((state==="failed"||state==="closed")&&p.identity)failResumeConnection(conn,`ice-${state}`);
      else if(state==="disconnected"&&p.identity){
        clearTimeout(disconnectedTimer);disconnectedTimer=setTimeout(()=>{if(p.conn===conn&&pc.iceConnectionState==="disconnected")failResumeConnection(conn,"ice-disconnected");},1800);
      }
    });
  }
}
function keepActiveEditorOnSnapshot(nextSnapshot){
  // iOS/Safari zamyka klawiature, gdy podczas pisania podmienimy caly DOM.
  // Snapshoty od hosta przychodza m.in. wtedy, gdy inni gracze koncza swoje akcje.
  // Jesli dla tej Owcy nadal trwa dokladnie ten sam etap pisania, aktualizujemy
  // stan w tle bez renderowania ekranu i pozostawiamy textarea/fokus bez zmian.
  const field=document.activeElement?.dataset?.draft;
  if(field!=="question"&&field!=="answer")return false;
  const prev=runtime.player.snapshot,prevC=prev?.match?.current,nextC=nextSnapshot?.match?.current;
  if(!prevC||!nextC||prev?.status!=="ROUND"||nextSnapshot?.status!=="ROUND")return false;
  if(!!prev.paused!==!!nextSnapshot.paused)return false;
  if(prevC.attemptId!==nextC.attemptId||prevC.phase!==nextC.phase)return false;
  if(field==="question")return nextC.phase==="QUESTION_INPUT"&&!!nextC.isRam;
  return nextC.phase==="ANSWER_INPUT"&&!!nextC.isAuthor&&!nextC.myAnswer;
}

function playerHandleMessage(msg){
  if(!msg||typeof msg!=="object")return;
  if(msg.type==="PONG"){runtime.player.lastPong=Date.now();return;}
  if(msg.type==="ROOM_INFO"){runtime.player.roomInfo=msg;render();return;}
  if(msg.type==="WELCOME"){
    clearJoinTimers();
    runtime.player.joining=false;runtime.player.joinRetryAttempt=0;runtime.player.joinAttemptToken="";runtime.player.joinFailed=false;runtime.player.lastJoinError="";
    clearResumeTimers();runtime.player.reconnecting=false;runtime.player.reconnectAttempt=0;
    runtime.player.identity={...msg.identity,status:"active",drafts:runtime.player.drafts};runtime.player.snapshot=msg.snapshot;runtime.player.roomInfo=null;runtime.player.pendingJoin=null;
    setPlayerJoinURL(runtime.player.identity);persistPlayer();render();return;
  }
  if(msg.type==="SNAPSHOT"){
    const keepEditor=keepActiveEditorOnSnapshot(msg.snapshot);
    runtime.player.snapshot=msg.snapshot;
    syncDraftsToSnapshot();
    if(runtime.player.identity){runtime.player.identity.status="active";persistPlayer();}
    if(keepEditor){
      // Nie ruszamy DOM-u pola tekstowego: klawiatura i kursor zostaja na miejscu.
      updateCountdownNodes();
      return;
    }
    render();return;
  }
  if(msg.type==="ACK"){
    const pend=runtime.player.pending.get(msg.actionId);if(pend){runtime.player.pending.delete(msg.actionId);if(msg.ok){pend.resolve?.(msg);toast(msg.message||"Zapisano.");}else{pend.reject?.(msg);toast(msg.message||"Nie udało się zapisać.","error");}render();}return;
  }
  if(msg.type==="RECOVERY_PENDING"){runtime.player.waitingRecovery=true;toast(msg.message);render();return;}
  if(msg.type==="RECOVERY_RESULT"){
    runtime.player.waitingRecovery=false;if(msg.ok){runtime.player.identity={...msg.identity,status:"active",drafts:runtime.player.drafts};runtime.player.snapshot=msg.snapshot;setPlayerJoinURL(runtime.player.identity);persistPlayer();toast("Owca odzyskana.");}else toast(msg.message,"error");render();return;
  }
  if(msg.type==="REJECT"){
    clearJoinTimers();runtime.player.joining=false;
    if(msg.code==="KEY"&&runtime.player.identity){runtime.player.identity.resumeKey="";persistPlayer();}
    if(["SHEEP_TAKEN","NAME_TAKEN","FULL","ROOM_ID","STARTED","JOIN_MISMATCH"].includes(msg.code))runtime.player.joinAttemptToken="";
    if(msg.code==="SHEEP_TAKEN")runtime.player.joinDraft.sheepId="";
    toast(msg.message||"Połączenie odrzucone.","error");render();return;
  }
  if(msg.type==="REMOVED"){clearPlayerIdentity();clearJoinURL();toast(msg.message||"Usunięto Cię z gry.","error");runtime.player.snapshot=null;runtime.player.roomInfo=null;render();return;}
  if(msg.type==="ROOM_CLOSED"){clearPlayerIdentity();clearJoinURL();runtime.player.snapshot=null;runtime.player.roomInfo=null;toast(msg.message||"Pokój został zamknięty.","error");render();return;}
}
function playerDisconnected(conn=null){
  const p=runtime.player;
  // Ignore close/error events from a connection we intentionally replaced.
  if(conn && p.conn!==conn)return;
  p.connected=false;stopHeartbeat();
  if(p.identity?.playerId){p.reconnecting=true;scheduleReconnect(true);render();return;}
  if(p.pendingJoin&&p.joining){
    // Browsers may emit both error and close for the same failed ICE attempt.
    // Count that as one retry only.
    if(conn?.__stadoRetryTriggered)return;
    if(conn)conn.__stadoRetryTriggered=true;
    if(p.conn===conn)p.conn=null;
    scheduleJoinRetry();render();return;
  }
  render();
}
function startHeartbeat(){
  stopHeartbeat();runtime.player.heartbeat=setInterval(()=>{
    const p=runtime.player;if(!p.conn?.open)return;
    send(p.conn,{type:"PING",ts:Date.now()});
    if(p.identity&&Date.now()-p.lastPong>NETWORK.offlineAfterMs&&!p.reconnecting){
      failResumeConnection(p.conn,"heartbeat-timeout");
    }
  },NETWORK.heartbeatMs);
}
function stopHeartbeat(){if(runtime.player.heartbeat)clearInterval(runtime.player.heartbeat);runtime.player.heartbeat=null;}
function clearResumeTimers(){const p=runtime.player;clearTimeout(p.resumeOpenTimer);clearTimeout(p.resumeWelcomeTimer);p.resumeOpenTimer=null;p.resumeWelcomeTimer=null;}
function resumeModeForAttempt(n){const modes=NETWORK.resumeConnectionModes||["all","relay","relay","all"];return modes[Math.min(Math.max(0,n),modes.length-1)]||"relay";}
function scheduleReconnect(immediate=false){
  const p=runtime.player;if(!p.identity?.playerId||!p.identity?.resumeKey)return;
  clearTimeout(p.reconnectTimer);clearResumeTimers();
  const delays=NETWORK.resumeRetryDelays||[0,700,1600,3000,5000,8000],n=p.reconnectAttempt++;
  const delay=immediate?0:delays[Math.min(n,delays.length-1)];
  p.reconnecting=true;p.reconnectTimer=setTimeout(()=>startPlayerResume(false,resumeModeForAttempt(n)),delay);render();
}
function failResumeConnection(conn,reason="resume-failed"){
  const p=runtime.player;if(!p.identity?.playerId||p.conn!==conn)return;
  clearResumeTimers();stopHeartbeat();p.connected=false;p.reconnecting=true;
  p.conn=null;try{conn?.close();}catch{}
  const oldPeer=p.peer;p.peer=null;try{oldPeer?.destroy();}catch{}
  scheduleReconnect(false);
}
function startPlayerResume(force=false,forcedMode=""){
  const p=runtime.player,id=p.identity;if(!id?.roomCode||!id?.playerId||!id?.resumeKey){if(force)toast("Brak klucza automatycznego powrotu. Użyj „Wróć do swojej Owcy”.","error");return;}
  closePlayerNetwork(false);clearResumeTimers();p.reconnecting=true;render();
  const mode=forcedMode||resumeModeForAttempt(Math.max(0,p.reconnectAttempt-1));p.resumeConnectionMode=mode;
  const peer=createPeer(null,mode);p.peer=peer;
  peer.on("open",()=>{
    if(p.peer!==peer)return;
    const conn=peer.connect(`stado-${id.roomCode}`,{reliable:true,serialization:"json"});p.conn=conn;setupPlayerConn(conn,{resume:true,connectionMode:mode});
    clearTimeout(p.resumeOpenTimer);p.resumeOpenTimer=setTimeout(()=>{if(p.conn===conn&&!conn.open&&p.identity)failResumeConnection(conn,`resume-open-timeout-${mode}`);},NETWORK.resumeOpenTimeoutMs||6500);
  });
  peer.on("error",()=>{if(p.peer!==peer)return;p.connected=false;p.reconnecting=true;scheduleReconnect(false);render();});
}
function kickPlayerReconnect(){
  const p=runtime.player;if(runtime.role!=="player"||!p.identity?.playerId||p.joining)return;
  if(p.connected&&p.conn?.open&&Date.now()-p.lastPong<NETWORK.offlineAfterMs)return;
  if(p.reconnecting&&(p.reconnectTimer||p.peer))return;
  scheduleReconnect(true);
}
function clearJoinTimers(){
  const p=runtime.player;
  clearTimeout(p.joinRetryTimer);clearTimeout(p.joinWelcomeTimer);clearTimeout(p.joinOpenTimer);
  p.joinRetryTimer=null;p.joinWelcomeTimer=null;p.joinOpenTimer=null;
}
function sendPendingJoin(conn=runtime.player.conn){
  const p=runtime.player;if(!conn?.open||!p.pendingJoin)return false;
  send(conn,{type:"JOIN",protocolVersion:PROTOCOL_VERSION,appVersion:APP_VERSION,payload:p.pendingJoin});
  clearTimeout(p.joinWelcomeTimer);
  p.joinWelcomeTimer=setTimeout(()=>{
    if(!p.identity&&p.pendingJoin&&p.joining)scheduleJoinRetry();
  },NETWORK.joinWelcomeTimeoutMs);
  return true;
}
function joinModeForAttempt(n){
  const modes=Array.isArray(NETWORK.joinConnectionModes)&&NETWORK.joinConnectionModes.length?NETWORK.joinConnectionModes:["all","relay","relay"];
  return modes[Math.min(Math.max(0,n),modes.length-1)]||"relay";
}
function failJoinConnection(conn,reason="connection-failed"){
  const p=runtime.player;
  if(p.identity||!p.pendingJoin||!p.joining||p.conn!==conn||conn.__stadoRetryTriggered)return;
  conn.__stadoRetryTriggered=true;p.lastJoinError=reason;
  clearTimeout(p.joinOpenTimer);p.joinOpenTimer=null;
  p.conn=null;p.connected=false;
  try{conn.close();}catch{}
  scheduleJoinRetry();
}
function scheduleJoinRetry(){
  const p=runtime.player;if(p.identity||!p.pendingJoin||!p.joining)return;
  clearTimeout(p.joinWelcomeTimer);clearTimeout(p.joinRetryTimer);clearTimeout(p.joinOpenTimer);
  p.joinWelcomeTimer=null;p.joinOpenTimer=null;
  const delays=Array.isArray(NETWORK.joinRetryDelays)?NETWORK.joinRetryDelays:[500,1200,2500,4500];
  const n=p.joinRetryAttempt++;
  if(n>=delays.length){
    p.joining=false;p.joinRetryAttempt=0;p.joinFailed=true;
    toast("Nie udało się zestawić połączenia przez dane komórkowe. Kliknij „TRYB KOMÓRKOWY / TURN” albo połącz się z Wi‑Fi.","error");render();return;
  }
  p.joinRetryTimer=setTimeout(()=>openJoinConnection(p.pendingJoin.roomCode),delays[n]);
}
function openJoinConnection(code,forcedMode=""){
  const p=runtime.player;if(!p.pendingJoin||p.identity)return;
  const mode=forcedMode||joinModeForAttempt(p.joinRetryAttempt);
  p.joinConnectionMode=mode;p.lastJoinError="";
  // Destroy only after the old connection has actually failed/timed out.
  closePlayerNetwork(false);
  const peer=createPeer(null,mode);p.peer=peer;
  peer.on("open",()=>{
    if(p.peer!==peer||!p.pendingJoin)return;
    const conn=peer.connect(`stado-${code}`,{reliable:true,serialization:"json"});p.conn=conn;
    setupPlayerConn(conn,{join:true,connectionMode:mode});
    clearTimeout(p.joinOpenTimer);
    p.joinOpenTimer=setTimeout(()=>{
      if(p.conn===conn&&!conn.open&&p.joining&&!p.identity)failJoinConnection(conn,`open-timeout-${mode}`);
    },NETWORK.connectionOpenTimeoutMs||6500);
    render();
  });
  peer.on("error",err=>{
    if(p.peer!==peer||!p.pendingJoin||!p.joining||peer.__stadoRetryTriggered)return;
    peer.__stadoRetryTriggered=true;
    p.lastJoinError=err?.type||err?.message||"peer-error";
    scheduleJoinRetry();
  });
}
function playerSubmitJoin(forceRelay=false){
  const p=runtime.player,code=cleanRoomCode(p.joinDraft.roomCode),name=cleanText(p.joinDraft.name),sid=p.joinDraft.sheepId;
  if(p.joining)return;
  if(code.length!==6){toast("Podaj 6-znakowy kod pokoju.","error");return;}
  if(!name||graphemeCount(name)>NAME_LIMIT){toast("Podaj imię — maksymalnie 20 znaków.","error");return;}
  if(!sid){toast("Wybierz swoją Owcę.","error");return;}
  const sh=sheepById(sid);if(!sh||sh.selectable===false){toast("Wybierz dostępną Owcę.","error");return;}
  p.joinAttemptToken=p.joinAttemptToken||randomToken(12);
  p.pendingJoin={roomCode:code,roomId:p.roomInfo?.roomId||p.joinDraft.roomId||"",name,sheepId:sid,joinToken:p.joinAttemptToken};
  p.joining=true;p.joinFailed=false;p.lastJoinError="";p.joinRetryAttempt=forceRelay?1:0;clearJoinTimers();render();

  // Best path: reuse the already-open preview WebRTC connection instead of
  // destroying it and doing a second handshake while many people join at once.
  // Manual TURN mode intentionally skips preview so it can force a relay path.
  if(!forceRelay&&p.conn?.open&&p.roomInfo?.roomCode===code){p.joinConnectionMode="all";sendPendingJoin(p.conn);return;}
  openJoinConnection(code,forceRelay?"relay":"");
}
function playerRequestRecovery(){
  const p=runtime.player,code=cleanRoomCode(p.joinDraft.roomCode),name=cleanText(p.joinDraft.name);
  if(code.length!==6||!name){toast("Podaj kod pokoju i swoje dotychczasowe imię.","error");return;}
  closePlayerNetwork(false);p.waitingRecovery=true;render();const peer=createPeer();p.peer=peer;
  peer.on("open",()=>{const conn=peer.connect(`stado-${code}`,{reliable:true,serialization:"json"});p.conn=conn;setupPlayerConn(conn,{recover:{roomCode:code,roomId:p.roomInfo?.roomId||"",name}});});
  peer.on("error",()=>{p.waitingRecovery=false;toast("Nie udało się wysłać prośby o odzyskanie.","error");render();});
}
function playerSendAction(type,payload){
  const p=runtime.player,s=p.snapshot,c=s?.match?.current;if(!p.conn?.open||!s){toast("Brak połączenia z ekranem głównym.","error");return Promise.reject();}
  const actionId=uid("act"),msg={type,protocolVersion:PROTOCOL_VERSION,actionId,roomId:s.roomId,matchId:s.match?.matchId||null,attemptId:c?.attemptId||null,payload};
  return new Promise((resolve,reject)=>{p.pending.set(actionId,{resolve,reject,type,createdAt:Date.now()});send(p.conn,msg);setTimeout(()=>{if(p.pending.has(actionId)){p.pending.delete(actionId);reject({message:"Brak potwierdzenia hosta."});toast("Brak potwierdzenia hosta — sprawdź połączenie.","error");}},12000);});
}
function playerSubmitQuestion(){
  const p=runtime.player;let text;try{text=validateUserText(p.drafts.question,"Pytanie");}catch(e){toast(e.message,"error");return;}
  playerSendAction("SUBMIT_QUESTION",{questionType:p.drafts.hardcoreType,text}).then(()=>{p.drafts.question="";persistPlayer();});
}
function playerSubmitAnswer(){
  const p=runtime.player;let text;try{text=validateUserText(p.drafts.answer,"Odpowiedź");}catch(e){toast(e.message,"error");return;}
  playerSendAction("SUBMIT_ANSWER",{text}).then(()=>{p.drafts.answer="";persistPlayer();});
}
function playerSubmitVote(){
  const p=runtime.player;if(!p.drafts.voteOptionId){toast("Najpierw wybierz odpowiedź.","error");return;}
  const c=p.snapshot?.match?.current,isWhichJudge=!!c?.isWhichJudge;
  const useToken=isWhichJudge?false:!!p.drafts.useToken;if(useToken && (p.snapshot?.self?.tokens||0)<1){toast("Nie masz Żetonu Wełny.","error");return;}
  playerSendAction("SUBMIT_VOTE",{optionId:p.drafts.voteOptionId,useToken}).then(()=>{p.drafts.voteOptionId="";p.drafts.useToken=false;persistPlayer();});
}
function playerSubmitHunt(skip){
  const p=runtime.player;if(!skip&&(!p.drafts.huntTargetId||!p.drafts.huntOptionId)){toast("Wybierz Owcę i przewidywany głos.","error");return;}
  const type=skip?"SKIP_HUNT":"SUBMIT_HUNT";
  playerSendAction(type,skip?{}:{targetPlayerId:p.drafts.huntTargetId,optionId:p.drafts.huntOptionId}).then(()=>{p.drafts.huntTargetId="";p.drafts.huntOptionId="";persistPlayer();});
}
function playerExitToMenu(){
  confirmModal("Opuścić widok gry?","Nie usuwa to Twojej Owcy z aktywnego meczu. Możesz później wrócić tym samym telefonem.",()=>{clearJoinTimers();runtime.player.joining=false;runtime.player.pendingJoin=null;runtime.player.joinAttemptToken="";closePlayerNetwork(false);clearJoinURL();runtime.role="start";runtime.player.snapshot=null;runtime.player.roomInfo=null;render();});
}
function closePlayerNetwork(clear=true){
  const p=runtime.player;
  stopHeartbeat();clearTimeout(p.reconnectTimer);p.reconnectTimer=null;clearTimeout(p.joinOpenTimer);p.joinOpenTimer=null;clearResumeTimers();
  const oldConn=p.conn,oldPeer=p.peer;
  // Detach them from runtime before closing so their asynchronous close/error
  // callbacks cannot start a second reconnect/join attempt.
  p.conn=null;p.peer=null;p.connected=false;
  try{oldConn?.close();}catch{}try{oldPeer?.destroy();}catch{}
  if(clear)p.roomInfo=null;
}
function clearPlayerIdentity(){localStorage.removeItem(PLAYER_STORAGE_KEY);runtime.player.identity=null;}
function persistPlayer(){try{if(runtime.player.identity){runtime.player.identity.drafts=runtime.player.drafts;runtime.player.identity.lastAttemptId=runtime.player.lastAttemptId||null;localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(runtime.player.identity));}}catch{}}
function syncDraftsToSnapshot(){
  const c=runtime.player.snapshot?.match?.current;if(!c)return;
  // Drafty tekstowe i wyborowe są przypisane do konkretnej próby/rundy.
  // Przy przejściu do nowej próby czyścimy je wszystkie, aby poprzednia
  // odpowiedź/pytanie nie pojawiały się ponownie w nowym formularzu.
  // lastAttemptId jest zapisywany lokalnie, więc zwykły reconnect w TRAKCIE
  // tej samej próby nadal zachowuje niedokończony tekst użytkownika.
  if(runtime.player.lastAttemptId!==c.attemptId){
    runtime.player.lastAttemptId=c.attemptId;
    runtime.player.drafts.question="";
    runtime.player.drafts.answer="";
    runtime.player.drafts.voteOptionId="";
    runtime.player.drafts.useToken=false;
    runtime.player.drafts.huntTargetId="";
    runtime.player.drafts.huntOptionId="";
  }
  if(c.myVote){runtime.player.drafts.voteOptionId=c.myVote.optionId;runtime.player.drafts.useToken=!!c.myVote.useToken;}
  // Po zaakceptowaniu odpowiedzi nie trzymamy jej jako draftu. Serwer i tak
  // przechowuje ją w c.myAnswer, a formularz nie jest już edytowalny.
  if(c.myAnswer)runtime.player.drafts.answer="";
  if(c.myWolfDecision&&!c.myWolfDecision.skip){runtime.player.drafts.huntTargetId=c.myWolfDecision.targetPlayerId;runtime.player.drafts.huntOptionId=c.myWolfDecision.optionId;}
}


/* -------------------- RENDERING -------------------- */

function render(){
  setBodyMode();
  let html="";
  if(runtime.role==="start")html=renderStart();
  else if(runtime.role==="host")html=renderHost();
  else html=renderPlayer();
  appEl.innerHTML=html;
  if(runtime.modal)renderModal(); else removeModalNode();
  requestAnimationFrame(afterRender);
}

function setBodyMode(){
  document.body.classList.toggle("player-mode",runtime.role==="player");
  const r=runtime.host.room;
  document.body.classList.toggle("host-game",runtime.role==="host" && !!r && ["ROUND","FINAL"].includes(r.status));
}
function logoHTML(){return `<div class="logo">ST<span class="pink">ADO</span></div>`;}
function versionHTML(){return `<span class="app-version">STADO v${APP_VERSION}</span>`;}
function imgHTML(src,alt="",cls=""){return src?`<img class="${cls}" src="${escAttr(src)}" alt="${escAttr(alt)}" onerror="this.style.visibility='hidden'">`:"";}
function sheepImg(pl,big=false,cls=""){const s=sheepById(pl?.sheepId);return imgHTML(big?s.bigAvatar:s.smallAvatar,s.name,cls);}
function sheepType(pl){return sheepById(pl?.sheepId).name||"Owca";}

function renderStart(){
  const saved=readJSON(HOST_STORAGE_KEY)?.room;
  return `<main class="app-shell start-shell">
    <div class="topbar">${logoHTML()}<div>${saved&&!saved.closed?`<button class="btn ghost" data-action="restore-host">↻ Wróć do pokoju</button>`:""}</div></div>
    <section class="start-hero">
      <article class="card light start-panel">
        <h1>STADO</h1><h2>Czy umiesz myśleć jak reszta owiec?</h2>
        <p>Imprezowa gra o tym, czy pójdziesz za Stadem… czy zostaniesz Czarną Owcą.</p>
        <div class="start-actions">
          <button class="start-action host" data-action="create-game">▣ UTWÓRZ GRĘ<span>Będę ekranem głównym — komputer, tablet lub TV</span></button>
          <button class="start-action join" data-action="join-game">▯ DOŁĄCZ DO GRY<span>Gram na tym telefonie i tworzę swoją Owcę</span></button>
        </div>
      </article>
      <div class="scene-wrap"><img src="assets/scenes/start.png" alt="Stado" onerror="this.parentElement.classList.add('scene-fallback');this.remove()"></div>
    </section>
    <div class="spread"><button class="btn ghost" data-action="how">ⓘ Jak to działa?</button><div class="row start-footer-right"><div class="sheep-runway footer-runway">${[0,1,2].map((_,i)=>`<i class="css-sheep" style="animation-delay:${-i*2.8}s"></i>`).join("")}<i class="css-sheep black" style="animation-delay:-4s"></i></div>${versionHTML()}</div></div>
  </main>`;
}

function renderHost(){
  const r=runtime.host.room;
  if(!r)return renderConfig();
  if(r.status==="CONFIG")return renderConfig(r);
  if(r.status==="LOBBY")return renderLobby(r);
  if(r.status==="PROLOGUE")return renderPrologue(r);
  if(r.status==="FINAL")return renderHostFinal(r);
  return renderHostGame(r);
}

function infoTip(key,label="Więcej informacji"){
  const text=CONFIG_HELP[key]||"";
  return `<button type="button" class="info-tip" data-action="help-info" data-id="${escAttr(key)}" aria-label="${escAttr(label)}">i<span class="info-tip-pop">${esc(text)}</span></button>`;
}

function renderConfig(room=null){
  // Konfiguracja jest edytowana w configDraft także wtedy, gdy pokój już istnieje.
  const cfg=runtime.configDraft;
  const fake=room?{...room,config:{...cfg}}:makeRoom(cfg,"------","preview");
  const pf=preflight(fake);
  return `<main class="app-shell config-shell">
    <div class="topbar">${logoHTML()}<button class="btn ghost" data-action="open-settings">⚙ Ustawienia</button></div>
    <section class="config-grid">
      <article class="card light pad config-card-main">
        <h1 class="section-title">Ustaw grę</h1>
        <label class="form-label">Liczba rund: <b id="roundValue">${cfg.roundsPlanned}</b></label>
        <div class="range-row"><input id="rounds" type="range" min="3" max="30" value="${cfg.roundsPlanned}"><span>3–30</span></div>
        <div class="config-label-row timer-label-row"><label class="form-label" for="responseTime">⏱ Limit czasu: <b id="responseTimeValue">${formatTimeSetting(cfg.responseTimeSec??60)}</b></label>${infoTip("timer","Jak działa limit czasu?")}</div>
        <div class="timer-range"><input id="responseTime" type="range" min="10" max="120" step="10" value="${clamp(+(cfg.responseTimeSec??60),10,120)}"><div class="timer-scale"><span>10 s</span><span>1 min</span><span>2 min</span></div></div>
        <h3 class="subhead config-section-title">Jak grubo gramy?</h3>
        <div class="mode-cards">${Object.entries(MODE).map(([key,m])=>`<button class="mode-card ${cfg.mode===key?"active":""}" data-action="mode" data-value="${key}"><span class="mode-kicker">${esc(m.short)}</span><b>${modeIcon(key)} ${esc(m.label)}</b><small>${esc(m.desc)}</small></button>`).join("")}</div>
        ${cfg.mode==="quiz"?renderQuizConfigControls(cfg):`<div class="config-label-row config-section-title"><h3 class="subhead">Liczba odpowiedzi</h3>${infoTip("answers","Jak dobrać liczbę odpowiedzi?")}</div><div class="choice-row">${[3,4,5].map(n=>`<button class="choice ${cfg.answerCountRequested===n?"active":""}" data-action="answer-count" data-value="${n}">${n}</button>`).join("")}</div>`}
        ${cfg.mode!=="quiz"?`<div class="info-item compact-setting"><div class="spread"><span class="setting-title">🐺 Tryb Wilka ${infoTip("wolf","Jak działa Wilk?")}</span><span class="switch"><input type="checkbox" ${cfg.wolfEnabled?"checked":""} data-action="wolf-toggle"><span></span></span></div></div>`:""}
        <div class="row wrap config-actions"><button class="btn" data-action="create-room">${room?"ZAPISZ I WRÓĆ DO LOBBY":"UTWÓRZ POKÓJ"}</button>${!room?`<button class="btn light" data-action="back-start">Wróć</button>`:""}</div><div class="config-version">${versionHTML()}</div>
      </article>
      <article class="card pad config-side-card">
        <h2 class="section-title">${modeIcon(cfg.mode)} ${esc(MODE[cfg.mode].label)}</h2>
        ${modeDescription(cfg.mode)}
        <h3 class="subhead config-score-title">Punktacja</h3>
        ${renderConfigScoring(cfg)}
        ${pf.errors.length||pf.warnings.length?`<div class="data-diagnostics">${pf.errors.map(x=>`<div class="error-text">● ${esc(x)}</div>`).join("")}${pf.warnings.map(x=>`<div class="muted">● ${esc(x)}</div>`).join("")}</div>`:""}
      </article>
    </section>
    <div class="sheep-runway">${[0,1,2].map((_,i)=>`<i class="css-sheep" style="animation-delay:${-i*2.6}s"></i>`).join("")}<i class="css-sheep black" style="animation-delay:-5s"></i></div>
  </main>`;
}

function renderConfigScoring(cfg){
  if(cfg.mode==="quiz")return `<div class="config-score-groups one"><div class="config-score-group"><h4>🧠 Quiz</h4><div class="config-score-row"><b>✅ +2</b><span>poprawna</span></div><div class="config-score-row"><b>❌ 0</b><span>błędna / brak</span></div><div class="config-score-row"><b>🧶 ×2</b><span>poprawna = +4</span></div><div class="config-score-row"><b>🧶 +1</b><span>za każdy zachowany żeton w finale</span></div></div></div>`;
  const author=cfg.mode!=="warmup"?`<div class="config-score-row"><b>✍️ +1 🧶</b><span>autor najczęściej wybranej odpowiedzi</span></div>`:"";
  const wolf=cfg.wolfEnabled?`<div class="config-score-row"><b>🐺</b><span>trafienie +1 / cel −2 • pudło −1</span></div>`:"";
  return `<div class="config-score-groups"><div class="config-score-group"><h4>🐑 Zwykłe rundy</h4><div class="config-score-row"><b>+2</b><span>największe Stado</span></div><div class="config-score-row"><b>+1</b><span>remis największych Stad</span></div><div class="config-score-row"><b>🖤 +3</b><span>jedyna samotna Czarna Owca</span></div><div class="config-score-row"><b>🧶 ×2</b><span>podwaja Twój wynik za głos</span></div>${author}${wolf}</div><div class="config-score-group accent"><h4>🎯 „Która Owca?”</h4><div class="config-score-row"><b>+2</b><span>trafisz wybór Owcy odniesienia</span></div><div class="config-score-row"><b>0</b><span>pudło</span></div><div class="config-score-row"><b>🧶 ×2</b><span>trafienie = +4</span></div><div class="config-score-note">Owca odniesienia wybiera odpowiedź, ale sama nie zdobywa punktów. W tej rundzie nie ma Czarnej Owcy ani Wilka.</div></div></div>`;
}

function renderQuizConfigControls(cfg){
  ensureQuizConfig(cfg);
  const allSelected=cfg.quizCategories.length===ALL_QUIZ_CATEGORY_KEYS.length;
  const categorySummary=allSelected?"Wszystkie 10":`${cfg.quizCategories.length}/10 wybranych`;
  return `<div class="quiz-config-block">
    <div class="config-label-row"><h3 class="subhead">Poziom pytań</h3>${infoTip("quiz","Zasady trybu Quiz")}</div>
    <div class="choice-row quiz-difficulty-row">${QUIZ_DIFFICULTIES.map(d=>`<button class="choice quiz-difficulty ${cfg.quizDifficulty===d.key?"active":""}" data-action="quiz-difficulty" data-value="${d.key}">${d.icon} ${d.label}</button>`).join("")}</div>
    <div class="category-launch-row">
      <button class="btn light category-launch" data-action="quiz-categories-open"><span>🗂 Kategorie pytań</span><b>${esc(categorySummary)}</b></button>
      ${infoTip("quizCategories","Jak wybierać kategorie?")}
    </div>
  </div>`;
}
function modeDescription(mode){
  if(mode==="warmup")return `<p class="mode-desc"><b>Gotowe pytania i odpowiedzi.</b> Najszybsze wejście w STADO. W „Która Owca?” jedna osoba wybiera, a reszta próbuje ją przewidzieć.</p>`;
  if(mode==="freestyle")return `<p class="mode-desc"><b>Pytania daje gra, odpowiedzi tworzycie Wy.</b> W „Która Owca?” liczy się znajomość konkretnej osoby, nie większość.</p>`;
  if(mode==="quiz")return `<p class="mode-desc"><b>Quiz wiedzy.</b> 5 odpowiedzi, jedna poprawna, wybrany poziom i kategorie. Bez Czarnej Owcy, Barana i Wilka.</p>`;
  return `<p class="mode-desc"><b>Pełny Sandbox.</b> Baran tworzy pytanie; przy pytaniu otwartym Owce tworzą odpowiedzi. „Która Owca?” działa jako przewidywanie wyboru konkretnej osoby.</p>`;
}

function renderLobby(r){
  const aps=activePlayers(r),minPlayers=minPlayersForRoom(r),canStart=aps.length>=minPlayers&&!aps.some(p=>!p.isBot&&!p.connected),url=joinURL(r);
  return `<main class="app-shell lobby-shell">
    <div class="topbar">${logoHTML()}<button class="btn ghost" data-action="open-settings">⚙ Ustawienia</button></div>
    <section class="card lobby-card">
      <h1 class="section-title">Stado się zbiera <span class="muted small">${aps.length}/${MAX_PLAYERS}</span></h1>
      <div class="room-join"><div class="center"><div class="room-code">${esc(r.roomCode)}</div><div class="muted">Kod pokoju</div><div class="small muted">${esc(joinDisplayURL(r))}</div></div><div id="qrBox" data-qr="${escAttr(url)}"></div><div><b>Jak dołączyć?</b><ol><li>Zeskanuj QR albo otwórz stronę.</li><li>Wpisz kod <b>${esc(r.roomCode)}</b>.</li><li>Wybierz imię i wolną Owcę.</li></ol></div></div>
      <div class="player-lobby-grid">${aps.map(p=>renderLobbyPlayer(p)).join("")}${Array.from({length:Math.max(0,Math.min(12,6)-aps.length)},()=>`<div class="lobby-player" style="opacity:.28"><div>＋</div><div><div class="name">Czeka na Owcę…</div><div class="type">Dołącz telefonem</div></div></div>`).join("")}</div>
      <div class="lobby-actions"><button class="btn" data-action="start-match" ${canStart?"":"disabled"}>START (${aps.length} ${aps.length===1?"owca":"owiec"})</button><button class="btn secondary" data-action="add-bot">+ Dodaj Owcę testową</button><button class="btn secondary" data-action="back-config">← Ustawienia gry</button></div>
      <p class="muted small lobby-note"><span>Minimum ${minPlayers}, maksimum 12. ${r.config.mode==="quiz"?`Quiz: ${quizDifficultyLabel(r.config.quizDifficulty)} • ${r.config.quizCategories?.length||10} kat. • ${formatTimeSetting(r.config.responseTimeSec)}`:""} Gra nie wystartuje, jeśli któryś prawdziwy gracz jest rozłączony. BOT-y służą wyłącznie do testowania rozgrywki.</span> <span class="lobby-version">${versionHTML()}</span></p>
    </section>
    <div class="sheep-runway">${[0,1,2].map((_,i)=>`<i class="css-sheep" style="animation-delay:${-i*2.7}s"></i>`).join("")}<i class="css-sheep black" style="animation-delay:-3s"></i></div>
  </main>`;
}
function renderLobbyPlayer(p){return `<div class="lobby-player ${p.isBot?"bot":""} ${p.connected||p.isBot?"":"offline"}">${sheepImg(p)}<div class="lobby-player-main"><div class="name" title="${escAttr(p.name)}">${esc(p.name)}</div><div class="type" title="${escAttr(sheepType(p))}">${esc(sheepType(p))}</div><div class="small muted lobby-status">${p.connected||p.isBot?`<i class="dot-online"></i> gotowa`:`<i class="dot-offline"></i> offline`}</div></div><button class="btn ghost lobby-remove" data-action="remove-player" data-id="${p.playerId}" title="Usuń ${escAttr(p.name)}" aria-label="Usuń ${escAttr(p.name)}">×</button></div>`;}

function renderPrologue(r){
  const i=r.match?.prologueIndex||0;
  return `<main class="prologue prologue-clickable" data-action="next-prologue"><div class="topbar">${logoHTML()}<div class="row"><button class="btn secondary" data-action="skip-prologue">Pomiń prolog</button><button class="btn ghost" data-action="open-settings">⚙ Ustawienia</button></div></div><div class="prologue-main"><div class="prologue-box"><div class="prologue-scene"><img src="assets/scenes/prolog.png" alt="Stado rusza"></div><div class="prologue-text">${esc(PROLOGUE[i])}</div><div class="prologue-dots">${PROLOGUE.map((_,j)=>`<i class="${j===i?"active":""}"></i>`).join("")}</div><div class="prologue-click-hint">Kliknij ekran, aby przejść dalej</div></div></div><div class="center muted">${modeIcon(r.config.mode)} ${esc(MODE[r.config.mode].label)}</div>${r.paused?pauseOverlay():""}</main>`;
}

function renderHostGame(r){
  const c=currentAttempt(r),aps=activePlayers(r),phase=c?.phase||"";
  const mode=MODE[r.config.mode];
  // The left column is a live scoreboard: highest score stays at the top.
  // Sorting a copy keeps gameplay/player order untouched. Ties keep join order.
  const scoreboard=aps.slice().sort((a,b)=>(b.points||0)-(a.points||0)||(a.joinedAt||0)-(b.joinedAt||0));
  const playerMetrics=aps.length<=2
    ? {avatar:118,name:23,type:16,score:22,icon:26}
    : aps.length<=4
      ? {avatar:102,name:20,type:14,score:20,icon:23}
    : aps.length<=5
      ? {avatar:98,name:19,type:13,score:19,icon:22}
      : aps.length<=6
        ? {avatar:88,name:18,type:12,score:18,icon:21}
        : aps.length<=7
          ? {avatar:78,name:17,type:11.5,score:17,icon:20}
          : aps.length<=8
            ? {avatar:70,name:16,type:11,score:16,icon:19}
            : aps.length<=9
              ? {avatar:62,name:15,type:10.5,score:15,icon:18}
              : aps.length<=10
                ? {avatar:55,name:14,type:10,score:14,icon:17}
                : {avatar:47,name:13,type:9,score:13,icon:16};
  const playerVars=`--players:${Math.max(aps.length,1)};--host-avatar:${playerMetrics.avatar}px;--host-name:${playerMetrics.name}px;--host-type:${playerMetrics.type}px;--host-score:${playerMetrics.score}px;--host-icon:${playerMetrics.icon}px`;
  return `<main class="host-root">
    <header class="host-floating-header">
      <div class="host-branding"><span class="badge pink host-mode-badge">${modeIcon(r.config.mode)} ${esc(mode.label)}</span>${logoHTML()}</div>
      <div class="host-header-actions"><button class="btn ghost" data-action="open-settings">⚙ Ustawienia</button></div>
    </header>
    <section class="host-grid">
      <aside class="host-side host-left"><div class="host-panel"><h3>Owce: ${aps.length}/${MAX_PLAYERS} <span class="small muted">• ranking</span></h3></div><div class="host-panel"><div class="host-player-list ${aps.length<=4?"few-players":""}" style="${playerVars}">${scoreboard.map(p=>renderHostPlayer(p,c)).join("")}</div></div></aside>
      <main class="host-center ${phase==="RESULT"?"has-result":""}">
        <div class="main-scene"><img src="assets/scenes/glowne.png" alt="STADO — główna scena"></div>
        ${renderHostQuestion(c,r)}
        <div class="answer-area">${renderHostAnswerArea(c,r)}</div>
        <div class="host-bottom-bar">
          <div class="host-round-bottom"><span class="pill">RUNDA ${r.match?.roundNumber||0} / ${r.match?.plannedRounds||r.config.roundsPlanned}</span>${countdownHTML(c)}${r.config.mode==="hardcore"&&c?.ramPlayerId?`<span class="badge yellow">🐏 ${esc(playerById(c.ramPlayerId)?.name||"")}</span>`:""}</div>
          <div class="host-bottom-actions">${renderHostBottomActions(c,r)}</div>
        </div>
      </main>
      <aside class="host-side host-right">
        <div class="host-panel host-info-panel"><h3>💬 Teraz</h3>${renderHostStatus(c,r)}</div>
        <div class="host-panel host-history-panel"><h3>🏆 Ostatnia runda</h3>${renderHistory(r)}</div>
        <div class="host-panel host-score-panel"><h3>📖 Punkty</h3>${renderScoreRules(r)}</div>
      </aside>
    </section>
    ${r.paused?pauseOverlay():""}<div class="rotate-overlay"><div class="overlay-box"><h1>Obróć urządzenie ↻</h1><p>Ekran główny STADO działa w orientacji poziomej.</p></div></div>
  </main>`;
}
function renderHostPlayer(p,c){
  const special=[];if(c?.ramPlayerId===p.playerId)special.push("🐏");if(c?.settlement?.wolfResult?.wolfPlayerId===p.playerId)special.push("🐺");
  const type=sheepType(p),longest=Math.max(graphemeCount(p.name),graphemeCount(type));
  const lengthClass=longest>=18?"very-long":longest>=14?"long-name":"";
  return `<div class="host-player ${lengthClass} ${p.connected||p.isBot?"":"offline"}">${sheepImg(p)}<div class="host-player-copy"><div class="pn" title="${escAttr(p.name)}">${esc(p.name)} ${special.join(" ")}</div><div class="pt" title="${escAttr(type)}">${esc(type)}</div></div><div class="res"><div class="resource score-resource"><span class="resource-icon">🏆</span><b>${p.points}</b></div><div class="resource token-resource"><span class="resource-icon">🧶</span><b>${p.tokens}</b></div></div></div>`;
}
function renderHostQuestion(c,r){
  if(!c)return `<div class="question-card">Przygotowujemy następną rundę…</div>`;
  if(c.phase==="NO_QUESTIONS")return `<div class="question-card"><div class="question-meta">Brak pytań</div>Nie ma kolejnego prawidłowego pytania w bazie dla tej konfiguracji.</div>`;
  if(c.phase==="QUESTION_INPUT")return `<div class="question-card"><div class="question-meta">🐏 Baran tej rundy: ${esc(playerById(c.ramPlayerId)?.name||"")}</div>Baran przygotowuje pytanie…</div>`;
  if(!c.questionText)return `<div class="question-card">Przygotowanie rundy…</div>`;
  const meta=c.type==="target"&&c.targetPlayerId?`Pytanie o: ${esc(playerById(c.targetPlayerId)?.name||"")}`:c.type==="which_sheep"?`🎯 Zgadnij wybór: ${esc(playerById(c.whichJudgePlayerId,r)?.name||"Owcy")}`:c.type==="quiz"?"🧠 QUIZ — jedna poprawna odpowiedź":"";
  return `<div class="question-card">${meta?`<div class="question-meta">${meta}</div>`:""}${esc(c.questionText)}</div>`;
}
function renderHostAnswerArea(c,r){
  if(!c)return "";
  if(c.phase==="QUESTION_INPUT")return `<div class="card pad center"><h2>🐏 Czekamy na pytanie Barana</h2><p class="muted">Pozostałe Owce widzą ekran oczekiwania.</p></div>`;
  if(c.phase==="ANSWER_INPUT")return `<div class="card pad center"><h2>✍️ Owce przygotowują odpowiedzi</h2><p>${Object.keys(c.answers||{}).length} / ${(c.assignedAuthorIds||[]).length} odpowiedzi gotowych</p>${progressHTML(Object.keys(c.answers||{}).length,(c.assignedAuthorIds||[]).length)}</div>`;
  if(c.phase==="NO_QUESTIONS")return `<div class="card pad center"><button class="btn" data-action="end-game">Zakończ i pokaż finał</button></div>`;
  if(c.type==="which_sheep")return renderWhichGrid(c,r);
  return renderTextOptions(c,r);
}
function renderTextOptions(c,r){
  const result=c.settlement;
  return `<div class="answer-grid count-${Math.min(5,Math.max(3,c.options.length))}">${c.options.map((o,i)=>{
    const key=COLORS[i]?.key||o.colorKey||"a",count=result?.counts?.[o.optionId],win=result?(c.type==="quiz"?result.correctOptionId===o.optionId:result.topOptionIds?.includes(o.optionId)):false,black=c.type!=="quiz"&&result?.blackOptionId===o.optionId;
    const voters=result?(result.voterMap[o.optionId]||[]).map(pid=>playerById(pid,r)?.name||"?"):[];
    const author=result&&o.authorPlayerId?playerById(o.authorPlayerId,r):null;
    return `<div class="answer-card ${key} ${win?"winner":""} ${black?"black-sheep":""}"><div class="answer-letter">${COLORS[i]?.letter||o.letter}</div><div class="answer-text">${esc(o.text)}</div>${result&&c.type==="quiz"&&result.correctOptionId===o.optionId?`<div class="quiz-correct-label">✓ POPRAWNA ODPOWIEDŹ</div>`:""}${result?`<div class="vote-count">${count} ${count===1?"głos":"głosów"}${author?` • autor: ${esc(author.name)}`:""}</div><div class="voter-chips">${voters.map(x=>`<span class="voter-chip">${esc(x)}</span>`).join("")}</div>`:""}</div>`;
  }).join("")}</div>`;
}
function renderWhichGrid(c,r){
  const n=c.options.length,cols=n<=4?n:Math.ceil(n/2),result=c.settlement;
  const whichAvatarPx=n<=5?122:n<=6?112:n<=8?98:n<=10?84:72;
  const correctId=result?.whichCorrectOptionId||null;
  return `<div class="which-grid ${result?"result":""}" style="--cols:${cols};--which-avatar:${whichAvatarPx}px">${c.options.map(o=>{
    const pl=playerById(o.candidatePlayerId,r),win=!!result&&correctId===o.optionId,count=result?.counts?.[o.optionId]||0;
    const voters=result?(result.voterMap?.[o.optionId]||[]).map(pid=>playerById(pid,r)?.name||"?"):[];
    return `<div class="sheep-option ${win?"winner":""} ${result?"result":""}">${sheepImg(pl)}<div class="name">${esc(pl?.name||"Owca")}</div><div class="type">${esc(sheepType(pl))}</div>${result?`${win?`<div class="which-correct-label">✓ WYBÓR OWCY</div>`:""}<b>${count} ${count===1?"trafienie":"trafień"}</b><div class="which-voters" aria-label="Osoby, które przewidziały ten wybór">${voters.map(name=>`<span class="voter-chip" title="${escAttr(name)}">${esc(name)}</span>`).join("")}</div>`:""}</div>`;
  }).join("")}</div>`;
}
function renderHostBottomActions(c,r){
  if(!c)return "";
  if(c.phase==="READY_TO_REVEAL")return `<button class="btn" data-action="show-results">POKAŻ WYNIKI</button>`;
  if(c.phase==="RESULT")return r.match.settledRounds>=r.match.plannedRounds?`<button class="btn" data-action="show-final">POKAŻ FINAŁ</button>`:`<button class="btn" data-action="next-round">NASTĘPNA RUNDA</button>`;
  if(c.phase==="NO_QUESTIONS")return `<button class="btn danger" data-action="end-game">ZAKOŃCZ GRĘ</button>`;
  if(hasBots()){
    if(c.phase==="QUESTION_INPUT")return `<button class="btn secondary" data-action="demo-question">🐏 Pytanie BOT-a</button>`;
    if(c.phase==="ANSWER_INPUT")return `<button class="btn secondary" data-action="demo-answers">✍️ Odpowiedzi BOT-ów</button>`;
    if(c.phase==="VOTING")return `<button class="btn secondary" data-action="demo-votes">🗳 Głosy BOT-ów</button>${c.wolfPlayerId&&playerById(c.wolfPlayerId)?.isBot?`<button class="btn secondary" data-action="demo-hunt">🐺 Ruch Wilka BOT</button>`:""}`;
  }
  return "";
}
function renderHostStatus(c,r){
  if(!c)return `<div class="status-lines"><div class="status-line status-primary">Przygotowanie rundy…</div></div>`;
  const lines=[];
  if(c.phase==="QUESTION_INPUT"){
    lines.push(`🐏 <b>${esc(playerById(c.ramPlayerId)?.name||"Baran")}</b> przygotowuje pytanie.`);
  }else if(c.phase==="ANSWER_INPUT"){
    const done=Object.keys(c.answers||{}).length,total=c.assignedAuthorIds.length;
    lines.push(`✍️ Czekamy na odpowiedzi: <b>${done}/${total}</b>.`);
    c.assignedAuthorIds.forEach(pid=>lines.push(`${c.answers[pid]?"✅":"…"} ${esc(playerById(pid)?.name||"Owca")}`));
  }else if(c.phase==="VOTING"||c.phase==="READY_TO_REVEAL"){
    const done=Object.keys(c.votes||{}).length,total=activePlayers(r).length;
    if(c.type==="which_sheep"){
      const judge=playerById(c.whichJudgePlayerId,r);
      lines.push(`🎯 Owca odniesienia: <b>${esc(judge?.name||"Owca")}</b>. Reszta Stada przewiduje jej wybór.`);
      lines.push(`🗳 Gotowych: <b>${done}/${total}</b> Owiec.`);
    }else lines.push(`🗳 Gotowych: <b>${done}/${total}</b> Owiec.`);
    if((c.timedOutPlayerIds||[]).length)lines.push(`⏱ Bez głosu w czasie: <b>${(c.timedOutPlayerIds||[]).length}</b>.`);
    if(c.type!=="which_sheep"&&r.config.mode!=="quiz"&&r.config.wolfEnabled)lines.push(`🐺 Tajna rola Wilka jest rozliczana bez ujawniania tożsamości.`);
    if(c.phase==="READY_TO_REVEAL")lines.push(`✅ Wszystkie decyzje zapisane. Pokazujemy wyniki.`);
  }else if(c.phase==="RESULT"){
    const st=c.settlement;
    if(c.type==="quiz"){
      const correct=c.options.find(o=>o.optionId===st.correctOptionId),correctVotes=(st.voterMap?.[st.correctOptionId]||[]).length;
      lines.push(`🧠 Poprawna odpowiedź: <b>${esc(optionLabel(c,correct,true))}</b>.`);
      lines.push(`✅ Poprawnie odpowiedziało: <b>${correctVotes}/${activePlayers(r).length}</b>.`);
    }else if(c.type==="which_sheep"){
      const judge=playerById(st.whichJudgePlayerId,r),correct=c.options.find(o=>o.optionId===st.whichCorrectOptionId);
      const hits=st.whichCorrectOptionId?(st.voterMap?.[st.whichCorrectOptionId]||[]).length:0;
      if(st.whichCorrectOptionId){lines.push(`🎯 Wybór <b>${esc(judge?.name||"Owcy")}</b>: <b>${esc(optionLabel(c,correct,true))}</b>.`);lines.push(`✅ Trafiło: <b>${hits}/${Math.max(0,activePlayers(r).length-1)}</b>.`);}
      else lines.push(`⏱ Owca odniesienia nie odpowiedziała — runda bez punktów.`);
    }else{
      lines.push(st.tiedTop?`🤝 Remis największych Stad — po <b>+1</b>.`:`🐑 Największe Stado zdobywa <b>+2</b>.`);
      if(st.blackOptionId){const pid=(st.voterMap[st.blackOptionId]||[])[0];lines.push(`🖤 Czarna Owca: <b>${esc(playerById(pid)?.name||"Owca")}</b> (+3).`);}else lines.push(`🖤 Brak unikalnej Czarnej Owcy.`);
    }
    if(st.wolfResult)lines.push(wolfResultText(r,c,st.wolfResult));
  }else if(c.phase==="NO_QUESTIONS")lines.push("⚠️ Skończyła się pula prawidłowych pytań.");
  return `<div class="status-lines">${lines.map((x,i)=>`<div class="status-line ${i===0?"status-primary":""}">${x}</div>`).join("")}</div>`;
}

function renderHistory(r){
  const x=(r.match?.history||[]).at(-1);if(!x)return `<div class="history-empty">Po pierwszej rundzie pokażemy tu ostatni wynik.</div>`;
  const result=x.type==="quiz"
    ? `✅ ${esc(truncate(x.correctAnswer||x.top,48))}`
    : x.type==="which_sheep"
      ? `🎯 ${esc(playerById(x.whichJudgePlayerId,r)?.name||"Owca")}: ${esc(truncate(x.correctAnswer||x.top,38))} • ${x.whichHits||0} traf.`
      : `🐑 ${esc(truncate(x.top,42))}${x.blackPlayerId?`<br>🖤 ${esc(playerById(x.blackPlayerId,r)?.name||"")}`:""}`;
  return `<div class="history-list"><div class="history-item"><div class="history-round">RUNDA ${x.round}</div><div class="history-q">${esc(truncate(x.question,72))}</div><div class="history-result">${result}</div></div></div>`;
}
function renderScoreRules(r){
  const c=currentAttempt(r);
  if(r.config.mode==="quiz")return `<div class="score-rules score-rules-simple"><div class="score-rule"><b>✅ +2</b><span>DOBRA</span></div><div class="score-rule"><b>❌ 0</b><span>BŁĄD</span></div><div class="score-rule"><b>🧶 ×2</b><span>= +4</span></div><div class="score-rule"><b>🧶 +1</b><span>FINAŁ / SZT.</span></div></div>`;
  if(c?.type==="which_sheep")return `<div class="score-rules score-rules-simple"><div class="score-rule"><b>🎯 +2</b><span>TRAFIENIE</span></div><div class="score-rule"><b>❌ 0</b><span>PUDŁO</span></div><div class="score-rule"><b>🧶 ×2</b><span>= +4</span></div><div class="score-rule"><b>👁 0</b><span>OWCA ODNIES.</span></div></div>`;
  return `<div class="score-rules score-rules-simple"><div class="score-rule"><b>🐑 +2</b><span>STADO</span></div><div class="score-rule"><b>🤝 +1</b><span>REMIS</span></div><div class="score-rule"><b>🖤 +3</b><span>CZARNA</span></div><div class="score-rule"><b>🧶 ×2</b><span>TWÓJ GŁOS</span></div>${r.config.mode!=="warmup"?`<div class="score-rule"><b>✍️ +1 🧶</b><span>AUTOR</span></div>`:""}${r.config.wolfEnabled?`<div class="score-rule"><b>🐺 +1/−1</b><span>CEL −2</span></div>`:""}</div>`;
}
function progressHTML(done,total){const pct=total?Math.round(done/total*100):0;return `<div class="host-status-line"><div class="progressbar" style="--pct:${pct}%"><span></span></div><b>${done}/${total}</b></div>`;}

function renderHostFinal(r){
  const f=r.match?.finalResult;if(!f)return `<main class="app-shell">${logoHTML()}<h1>Podsumowanie…</h1></main>`;
  if(f.noWinner)return `<main class="app-shell"><div class="topbar">${logoHTML()}<button class="btn ghost" data-action="open-settings">⚙ Ustawienia</button></div><section class="card pad center"><h1 class="section-title">Gra zakończona przed rozpoczęciem</h1><p>Nie rozegrano żadnej punktowanej rundy.</p><div class="row" style="justify-content:center"><button class="btn" data-action="new-game">Nowa gra</button><button class="btn secondary" data-action="close-room">Powrót do menu</button></div></section></main>`;
  const levels=[...new Set(f.rankings.map(x=>x.place))].filter(x=>x<=3);
  const finalCount=f.rankings.length;
  const finalMetrics=finalCount<=4?{avatar:64,podium:88,name:20,score:21}:finalCount<=6?{avatar:56,podium:78,name:18,score:19}:finalCount<=8?{avatar:50,podium:70,name:17,score:18}:finalCount<=10?{avatar:44,podium:62,name:16,score:17}:{avatar:38,podium:56,name:15,score:16};
  const finalVars=`--final-avatar:${finalMetrics.avatar}px;--podium-avatar:${finalMetrics.podium}px;--final-name:${finalMetrics.name}px;--final-score:${finalMetrics.score}px`;
  return `<main class="final-host" style="${finalVars}"><header class="host-header"><div>${logoHTML()}</div><div class="host-round"><span class="pill">🏆 FINAŁ STADA</span><span class="badge pink">${esc(MODE[r.config.mode].label)}</span></div><div class="host-header-actions"><button class="btn ghost" data-action="open-settings">⚙ Ustawienia</button></div></header>
    <section class="podium">${levels.map(place=>{const group=f.rankings.filter(x=>x.place===place);return `<div class="podium-level ${place===1?"first":""} ${group.length>1?"tie":"single"}"><h3 class="podium-title"><span class="podium-medal">${medal(place)}</span><span>${place}. miejsce</span></h3><div class="podium-players">${group.map(x=>{const p=playerById(x.playerId,r);return `<div class="podium-person">${sheepImg(p)}<div class="podium-copy"><b>${esc(p.name)}</b><strong>${p.points} pkt</strong></div></div>`;}).join("")}</div></div>`;}).join("")}</section>
    <section class="final-main"><div class="card pad final-awards-card"><h2>Wyróżnienia</h2><div class="awards-grid ${r.config.mode==="quiz"?"quiz-awards":""}">${r.config.mode==="quiz"?`${awardCard(r,"🧠 Mózg Stada",f.awards.quiz||[],"Najwięcej poprawnych odpowiedzi")}${awardCard(r,"🧶 Owca All-In",f.awards.allIn,"Najczęściej grała Żetonem")}`:`${awardCard(r,"🐑 Owca Stada",f.awards.herd,"Najczęściej z największym Stadem")}${awardCard(r,"🖤 Czarna Owca",f.awards.black,"Najczęściej samotnie")}${awardCard(r,"🧶 Owca All-In",f.awards.allIn,"Najczęściej grała Żetonem")}`}</div></div><div class="card pad final-ranking-card"><h2>Klasyfikacja końcowa</h2><div class="ranking">${f.rankings.map(x=>{const p=playerById(x.playerId,r);return `<div class="ranking-row"><b class="rank-place">${x.place}</b>${sheepImg(p)}<div class="ranking-copy"><b class="ranking-name">${esc(p.name)}</b><span class="ranking-type">${esc(sheepType(p))}</span><strong class="ranking-score">${x.points} pkt</strong></div></div>`;}).join("")}</div></div></section>
    <div class="final-actions"><div class="row"><button class="btn" data-action="replay">↻ Zagraj ponownie</button><button class="btn secondary" data-action="new-game">⚙ Nowa gra</button><button class="btn ghost" data-action="close-room">⌂ Powrót do menu</button></div>${versionHTML()}</div>${confettiHTML()}</main>`;
}
function awardCard(r,title,ids,desc){return `<div class="award-card"><h3>${title}</h3><div class="award-people">${ids.length?ids.map(id=>{const p=playerById(id,r);return `<div class="award-person">${sheepImg(p)}<div><b>${esc(p?.name||"")}</b><span>${esc(sheepType(p))}</span></div></div>`;}).join(""):`<div class="muted">Nie przyznano</div>`}</div><p>${esc(desc)}</p></div>`;}
function confettiHTML(){return `<div class="confetti">${Array.from({length:28},(_,i)=>`<i style="--x:${(i*37)%100}%;--d:${4+(i%5)}s;--r:${i*31}deg;--c:${COLORS[i%5].hex}"></i>`).join("")}</div>`;}

/* -------------------- PHONE RENDER -------------------- */

function renderPlayer(){
  const p=runtime.player;
  if(!p.identity?.playerId)return renderJoin();
  const s=p.snapshot;
  if(!s)return renderPlayerConnecting();
  if(s.status==="FINAL")return phoneShell(renderPhoneFinal(s),s);
  if(s.status==="LOBBY"||s.status==="CONFIG")return phoneShell(renderPhoneLobbyWait(s),s);
  if(s.status==="PROLOGUE")return phoneShell(renderPhoneWait("Stado rusza…","Prolog trwa na ekranie głównym.","assets/phone/czekatel.png"),s);
  if(s.status==="ROUND")return phoneShell(renderPhoneRound(s),s);
  return phoneShell(renderPhoneWait("Czekamy…","Spójrz na ekran główny.","assets/phone/czekatel.png"),s);
}
function phoneShell(content,snapshot=null){
  return `<main class="phone-shell"><div class="phone-top">${logoHTML()}<button class="btn ghost" data-action="open-settings">⚙ Ustawienia</button></div>${snapshot?renderPhoneProfile(snapshot):""}<section class="card phone-content">${content}</section>${snapshot?.paused?pauseOverlay(true):""}${!runtime.player.connected&&runtime.player.identity?connectionOverlay():""}</main>`;
}
function renderPhoneProfile(s){const p=s.self,sh=sheepById(p.sheepId);return `<div class="card phone-profile">${imgHTML(sh.smallAvatar,sh.name)}<div><div class="name">${esc(p.name)}</div><div class="type">${esc(sh.name)}</div></div><div class="phone-res"><b>🏆 ${p.points} PKT</b><span>🧶 ${p.tokens}</span></div></div>`;}
function renderJoin(){
  const p=runtime.player,info=p.roomInfo,occupied=new Set(info?.occupiedSheep||[]),nn=normalizeName(p.joinDraft.name);
  const selectable=sheepData.filter(s=>s.selectable!==false);
  return `<main class="phone-shell"><div class="phone-top">${logoHTML()}<button class="btn ghost" data-action="back-start">← Menu</button></div><section class="card phone-content"><h1>Dołącz do stada</h1>
    <label class="form-label">Kod pokoju</label><input class="input" data-field="roomCode" maxlength="6" value="${escAttr(p.joinDraft.roomCode)}" placeholder="ABC123" autocomplete="off" autocapitalize="characters">
    <label class="form-label" style="margin-top:12px">Twoje imię</label><input class="input" data-field="playerName" maxlength="${NAME_LIMIT}" value="${escAttr(p.joinDraft.name)}" placeholder="Np. Mati" autocomplete="off">
    ${info?`<p class="${info.status==="LOBBY"?"success-text":"error-text"}">${info.status==="LOBBY"?`Pokój znaleziony • ${info.count}/${info.max} Owiec`:`Gra już wystartowała — możesz tylko wrócić do swojej Owcy.`}</p>`:`<p class="muted small">Po wpisaniu pełnego kodu sprawdzimy pokój.</p>`}
    <h2>Wybierz swoją Owcę</h2><div class="big-sheep-list">${selectable.map(sh=>{const taken=occupied.has(String(sh.id)),sel=p.joinDraft.sheepId===String(sh.id);return `<button class="big-sheep-card ${taken?"taken":""} ${sel?"selected":""}" data-action="select-sheep" data-id="${escAttr(sh.id)}" ${taken?"disabled":""}>${imgHTML(sh.bigAvatar,sh.name)}${taken?`<span class="taken-label">ZAJĘTA</span>`:""}<div class="caption"><strong>${esc(sh.name)}</strong><p>${esc(sh.description||"")}</p></div></button>`;}).join("")}</div>
    <div class="sticky-action"><button class="btn" data-action="submit-join" ${p.joining||(info&&info.status!=="LOBBY")?"disabled":""}>${p.joining?(p.joinConnectionMode==="relay"?"ŁĄCZENIE PRZEZ TURN…":"ŁĄCZENIE…"):"DOŁĄCZ"}</button></div>
    ${p.joinFailed?`<div class="hint-box" style="margin-top:12px"><b>📶 Dane komórkowe blokują połączenie bezpośrednie?</b><p class="small">Uruchom tryb zgodności, który wymusza połączenie przez serwer TURN na porcie 443.</p><button class="btn cyan" data-action="submit-join-relay">TRYB KOMÓRKOWY / TURN</button></div>`:""}
    <div class="hint-box" style="margin-top:14px"><b>Telefon się zmienił albo straciłeś dane powrotu?</b><br><button class="btn ghost" data-action="toggle-recover">Wróć do swojej Owcy</button>${p.joinDraft.recover?`<div class="stack" style="margin-top:10px"><p class="small muted">Wpisz kod i dokładnie to samo imię. Prowadzący zatwierdzi przejęcie Owcy na tym urządzeniu.</p><button class="btn cyan" data-action="submit-recover" ${p.waitingRecovery?"disabled":""}>${p.waitingRecovery?"Czekamy na prowadzącego…":"WYŚLIJ PROŚBĘ"}</button></div>`:""}</div><div class="center" style="margin-top:12px">${versionHTML()}</div>
  </section></main>`;
}
function renderPlayerConnecting(){return `<main class="phone-shell"><div class="phone-top">${logoHTML()}</div><section class="card phone-wait"><h1>Wracamy do Stada…</h1><div class="wait-dots"><i></i><i></i><i></i></div><p class="muted">Przywracamy Twój profil, punkty i bieżącą rundę.</p><button class="btn secondary" data-action="player-reconnect">Połącz ponownie</button></section></main>`;}
function renderPhoneLobbyWait(s){return renderPhoneWait("Jesteś w Stadzie!","Czekamy, aż wszystkie Owce dołączą i prowadzący rozpocznie grę.","assets/phone/logowanietel.png",`Dołączyło ${s.players.length} Owiec`);}
function renderPhoneWait(title,text,img,extra=""){return `<div class="phone-wait"><h1>${esc(title)}</h1><p>${esc(text)}</p>${img?`<img src="${escAttr(img)}" alt="Czekające Owce">`:""}<div class="wait-dots"><i></i><i></i><i></i></div>${extra?`<b>${esc(extra)}</b>`:""}</div>`;}
function renderPhoneRound(s){
  const c=s.match?.current;if(!c)return renderPhoneWait("Przygotowanie rundy…","Spójrz na ekran główny.","assets/phone/czekatel.png");
  const rp=`<div class="phone-round-head"><div class="round-pill">RUNDA ${c.number}/${s.match.plannedRounds}</div>${countdownHTML(c,true)}</div>`;
  if(c.phase==="QUESTION_INPUT"){
    if(c.isRam)return rp+renderQuestionAuthor(c,s);
    return rp+renderPhoneWait("Baran układa pytanie…","Czekasz na przygotowanie rundy.","assets/phone/czekatel.png");
  }
  if(c.phase==="ANSWER_INPUT"){
    if(c.isAuthor&&!c.myAnswer)return rp+renderAnswerAuthor(c,s);
    return rp+renderPhoneWait("Owce tworzą odpowiedzi…",`Gotowych odpowiedzi: ${c.authorProgress.done}/${c.authorProgress.total}.`,"assets/phone/czekatel.png");
  }
  if(c.phase==="VOTING"){
    if(!c.myVote)return rp+renderVoting(c,s);
    if(c.isWolf&&!c.myWolfDecision)return rp+renderWolf(c,s);
    return rp+renderPhoneWait("Głos zapisany!",`Czekamy na pozostałe Owce: ${c.votingProgress.done}/${c.votingProgress.total}.`,"assets/phone/czekatel.png");
  }
  if(c.phase==="READY_TO_REVEAL")return rp+renderPhoneWait("Wszyscy gotowi!","Prowadzący za chwilę pokaże wyniki rundy.","assets/phone/czekatel.png");
  if(c.phase==="RESULT")return rp+renderPhoneRoundResult(c,s);
  if(c.phase==="NO_QUESTIONS")return rp+renderPhoneWait("Brak kolejnego pytania","Prowadzący zdecyduje, co dalej.","assets/phone/czekatel.png");
  return rp+renderPhoneWait("Czekamy na przygotowanie rundy…","Spójrz na ekran główny.","assets/phone/czekatel.png");
}
function questionWritingGuide(type){
  if(type==="which_sheep")return `<div class="writing-guide"><b>💡 Jak napisać dobre „Która Owca?”</b><div class="small">Krótka, konkretna sytuacja, w której naturalnie da się wskazać jedną osobę ze Stada.</div><div class="writing-examples"><span>„Kto pierwszy zasnąłby na własnej imprezie?”</span><span>„Kto kupiłby coś kompletnie niepotrzebnego?”</span><span>„Kto zniknąłby bez pożegnania?”</span></div></div>`;
  return `<div class="writing-guide"><b>💡 Jak napisać dobre pytanie otwarte?</b><div class="small">Daj Stadu sytuację z kilkoma możliwymi, zabawnymi odpowiedziami. Nie sugeruj jednej oczywistej odpowiedzi.</div><div class="writing-examples"><span>„Stado budzi się w obcym mieście. Co robi jako pierwsze?”</span><span>„Co jest najgorszym tekstem na pierwszej randce?”</span><span>„Co Stado zabiera na bezludną wyspę?”</span></div></div>`;
}
function renderQuestionAuthor(c,s){
  const d=runtime.player.drafts;
  return `<div class="author-box"><h2>🐏 Jesteś Baranem!</h2><p>Wybierz rodzaj pytania, a potem wpisz własne pytanie.</p><div class="choice-row"><button class="choice ${d.hardcoreType==="which_sheep"?"active":""}" data-action="hardcore-type" data-value="which_sheep">🐑 Która Owca?</button><button class="choice ${d.hardcoreType!=="which_sheep"?"active":""}" data-action="hardcore-type" data-value="open">📝 Pytanie otwarte</button></div><div class="hint-box" style="margin-top:12px">${d.hardcoreType==="which_sheep"?"Odpowiedziami będą wszystkie Owce w grze.":"Wybrane Owce przygotują odpowiedzi. Możesz sam wpisać w pytaniu imię konkretnej Owcy."}</div>${questionWritingGuide(d.hardcoreType)}<label class="form-label" style="margin-top:14px">Wpisz pytanie</label><textarea class="textarea author-textarea" data-draft="question" placeholder="Napisz pytanie do Stada…" autocomplete="off" autocapitalize="sentences" spellcheck="true">${esc(d.question)}</textarea><div id="questionCount" class="char-count">${graphemeCount(d.question)}/200</div><div class="author-submit"><button class="btn" data-action="submit-question">ZATWIERDŹ PYTANIE</button><div class="small muted center">Po zatwierdzeniu pytania nie można już edytować.</div></div></div>`;
}
function renderAnswerAuthor(c,s){const d=runtime.player.drafts;return `<div class="author-box"><h2>✍️ Czas na Twoją odpowiedź!</h2><p class="muted">Twoja odpowiedź będzie anonimowa do momentu pokazania wyników.</p><div class="phone-question">${esc(c.questionText)}</div><label class="form-label">Wpisz swoją odpowiedź</label><textarea class="textarea author-textarea" data-draft="answer" placeholder="Napisz coś, co może przekonać Stado…" autocomplete="off" autocapitalize="sentences" spellcheck="true">${esc(d.answer)}</textarea><div id="answerCount" class="char-count">${graphemeCount(d.answer)}/200</div><div class="author-submit"><button class="btn cyan" data-action="submit-answer">ZATWIERDŹ ODPOWIEDŹ</button><div class="small muted center">Po zatwierdzeniu odpowiedzi nie można już edytować.</div></div></div>`;}
function renderVoting(c,s){
  const isWhich=c.type==="which_sheep",isJudge=!!c.isWhichJudge,judge=s.players.find(p=>p.playerId===c.whichJudgePlayerId);
  const roleNote=isWhich?(isJudge?`<div class="which-role-note judge">🎯 <b>To Ty jesteś Owcą odniesienia.</b> Wybierz Owcę, która najlepiej pasuje do pytania. Twój wybór ustala wynik tej rundy.</div>`:`<div class="which-role-note">🔮 <b>Zgadnij wybór ${esc(judge?.name||"Owcy")}.</b> +2 pkt za trafienie, Żeton ×2 daje +4.</div>`):"";
  const token=isWhich&&isJudge?"":renderTokenChooser(s);
  return `<div>${roleNote}<div class="phone-question">${esc(c.questionText)}</div>${isWhich?renderPhoneSheepOptions(c,s):renderPhoneTextOptions(c)}${token}<div class="sticky-action"><button class="btn" data-action="submit-vote" ${runtime.player.drafts.voteOptionId?"":"disabled"}>${isJudge?"USTAW SWÓJ WYBÓR":"ZATWIERDŹ"}</button></div><p class="muted small center">${isJudge?"Po zatwierdzeniu pozostali gracze nie zobaczą Twojego wyboru aż do wyniku.":"Do kliknięcia „Zatwierdź” możesz zmienić wybór i decyzję o Żetonie Wełny."}</p></div>`;
}
function renderPhoneTextOptions(c){return `<div class="phone-answer-list">${c.options.map((o,i)=>`<button class="phone-answer ${COLORS[i]?.key||o.colorKey} ${runtime.player.drafts.voteOptionId===o.optionId?"selected":""}" data-action="select-vote" data-id="${o.optionId}">${COLORS[i]?.letter||o.letter} — ${esc(o.text)}</button>`).join("")}</div>`;}
function renderPhoneSheepOptions(c,s){return `<div class="phone-sheep-grid">${c.options.map(o=>{const p=s.players.find(x=>x.playerId===o.candidatePlayerId),sh=sheepById(p?.sheepId);return `<button class="phone-sheep-option ${runtime.player.drafts.voteOptionId===o.optionId?"selected":""}" data-action="select-vote" data-id="${o.optionId}">${imgHTML(sh.smallAvatar,sh.name)}<strong>${esc(p?.name||"Owca")}</strong><small>${esc(sh.name)}</small></button>`;}).join("")}</div>`;}
function renderTokenChooser(s){
  const available=s.self.tokens>0;
  const selected=available && runtime.player.drafts.useToken;
  return `<div class="token-box ${selected?"active":""}">
    <div class="token-toggle">
      <div>
        <b>🧶 Masz ${s.self.tokens} ${pluralToken(s.self.tokens)}.</b>
        <div class="small">${selected
          ?"Żeton wybrany — ten głos będzie punktowany ×2. Żeton zostanie odjęty przy rozliczeniu rundy."
          :"Żeton podwaja punkty zdobyte za ten głos. Jeśli go nie użyjesz, każdy pozostały da +1 pkt w finale."}</div>
      </div>
      <label class="switch" aria-label="Użyj Żetonu Wełny">
        <input type="checkbox" data-token-toggle ${selected?"checked":""} ${available?"":"disabled"}>
        <span></span>
      </label>
    </div>
    <div class="token-state">${selected?"✓ UŻYWASZ ŻETONU ×2":"ŻETON NIEUŻYWANY"}</div>
  </div>`;
}
function renderWolf(c,s){
  const d=runtime.player.drafts,targets=s.players.filter(p=>p.playerId!==s.self.playerId),selectedTarget=targets.find(p=>p.playerId===d.huntTargetId);
  return `<div class="wolf-box"><h2>🐺 Czas na polowanie!</h2><p>Twój głos jest zapisany. Teraz możesz przewidzieć ruch jednej konkretnej Owcy — albo odpuścić.</p><h3>1. Kogo obserwujesz?</h3><div class="wolf-choice-grid">${targets.map(p=>{const sh=sheepById(p.sheepId);return `<button class="wolf-target ${d.huntTargetId===p.playerId?"selected":""}" data-action="select-hunt-target" data-id="${p.playerId}">${imgHTML(sh.smallAvatar,sh.name)}<b>${esc(p.name)}</b></button>`;}).join("")}</div><h3>2. Na co według Ciebie zagłosuje ${selectedTarget?esc(selectedTarget.name):"ta Owca"}?</h3>${c.type==="which_sheep"?`<div class="phone-sheep-grid">${c.options.map(o=>{const pp=s.players.find(x=>x.playerId===o.candidatePlayerId),sh=sheepById(pp?.sheepId);return `<button class="phone-sheep-option ${d.huntOptionId===o.optionId?"selected":""}" data-action="select-hunt-option" data-id="${o.optionId}">${imgHTML(sh.smallAvatar,sh.name)}<strong>${esc(pp?.name||"Owca")}</strong></button>`;}).join("")}</div>`:`<div class="phone-answer-list">${c.options.map((o,i)=>`<button class="phone-answer ${COLORS[i]?.key||o.colorKey} ${d.huntOptionId===o.optionId?"selected":""}" data-action="select-hunt-option" data-id="${o.optionId}">${COLORS[i]?.letter||o.letter} — ${esc(o.text)}</button>`).join("")}</div>`}<div class="hint-box" style="margin-top:12px">🎯 Trafienie: <b>+1 dla Ciebie, −2 dla ofiary</b><br>💨 Pudło: <b>−1 dla Ciebie</b><br>🚫 Rezygnacja: bez zmian.</div><div class="row wrap" style="margin-top:12px"><button class="btn" data-action="submit-hunt" ${d.huntTargetId&&d.huntOptionId?"":"disabled"}>🐺 POLUJĘ</button><button class="btn secondary" data-action="skip-hunt">NIE POLUJĘ W TEJ RUNDZIE</button></div></div>`;
}
function renderPhoneRoundResult(c,s){
  const x=c.settlement,L=x?.ledger;if(!x||!L)return renderPhoneWait("Wyniki rundy","Spójrz na ekran główny.","assets/phone/czekatel.png");
  const isQuiz=c.type==="quiz",isWhich=c.type==="which_sheep";
  const baseText=L.timedOut?"Brak głosu w czasie":L.voteAward==="quiz_correct"?"Poprawna odpowiedź":L.voteAward==="quiz_wrong"?"Błędna odpowiedź":L.voteAward==="which_correct"?"Trafione!":L.voteAward==="which_wrong"?"Nie tym razem":L.voteAward==="which_judge"?"Twój wybór ustalał wynik":L.voteAward==="which_no_key"?"Runda bez rozstrzygnięcia":L.voteAward==="black"?"Czarna Owca":L.voteAward==="herd"?"Największe Stado":L.voteAward==="tie"?"Remis największych Stad":"Poza punktami";
  const correctQuiz=isQuiz?x.optionResults?.find(o=>o.optionId===x.correctOptionId):null;
  const correctWhich=isWhich?x.optionResults?.find(o=>o.optionId===x.whichCorrectOptionId):null;
  const correctWhichPlayer=isWhich?s.players.find(p=>p.playerId===correctWhich?.candidatePlayerId):null;
  const judge=isWhich?s.players.find(p=>p.playerId===x.whichJudgePlayerId):null;
  return `<div class="result-box"><h2>Wynik rundy</h2><div class="result-row"><span>Twój wynik</span><b>${baseText}</b></div>${isQuiz?`<div class="result-row"><span>Poprawna odpowiedź</span><b>${esc(correctQuiz?.text||"—")}</b></div>`:""}${isWhich?`<div class="result-row"><span>Wybór ${esc(judge?.name||"Owcy")}</span><b>${esc(correctWhichPlayer?.name||"brak")}</b></div>`:""}<div class="result-row"><span>Punkty${L.tokenUsed?" z Żetonem ×2":""}</span><b>${signed(L.votePoints||0)}</b></div>${L.authorToken?`<div class="result-row"><span>Twoja odpowiedź wygrała</span><b>+${L.authorToken} 🧶</b></div>`:""}${L.wolfDelta?`<div class="result-row"><span>Rozliczenie Wilka</span><b>${signed(L.wolfDelta)} pkt</b></div>`:""}<div class="result-row"><span>Stan po rundzie</span><b>${L.after} pkt • 🧶 ${s.self.tokens}</b></div>${x.wolfResult?`<div class="hint-box" style="margin-top:12px">${wolfResultTextFromSnapshot(s,c,x.wolfResult)}</div>`:""}<p class="muted center">Następną rundę uruchamia prowadzący.</p></div>`;
}
function renderPhoneFinal(s){
  const f=s.match.finalResult,me=s.self,sh=sheepById(me.sheepId),sum=s.match.personalSummary||{sentences:[]};
  if(f.noWinner)return `<div class="final-box center"><h1>Gra zakończona</h1><p>Nie rozegrano żadnej punktowanej rundy.</p></div>`;
  const rank=f.rankings.find(x=>x.playerId===me.playerId)?.place||me.stats.finalPlace;
  const myAwards=[];if(s.config.mode==="quiz"&&(f.awards.quiz||[]).includes(me.playerId))myAwards.push("🧠 Mózg Stada");if(s.config.mode!=="quiz"&&f.awards.herd.includes(me.playerId))myAwards.push("🐑 Owca Stada");if(s.config.mode!=="quiz"&&f.awards.black.includes(me.playerId))myAwards.push("🖤 Czarna Owca Gry");if(f.awards.allIn.includes(me.playerId))myAwards.push("🧶 Owca All-In");
  return `<div class="final-box center">${imgHTML(sh.smallAvatar,sh.name,"final-avatar")}<h1>${rank===1?"🏆 Wygrywasz!":`Finał: ${rank}. miejsce`}</h1><h2>${esc(me.name)} — ${esc(sh.name)}</h2><div class="final-score">${me.points} pkt</div><div class="stack" style="text-align:left;margin-top:14px"><div class="result-row"><span>Przed wymianą żetonów</span><b>${me.stats.scoreBeforeRedemption} pkt</b></div><div class="result-row"><span>Bonus za zachowane żetony</span><b>+${me.stats.tokenBonusPoints} pkt</b></div>${s.config.mode==="quiz"?`<div class="result-row"><span>Poprawne odpowiedzi</span><b>${me.stats.quizCorrect||0}×</b></div><div class="result-row"><span>Błędne odpowiedzi</span><b>${me.stats.quizWrong||0}×</b></div>`:`<div class="result-row"><span>Ze Stadem</span><b>${me.stats.herdWins}×</b></div><div class="result-row"><span>Czarna Owca</span><b>${me.stats.blackSheepWins}×</b></div>`}<div class="result-row"><span>Użyte Żetony Wełny</span><b>${me.stats.tokensUsed}×</b></div>${s.config.mode!=="quiz"?`<div class="result-row"><span>Wilk — trafienia / pudła / rezygnacje</span><b>${me.stats.wolfHits}/${me.stats.wolfMisses}/${me.stats.wolfSkipped}</b></div>`:""}</div>${myAwards.length?`<div class="award-list" style="margin-top:14px">${myAwards.map(a=>`<div class="award">${a}</div>`).join("")}</div>`:""}<div class="hint-box final-text" style="margin-top:14px;text-align:left"><b>Twój raport ze Stada</b>${sum.sentences.map(t=>`<p>${esc(t)}</p>`).join("")}</div><button class="btn" data-action="replay-ready" style="margin-top:14px">↻ Chcę rewanżu</button><p class="small muted">Prowadzący decyduje o ponownym starcie.</p></div>`;
}

function buildPersonalFinalSummary(r,pl){
  const s=pl.stats,sent=[];
  if(r.config.mode==="quiz"){
    const answered=(s.quizCorrect||0)+(s.quizWrong||0),rate=answered?(s.quizCorrect||0)/answered:0;
    if(answered===0)sent.push("Quiz minął bez zapisanej odpowiedzi. Następnym razem warto zaryzykować przed końcem czasu.");
    else if(rate>=.8)sent.push(`Mózg Stada pracował na wysokich obrotach: ${s.quizCorrect||0} poprawnych odpowiedzi na ${answered} oddanych.`);
    else if(rate>=.55)sent.push(`Solidny wynik wiedzy: ${s.quizCorrect||0} poprawnych odpowiedzi na ${answered} oddanych.`);
    else sent.push(`Quiz lubił zaskakiwać: ${s.quizCorrect||0} poprawnych odpowiedzi na ${answered} oddanych.`);
    if(s.tokensUsed)sent.push(`Żetony Wełny wykorzystane: ${s.tokensUsed}; skuteczne: ${s.tokensSuccessful}.`);
    else if(s.tokenBonusPoints)sent.push(`Zachowane Żetony Wełny dały na końcu +${s.tokenBonusPoints} pkt.`);
    if(s.wolfRounds)sent.push(`Wilk: ${s.wolfHits} trafień, ${s.wolfMisses} pudeł, ${s.wolfSkipped} rezygnacji.`);
    while(sent.length<3)sent.push(`Wynik końcowy: ${pl.points} pkt.`);
    return {sentences:sent.slice(0,5)};
  }
  const whichPlayed=(s.whichHits||0)+(s.whichMisses||0)+(s.whichJudgeRounds||0);
  const rounds=Math.max(1,(s.roundsPlayed||0)-whichPlayed),herdRate=s.herdWins/rounds,black=s.blackSheepWins;
  if(black>=Math.max(2,Math.ceil(rounds*.25)))sent.push(`Stado próbowało Cię wchłonąć, ale ${black} razy udało Ci się zostać jedyną Czarną Owcą. Konsekwencja czy chaos? Wynik punktowy nie rozstrzyga.`);
  else if(herdRate>=.65)sent.push(`Masz wybitny radar na wspólne myślenie: w ${s.herdWins} rundach Twój głos należał do największego Stada.`);
  else if(s.outsideHerd>s.herdWins)sent.push(`Twoje decyzje lubią boczne drogi. Częściej było Ci nie po drodze z największym Stadem niż razem z nim.`);
  else sent.push(`Balansujesz między Stadem a własnym zdaniem. Raz płyniesz z nurtem, a raz sprawdzasz, co jest za płotem.`);
  const whichGuesses=(s.whichHits||0)+(s.whichMisses||0);
  if(whichGuesses>=2)sent.push(`W rundach „Która Owca?” udało Ci się przewidzieć wybór innych ${s.whichHits||0} razy na ${whichGuesses} prób.`);
  if(s.tokensUsed>=3){sent.push(s.tokensSuccessful>=Math.ceil(s.tokensUsed*.6)?`Żetony Wełny nie leżały bezczynnie: ${s.tokensUsed} użyć i ${s.tokensSuccessful} skutecznych. Owca All-In z kalkulatorem.`:`Ryzyko zdecydowanie Cię nie odstraszało: ${s.tokensUsed} razy poszedł Żeton Wełny. Skuteczność bywała bardziej artystyczna.`);}else if(s.tokenBonusPoints>=2)sent.push(`Zamiast rzucać całą wełnę na stół, zachowujesz zapasy. ${s.tokenBonusPoints} niewykorzystane żetony zamieniły się na punkty w finale.`);
  if(s.wolfRounds){
    if(s.wolfHits>s.wolfMisses)sent.push(`Wilk obudził się w Tobie ${s.wolfRounds} razy i ${s.wolfHits} polowań było celnych. Ktoś w Stadzie powinien przestać być taki przewidywalny.`);
    else if(s.wolfSkipped===s.wolfRounds)sent.push(`Wilk pojawiał się ${s.wolfRounds} razy, ale za każdym razem wybierał dyplomację. Bardzo nietypowy drapieżnik.`);
    else sent.push(`Rola Wilka przypadła Ci ${s.wolfRounds} razy: ${s.wolfHits} trafień, ${s.wolfMisses} pudeł i ${s.wolfSkipped} świadomych rezygnacji. Polowanie to też nauka.`);
  }
  if(s.answersWritten){sent.push(s.answersWon?`Twoje odpowiedzi wygrały ${s.answersWon} razy. Stado najwyraźniej kupuje Twoją narrację.`:`Napisanych odpowiedzi: ${s.answersWritten}. Zwycięskich: 0. Publiczność jeszcze nie była gotowa.`);}
  if(s.ramRounds)sent.push(`Baranem było Ci dane zostać ${s.ramRounds} razy. Pytanie potrafi namieszać równie skutecznie jak odpowiedź.`);
  while(sent.length<3)sent.push(`Wynik końcowy: ${pl.points} pkt. Reszta szczegółów zostaje między Tobą, Stadem i historią rund.`);
  return {sentences:sent.slice(0,5)};
}

/* -------------------- MODALS -------------------- */

function renderModal(){
  removeModalNode();const m=runtime.modal;if(!m)return;
  const root=document.createElement("div");root.id="modal-root";root.className="modal-backdrop";
  let body="";
  if(m.type==="how")body=`<div class="modal card"><h2>Jak działa STADO?</h2><p>Jedno urządzenie prowadzi grę na dużym ekranie. Każdy gracz dołącza telefonem, wybiera własną Owcę i głosuje prywatnie.</p><p>Próbuj myśleć jak największe Stado albo zostań jedyną Czarną Owcą. W Freestyle sami tworzycie odpowiedzi, a w Sandboxie Baran tworzy również pytanie.</p><div class="modal-actions"><button class="btn" data-action="close-modal">Rozumiem</button></div></div>`;
  else if(m.type==="confirm")body=`<div class="modal card"><h2>${esc(m.title)}</h2><p>${esc(m.text)}</p><div class="modal-actions"><button class="btn secondary" data-action="confirm-no">Anuluj</button><button class="btn danger" data-action="confirm-yes">Potwierdź</button></div></div>`;
  else if(m.type==="preflight")body=`<div class="modal card"><h2>Nie można wystartować</h2>${m.errors.map(x=>`<p class="error-text">● ${esc(x)}</p>`).join("")}${m.warnings.map(x=>`<p class="muted">● ${esc(x)}</p>`).join("")}<div class="modal-actions"><button class="btn" data-action="close-modal">Zamknij</button></div></div>`;
  else if(m.type==="help-info")body=`<div class="modal card info-modal"><h2>ℹ Informacja</h2><p>${esc(m.text||"")}</p><div class="modal-actions"><button class="btn" data-action="close-modal">Rozumiem</button></div></div>`;
  else if(m.type==="quiz-categories")body=renderQuizCategoriesModal();
  else if(m.type==="settings")body=renderSettingsModal();
  root.innerHTML=body;document.body.appendChild(root);afterModalRender();
}
function removeModalNode(){document.getElementById("modal-root")?.remove();}
function confirmModal(title,text,onConfirm){runtime.modal={type:"confirm",title,text,onConfirm};render();}
function renderQuizCategoriesModal(){
  ensureQuizConfig(runtime.configDraft);
  const selected=runtime.configDraft.quizCategories||[];
  const allSelected=selected.length===ALL_QUIZ_CATEGORY_KEYS.length;
  return `<div class="modal card quiz-categories-modal"><div class="spread"><div><h2>🗂 Kategorie pytań</h2><p class="category-modal-summary">Wybrano <b>${selected.length}/10</b></p></div><button class="btn light quiz-all-btn ${allSelected?"active":""}" data-action="quiz-category-all">Wszystkie 10</button></div><div class="quiz-category-modal-grid">${QUIZ_CATEGORIES.map(cat=>`<button class="quiz-category ${selected.includes(cat.key)?"active":""}" data-action="quiz-category" data-value="${cat.key}"><span>${cat.icon}</span><b>${esc(cat.label)}</b><i>${selected.includes(cat.key)?"✓":""}</i></button>`).join("")}</div><div class="modal-actions"><button class="btn" data-action="close-modal">GOTOWE</button></div></div>`;
}
function renderSettingsModal(){
  if(runtime.role==="player")return `<div class="modal card"><h2>⚙ Ustawienia telefonu</h2><div class="info-list"><div class="info-item">Połączenie: <b>${runtime.player.connected?"online":"offline"}</b></div><div class="info-item">Wersja: <b>${APP_VERSION}</b></div><div class="info-item">Telefon gracza nie odtwarza muzyki ani efektów dźwiękowych.</div></div><div class="modal-actions"><button class="btn secondary" data-action="player-reconnect">Połącz ponownie</button><button class="btn ghost" data-action="player-menu">Wyjdź do menu</button><button class="btn" data-action="close-modal">Zamknij</button></div></div>`;
  const r=runtime.host.room;
  const volume=Math.round(runtime.audio.volume*100);
  return `<div class="modal card"><h2>⚙ Ustawienia <span class="app-version">v${APP_VERSION}</span></h2><label class="form-label">Głośność muzyki</label><input type="range" min="0" max="100" value="${volume}" data-hostvolume="1"><label class="row" style="margin-top:10px"><input type="checkbox" data-mute ${runtime.audio.muted?"checked":""}> Wycisz muzykę</label><div class="row wrap" style="margin-top:12px"><button class="btn cyan" data-action="music-enable">▶ WŁĄCZ / TESTUJ MUZYKĘ</button><span class="small muted">Aktualny utwór: ${runtime.audio.track||1}${runtime.audio.pendingTrack?" • oczekuje na odblokowanie":""}</span></div>${r?`<div class="info-item" style="margin-top:14px"><b>Pokój ${esc(r.roomCode)}</b><div id="settingsQR" data-qr="${escAttr(joinURL(r))}" style="width:150px;height:150px;background:#fff;padding:8px;border-radius:12px;margin:10px auto"></div><div class="small center muted">Zeskanuj, aby wrócić do pokoju.</div></div><div class="manage-list">${activePlayers(r).map(p=>`<div class="manage-row">${sheepImg(p)}<div><b>${esc(p.name)}</b><div class="small muted">${esc(sheepType(p))} • ${p.connected||p.isBot?"online":"offline"}</div></div><button class="btn ghost" data-action="remove-player" data-id="${p.playerId}">Usuń</button></div>`).join("")}</div>`:""}<div class="modal-actions">${r&&["ROUND","PROLOGUE"].includes(r.status)?`<button class="btn secondary" data-action="pause">${r.paused?"Wznów":"Pauza"}</button>`:""}${r&&r.status==="ROUND"&&r.match?.current&&!r.match.current.settlement?`<button class="btn secondary" data-action="abort-round">Pomiń pytanie</button>`:""}${r?`<button class="btn yellow" data-action="settings-new-game">↻ USTAW GRĘ OD NOWA</button>`:""}${r?`<button class="btn danger" data-action="settings-exit-menu">WYJDŹ DO MENU GŁÓWNEGO</button>`:""}<button class="btn" data-action="close-modal">Zamknij</button></div></div>`;
}
function afterModalRender(){document.querySelectorAll("[data-qr]").forEach(renderQRNode);}

function pauseOverlay(phone=false){return `<div class="pause-overlay"><div class="overlay-box"><h1>⏸ Gra wstrzymana</h1><p>${phone?"Prowadzący zatrzymał grę. Twoje wpisane, ale niezatwierdzone treści pozostają na tym urządzeniu.":"Wznów grę w Ustawieniach."}</p></div></div>`;}
function connectionOverlay(){return `<div class="connection-overlay"><div class="overlay-box"><h1>Łączenie ze Stadem…</h1><p>Nie wykonujemy żadnych ruchów bez potwierdzenia hosta.</p><button class="btn" data-action="player-reconnect">Połącz ponownie</button></div></div>`;}

/* -------------------- AUDIO / POST-RENDER -------------------- */

function afterRender(){
  document.querySelectorAll("[data-qr]").forEach(renderQRNode);
  updateCountdownNodes();
  if(runtime.role==="host"){
    requestWakeLock();
    fitHostAnswerText();
    fitWhichSheepCards();
    fitHostInfoText();
  }
}
function fitWhichSheepCards(){
  document.querySelectorAll(".which-grid").forEach(grid=>{
    const isResult=grid.classList.contains("result");
    const preferred=parseFloat(getComputedStyle(grid).getPropertyValue("--which-avatar"))||96;
    grid.querySelectorAll(".sheep-option").forEach(card=>{
      const img=card.querySelector("img");
      if(!img||!card.clientWidth||!card.clientHeight)return;
      const minSize=isResult?38:48;
      let size=Math.min(preferred,card.clientWidth*.48,card.clientHeight*(isResult?.42:.62));
      size=Math.max(minSize,size);
      img.style.width=`${size}px`;img.style.height=`${size}px`;
      for(let i=0;i<14 && card.scrollHeight>card.clientHeight+1 && size>minSize;i++){
        size=Math.max(minSize,size-4);
        img.style.width=`${size}px`;img.style.height=`${size}px`;
      }
      if(isResult && card.scrollHeight>card.clientHeight+1){
        card.classList.add("compact-result");
      }else card.classList.remove("compact-result");
    });
  });
}
function fitHostInfoText(){
  const panel=document.querySelector(".host-info-panel");
  const box=panel?.querySelector(".status-lines");
  if(!panel||!box||!panel.clientWidth||!panel.clientHeight)return;
  box.style.fontSize="";
  const maxSize=Math.min(21,Math.max(15,panel.clientWidth*.057));
  const minSize=10.5;
  let low=minSize,high=maxSize,best=minSize;
  for(let i=0;i<9;i++){
    const mid=(low+high)/2;
    box.style.fontSize=`${mid}px`;
    const fits=panel.scrollHeight<=panel.clientHeight+1 && panel.scrollWidth<=panel.clientWidth+1;
    if(fits){best=mid;low=mid;}else high=mid;
  }
  box.style.fontSize=`${Math.floor(best*10)/10}px`;
  panel.classList.toggle("status-compact",best<12.5);
}

function fitHostAnswerText(){
  document.querySelectorAll(".answer-card .answer-text").forEach(text=>{
    const card=text.closest(".answer-card");
    if(!card||!card.clientWidth||!card.clientHeight)return;
    text.style.fontSize="";
    const maxSize=Math.min(30,Math.max(18,Math.min(card.clientWidth*.105,card.clientHeight*.24)));
    const minSize=13;
    let low=minSize,high=maxSize,best=minSize;
    for(let i=0;i<9;i++){
      const mid=(low+high)/2;
      text.style.fontSize=`${mid}px`;
      const fits=card.scrollHeight<=card.clientHeight+1 && card.scrollWidth<=card.clientWidth+1;
      if(fits){best=mid;low=mid;}else high=mid;
    }
    text.style.fontSize=`${Math.floor(best*10)/10}px`;
  });
}
function renderQRNode(el){
  if(!el||el.dataset.done)return;const value=el.dataset.qr;if(!value)return;el.dataset.done="1";
  if(typeof window.QRCode!=="undefined"){try{el.innerHTML="";new QRCode(el,{text:value,width:158,height:158,correctLevel:QRCode.CorrectLevel.M});}catch{el.textContent="QR";}}
  else el.innerHTML=`<div class="center" style="color:#111;padding:20px"><b>QR</b><br><small>${esc(value)}</small></div>`;
}
function loadAudioPrefs(){const a=readJSON(AUDIO_STORAGE_KEY);if(a){runtime.audio.volume=typeof a.volume==="number"?a.volume:.35;runtime.audio.muted=!!a.muted;}syncAudioElements();}
function syncAudioElements(){for(let i=1;i<=4;i++){const el=document.getElementById(`music${i}`);if(el){el.volume=runtime.audio.muted?0:runtime.audio.volume;}}}
function setAudioVolume(v){runtime.audio.volume=clamp(v,0,1);syncAudioElements();saveAudioPrefs();}
function setMuted(v){runtime.audio.muted=!!v;syncAudioElements();saveAudioPrefs();render();}
function saveAudioPrefs(){try{localStorage.setItem(AUDIO_STORAGE_KEY,JSON.stringify({volume:runtime.audio.volume,muted:runtime.audio.muted}));}catch{}}

function primeMusicTrack(n){
  if(runtime.role==="player")return;
  const el=document.getElementById(`music${n}`);
  if(!el || !el.paused || runtime.audio.track===n)return;
  const oldVolume=el.volume, oldMuted=el.muted;
  try{
    el.muted=false;
    el.volume=0;
    const p=el.play();
    if(p&&typeof p.then==="function"){
      p.then(()=>{
        el.pause();
        try{el.currentTime=0;}catch{}
        el.muted=oldMuted;
        el.volume=runtime.audio.muted?0:runtime.audio.volume;
      }).catch(()=>{
        el.muted=oldMuted;
        el.volume=oldVolume;
      });
    }else{
      el.pause();
      try{el.currentTime=0;}catch{}
      el.muted=oldMuted;
      el.volume=runtime.audio.muted?0:runtime.audio.volume;
    }
  }catch{
    el.muted=oldMuted;
    el.volume=oldVolume;
  }
}

function playMusic(n,force=false){
  if(runtime.role==="player")return;
  runtime.audio.track=n;
  syncAudioElements();
  for(let i=1;i<=4;i++){
    const el=document.getElementById(`music${i}`);
    if(!el)continue;
    if(i!==n){
      el.pause();
      try{el.currentTime=0;}catch{}
    }
  }
  const el=document.getElementById(`music${n}`);
  if(!el)return;
  el.loop=true;
  el.muted=false;
  el.volume=runtime.audio.muted?0:runtime.audio.volume;
  if(!el.paused&&!force){runtime.audio.pendingTrack=0;return;}
  const promise=el.play();
  if(promise&&typeof promise.then==="function"){
    promise.then(()=>{
      runtime.audio.pendingTrack=0;
      runtime.audio.lastError="";
    }).catch(err=>{
      runtime.audio.pendingTrack=n;
      runtime.audio.lastError=String(err?.name||err?.message||"audio");
      if(force)toast("Muzyka została zablokowana przez przeglądarkę. Kliknij „Włącz / testuj muzykę” w Ustawieniach.","error");
    });
  }
}
function pauseCurrentMusic(){const el=document.getElementById(`music${runtime.audio.track}`);if(el)el.pause();}
function pauseAllMusic(){for(let i=1;i<=4;i++){const el=document.getElementById(`music${i}`);if(el){el.pause();try{el.currentTime=0;}catch{}}}runtime.audio.track=0;runtime.audio.pendingTrack=0;}
async function requestWakeLock(){if(runtime.role!=="host"||!runtime.host.room||runtime.host.wakeLock||!navigator.wakeLock?.request)return;try{runtime.host.wakeLock=await navigator.wakeLock.request("screen");runtime.host.wakeLock.addEventListener("release",()=>runtime.host.wakeLock=null);}catch{}}
function releaseWakeLock(){try{runtime.host.wakeLock?.release();}catch{}runtime.host.wakeLock=null;}

/* -------------------- UTILITIES -------------------- */



function formatTimeSetting(sec){sec=clamp(+sec,10,120);return sec<60?`${sec} s`:sec===60?"1 min":sec===120?"2 min":`${Math.floor(sec/60)} min ${sec%60} s`;}
function countdownHTML(c,compact=false){
  if(!c?.phaseDeadlineAt||!isTimedPhase(c.phase))return "";
  const left=Math.max(0,Math.ceil((c.phaseDeadlineAt-Date.now())/1000));
  return `<span class="countdown ${compact?"compact":""} ${left<=10?"urgent":""}" data-deadline="${c.phaseDeadlineAt}">⏱ <b data-countdown-text>${formatCountdownSeconds(left)}</b></span>`;
}
function formatCountdownSeconds(sec){sec=Math.max(0,Math.ceil(+sec||0));return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;}
function updateCountdownNodes(){
  const now=Date.now();document.querySelectorAll("[data-deadline]").forEach(el=>{
    const deadline=+el.dataset.deadline||0,left=Math.max(0,Math.ceil((deadline-now)/1000));
    const text=el.querySelector("[data-countdown-text]");if(text)text.textContent=formatCountdownSeconds(left);
    el.classList.toggle("urgent",left<=10);
  });
}

function setPlayerJoinURL(identity){try{const u=new URL(location.href);u.search="";u.hash="";u.searchParams.set("room",identity.roomCode);u.searchParams.set("roomId",identity.roomId);history.replaceState(null,"",u.pathname+u.search);}catch{}}
function clearJoinURL(){try{history.replaceState(null,"",location.pathname);}catch{}}
function send(conn,msg){try{if(conn?.open)conn.send(msg);}catch(e){console.warn("STADO send",e);}}
function cleanRoomCode(v){return String(v||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);}
function randomRoomCode(){const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";for(let i=0;i<6;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s;}
function uid(prefix="id"){return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`;}
function randomToken(n=24){const arr=new Uint8Array(n);crypto.getRandomValues(arr);return Array.from(arr,b=>b.toString(16).padStart(2,"0")).join("");}
function clamp(n,a,b){return Math.max(a,Math.min(b,Number.isFinite(n)?n:a));}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function cleanText(v){return String(v??"").replace(/\s+/g," ").trim();}
function normalizeText(v){return cleanText(v).toLocaleLowerCase("pl-PL");}
function normalizeName(v){return normalizeText(v);}
function graphemeCount(v){const s=String(v??"");try{return [...new Intl.Segmenter("pl",{granularity:"grapheme"}).segment(s)].length;}catch{return Array.from(s).length;}}
function truncate(v,n){v=String(v||"");return graphemeCount(v)<=n?v:Array.from(v).slice(0,n-1).join("")+"…";}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function escAttr(v){return esc(v).replace(/`/g,"&#96;");}
function readJSON(k){try{return JSON.parse(localStorage.getItem(k)||"null");}catch{return null;}}
function modeIcon(m){return m==="warmup"?"🐑":m==="freestyle"?"🍸":m==="quiz"?"🧠":"🔥";}
function pluralToken(n){return n===1?"żeton":n>=2&&n<=4?"żetony":"żetonów";}
function signed(n){return n>0?`+${n}`:`${n}`;}
function medal(p){return p===1?"🥇":p===2?"🥈":"🥉";}
function joinURL(r){const u=new URL(location.href);u.search="";u.hash="";u.searchParams.set("room",r.roomCode);u.searchParams.set("roomId",r.roomId);return u.toString();}
function joinDisplayURL(r){return `${location.host}${location.pathname}?room=${r.roomCode}`;}
function optionLabel(c,o,short=false){if(!o)return "—";if(c.type==="which_sheep"){const p=playerById(o.candidatePlayerId);return p?.name||"Owca";}return short?truncate(o.text,50):o.text;}
function wolfResultText(r,c,w){
  const wolf=playerById(w.wolfPlayerId,r);if(w.skip)return `🐺 ${esc(wolf?.name||"Wilk")} ${w.timedOut?"nie zdążył z polowaniem — bez zmian.":"zrezygnował z polowania."}`;
  const target=playerById(w.targetPlayerId,r),pred=optionLabel(c,c.options.find(o=>o.optionId===w.predictedOptionId),true);
  if(w.neutral)return `🐺 Polowanie ${esc(wolf?.name||"Wilka")} na ${esc(target?.name||"Owcę")} jest neutralne — cel nie oddał głosu w czasie.`;
  return w.hit?`🐺 ${esc(wolf?.name||"Wilk")} trafił głos ${esc(target?.name||"Owcy")} (${esc(pred)}): +1 dla Wilka, −${w.targetLoss} dla celu.`:`🐺 ${esc(wolf?.name||"Wilk")} chybił typ głosu ${esc(target?.name||"Owcy")}: −${Math.abs(w.delta)} pkt.`;
}
function wolfResultTextFromSnapshot(s,c,w){
  const wolf=s.players.find(p=>p.playerId===w.wolfPlayerId),target=s.players.find(p=>p.playerId===w.targetPlayerId);
  if(w.skip)return `🐺 ${wolf?.name||"Wilk"} ${w.timedOut?"nie zdążył z polowaniem — bez zmian.":"zrezygnował z polowania."}`;
  if(w.neutral)return `🐺 Polowanie ${wolf?.name||"Wilka"} na ${target?.name||"Owcę"} jest neutralne — cel nie oddał głosu w czasie.`;
  return w.hit?`🐺 ${wolf?.name||"Wilk"} przewidział głos ${target?.name||"Owcy"}: Wilk +1, cel −${w.targetLoss}.`:`🐺 ${wolf?.name||"Wilk"} nie przewidział głosu ${target?.name||"Owcy"} i traci ${Math.abs(w.delta)} pkt.`;
}
function toast(text,type="good"){const el=document.createElement("div");el.className=`toast ${type}`;el.textContent=text;toastRoot.appendChild(el);setTimeout(()=>el.remove(),4200);}

/* extra click actions added after function declaration via capture listener */
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-action]");if(!el)return;const a=el.dataset.action;
  if(a==="confirm-yes"&&runtime.modal?.type==="confirm"){const fn=runtime.modal.onConfirm;runtime.modal=null;removeModalNode();try{fn?.();}catch(err){toast(err.message||"Nie udało się wykonać akcji.","error");}render();}
  else if(a==="confirm-no"){runtime.modal=null;render();}
  else if(a==="restore-host"){restoreHostSnapshot();}
  else if(a==="discard-host"){discardHostSnapshot();}
},true);

// Persist Wolf setting when changed in an already-created room.
document.addEventListener("click",e=>{
  const el=e.target.closest('[data-action="wolf-toggle"]');if(!el)return;
  setTimeout(()=>{if(runtime.role==="host"&&runtime.host.room){runtime.host.room.config.wolfEnabled=runtime.configDraft.wolfEnabled;commitHost("Zmieniono Tryb Wilka");}},0);
});

// Offer same-browser host recovery when a valid snapshot exists.
if(runtime.role==="start" && readJSON(HOST_STORAGE_KEY)?.room && !new URLSearchParams(location.search).has("room")){
  // The start screen exposes the explicit recovery button; do not auto-own the room from an accidental tab.
}

})();
