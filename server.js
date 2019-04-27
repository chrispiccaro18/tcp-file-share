const tcp = require('net');

const PORT = process.env.PORT || 7890;

const db = [];

const server = tcp.createServer(client => {
  console.log('client connected');
  client.on('data', chunk => {
    const newFiles = JSON.parse(chunk.toString());
    db.push(newFiles);
    client.write(JSON.stringify(db));

    console.log(newFiles);
  });
});

server.listen(PORT, () => {
  console.log('listening on 7890');
});
