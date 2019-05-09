const socket = io();

// nappulaelementit taulukkoon
const nappulat = [
  document.getElementById('nappula0'),
  document.getElementById('nappula1'),
  document.getElementById('nappula2'),
  document.getElementById('nappula3'),
];

const tulosResults = document.getElementById('tulos');
const speed = document.getElementById('speed');
const attemps = document.getElementById('attemps');
const overlay = document.getElementById('overlay');
const overlayLogin = document.getElementById('overlay-login');
const loginSubmit = document.getElementById('loginsubmit');
const loginName = document.getElementById('loginname');
const usersOl = document.getElementById('users');
const account = document.getElementById('account');
const gameOverTulos = document.getElementById('game-over-tulos');

// onclick-käsittelyjät kaikille nappuloille
nappulat[0].onclick = function () { painallus(0); };
nappulat[1].onclick = function () { painallus(1); };
nappulat[2].onclick = function () { painallus(2); };
nappulat[3].onclick = function () { painallus(3); };
loginSubmit.onclick = function () { loginPeli(); };

let nykyinen = 0; // nykyinen aktiivinen nappula
let tulos = 0;
let attempsCount = attemps.innerText;
let ajastin;
// var ajastin = setTimeout(aktivoiSeuraava, time, 1000);

// käynnistetään kone
// arvotaan ensimmäinen aktiivinen nappula 1500ms päästä, sitten 1000ms
// 1500 on parametri setTimeout-funktiolle
// 1000 on parametri aktivoiSeuraava-funktiolle

let time = 1500;
speed.innerText = `${time / 1000} seconds`;


function startPeli() {
  overlayLogin.style.visibility = 'visible';
}

startPeli();

// generoi satunnaisen kokonaisluvun väliltä min - max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// funktio, joka pyörittää konetta: aktivoi seuraavan nappulan ja ajastaa
// sitä seuraavan nappulanvaihdon
function aktivoiSeuraava(aika) {
  function arvoUusi(edellinen) {
    // Tämä on vain demotarkoituksessa näin!
    // Koodaa tämä niin, että seuraava arvotaan. Muista, että sama ei saa
    // tulla kahta kertaa peräkkäin.
    const randNumeber = getRandomInt(0, nappulat.length - 1);
    const uusi = (edellinen + randNumeber) % nappulat.length;
    return uusi;
  }

  // arvo seuraava aktiivinen nappula
  const seuraava = arvoUusi(nykyinen);

  // päivitä nappuloiden värit: vanha mustaksi, uusi punaiseksi
  nappulat[nykyinen].style.backgroundColor = 'black'; // vanha mustaksi
  nappulat[seuraava].style.backgroundColor = 'red'; // uusi punaiseksi

  // aseta uusi nykyinen nappula
  nykyinen = seuraava;

  // aseta ajastin seuraavalle vaihdolle
  // Koodaa niin, että vaihtumistahti kiihtyy koko ajan!
  console.log(`Aktiivinen ${nykyinen}`);
  ajastin = setTimeout(aktivoiSeuraava, aika, aika);
}

// Tätä funktiota kutsutaan aina, kun jotain nappulaa painetaan
// Pelilogiikkasi vaatinee, että lisäät tänne jotain...
function painallus(i) {
  console.log('Painallus ', i);
  const obj = {};
  obj.I = i;
  obj.Nykyinen = nykyinen;
  obj.Tulos = tulos;
  obj.AttempsCount = attempsCount;
  obj.LoginName = loginName.value;
  socket.emit('painallus', { painallus: JSON.stringify(obj) });
}

function buildOl(users) {
  usersOl.innerHTML = '';
  const obj = new Map(JSON.parse(users.loginsuccessful));
  for (const user of obj) {
    console.log(user);
    const node = document.createElement('li');
    const who = user[1].Loginname !== users.loginname ? 'Player' : 'You';
    const className = user[1].Loginname !== users.loginname ? '' : 'you';
    node.setAttribute('class', className);
    node.setAttribute('id', user[1].Loginname);
    const textnode = document.createTextNode(`${who}: ${user[1].Loginname}, Tulos: ${user[1].Tulos}, Attemps: ${user[1].Attemps}, Status: ${user[1].Status}`);
    node.appendChild(textnode);
    usersOl.appendChild(node);
  }
}

function setTulosResults() {
  tulos += 1;
  tulosResults.innerText = tulos;
}

function continueGame() {
  clearTimeout(ajastin);
  time = time >= 500 ? time - 200 : time;
  speed.innerText = `${time / 1000} seconds`;
  ajastin = setTimeout(aktivoiSeuraava, time, time);
}

function attempPois() {
  attempsCount -= 1;
  attemps.innerText = attempsCount;
}

function stopGame() {
  lopetaPeli();
  gameOverTulos.innerText = tulos;
  overlay.style.visibility = 'visible';
}

function loginPeli() {
  socket.emit('loginname', { loginname: loginName.value });
}

// Kutsu tätä funktiota, kun peli loppuu.
// Tämäkin tarvinnee täydennystä
function lopetaPeli() {
  clearTimeout(ajastin); // pysäytä ajastin
  for (let i = 0; i < nappulat.length; i += 1) {
    nappulat[i].style.backgroundColor = 'red'; // aseta kaikki punaisiksi
    nappulat[i].onclick = null; // disabloi nappuloiden käsittelijät
  }

  // ilmoita lopputulos
  // Vinkki: dokumentissa on valmiina taustaelementti ja elementti
  // lopputuloksen näyttämiseen. Aseta overlay-elementti näkyväksi
  // ja näytä tulos gameoover-elementissä
}

socket.on('login-successful', (users) => {
  if (typeof users !== 'undefined') {
    buildOl(users);
    overlayLogin.style.visibility = 'hidden';
    ajastin = setTimeout(aktivoiSeuraava, time, 1000);
    account.innerText = users.loginname;
  }
});

socket.on('new-user', (user) => {
  console.log(user);
  const obj = JSON.parse(user);
  const node = document.createElement('li');
  node.setAttribute('id', obj.Loginname);
  const textnode = document.createTextNode(`Player: ${obj.Loginname}, Tulos: ${obj.Tulos}, Attemps: ${obj.Attemps}, Status: ${obj.Status}`);
  node.appendChild(textnode);
  usersOl.appendChild(node);
});

socket.on('check-users', (users) => {
  if (typeof users !== 'undefined') {
    buildOl(users);
  }
});

socket.on('setTulosResults', () => {
  setTulosResults();
});

socket.on('continueGame', () => {
  continueGame();
});

socket.on('attempPois', () => {
  attempPois();
});

socket.on('stopGame', () => {
  stopGame();
});

socket.on('results-users', (user) => {
  const obj = JSON.parse(user);
  console.log(obj);
  console.log(obj.Loginname, loginName.value);
  const who = obj.Loginname !== loginName.value ? 'Player' : 'You';
  let className = '';
  if (obj.Loginname === loginName.value) {
    className = 'you';
  }
  if (obj.Status === 'Game over') {
    className = 'game-over';
  }

  document.getElementById(obj.Loginname).classList = className;
  document.getElementById(obj.Loginname).innerText = `${who}: ${obj.Loginname}, Tulos: ${obj.Tulos}, Attemps: ${obj.Attemps}, Status: ${obj.Status}`;
});