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

    client.on('close', () => {
      chatRoom.delete(client.username);
      for(let i = 0; i < db.length; i++){ 
        if(db[i].nick === client.username) {
          db.splice(i, 1);
          break;
        }
      }
      chatRoom.clients.forEach(client => {
        client.write(JSON.stringify(`${client.username} has left`));
        client.write(JSON.stringify(db));
      });
    });
  });
});

server.listen(PORT, () => {
  console.log('listening on 7890');
});
