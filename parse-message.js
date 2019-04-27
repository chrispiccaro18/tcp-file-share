const db = require('./db');
const chatRoom = require('./chat-room');

function parseMessage(string, client) {
  const message = JSON.parse(string);

  switch(message.code) {
    case 1: {
      const { ip, files } = message;
      const newFiles = { ip, files };
      db.push({ nick: client.username, ...newFiles });
      chatRoom.clients.forEach(client => {
        client.write(JSON.stringify(db));
      });
      return newFiles;
    }
    case 2:
      for(let i = 0; i < db.length; i++) {
        for(let j = 0; j < db[i].files.length; j++)
          if(message.line === db[i].files[j]) {
            return { file: true, nick: db[i].nick, ip: db[i].ip };
          }
      }
      return 'bad';
    default:
      break;
  }
}

module.exports = parseMessage;
