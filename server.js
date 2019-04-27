const tcp = require('net');
const ChatRoom = require('./ChatRoom');

const PORT = process.env.PORT || 7890;

const db = [];
const chatRoom = new ChatRoom();

const server = tcp.createServer(client => {
  chatRoom.add(client);
  console.log(`${client.username} has joined`);
  client.on('data', chunk => {
    const newFiles = JSON.parse(chunk.toString());
    db.push({ nick: client.username, ...newFiles });
    chatRoom.clients.forEach(client => {
      client.write(JSON.stringify(db));
    });

    console.log(newFiles);
  });
});

server.listen(PORT, () => {
  console.log('listening on 7890');
});
