const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const mpd = require('mpd2');
const { cmd } = mpd;

// config is passed to net.connect()
const config = {
  host: 'localhost',
  port: 6600,
};

const boot = async () => {
  // config is passed to net.connect()
  const config = {
    host: 'localhost',
    port: 6600,
  };
  const client = await mpd.connect(config);

  io.on('connection', socket => {
    setInterval(async () => {
      const status = await client
        .sendCommand('currentsong')
        .then(mpd.parseObject);

      socket.broadcast.emit('status.change', status);
    }, 1000);
  });

  nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
      return nextHandler(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
};

boot();
