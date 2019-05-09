# Reaktiopeli

<img src="media/5e7a8461c064adb51984e7e962530b49.jpg" width=400px>

Tehtävänä on reaktiopeli, jossa tehtävänä on painaa sitä nappulaa, jonka valo
syttyy. Jokaisesta oikeasta painalluksesta saa pisteen, väärä painallus lopettaa
pelin. Nappuloiden vaihtumisnopeus kiihtyy jatkuvasti.
(https://www.youtube.com/watch?v=nv_Wfhz38EM).


## Start game just in browser
1. Pitää avaa ```index-local.html```

## Multiplay game
### Localhost
1.  Pitää asettaa <a href="https://nodejs.org/en/" target="_blank">```NodeJS```</a>

### On the server
1. Avaa http://35.199.32.16/
2. Syötää sinun 'nimesi'
3. Painaa nappia

Sinun tulokset ja muita pelaajien tuloksia voi hakea alempi.
Ensimmäisellä rivillä on pelaaja jolla on useimmat pisteet.
Toisella rivillä on seuraava pelaaja ja n.e.

Tulokset päivitetään dynaamisesti.

## Docker
Ensinnäkin pitää asettaa Docker:a

1. Linux / iOS: sudo docker pull s1900624/reaktiopeli

   Windows: docker pull s1900624/reaktiopeli

2. sudo docker run -d -p 80:80 --name reaktiopeli s1900624/reaktiopeli:latest