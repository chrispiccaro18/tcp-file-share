const tcp = require('net');

const PORT = process.env.PORT || 7890;

const db = [];

const server = tcp.createServer(client => {
  console.log('client connected');
  client.on('data', chunk => {
    db.push(JSON.parse(chunk.toString()));
    client.write(JSON.stringify(db));
    // console.log(JSON.parse(chunk.toString()));
  });
});

server.listen(PORT, () => {
  console.log('listening on 7890');
});
