const tcp = require('net');
const parseMessage = require('./parse-message');
const db = require('./db');
const chatRoom = require('./chat-room');

const PORT = process.env.PORT || 7890;

const server = tcp.createServer(client => {
  chatRoom.add(client);
  console.log(`${client.username} has joined`);

  client.on('data', chunk => {
    const parsed = parseMessage(chunk.toString(), client);

    console.log(parsed);
    if(parsed.file) {
      const { ip } = parsed;
      // this client wants to download
      client.write(JSON.stringify({ code: 3, ip }));
      // this client has what above client wants to download
      const receiver = chatRoom.getClient(parsed.nick);
      receiver.write(JSON.stringify({ code: 4, client: client.username, ip: client.address().address }));
    }

  });

  client.on('close', () => {
    chatRoom.delete(client.username);
    deleteFromDb(client);
    chatRoom.clients.forEach(client => {
      client.write(JSON.stringify(`${client.username} has left`));
      client.write(JSON.stringify(db));
    });
  });
});

server.listen(PORT, () => {
  console.log('listening on 7890');
});

const deleteFromDb = function(client) {
  for(let i = 0; i < db.length; i++){ 
    if(db[i].nick === client.username) {
      db.splice(i, 1);
      break;
    }
  }
};
