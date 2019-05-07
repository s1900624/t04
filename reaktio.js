"use strict";

// nappulaelementit taulukkoon
var nappulat = [
  document.getElementById('nappula0'),
  document.getElementById('nappula1'),
  document.getElementById('nappula2'),
  document.getElementById('nappula3')
];

let tulosResults = document.getElementById('tulos');
let speed = document.getElementById('speed');
let attemps = document.getElementById('attemps');
let overlay = document.getElementById('overlay');

// onclick-käsittelyjät kaikille nappuloille
nappulat[0].onclick = function() { painallus(0) };
nappulat[1].onclick = function() { painallus(1) };
nappulat[2].onclick = function() { painallus(2) };
nappulat[3].onclick = function() { painallus(3) };

let nykyinen = 0;   // nykyinen aktiivinen nappula
let tulos = 0;
let attempsCount = attemps.innerText;


// käynnistetään kone
// arvotaan ensimmäinen aktiivinen nappula 1500ms päästä, sitten 1000ms
// 1500 on parametri setTimeout-funktiolle
// 1000 on parametri aktivoiSeuraava-funktiolle

var time = 1500;
speed.innerText = (time / 1000) + ' sec';
var ajastin = setTimeout(aktivoiSeuraava, time, 1000);

// funktio, joka pyörittää konetta: aktivoi seuraavan nappulan ja ajastaa
// sitä seuraavan nappulanvaihdon
function aktivoiSeuraava(aika) {
  // arvo seuraava aktiivinen nappula
  var seuraava = arvoUusi(nykyinen);

  // päivitä nappuloiden värit: vanha mustaksi, uusi punaiseksi
  nappulat[nykyinen].style.backgroundColor = "black"; // vanha mustaksi
  nappulat[seuraava].style.backgroundColor = "red"; // uusi punaiseksi

  // aseta uusi nykyinen nappula
  nykyinen = seuraava;

  // aseta ajastin seuraavalle vaihdolle
  // Koodaa niin, että vaihtumistahti kiihtyy koko ajan!
  console.log("Aktiivinen " + nykyinen);
  ajastin = setTimeout(aktivoiSeuraava, aika, aika);  

  function arvoUusi(edellinen) {
    // Tämä on vain demotarkoituksessa näin!
    // Koodaa tämä niin, että seuraava arvotaan. Muista, että sama ei saa
    // tulla kahta kertaa peräkkäin.
    var uusi = (edellinen + 1) % nappulat.length;
    return uusi;
  }
}

// Tätä funktiota kutsutaan aina, kun jotain nappulaa painetaan
// Pelilogiikkasi vaatinee, että lisäät tänne jotain...
function painallus(i) {
  console.log("Painallus ", i);
  if (i === nykyinen) {
    tulosResults.innerText = (tulos += 1);

      if (tulos % 5 === 0) {
        clearTimeout(ajastin);
        time = time >= 500 ? time - 100 : time;
        // console.log('time', time);
        speed.innerText = (time / 1000) + ' secs';
        ajastin = setTimeout(aktivoiSeuraava, time, time);
      }
  } else {
    attempsCount -= 1;
    attemps.innerText = attempsCount;
    if (attempsCount === 0) {
      lopetaPeli();
      overlay.style.visibility = "visible";
    } 
  }
}

// Kutsu tätä funktiota, kun peli loppuu.
// Tämäkin tarvinnee täydennystä
function lopetaPeli() {
  clearTimeout(ajastin); // pysäytä ajastin
  for (var i = 0; i < nappulat.length; i++) {
    nappulat[i].style.backgroundColor = "red"; // aseta kaikki punaisiksi
    nappulat[i].onclick = null; // disabloi nappuloiden käsittelijät
  }

  // ilmoita lopputulos
  // Vinkki: dokumentissa on valmiina taustaelementti ja elementti
  // lopputuloksen näyttämiseen. Aseta overlay-elementti näkyväksi
  // ja näytä tulos gameoover-elementissä
}

// generoi satunnaisen kokonaisluvun väliltä min - max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
