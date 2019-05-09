const express = require('express');

const app = express();
app.set('port', 3000);
app.use(express.static('public'));

const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);

let users = new Map();

io.on('connection', (socket) => {
  function userInit(data) {
    const obj = {};
    obj.Loginname = data.loginname;
    obj.Tulos = 0;
    obj.Attemps = 3;
    obj.Status = 'Active';

    users.set(data.loginname, obj);
  }

  function gameOverUsers() {
    const countStart = users.size;
    users.forEach((value, key) => {
      // console.log(`${value.Status}`);
      if (`${value.Status}` === 'Game over') {
        users.delete(key);
      }
    });
    const countEnd = users.size;

    if (countStart !== countEnd) {
      io.emit('check-users', JSON.stringify(Array.from(users.entries())));
    }
  }

  socket.on('loginname', (data) => {
    if (data.loginname.trim() !== '' && !users.has(data.loginname)) {
      console.log('Add new user: ', data.loginname);
      userInit(data);
      console.log(users);
      socket.user_id = data.loginname;
      socket.emit('login-successful', { loginsuccessful: JSON.stringify(Array.from(users.entries())), loginname: data.loginname });
      socket.broadcast.emit('new-user', JSON.stringify(users.get(data.loginname)));
    } else {
      socket.emit('login-unsuccessful', { loginsuccessful: false });
    }
  });

  socket.on('painallus', (data) => {
    const obj = JSON.parse(data.painallus);
    if (obj) {
      const user = users.get(obj.LoginName);
      user.Tulos = obj.Tulos + 1;
      user.Attemps = parseFloat(obj.AttempsCount);

      if (obj.I === obj.Nykyinen) {
        socket.emit('setTulosResults', { painallus: true });
        if (obj.Tulos % 5 === 0) {
          socket.emit('continueGame', { painallus: true });
        }
      } else {
        socket.emit('attempPois', { painallus: true });
        if (obj.AttempsCount === 1) {
          user.Status = 'Game over';
          user.Attemps = 0;
          socket.emit('stopGame', { painallus: true });
        }
      }

      users = new Map([...users.entries()].sort((a, b) => b[1].Tulos - a[1].Tulos));

      // io.emit('results-users', JSON.stringify(users.get(obj.LoginName)) );
      io.emit('check-users', JSON.stringify(Array.from(users.entries())));
    }
  });

  socket.on('disconnect', () => {
    users.delete(socket.user_id);
    io.emit('check-users', JSON.stringify(Array.from(users.entries())));
    console.log('User disconnected', socket.user_id);
  });

  setInterval(gameOverUsers, 10000);
});

const server = httpServer.listen(app.get('port'), (err, res) => {
  if (err) {
    res
      .status(500)
      .send(`${err} Palvelinta ei voitu käynnistää, teknisen vian vuoksi!`);
  } else {
    const { port } = server.address();
    console.log('Server starts on port', port);
  }
});
