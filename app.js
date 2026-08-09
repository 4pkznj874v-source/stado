(() => {
const app = document.querySelector('#app');
const music = document.querySelector('#bgMusic');
const A=['A','B','C','D','E'];
const avatarSet=['🐑','🐏','🦙','🐑','🐏','🐑','🦙','🐑','🐏','🐑','🦙','🐑'];
const palette=['pink','cyan','gold','violet','green'];
const PUBLIC_URL='https://tinyurl.com/stadoowiec';
const traitLabels={conformism:'Stadność',independence:'Niezależność',risk:'Ryzyko',chaos:'Chaos',empathy:'Empatia',dominance:'Dominacja',honesty:'Szczerość',hedonism:'Hedonizm',pragmatism:'Pragmatyzm',romance:'Romantyzm'};
const state={mode:null,peer:null,conn:null,connections:new Map(),room:'',players:[],settings:{rounds:15,intensity:2,categories:['Impreza','Randki','Przyjaźń','Wstyd','Pieniądze','Praca','Wakacje','Moralne katastrofy','Absurd','Charakter'],volume:.28},game:null,me:null,settingsOpen:false};

const uid=()=>Math.random().toString(36).slice(2,10);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const roomCode=()=>Math.random().toString(36).slice(2,8).toUpperCase();
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const playerBy=id=>state.players.find(p=>p.id===id);

function answerCount(){const n=state.players.length;return n<=5?3:n<=8?4:5}
function toast(t){document.body.insertAdjacentHTML('beforeend',`<div class="toast">${esc(t)}</div>`);setTimeout(()=>document.querySelector('.toast')?.remove(),2200)}
function safePlay(){music.volume=state.settings.volume;if(music.paused)music.play().catch(()=>{});}
function setMode(m){state.mode=m;render()}
function broadcast(type,payload={}){state.connections.forEach(c=>{if(c.open)c.send({type,...payload})})}
function send(c,type,payload={}){if(c?.open)c.send({type,...payload})}

function publicGame(){
if(!state.game)return null;
const g=state.game;
return {
round:g.round,
stage:g.stage,
totalRounds:g.totalRounds,
question:g.question?{...g.question,answers:g.question.answers.map(x=>({text:x.text}))}:null,
visibleAnswers:g.visibleAnswers,
baranId:g.baranId,
baranChoice:g.baranChoice,
deadline:g.deadline,
results:g.results||null,
finished:g.finished||false
}
}

function sync(){broadcast('sync',{players:state.players,game:publicGame(),settings:state.settings})}

function shell(content,settings=true){
return `<main class="app-shell">
<header class="topbar">
<div class="brand">ST<span>ADO</span></div>
${settings?`<button class="icon-btn" data-action="settings">⚙ Ustawienia</button>`:''}
</header>
<section class="screen">${content}</section>
</main>
${state.settingsOpen?settingsModal():''}`
}

function startView(){
return shell(`
<div class="hero">
<div class="hero-card">
<h1>STADO<span>Czy umiesz myśleć jak reszta owiec?</span></h1>
<p>Imprezowa gra o stadzie, Czarnych Owcach, Baranach, Wilkach i decyzjach, których jutro lepiej nie tłumaczyć.</p>
<div class="btn-row">
<button class="primary" data-action="host">UTWÓRZ GRĘ</button>
<button class="secondary dark" data-action="join">DOŁĄCZ TELEFONEM</button>
</div>
</div>
<div class="sheep-scene">
<div class="cloud c1"></div>
<div class="cloud c2"></div>
<div class="hill"></div>
${sheepHTML('s1 pink')}
${sheepHTML('s2 black')}
${sheepHTML('s3 gold')}
</div>
</div>`,false)
}

function sheepHTML(cls){
return `<div class="sheep ${cls}">
<div class="wool">
<div class="face"></div>
<div class="legs">〰〰</div>
</div>
</div>`
}

function setupView(){
const cats=state.settings.categories;
return shell(`
<div class="grid-2">
<div class="panel light">
<h2 class="section-title">Ustaw grę</h2>

<label class="label">Liczba rund: <b id="roundVal">${state.settings.rounds}</b></label>
<input class="control" id="rounds" type="range" min="5" max="30" value="${state.settings.rounds}">

<label class="label">Jak grubo gramy?</label>
<div class="chips">
${[[1,'🐑 Grzeczne stadko'],[2,'🍸 Po dwóch drinkach'],[3,'🔥 Bez hamulców']]
.map(([v,t])=>`<button class="chip ${state.settings.intensity===v?'active':''}" data-intensity="${v}">${t}</button>`).join('')}
</div>

<label class="label">Kategorie</label>
<div class="chips">
${Object.keys(groupCategories()).map(c=>`
<button class="chip ${cats.includes(c)?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}
</div>

<label class="label">Głośność muzyki</label>
<input class="control" id="volume" type="range" min="0" max="100" value="${Math.round(state.settings.volume*100)}">

<div class="btn-row">
<button class="primary" data-action="create-room">UTWÓRZ POKÓJ</button>
<button class="secondary dark" data-action="home">Wróć</button>
</div>
</div>

<div class="panel">
<h2 class="section-title">Jak działa runda?</h2>
<p><b>+2</b> - idziesz za większością.</p>
<p><b>+4</b> - jesteś jedyną Czarną Owcą.</p>
<p><b>+1</b> - dokładnie dwie owce wybiorą niszową odpowiedź.</p>
<p><b>Baran +2</b> - przekona stado do swojej opcji.</p>
<p><b>Wilk +3</b> - jego tajny cel wygra.</p>
<p><b>Żeton Wełny +1</b> - poprawnie obstawisz większość.</p>
<p>W połowie gry najsłabsze owce dostają dodatkowy żeton.</p>
</div>
</div>`)
}

function groupCategories(){
const o={};
STADO_QUESTIONS.forEach(q=>o[q.category]=1);
return o
}

function joinView(){
const preset=new URLSearchParams(location.search).get('join')||'';
return shell(`
<div class="phone-shell">
<h2>Dołącz do stada</h2>

<label class="label">Kod pokoju</label>
<input id="roomInput" class="control" maxlength="6" value="${esc(preset)}" placeholder="ABC123">

<label class="label">Twoje imię</label>
<input id="nameInput" class="control" maxlength="18" placeholder="np. Marta">

<label class="label">Wybierz owcę</label>
<div class="grid-3">
${avatarSet.map((a,i)=>`
<button class="chip ${i===0?'active':''}" data-avatar="${i}">
<span style="font-size:34px">${a}</span>
</button>`).join('')}
</div>

<p class="nickname" id="nickPreview">${esc(STADO_NICKNAMES[0])}</p>

<div class="btn-row">
<button class="primary" data-action="connect">DOŁĄCZ</button>
<button class="secondary" data-action="home">Wróć</button>
</div>
</div>`,false)
}

function lobbyView(){
const qr=`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(PUBLIC_URL)}`;

return shell(`
<div class="panel">
<h2 class="section-title">Stado się zbiera</h2>

<div class="room-code">${state.room}</div>

<div class="join-link">
Na telefonie otwórz:
<b>${PUBLIC_URL.replace('https://','')}</b>
</div>

<img
src="${qr}"
alt="Kod QR do gry"
width="180"
height="180"
style="display:block;margin:16px auto;border-radius:14px;background:white;padding:8px"
>

<div class="player-grid">
${state.players.map(playerCard).join('')}
</div>

<div class="btn-row">
<button class="primary" data-action="start-game" ${state.players.length<2?'disabled':''}>
START (${state.players.length} owiec)
</button>
<button class="secondary" data-action="demo-player">+ Dodaj owcę testową</button>
</div>
</div>`)
}

function playerCard(p){
return `<div class="player-card">
<div class="avatar">${p.avatar}</div>
<div class="player-name">${esc(p.name)}</div>
<div class="nickname">${esc(p.nickname)}</div>
<div class="score">${p.score||0}</div>
</div>`
}

function prologueView(){
return shell(`
<div class="prologue">
<div class="road">
<div class="prologue-copy">
Gdzieś pomiędzy rozsądkiem a trzecim prosecco...<br>
<span style="color:#f34d88">powstało STADO.</span>
</div>
<div class="bus">🚐🐑🐑</div>
</div>
</div>`)
}

function hostGameView(){
const g=state.game,q=g.question,ans=q?g.visibleAnswers.map(i=>q.answers[i]):[];

return shell(`
<div class="game-layout">

<div class="game-main">

<div class="round-meta">
<span class="badge pink">RUNDA ${g.round}/${g.totalRounds}</span>
${g.baranId?`<span class="badge gold">🐏 Baran: ${esc(playerBy(g.baranId)?.name||'')}</span>`:''}
${g.wolfId?`<span class="badge">🐺 Wilk jest wśród was...</span>`:''}
</div>

<div class="scoreboard">
${[...state.players].sort((a,b)=>b.score-a.score).map(p=>`
<div class="score-pill">
<span class="mini">${p.avatar}</span>
<div>
<b>${esc(p.name)}</b>
<strong>${p.score} pkt</strong>
</div>
</div>`).join('')}
</div>

<div class="question-stage">

<div class="scene-decor">
<div class="moon"></div>
<div class="city"></div>
<div class="scene-sheep a">🐑</div>
<div class="scene-sheep b">🐺</div>
</div>

<div class="scenario">${stageMessage(g,q)}</div>

${q?`
<div class="answers" style="--cols:${ans.length}">
${ans.map((a,i)=>`
<div class="answer">
<span class="letter">${A[i]}</span>
${esc(a.text)}
</div>`).join('')}
</div>`:''}

${g.stage==='results'?resultHTML(g):''}

</div>
</div>

<aside class="side-panel">

<div class="side-card">
<h3>🎯 Co się dzieje?</h3>
<div class="event-log">${eventLog(g)}</div>
</div>

<div class="side-card">
<h3>🧶 Żetony</h3>
${state.players.map(p=>`<div>${p.avatar} ${esc(p.name)}: <b>${p.tokens}</b></div>`).join('')}
</div>

<div class="side-card controls-row">
<button class="secondary" data-action="pause">${g.paused?'Wznów':'Pauza'}</button>

${g.stage==='baran'&&String(g.baranId).startsWith('demo-')
?`<button class="primary" data-action="demo-baran">BARAN DEMO</button>`:''}

${g.stage==='vote'
?`<button class="secondary" data-action="sim-demo">GŁOSY DEMO</button>`:''}

${g.stage==='results'
?`<button class="primary" data-action="next-round">DALEJ</button>`:''}
</div>

</aside>
</div>`)
}

function stageMessage(g,q){
if(g.paused)return '⏸ Gra wstrzymana. Czas na dolewkę.';

if(g.stage==='baran')
return `🐏 <b>${esc(playerBy(g.baranId)?.name||'Baran')}</b> wybiera odpowiedź, do której spróbuje przekonać stado.<br><small>${esc(q.question)}</small>`;

if(g.stage==='vote')
return `${esc(q.question)}${g.baranChoice!=null?`<br><span style="color:#d63b75">Baran poleca: ${A[g.baranChoice]}</span>`:''}`;

if(g.stage==='results')
return `STADO ZDECYDOWAŁO. ${g.results?.tie?'Remis! Kilka odpowiedzi dzieli zwycięstwo.':''}`;

return esc(q?.question||'')
}

function eventLog(g){
const logs=[];

if(g.stage==='baran')
logs.push('Baran przygotowuje swoją rekomendację.');

if(g.stage==='vote')
logs.push(`${Object.keys(g.votes||{}).length}/${state.players.length} owiec zagłosowało.`);

if(g.stage==='results'){
(g.results?.awards||[]).forEach(x=>logs.push(`${x.icon} ${esc(x.text)}`));
}

return logs.map(x=>`<div class="log-item">${x}</div>`).join('')
}

function resultHTML(g){
const r=g.results;
if(!r)return'';

return `<div class="result-columns" style="--cols:${g.visibleAnswers.length}">
${g.visibleAnswers.map((idx,i)=>{
const ids=r.groups[i]||[];

return `<div class="result-col ${r.majority.includes(i)?'winner':''}">
<b>${A[i]} - ${ids.length} gł.</b>
<div class="result-sheep">${ids.map(id=>playerBy(id)?.avatar||'🐑').join('')}</div>
${r.majority.includes(i)?'<div class="points-pop">WYBÓR STADA</div>':''}
</div>`
}).join('')}
</div>`
}

function phoneView(){
const me=state.me,p=playerBy(me?.id)||me;

if(!p)return joinView();

const g=state.game;

if(!g)
return shell(`
<div class="phone-shell">
<div class="phone-head">
<div class="avatar">${p.avatar}</div>
<div>
<b>${esc(p.name)}</b>
<div class="nickname">${esc(p.nickname)}</div>
</div>
<div class="phone-score">${p.score||0} PKT</div>
</div>

<div class="phone-section">
<div class="phone-q">
Połączono. Czekamy, aż gospodarz uruchomi grę.
</div>
</div>
</div>`);

if(g.finished)return finalProfileView(p,true);

const q=g.question;
const ans=q?g.visibleAnswers.map(i=>q.answers[i]):[];
const isBaran=g.baranId===p.id;
const secret=me?.secret;

return shell(`
<div class="phone-shell">

<div class="phone-head">
<div class="avatar">${p.avatar}</div>
<div>
<b>${esc(p.name)}</b>
<div class="nickname">${esc(p.nickname)}</div>
</div>
<div class="phone-score">${p.score||0} PKT</div>
</div>

<div class="phone-section">
<span class="badge pink">RUNDA ${g.round}/${g.totalRounds}</span>
</div>

${secret?`
<div class="phone-section secret">
🐺 <b>TAJNA MISJA</b><br>
Spraw, żeby stado wybrało <b>${A[secret.target]}</b>.
Jeśli się uda: +3 pkt.
</div>`:''}

<div class="phone-section phone-q">${esc(q?.question||'')}</div>

${g.stage==='baran'&&isBaran?`
<div class="phone-section">
<b>🐏 Jesteś Baranem.</b>
<p>Wskaż opcję, do której spróbujesz przekonać stado:</p>

<div class="phone-answers">
${ans.map((a,i)=>`
<button class="phone-answer" data-baran="${i}">
${A[i]} - ${esc(a.text)}
</button>`).join('')}
</div>
</div>`:''}

${g.stage==='baran'&&!isBaran?`
<div class="phone-section phone-q">
Baran wybiera rekomendację. Obserwuj go uważnie.
</div>`:''}

${g.stage==='vote'?`
<div class="phone-answers">
${ans.map((a,i)=>`
<button class="phone-answer ${me.vote===i?'selected':''}"
data-vote="${i}"
${me.vote!=null?'disabled':''}>
${A[i]} - ${esc(a.text)}
</button>`).join('')}
</div>

${p.tokens>0&&me.tokenPrediction==null?`
<div class="token-box">
<b>🧶 Masz ${p.tokens} żeton(y) wełny.</b>
<p>Możesz obstawić odpowiedź większości za +1 pkt.</p>
<button data-action="token">POSTAW ŻETON</button>
</div>`:''}
`:''}

${g.stage==='results'?`
<div class="phone-section phone-q">
Wyniki są na dużym ekranie.<br>
<b>Twój wynik: ${p.score} pkt</b>
</div>`:''}

</div>`)
}

function finalProfileView(p,phone=false){
const traits=p.traits||{};
const sorted=Object.entries(traits).sort((a,b)=>b[1]-a[1]);
const top=sorted[0]?.[0]||'independence';
const second=sorted[1]?.[0]||'chaos';

const title=profileTitle(top,second);
const desc=profileDesc(top,second,p);
const max=Math.max(1,...Object.values(traits));

const body=`
<div class="profile-card">
<div class="profile-icon">${p.avatar||'🐑'}</div>
<h2>${esc(p.name)} - ${esc(title)}</h2>
<p>${esc(desc)}</p>
<p><b>${p.score} punktów</b></p>

<div class="trait-bars">
${sorted.slice(0,6).map(([k,v])=>`
<div class="trait-row">
<span>${traitLabels[k]||k}</span>
<div class="bar">
<i style="width:${Math.round(v/max*100)}%"></i>
</div>
<b>${v}</b>
</div>`).join('')}
</div>
</div>`;

return shell(body)
}

function profileTitle(a,b){
const n={
conformism:'Owca Stada',
independence:'Czarna Owca',
risk:'Owca Ryzyka',
chaos:'Owca Kontrolowanego Chaosu',
empathy:'Owca Wielkiego Serca',
dominance:'Baran Dowodzący',
honesty:'Owca Bez Filtra',
hedonism:'Owca Afteru',
pragmatism:'Owca Kalkulator',
romance:'Owca Romantyczna'
};

return `${n[a]||'Owca'} - ${traitLabels[b]||b}`
}

function profileDesc(a,b,p){
const base={
conformism:'Dobrze czytasz grupę i zwykle wiesz, gdzie popłynie stado.',
independence:'Masz naturalną skłonność do chodzenia własną drogą, zwłaszcza gdy reszta twierdzi, że to zły pomysł.',
risk:'Nie boisz się decyzji z dopiskiem „co może pójść nie tak?”.',
chaos:'Masz talent do zamieniania zwykłego wieczoru w historię z przypisami.',
empathy:'Częściej ratujesz ludzi niż plan wieczoru.',
dominance:'Gdy nikt nie wie, co robić, zwykle już próbujesz wszystkich przekonać.',
honesty:'Filtr między myślą a wypowiedzią traktujesz jako funkcję opcjonalną.',
hedonism:'Życie ma być wspomnieniem, nie tabelą w Excelu.',
pragmatism:'Nawet w absurdzie próbujesz znaleźć opcję, która faktycznie działa.',
romance:'W decyzjach zostawiasz trochę miejsca na chemię, historię i zły timing.'
};

return `${base[a]||''} Druga silna cecha to ${traitLabels[b]?.toLowerCase()||b}. W tej grze ${p.blackSheep||0} razy byłaś/byłeś Czarną Owcą i ${p.herdHits||0} razy idealnie wtopiłaś/wtopiłeś się w stado.`
}

function finishView(){
const ranked=[...state.players].sort((a,b)=>b.score-a.score);

return shell(`
<div class="panel">
<h2 class="section-title">🏆 Finał stada</h2>

<div class="player-grid">
${ranked.map((p,i)=>`
<div class="player-card">
<div style="font-size:30px">${i===0?'👑':''}</div>
${playerCard(p)}
</div>`).join('')}
</div>

${ranked[0]
?finalProfileView(ranked[0]).match(/<section class="screen">([\s\S]*)<\/section>/)?.[1]||''
:''}

<div class="btn-row">
<button class="primary" data-action="new-game">NOWA GRA</button>
</div>
</div>`)
}

function settingsModal(){
return `<div class="settings-modal">
<div class="settings-card">
<h2>⚙ Ustawienia</h2>

<label class="label">Głośność muzyki</label>
<input id="settingsVolume" class="control" type="range" min="0" max="100" value="${Math.round(state.settings.volume*100)}">

<div class="form-check">
<input id="mute" type="checkbox" ${music.muted?'checked':''}>
<label for="mute"> Wycisz muzykę</label>
</div>

<div class="btn-row">
<button class="secondary" data-action="close-settings">Zamknij</button>

${state.mode==='host'&&state.game
?`<button class="secondary" data-action="pause">${state.game.paused?'Wznów grę':'Wstrzymaj grę'}</button>`
:''}

<button class="danger" data-action="exit-game">Wyjdź z gry</button>
</div>

</div>
</div>`
}

function render(){
if(state.mode==='setup')app.innerHTML=setupView();
else if(state.mode==='host'&&!state.room)app.innerHTML=setupView();
else if(state.mode==='host'&&!state.game)app.innerHTML=lobbyView();
else if(state.mode==='host'&&state.game?.stage==='prologue')app.innerHTML=prologueView();
else if(state.mode==='host'&&state.game?.finished)app.innerHTML=finishView();
else if(state.mode==='host')app.innerHTML=hostGameView();
else if(state.mode==='join')app.innerHTML=joinView();
else if(state.mode==='player')app.innerHTML=phoneView();
else app.innerHTML=startView();

bindDynamic()
}

function bindDynamic(){
document.querySelector('#rounds')?.addEventListener('input',e=>{
state.settings.rounds=+e.target.value;
document.querySelector('#roundVal').textContent=e.target.value
});

document.querySelector('#volume')?.addEventListener('input',e=>{
state.settings.volume=e.target.value/100;
music.volume=state.settings.volume
});

document.querySelector('#settingsVolume')?.addEventListener('input',e=>{
state.settings.volume=e.target.value/100;
music.volume=state.settings.volume
});

document.querySelector('#mute')?.addEventListener('change',e=>{
music.muted=e.target.checked
})
}

function makePeerHost(){
state.room=roomCode();
state.peer=new Peer('stado-'+state.room);

state.peer.on('open',()=>{
safePlay();
render()
});

state.peer.on('connection',c=>{
c.on('open',()=>{});
c.on('data',m=>hostMessage(c,m));

c.on('close',()=>{
state.connections.delete(c.peer);
sync();
render()
})
});

state.peer.on('error',e=>toast('Połączenie: '+e.type))
}

function hostMessage(c,m){
if(m.type==='join'){
let p=state.players.find(x=>x.clientPeer===c.peer);

if(!p){
p={
id:uid(),
clientPeer:c.peer,
name:m.name||'Owca',
avatar:avatarSet[m.avatarIndex||0],
nickname:m.nickname||pick(STADO_NICKNAMES),
score:0,
tokens:1,
traits:{},
blackSheep:0,
herdHits:0
};

state.players.push(p)
}

state.connections.set(c.peer,c);

send(c,'joined',{
id:p.id,
players:state.players,
game:publicGame(),
settings:state.settings
});

sync();
render()
}

if(m.type==='baran')chooseBaran(m.playerId,m.choice);
if(m.type==='vote')recordVote(m.playerId,m.choice);
if(m.type==='token')recordToken(m.playerId,m.choice)
}

function makePlayer(room,name,avatarIndex){
state.peer=new Peer();

state.peer.on('open',()=>{
const c=state.peer.connect('stado-'+room.toUpperCase(),{reliable:true});

state.conn=c;

c.on('open',()=>{
safePlay();
send(c,'join',{
name,
avatarIndex,
nickname:pick(STADO_NICKNAMES)
})
});

c.on('data',playerMessage);
c.on('close',()=>toast('Rozłączono z pokojem.'));
});

state.peer.on('error',()=>{
toast('Nie udało się połączyć. Sprawdź kod pokoju.')
})
}

function playerMessage(m){
if(m.type==='joined'){
state.me={id:m.id,vote:null,tokenPrediction:null,secret:null};
state.players=m.players;
state.game=m.game;
state.settings=m.settings||state.settings;
state.mode='player';
render()
}

if(m.type==='sync'){
state.players=m.players;
state.game=m.game;
state.settings=m.settings||state.settings;

if(state.me&&state.game?.stage!=='vote'){
state.me.vote=null;
state.me.tokenPrediction=null
}

render()
}

if(m.type==='secret'){
if(state.me)state.me.secret=m.secret;
render()
}

if(m.type==='clear-secret'){
if(state.me)state.me.secret=null;
render()
}

if(m.type==='award'){
toast(m.text)
}
}

function selectQuestions(){
let pool=STADO_QUESTIONS.filter(q=>
state.settings.categories.includes(q.category)&&
q.intensity<=state.settings.intensity
);

if(pool.length<state.settings.rounds)
pool=STADO_QUESTIONS.filter(q=>q.intensity<=state.settings.intensity);

return shuffle(pool).slice(0,state.settings.rounds)
}

function startGame(){
if(state.players.length<2)return;

state.players.forEach(p=>{
p.score=0;
p.tokens=1;
p.traits={};
p.blackSheep=0;
p.herdHits=0
});

state.game={
round:0,
totalRounds:state.settings.rounds,
stage:'prologue',
questions:selectQuestions(),
question:null,
visibleAnswers:[],
baranId:null,
baranChoice:null,
wolfId:null,
wolfTarget:null,
votes:{},
tokenPredictions:{},
results:null,
paused:false,
finished:false
};

sync();
render();

setTimeout(()=>nextRound(),4300)
}

function nextRound(){
const g=state.game;

if(!g)return;

if(g.round>=g.totalRounds){
g.finished=true;
g.stage='finished';
sync();
render();
return
}

g.round++;
g.question=g.questions[g.round-1];

const count=answerCount();

g.visibleAnswers=shuffle([0,1,2,3,4]).slice(0,count);
g.baranId=state.players[(g.round-1)%state.players.length]?.id;
g.baranChoice=null;
g.votes={};
g.tokenPredictions={};
g.results=null;
g.stage='baran';
g.wolfId=null;
g.wolfTarget=null;

if(g.round>=2&&g.round%3===0){
const wolf=pick(state.players);
g.wolfId=wolf.id;
g.wolfTarget=Math.floor(Math.random()*count);

const c=state.connections.get(wolf.clientPeer);

send(c,'secret',{
secret:{target:g.wolfTarget}
})
}

broadcast('clear-secret');

if(g.wolfId){
const w=playerBy(g.wolfId);

send(
state.connections.get(w.clientPeer),
'secret',
{secret:{target:g.wolfTarget}}
)
}

sync();
render()
}

function chooseBaran(playerId,choice){
const g=state.game;

if(g.stage!=='baran'||g.baranId!==playerId)return;

g.baranChoice=choice;
g.stage='vote';

sync();
render()
}

function recordVote(playerId,choice){
const g=state.game;

if(g.stage!=='vote'||g.paused)return;

g.votes[playerId]=choice;

sync();
render();

if(Object.keys(g.votes).length>=state.players.length)
scoreRound()
}

function recordToken(playerId,choice){
const p=playerBy(playerId);
const g=state.game;

if(!p||p.tokens<=0||g.stage!=='vote'||g.tokenPredictions[playerId]!=null)
return;

p.tokens--;
g.tokenPredictions[playerId]=choice;

sync();
render()
}

function scoreRound(){
const g=state.game;
const n=g.visibleAnswers.length;

const groups=Array.from({length:n},()=>[]);

Object.entries(g.votes).forEach(([id,c])=>{
groups[c]?.push(id)
});

const counts=groups.map(x=>x.length);
const max=Math.max(...counts);

const majority=counts
.map((v,i)=>v===max?i:-1)
.filter(i=>i>=0);

const awards=[];

state.players.forEach(p=>{
const c=g.votes[p.id];
const cnt=groups[c]?.length||0;

let pts=0;

if(majority.includes(c)){
pts+=2;
p.herdHits++
}

if(cnt===1&&state.players.length>2){
pts=4;
p.blackSheep++;

awards.push({
icon:'🖤',
text:`${p.name} zostaje Czarną Owcą: +4`
})
}
else if(cnt===2&&!majority.includes(c)){
pts+=1
}

const originalIdx=g.visibleAnswers[c];
const traits=g.question.answers[originalIdx]?.traits||{};

Object.entries(traits).forEach(([k,v])=>{
p.traits[k]=(p.traits[k]||0)+v
});

p.score+=pts
});

if(g.baranChoice!=null&&majority.includes(g.baranChoice)){
const p=playerBy(g.baranId);

p.score+=2;

awards.push({
icon:'🐏',
text:`${p.name} przekonał(a) stado: +2`
})
}

if(g.wolfId&&majority.includes(g.wolfTarget)){
const p=playerBy(g.wolfId);

p.score+=3;

awards.push({
icon:'🐺',
text:`${p.name} namieszał(a) jako Wilk: +3`
})
}

Object.entries(g.tokenPredictions).forEach(([id,c])=>{
if(majority.includes(c)){
const p=playerBy(id);

p.score+=1;

awards.push({
icon:'🧶',
text:`${p.name} trafia Żetonem Wełny: +1`
})
}
});

if(g.round===Math.ceil(g.totalRounds/2)){
const sorted=[...state.players].sort((a,b)=>a.score-b.score);
const k=state.players.length>=6?2:1;

sorted.slice(0,k).forEach(p=>{
p.tokens++;

awards.push({
icon:'🎁',
text:`${p.name} dostaje żeton ratunkowy`
})
})
}

g.results={
groups,
majority,
tie:majority.length>1,
awards
};

g.stage='results';

sync();
render()
}

function addDemo(){
const i=state.players.length;

state.players.push({
id:'demo-'+uid(),
clientPeer:null,
name:['Marta','Ola','Kasia','Ania','Natalia','Zuza','Magda','Iga','Asia','Ewa'][i%10],
avatar:avatarSet[i%avatarSet.length],
nickname:STADO_NICKNAMES[i%STADO_NICKNAMES.length],
score:0,
tokens:1,
traits:{},
blackSheep:0,
herdHits:0
});

render()
}

function simulateDemos(){
const g=state.game;

if(!g||g.stage!=='vote')return;

state.players
.filter(p=>p.id.startsWith('demo-')&&g.votes[p.id]==null)
.forEach(p=>{
g.votes[p.id]=Math.floor(Math.random()*g.visibleAnswers.length)
});

if(Object.keys(g.votes).length>=state.players.length)
scoreRound();
else{
sync();
render()
}
}

function exitGame(){
try{state.peer?.destroy()}catch{}

state.peer=null;
state.conn=null;
state.connections.clear();
state.room='';
state.players=[];
state.game=null;
state.me=null;
state.mode=null;
state.settingsOpen=false;

history.replaceState({},'',location.pathname);

render()
}

document.addEventListener('pointerdown',safePlay,{once:true});

document.addEventListener('click',e=>{
const el=e.target.closest('[data-action],[data-intensity],[data-cat],[data-avatar],[data-baran],[data-vote]');

if(!el)return;

safePlay();

if(el.dataset.intensity){
state.settings.intensity=+el.dataset.intensity;
render();
return
}

if(el.dataset.cat){
const c=el.dataset.cat;

state.settings.categories=state.settings.categories.includes(c)
?state.settings.categories.filter(x=>x!==c)
:[...state.settings.categories,c];

render();
return
}

if(el.dataset.avatar!=null){
document.querySelectorAll('[data-avatar]')
.forEach(x=>x.classList.remove('active'));

el.classList.add('active');

document.querySelector('#nickPreview').textContent=pick(STADO_NICKNAMES);

return
}

if(el.dataset.baran!=null){
send(state.conn,'baran',{
playerId:state.me.id,
choice:+el.dataset.baran
});
return
}

if(el.dataset.vote!=null){
state.me.vote=+el.dataset.vote;

send(state.conn,'vote',{
playerId:state.me.id,
choice:+el.dataset.vote
});

render();
return
}

const action=el.dataset.action;

if(action==='host'){
state.mode='setup';
render()
}

else if(action==='join'){
state.mode='join';
render()
}

else if(action==='home'){
state.mode=null;
render()
}

else if(action==='create-room'){
state.mode='host';
makePeerHost()
}

else if(action==='connect'){
const room=document.querySelector('#roomInput').value.trim();
const name=document.querySelector('#nameInput').value.trim();

const av=[...document.querySelectorAll('[data-avatar]')]
.find(x=>x.classList.contains('active'))?.dataset.avatar||0;

if(room&&name)
makePlayer(room,name,+av);
else
toast('Wpisz kod pokoju i imię.')
}

else if(action==='start-game'){
startGame()
}

else if(action==='demo-player'){
addDemo()
}

else if(action==='next-round'){
nextRound()
}

else if(action==='pause'){
if(state.game){
state.game.paused=!state.game.paused;
sync();
render()
}
}

else if(action==='settings'){
state.settingsOpen=true;
render()
}

else if(action==='close-settings'){
state.settingsOpen=false;
render()
}

else if(action==='exit-game'){
exitGame()
}

else if(action==='new-game'){
state.game=null;

state.players.forEach(p=>{
p.score=0;
p.tokens=1
});

sync();
render()
}

else if(action==='token'){
const ans=prompt(
`Którą odpowiedź obstawiasz? (${A.slice(0,state.game.visibleAnswers.length).join(', ')})`
);

const c=A.indexOf((ans||'').trim().toUpperCase());

if(c>=0&&c<state.game.visibleAnswers.length){
state.me.tokenPrediction=c;

send(state.conn,'token',{
playerId:state.me.id,
choice:c
});

render()
}
}

else if(action==='demo-baran'){
if(state.game?.stage==='baran')
chooseBaran(
state.game.baranId,
Math.floor(Math.random()*state.game.visibleAnswers.length)
)
}

else if(action==='sim-demo'){
simulateDemos()
}
});

document.addEventListener('keydown',e=>{
if(
e.key==='d'&&
state.mode==='host'&&
state.game?.stage==='vote'
)
simulateDemos()
});

if(new URLSearchParams(location.search).has('join'))
state.mode='join';

render();
})();
